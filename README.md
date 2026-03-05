# Práctica API REST con Reqres y Vue.js

**Alumno:** Miguel Lucero  
**Fecha:** 4 de marzo de 2026  
**Módulo:** 7 - Lección 2 - Día 3

---

## 📋 Descripción del Proyecto

Aplicación Vue.js que demuestra el consumo de una API REST utilizando **Axios** y la API de prueba **Reqres**. Incluye operaciones CRUD completas (Create, Read, Update, Delete) y es compatible con pruebas en **Postman**.

---

## 🚀 Tecnologías Utilizadas

- **Vue.js 3** - Framework frontend
- **Axios** - Cliente HTTP para consumo de APIs
- **Reqres API** - API REST de prueba (https://reqres.in/)
- **Postman** - Herramienta para pruebas de API

---

## 📦 Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>

# Entrar al directorio del proyecto
cd api-practica

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run serve
```

---

## 🔧 Configuración

### API Key de Reqres

Este proyecto requiere una API key de Reqres:

1. Crear cuenta gratuita en https://app.reqres.in/api-keys
2. Copiar tu API key personal
3. Configurar en los archivos:
   - `vue.config.js` (línea del header x-api-key)
   - `src/components/ReqresExample.vue` (línea del header x-api-key)

---

## 🌐 Endpoints Implementados

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/users?page=1` | Listar usuarios (paginado) |
| GET | `/api/users/:id` | Obtener usuario por ID |
| POST | `/api/users` | Crear nuevo usuario |
| PUT | `/api/users/:id` | Actualizar usuario |
| DELETE | `/api/users/:id` | Eliminar usuario |

---

## 📮 Uso con Postman

Ver la guía completa en: [Guia_Postman_Reqres.md](Guia_Postman_Reqres.md)

### Headers requeridos:

| Header | Valor |
|--------|-------|
| `x-api-key` | `TU_API_KEY` |
| `Content-Type` | `application/json` |

---

## 💡 Funcionalidades

- ✅ Listar usuarios con paginación
- ✅ Ver detalles de un usuario
- ✅ Crear nuevos usuarios
- ✅ Editar usuarios existentes
- ✅ Eliminar usuarios
- ✅ Log de peticiones HTTP en tiempo real
- ✅ Guía integrada para uso con Postman

---

## 📁 Estructura del Proyecto

```
api-practica/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── ReqresExample.vue    # Componente principal CRUD
│   ├── App.vue
│   └── main.js
├── vue.config.js                 # Configuración del proxy
├── package.json
└── README.md
```

---

## 🔐 Seguridad

- La API key no se muestra en la interfaz de usuario
- La API key no se expone en la documentación
- Se usa proxy en desarrollo para evitar CORS

---

## 📚 Recursos

- [Documentación Reqres](https://reqres.in/)
- [Documentación Vue.js](https://vuejs.org/)
- [Documentación Axios](https://axios-http.com/)
- [Guía de Postman](https://learning.postman.com/)

---

## 📝 Licencia

Proyecto educativo - AIEP 2026
