# Guía de Uso: Reqres API con Postman

**Alumna:** Miguel Lucero  
**Fecha:** 4 de marzo de 2026  
**Módulo:** 7 - Lección 2 - Día 3

---

## 1. ¿Qué es Reqres?

**Reqres** (https://reqres.in/) es una API REST de prueba gratuita que simula operaciones CRUD reales. Es perfecta para:

- ✅ Aprender a consumir APIs REST
- ✅ Practicar con Postman
- ✅ Probar código frontend sin backend
- ✅ Demostrar operaciones HTTP (GET, POST, PUT, DELETE)

---

## 2. Configuración de Postman

### Paso 1: Descargar Postman
Descarga Postman desde: https://www.postman.com/downloads/

### Paso 2: Crear una nueva colección
1. Abre Postman
2. Click en "Collections" → "New Collection"
3. Nombra la colección: **"Reqres API - Práctica"**

---

## 3. Endpoints Disponibles

### Base URL
```
https://reqres.in/api
```

### ⚠️ Header Requerido (IMPORTANTE)

**Todas las peticiones requieren el header `x-api-key`:**

| Header | Valor |
|--------|-------|
| `x-api-key` | `TU_API_KEY_AQUI` |

En Postman:
1. Ve a la pestaña "Headers"
2. Agrega: Key = `x-api-key`, Value = `tu_api_key_personal`

> 💡 **Obtén tu API key gratuita en:** https://app.reqres.in/api-keys

---

### 📋 GET - Listar Usuarios (Paginado)

| Campo | Valor |
|-------|-------|
| Método | `GET` |
| URL | `https://reqres.in/api/users?page=1` |
| Parámetros | `page` (número de página) |

**Respuesta esperada (200 OK):**
```json
{
  "page": 1,
  "per_page": 6,
  "total": 12,
  "total_pages": 2,
  "data": [
    {
      "id": 1,
      "email": "george.bluth@reqres.in",
      "first_name": "George",
      "last_name": "Bluth",
      "avatar": "https://reqres.in/img/faces/1-image.jpg"
    }
    // ... más usuarios
  ]
}
```

---

### 👤 GET - Obtener Usuario por ID

| Campo | Valor |
|-------|-------|
| Método | `GET` |
| URL | `https://reqres.in/api/users/2` |

**Respuesta esperada (200 OK):**
```json
{
  "data": {
    "id": 2,
    "email": "janet.weaver@reqres.in",
    "first_name": "Janet",
    "last_name": "Weaver",
    "avatar": "https://reqres.in/img/faces/2-image.jpg"
  }
}
```

**Usuario no encontrado (404):**
```json
{}
```

---

### ➕ POST - Crear Usuario

| Campo | Valor |
|-------|-------|
| Método | `POST` |
| URL | `https://reqres.in/api/users` |
| Headers | `Content-Type: application/json` |

**Body (JSON):**
```json
{
  "name": "Juan Pérez",
  "job": "Desarrollador Frontend"
}
```

**Respuesta esperada (201 Created):**
```json
{
  "name": "Juan Pérez",
  "job": "Desarrollador Frontend",
  "id": "123",
  "createdAt": "2026-03-04T10:30:00.000Z"
}
```

---

### ✏️ PUT - Actualizar Usuario Completo

| Campo | Valor |
|-------|-------|
| Método | `PUT` |
| URL | `https://reqres.in/api/users/2` |
| Headers | `Content-Type: application/json` |

**Body (JSON):**
```json
{
  "name": "Janet Weaver",
  "job": "Senior Developer"
}
```

**Respuesta esperada (200 OK):**
```json
{
  "name": "Janet Weaver",
  "job": "Senior Developer",
  "updatedAt": "2026-03-04T10:35:00.000Z"
}
```

---

### 🔧 PATCH - Actualizar Usuario Parcial

| Campo | Valor |
|-------|-------|
| Método | `PATCH` |
| URL | `https://reqres.in/api/users/2` |
| Headers | `Content-Type: application/json` |

**Body (JSON):**
```json
{
  "job": "Team Lead"
}
```

**Respuesta esperada (200 OK):**
```json
{
  "job": "Team Lead",
  "updatedAt": "2026-03-04T10:40:00.000Z"
}
```

---

### 🗑️ DELETE - Eliminar Usuario

| Campo | Valor |
|-------|-------|
| Método | `DELETE` |
| URL | `https://reqres.in/api/users/2` |

**Respuesta esperada:** `204 No Content` (sin body)

---

## 4. Endpoints de Autenticación

### 🔐 POST - Registro de Usuario

| Campo | Valor |
|-------|-------|
| Método | `POST` |
| URL | `https://reqres.in/api/register` |
| Headers | `Content-Type: application/json` |

**Body (JSON) - Registro exitoso:**
```json
{
  "email": "eve.holt@reqres.in",
  "password": "pistol"
}
```

**Respuesta (200 OK):**
```json
{
  "id": 4,
  "token": "QpwL5tke4Pnpja7X4"
}
```

**Body (JSON) - Error (falta password):**
```json
{
  "email": "eve.holt@reqres.in"
}
```

**Respuesta (400 Bad Request):**
```json
{
  "error": "Missing password"
}
```

---

### 🔑 POST - Login

| Campo | Valor |
|-------|-------|
| Método | `POST` |
| URL | `https://reqres.in/api/login` |
| Headers | `Content-Type: application/json` |

**Body (JSON) - Login exitoso:**
```json
{
  "email": "eve.holt@reqres.in",
  "password": "cityslicka"
}
```

**Respuesta (200 OK):**
```json
{
  "token": "QpwL5tke4Pnpja7X4"
}
```

---

## 5. Configuración en Postman

### Crear Variables de Entorno

1. Click en "Environments" → "Create Environment"
2. Nombre: **"Reqres Development"**
3. Agregar variable:
   - Variable: `base_url`
   - Initial Value: `https://reqres.in/api`
   - Current Value: `https://reqres.in/api`

### Usar Variables en las Peticiones

En lugar de escribir la URL completa, usa:
```
{{base_url}}/users
{{base_url}}/users/2
{{base_url}}/login
```

---

## 6. Probar con el Proyecto Vue

### Iniciar el proyecto:
```bash
cd api-practica
npm install
npm run serve
```

### Abrir en el navegador:
```
http://localhost:8080
```

### Funcionalidades implementadas:

1. **Ver lista de usuarios** - Consume GET /users con paginación
2. **Ver detalle de usuario** - Consume GET /users/:id
3. **Crear usuario** - Consume POST /users
4. **Editar usuario** - Consume PUT /users/:id
5. **Eliminar usuario** - Consume DELETE /users/:id
6. **Log de peticiones** - Muestra todas las peticiones realizadas

---

## 7. Códigos de Estado HTTP

| Código | Significado |
|--------|-------------|
| 200 | OK - Petición exitosa |
| 201 | Created - Recurso creado |
| 204 | No Content - Eliminación exitosa |
| 400 | Bad Request - Datos inválidos |
| 404 | Not Found - Recurso no encontrado |

---

## 8. Notas Importantes

⚠️ **Reqres es una API de prueba:**
- Los datos **NO se guardan permanentemente**
- POST/PUT/DELETE simulan la operación pero no modifican la base de datos real
- Ideal para aprender y prototipar
- Los IDs generados son aleatorios

💡 **Consejos para Postman:**
- Guarda las peticiones en una colección
- Usa variables de entorno para la URL base
- Exporta la colección para compartirla
- Revisa la pestaña "Tests" para automatizar validaciones

---

## 9. Ejemplo de Código con Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://reqres.in/api'
});

// GET - Listar usuarios
async function getUsers(page = 1) {
  const response = await api.get('/users', { params: { page } });
  return response.data;
}

// POST - Crear usuario
async function createUser(userData) {
  const response = await api.post('/users', userData);
  return response.data;
}

// PUT - Actualizar usuario
async function updateUser(id, userData) {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
}

// DELETE - Eliminar usuario
async function deleteUser(id) {
  await api.delete(`/users/${id}`);
}
```

---

## 10. Recursos Adicionales

- 📚 Documentación Reqres: https://reqres.in/
- 📮 Documentación Postman: https://learning.postman.com/
- 📖 Documentación Axios: https://axios-http.com/docs/intro
