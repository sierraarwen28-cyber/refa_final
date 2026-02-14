const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

async function setupDB() {
    const db = await open({
        filename: './refaccionaria.db',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT
        );
        CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT,
            marca TEXT,
            precio REAL,
            stock INTEGER,
            numero_parte TEXT
        );
    `);
    return db;
}

module.exports = setupDB;