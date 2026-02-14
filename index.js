const express = require('express');
const setupDB = require('./database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path'); 

const app = express();
app.use(express.json()); 
app.use(express.static(path.join(__dirname, 'public')));

const SECRET_KEY = "clave_secreta_refaccionaria";

app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    console.log("Buscando el HTML en: ", indexPath); // Esto nos dirá en la terminal dónde lo busca
    res.sendFile(indexPath);
});

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
    const { email, password } = req.body; // Extraemos los datos
    const user = await db.get('SELECT * FROM usuarios WHERE email = ?', [email]);
    
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else { 
        res.status(401).send("Credenciales incorrectas"); 
    }
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
    res.status(201).send("Refacción agregada");
});

const PORT = 8080;
app.listen(PORT, async () => {
    console.log(`Servidor en http://localhost:${PORT}`);
    
    const db = await setupDB();
    const hash = await bcrypt.hash('123456', 10);
    
    await db.run('INSERT OR IGNORE INTO usuarios (email, password) VALUES (?, ?)', ['admin@test.com', hash]);
    
    const prodCheck = await db.get('SELECT count(*) as count FROM productos');
    if(prodCheck.count === 0) {
        await db.run('INSERT INTO productos (nombre, marca, precio, stock, numero_parte) VALUES (?,?,?,?,?)', 
            ['Balatas Delanteras', 'Brembo', 1250.00, 15, 'BR-9090']);
        await db.run('INSERT INTO productos (nombre, marca, precio, stock, numero_parte) VALUES (?,?,?,?,?)', 
            ['Filtro de Aire', 'Gonher', 280.00, 50, 'GA-102']);
    }
});

module.exports = app;