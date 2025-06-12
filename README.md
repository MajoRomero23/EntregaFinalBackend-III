# Backend-III-EntregaFinal

Entrega final del curso de **Backend III** de Coderhouse.

Este proyecto consiste en la implementación de una API RESTful para una florería en línea, con gestión de productos, carritos, sesiones y tickets de compra. Integra autenticación por JWT, documentación Swagger, testing automatizado y despliegue con Docker.

---

## Objetivos generales

- Utilizar **MongoDB** como sistema de persistencia principal.
- Desarrollar una API profesional con endpoints para productos y carritos.
- Aplicar prácticas avanzadas de arquitectura y testing backend.

## Objetivos específicos

- Consultas de productos con filtros, paginación y ordenamiento.
- Gestión de carritos robusta, con flujo de compra completo.
- Implementar **DAO**, **DTO**, y **Repository Pattern**.
- Incorporar middleware de **autorización por roles** (`admin`, `user`).
- Documentar rutas con **Swagger**.
- Automatizar pruebas con **Supertest** y **Jest**.
- Crear una imagen de Docker funcional.

---

## 🚀 Instalación y ejecución local

```bash
git clone https://github.com/MajoRomero23/EntregaFinalBackend-III.git
cd EntregaFinalBackend-III
npm install
npm start 
```
### Crea un archivo .env:

- PORT=8080
- MONGO_URL=mongodb+srv://<usuario>:<contraseña>@cluster1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1
- JWT_SECRET=claveSuperSecreta123
- ADMIN_EMAIL=admin@admin.com
- ADMIN_PASSWORD=admin123
- NODE_ENV=development
Puedes usar el archivo .env.example como guía.

## 📦 API de Productos
GET /api/products
Devuelve productos con filtros, paginación y ordenamiento:
```bash
{
  "status": "success",
  "payload": [ ... ],
  "totalPages": 5,
  "page": 2,
  "prevPage": 1,
  "nextPage": 3,
  "hasPrevPage": true,
  "hasNextPage": true,
  "prevLink": "...",
  "nextLink": "..."
}
```
## 🛒 Endpoints de Carritos
- DELETE /api/carts/:cid/products/:pid — Elimina un producto del carrito

- PUT /api/carts/:cid — Actualiza el carrito completo

- PUT /api/carts/:cid/products/:pid — Actualiza cantidad de un producto

- DELETE /api/carts/:cid — Vacía el carrito

- POST /api/carts/:cid/purchase — Finaliza la compra y genera ticket

El carrito contiene un arreglo de productos con cantidades y realiza populate para retornar los detalles completos.

## 🔐 Autenticación y Autorización
Usuarios autenticados con JWT

Rutas protegidas según el rol:

Admin: puede crear y eliminar productos

User: puede comprar y modificar carritos

## 📄 Documentación Swagger
Disponible en:
``` bash
http://localhost:8080/api-docs

```
Documenta:

- Registro y login
- Perfil actual
- Productos y carritos
- Estructura de tickets

## 🧪 Testing Automatizado
El proyecto incluye tests con Jest y Supertest para las siguientes rutas:

- /api/sessions
- /api/products
- /api/carts

Ejecutar los tests:
``` basg
npm test
```
Organización:

  ├── sessions.test.mjs

  ├── products.test.mjs

  └── carts.test.mjs

Los tests se ejecutan con una conexión real a Mongo Atlas y verifican comportamiento completo, incluyendo login, creación, compra y generación de tickets.

## 🐳 Docker
Construir la imagen
```bash
docker build -t majopozos23a/backend-floreria:1.0 .
```

Ejecutar el contenedor
``` bash
docker run -p 8080:8080 --env-file .env majopozos23a/backend-floreria:1.0
```
DockerHub

#### Disponible en:

https://hub.docker.com/r/majopozos23a/backend-floreria

#### 🧹 Limpieza para entrega
- Eliminadas rutas de prueba como create-admin y debug-users.
- Passwords y datos sensibles movidos a variables de entorno.
- Controladores refactorizados y simplificados para mantener buenas prácticas.

#### 👩‍💻 Autoría
Maria José Romero Pozos
Proyecto final para la materia Backend III - Coderhouse (2025)

🔗 (https://github.com/MajoRomero23)