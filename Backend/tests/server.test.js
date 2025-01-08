const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../server'); // Importa tu app

describe('Pruebas del Backend', () => {
  it('Debería responder con un mensaje en la ruta raíz', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('!Backend Funcionando Correctamente!');
  });

  it('Debería manejar rutas no existentes', async () => {
    const res = await request(app).get('/ruta-inexistente');
    expect(res.statusCode).toBe(404); // Si no tienes manejo de rutas no existentes, puedes implementarlo
  });

  // Hook para cerrar la conexión después de todas las pruebas
  afterAll(async () => {
    await mongoose.connection.close(); // Cierra la conexión a MongoDB
  });
});
