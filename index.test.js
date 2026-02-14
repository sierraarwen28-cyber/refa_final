const request = require('supertest');
const app = require('./index'); // Importa tu servidor

describe('Pruebas de la API de Refaccionaria', () => {
    
    // Prueba de la ruta pública de productos
    test('Debe listar los productos (Ruta Pública)', async () => {
        const res = await request(app).get('/api/productos');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    // Prueba de protección de rutas
    test('Debe denegar acceso a crear productos sin Token', async () => {
        const res = await request(app).post('/api/productos').send({
            nombre: "Filtro de Aceite",
            marca: "Fram",
            precio: 150,
            stock: 10,
            numero_parte: "PH3614"
        });
        expect(res.statusCode).toEqual(401); // 401 es No Autorizado
    });
});