# Backend-III-EntregaFinal

Entrega final del curso de Coderhouse del curso de Backend I

---

## Objetivos generales

* Contar con Mongo como sistema de persistencia principal
* Definir todos los endpoints para trabajar con productos y carritos

## Objetivos específicos

* Profesionalizar las consultas de productos con filtros, paginación y ordenamiento
* Profesionalizar la gestión de carritos para implementar conceptos vistos

---

## Instalación y ejecución local

```bash
git clone https://github.com/MajoRomero23/EntregaFinalBackend-III.git
cd EntregaFinalBackend-III
npm install
npm start
```

Crea el archivo `.env` con tus variables de entorno:

```env
PORT=8080
MONGO_URL=mongodb+srv://<usuario>:<contraseña>@cluster1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1
JWT_SECRET=claveSuperSecreta123
ADMIN_EMAIL=admin@admin.com
ADMIN_PASSWORD=admin123
NODE_ENV=development
```

Puedes usar `.env.example` como referencia.

---

## API de Productos

Este proyecto proporciona una API para gestionar productos.

### Método GET

Devuelve un objeto con el siguiente formato:

```json
{
  "status": "success/error",
  "payload": "Resultado de los productos solicitados",
  "totalPages": 5,
  "prevPage": 1,
  "nextPage": 3,
  "page": 2,
  "hasPrevPage": true,
  "hasNextPage": true,
  "prevLink": "http://...",
  "nextLink": "http://..."
}
```

### Explicación de los campos

* `status`: Indica si la solicitud fue exitosa
* `payload`: Resultado de los productos
* `totalPages`: Total de páginas
* `page`: Página actual
* `prevPage`, `nextPage`: Números de navegación
* `hasPrevPage`, `hasNextPage`: Booleanos
* `prevLink`, `nextLink`: URLs generadas

---

## Endpoints de Carritos

### DELETE `/api/carts/:cid/products/:pid`

Elimina un producto específico del carrito

### PUT `/api/carts/:cid`

Actualiza el carrito con un arreglo de productos

### PUT `/api/carts/:cid/products/:pid`

Actualiza la cantidad de un producto específico

### DELETE `/api/carts/:cid`

Elimina todos los productos del carrito

### Modelo de Carts

Contiene la propiedad `products`, que es un arreglo de objetos con `product` (ObjectId) y `quantity`.

### Populate

La ruta `/api/carts/:cid` realiza un `populate` para mostrar los detalles completos de cada producto.

---

## Documentación Swagger

Disponible en:

```
http://localhost:8080/api-docs
```

Incluye:

* Registro y login de usuarios
* Autenticación JWT
* Productos y carritos protegidos por roles

---

## Rutas principales

### Usuarios

* `POST /api/sessions/register` - Registrar usuario
* `POST /api/sessions/login` - Login con JWT
* `GET /api/sessions/current` - Ver perfil

### Productos

* `GET /api/products` - Ver productos
* `POST /api/products` - Crear producto (admin)

### Carritos

* `POST /api/carts/:cid/purchase` - Finalizar compra (user)

---

## Docker

### Construir la imagen

```bash
docker build -t majopozos23a/backend-floreria:1.0 .
```

### Ejecutar el contenedor

```bash
docker run -p 8080:8080 --env-file .env majopozos23a/backend-floreria:1.0
```

### DockerHub

Imagen disponible en:
[https://hub.docker.com/r/majopozos23a/backend-floreria](https://hub.docker.com/r/majopozos23a/backend-floreria)

---

## Autoría

**Maria José Romero Pozos**
Proyecto final para la materia Backend II - Coderhouse 2025

* [@MajoRomero23](https://github.com/MajoRomero23)

