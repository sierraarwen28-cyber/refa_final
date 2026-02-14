const express = require('express');
const setupDB = require('./database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const SECRET_KEY = "clave_secreta_refaccionaria";

const auth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).send("Acceso denegado");
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) { res.status(403).send("Token inválido"); }
};

app.post('/api/register', async (req, res) => {
    const db = await setupDB();
    const hash = await bcrypt.hash(req.body.password, 10);
    try {
        await db.run('INSERT INTO usuarios (email, password) VALUES (?, ?)', [req.body.email, hash]);
        res.status(201).send("Usuario registrado");
    } catch (e) { res.status(400).send("Error: el correo ya existe"); }
});

app.post('/api/login', async (req, res) => {
    const db = await setupDB();
    const { email, password } = req.body;
    const user = await db.get('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else { res.status(401).send("Credenciales incorrectas"); }
});


app.get('/api/productos', async (req, res) => {
    const db = await setupDB();
    const productos = await db.all('SELECT * FROM productos');
    res.json(productos);
});

app.post('/api/productos', auth, async (req, res) => {
    const db = await setupDB();
    const { nombre, marca, precio, stock, numero_parte } = req.body;
    await db.run('INSERT INTO productos (nombre, marca, precio, stock, numero_parte) VALUES (?,?,?,?,?)', 
        [nombre, marca, precio, stock, numero_parte]);
    res.status(201).send("Agregado");
});

app.put('/api/productos/:id', auth, async (req, res) => {
    const db = await setupDB();
    const { id } = req.params;
    const { nombre, marca, precio, stock, numero_parte } = req.body;
    await db.run('UPDATE productos SET nombre=?, marca=?, precio=?, stock=?, numero_parte=? WHERE id=?', 
        [nombre, marca, precio, stock, numero_parte, id]);
    res.send("Actualizado");
});

app.delete('/api/productos/:id', auth, async (req, res) => {
    const db = await setupDB();
    await db.run('DELETE FROM productos WHERE id = ?', [req.params.id]);
    res.send("Eliminado");
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Servidor en puerto ${PORT}`);
    const db = await setupDB();
    const hash = await bcrypt.hash('123456', 10);
    await db.run('INSERT OR IGNORE INTO usuarios (email, password) VALUES (?, ?)', ['admin@test.com', hash]);
});