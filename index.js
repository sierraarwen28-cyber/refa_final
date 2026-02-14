const express = require('express');
const setupDB = require('./database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());

const SECRET_KEY = "clave_secreta_refaccionaria";

// Middleware para proteger rutas
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

// --- RUTAS DE AUTENTICACIÓN ---
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
    const user = await db.get('SELECT * FROM usuarios WHERE email = ?', [req.body.email]);
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else { res.status(401).send("Credenciales incorrectas"); }
});

// --- CRUD DE REFACCIONES ---
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
    res.status(201).send("Refacción agregada");
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));

module.exports = app; 