import request from 'supertest';
import mongoose from 'mongoose';
import connectDB from '../src/database.js';
import app from '../app.js';

const adminCredentials = {
  email: 'admin@admin.com',
  password: 'admin123'
};


let server;
let requester;
let adminToken;

beforeAll(async () => {
  server = app.listen(3001, () => {
    console.log('Servidor de pruebas de productos corriendo en http://localhost:3001');
  });

  await connectDB();
  requester = request.agent(server);
});

afterAll(async () => {
  await mongoose.connection.close();
  await new Promise((resolve) =>
    server.close(() => {
      console.log('Servidor de pruebas de productos cerrado');
      resolve();
    })
  );
});

describe('🛍️ Products API Tests', () => {
  describe(' Acciones del admin', () => {
    beforeAll(async () => {
      const res = await requester.post('/api/sessions/login').send(adminCredentials);
      console.log("Admin Login:", res.status, res.body);
      expect(res.status).toBe(200);
      adminToken = res.body.token;
    });

    let createdProductId;

    it('Debería permitir al admin crear un producto', async () => {
      const newProduct = {
        title: 'Producto de prueba',
        description: 'Descripción de prueba',
        code: 'PRUEBA123',
        price: 100,
        stock: 10,
        category: 'Test',
        thumbnails: ['test.jpg']
      };

      const res = await requester
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newProduct);

      console.log("Crear producto:", res.status, res.body);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('product');
      createdProductId = res.body.product._id;
    });

    it('Debería permitir al admin eliminar un producto', async () => {
      const res = await requester
        .delete(`/api/products/${createdProductId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      console.log("Eliminar producto:", res.status, res.body);

      expect(res.status).toBe(200);
    });
  });

  describe('Acceso público', () => {
    it('Debería obtener productos sin autenticación', async () => {
      const res = await requester.get('/api/products');

      console.log("📦 Productos públicos:", res.status, res.body);

      expect(res.status).toBe(200);
      expect(res.body).toBeDefined();
      expect(res.body.payload).toBeInstanceOf(Array);
    });
  });
});
