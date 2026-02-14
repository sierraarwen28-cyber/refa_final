const request = require('supertest');
const app = require('./index');

describe('Pruebas de Refaccionaria', () => {
    test('Debe cargar la lista de productos correctamente', async () => {
        const res = await request(app).get('/api/productos');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('No debe permitir agregar productos sin token', async () => {
        const res = await request(app).post('/api/productos').send({
            nombre: "Prueba",
            marca: "Prueba",
            precio: 10,
            stock: 1,
            numero_parte: "000"
        });
        expect(res.statusCode).toBe(401);
    });
});