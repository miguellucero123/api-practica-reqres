# Explicación del Proyecto: Meteorología Huilo-Huilo

**Alumno:** Alicia Piero  
**Fecha:** 25 de febrero de 2026  
**Módulo:** 7 - Lección 2 - Día 3

---

## 1. Cómo se realizó la petición a la API con Open-Meteo (y concepto de Axios)

### Descripción del proceso

Este proyecto utiliza **Open-Meteo** como API meteorológica principal con la librería especializada `openmeteo`. Adicionalmente, incluye ejemplos educativos de cómo se usaría **Axios** para otras APIs REST.

En el componente `ApiExample.vue`, se implementó una función asíncrona llamada `fetchWeatherData()` que realiza la petición a Open-Meteo.

### Código de la petición principal (Open-Meteo)

```javascript
import { fetchWeatherApi } from 'openmeteo';

async fetchWeatherData() {
  this.loading = true;
  this.error = null;
  
  try {
    console.log('🌐 Realizando peticiones a la API Open-Meteo...');
    
    // Preparar parámetros para las 5 estaciones de Huilo-Huilo
    const params = {
      latitude: this.stationsLocations.map(s => s.lat),
      longitude: this.stationsLocations.map(s => s.lon),
      current: ["temperature_2m", "relative_humidity_2m", "wind_speed_10m", "weather_code"],
      daily: ["temperature_2m_max", "temperature_2m_min", "weather_code"],
      timezone: "America/Santiago",
      forecast_days: 7
    };
    
    // Realizar petición con fetchWeatherApi
    const responses = await fetchWeatherApi(this.apiEndpoint, params);
    
    console.log('✅ Respuesta exitosa de Open-Meteo!');
    this.requestCount++;

    // Procesar los datos meteorológicos reales
    this.processWeatherData(responses);
    
  } catch (err) {
    console.error('❌ Error al consumir la API:', err);
    this.loadExampleData();
  } finally {
    this.loading = false;
  }
}
```

### ¿Por qué fetchWeatherApi y no Axios?

**fetchWeatherApi** está optimizado para:
- Procesar respuestas binarias de Open-Meteo eficientemente
- Manejar múltiples coordenadas simultáneamente
- API específica y simplificada para datos meteorológicos

**Axios** se usaría para:
- APIs REST tradicionales que devuelven JSON
- APIs que requieren configuración compleja de headers
- Cuando necesitas interceptores globales
- Para múltiples APIs diferentes

### Ejemplos completos de Axios

Ver archivo [src/ejemplos-axios.js](api-practica/src/ejemplos-axios.js) que incluye 8 ejemplos de:
- Peticiones GET/POST
- Headers personalizados
- Manejo de errores
- Interceptores
- Configuración global

### Pasos del proceso:

1. **Instalación de dependencias:**
   ```bash
   npm install axios
   npm install openmeteo
   ```

2. **Importación de librerías:**
   ```javascript
   import axios from 'axios';
   import { fetchWeatherApi } from 'openmeteo';
   ```

3. **Configuración de parámetros:** Se definen las coordenadas de las 5 estaciones y los datos a obtener.

4. **Petición con fetchWeatherApi:** Se envía la petición con múltiples coordenadas a la vez.

5. **Procesamiento de respuestas:** Se reciben datos de las 5 estaciones y se procesan individualmente.

6. **Uso de async/await:** Se manejan las promesas de forma sincrónica y limpia.

---

## 2. Cómo se usó la clave API (x-api-key) en la solicitud

### Contexto del proyecto

Este proyecto utiliza **Open-Meteo**, que es una **API completamente gratuita y abierta** que **NO requiere registro, autenticación ni clave API**.

### ¿Por qué Open-Meteo no requiere clave API?

Open-Meteo es un proyecto de código abierto financiado por donaciones que proporciona datos meteorológicos de forma gratuita para cualquier persona. Su filosofía es:

- ✅ Sin registro
- ✅ Sin límites de peticiones excesivos
- ✅ Sin clave API
- ✅ Datos de alta calidad de fuentes gubernamentales

### Código de demostración con Axios

Para propósitos educativos, el proyecto incluye un archivo de ejemplos completos en [src/ejemplos-axios.js](api-practica/src/ejemplos-axios.js) que demuestra:

**8 ejemplos de uso de Axios:**
1. Petición GET simple
2. Petición GET con parámetros
3. Petición con headers personalizados (x-api-key)
4. Petición POST para enviar datos
5. Configuración global de Axios
6. Interceptores para logging y debugging
7. Múltiples peticiones en paralelo
8. Manejo completo de errores

**Ejemplo de código con Axios:**

```javascript
import axios from 'axios';

// Petición con header x-api-key
async function consumirAPIConClave() {
  try {
    const response = await axios.get('https://api.ejemplo.com/privado', {
      headers: {
        'x-api-key': 'tu_clave_api_secreta',
        'Content-Type': 'application/json'
      }
    });
    console.log('Datos recibidos:', response.data);
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('❌ Error 401: Clave API inválida');
    } else if (error.response?.status === 403) {
      console.log('❌ Error 403: Acceso prohibido');
    }
  }
}
```

**Nota:** La aplicación principal usa `fetchWeatherApi` de openmeteo porque está optimizada para datos meteorológicos binarios. Axios se usaría para APIs REST tradicionales que devuelven JSON.

### En una API que SÍ requiere autenticación (ejemplo teórico):

```javascript
// Ejemplo con OpenWeatherMap (requiere clave API)
const API_KEY = 'tu_clave_api_real';
const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
  params: {
    q: 'Huilo-Huilo,CL',
    appid: API_KEY,  // Clave API como parámetro
    units: 'metric'
  }
});
```

O usando header:

```javascript
const response = await axios.get('https://api.ejemplo.com/weather', {
  headers: {
    'x-api-key': 'tu_clave_api_secreta',
    'Content-Type': 'application/json'
  }
});
```

### Buenas prácticas con claves API:

1. **Variables de entorno:** Nunca incluir claves API directamente en el código.
   ```javascript
   const API_KEY = process.env.VUE_APP_API_KEY;
   ```

2. **Archivo .env:**
   ```
   VUE_APP_API_KEY=tu_clave_secreta_aqui
   ```

3. **Excluir del control de versiones:**
   ```
   # .gitignore
   .env
   .env.local
   ```

---

## 3. Qué ocurre si no se incluye la clave API

### En Open-Meteo (nuestra API principal)

✅ **Funciona perfectamente SIN clave API** porque es una API pública abierta.

```javascript
// Esto funciona sin problemas:
const responses = await fetchWeatherApi('https://api.open-meteo.com/v1/forecast', {
  latitude: [-39.84],
  longitude: [-71.81],
  current: ["temperature_2m"]
});
```

### En reqres.in (API de demostración)

✅ **También funciona SIN clave API** porque es una API pública para testing.

❌ **PERO:** Si intentamos agregar un header `x-api-key` no válido, la API lo rechaza con error **403 Forbidden**.

```javascript
// Esto genera ERROR 403:
await axios.get('https://reqres.in/api/users?page=1', {
  headers: {
    'x-api-key': 'clave-incorrecta'  // ❌ Header no aceptado
  }
});
```

### En APIs que SÍ requieren autenticación

Si intentamos consumir una API que requiere autenticación (como OpenWeatherMap, WeatherAPI, etc.) **sin proporcionar la clave API**, ocurre lo siguiente:

#### Error 401 - No autorizado

```
Error 401: Unauthorized
{
  "cod": 401,
  "message": "Invalid API key. Please see https://openweathermap.org/faq#error401"
}
```

**Significado:** El servidor no puede autenticar al cliente porque falta la clave API o no es válida.

#### Error 403 - Prohibido

```
Error 403: Forbidden
{
  "error": "Access denied. Valid API key required."
}
```

**Significado:** El servidor entiende la petición pero se niega a autorizarla, generalmente porque la clave API no tiene los permisos necesarios o está ausente.

### Consecuencias prácticas:

1. **No se obtienen datos:** La petición falla completamente y no devuelve datos.
2. **Error en la aplicación:** Si no se maneja correctamente con `try...catch`, la aplicación puede romperse.
3. **Logs de error:** El navegador muestra errores 401 o 403 en la consola.
4. **Experiencia del usuario:** El usuario ve mensajes de error o datos vacíos.

### Demostración en el código:

```javascript
// Sin clave API en una API que la requiere:
try {
  const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
    params: {
      q: 'Huilo-Huilo,CL'
      // Falta: appid: API_KEY
    }
  });
} catch (error) {
  console.log(error.response.status); // 401
  console.log(error.response.data.message); // "Invalid API key"
}
```

---

## 4. Cómo se manejaron errores con try...catch

### Estructura del manejo de errores

El proyecto implementa un **manejo robusto de errores** utilizando la estructura `try...catch...finally`:

```javascript
try {
  // Código que puede generar un error
  const response = await axios.get(this.apiEndpoint);
  this.processWeatherData(response.data);
  
} catch (err) {
  // Manejo de diferentes tipos de errores
  console.error('❌ Error al consumir la API:', err);
  
  if (err.response) {
    // Error de respuesta del servidor (4xx, 5xx)
    console.error('📛 Código de error:', err.response.status);
    console.error('📝 Datos del error:', err.response.data);
    
    if (err.response.status === 401 || err.response.status === 403) {
      this.error = 'Error de autenticación. Clave API inválida o faltante.';
    } else {
      this.error = `Error ${err.response.status}: ${err.response.statusText}`;
    }
    
  } else if (err.request) {
    // La petición se hizo pero no hubo respuesta
    console.error('📡 No se recibió respuesta del servidor');
    this.error = 'No se pudo conectar con el servidor. Verifica tu conexión.';
    
  } else {
    // Error al configurar la petición
    console.error('⚙️ Error al configurar la petición:', err.message);
    this.error = `Error: ${err.message}`;
  }
  
  // Cargar datos de ejemplo en caso de error
  this.loadExampleData();
  
} finally {
  // Código que se ejecuta siempre
  this.loading = false;
  console.log('🏁 Proceso de carga finalizado');
}
```

### Tipos de errores manejados:

#### 1. **err.response** - Error de respuesta del servidor

Ocurre cuando el servidor responde con un código de error (4xx o 5xx):

- **401 Unauthorized:** Clave API inválida o faltante
- **403 Forbidden:** Acceso prohibido
- **404 Not Found:** URL no encontrada
- **500 Internal Server Error:** Error del servidor

**Acción:** Se muestra un mensaje específico al usuario y se cargan datos de ejemplo.

#### 2. **err.request** - Sin respuesta del servidor

Ocurre cuando se envía la petición pero no se recibe respuesta:

- Problemas de red
- Servidor caído
- Timeout de conexión

**Acción:** Se informa al usuario sobre problemas de conexión.

#### 3. **Otros errores** - Error al configurar la petición

Errores en la configuración de Axios antes de enviar la petición:

- URL malformada
- Headers incorrectos
- Parámetros inválidos

**Acción:** Se muestra el mensaje de error técnico.

### Beneficios del manejo de errores:

1. **Prevención de crashes:** La aplicación no se rompe si falla la API.
2. **Feedback al usuario:** Se muestran mensajes claros sobre qué salió mal.
3. **Logs detallados:** La consola muestra información útil para debugging.
4. **Fallback de datos:** Se cargan datos de ejemplo si falla la API real.
5. **Estado de carga:** El indicador `loading` siempre se desactiva (en el bloque `finally`).

### Logs en consola

El código incluye múltiples `console.log()` para hacer seguimiento del proceso:

```javascript
console.log('🌐 Realizando petición GET a la API con Axios...');
console.log('📡 Endpoint:', this.apiEndpoint);
console.log('✅ Respuesta exitosa de la API:', response.data);
console.error('❌ Error al consumir la API:', err);
```

Estos logs ayudan a:
- Entender el flujo de la aplicación
- Detectar problemas rápidamente
- Validar que los datos se reciben correctamente
- Depurar errores durante el desarrollo

---

## 5. Características adicionales implementadas

### Aplicación meteorológica REAL de Huilo-Huilo con Open-Meteo

El proyecto va más allá de los requisitos básicos e implementa **datos meteorológicos reales** de la API Open-Meteo:

#### 5 Estaciones meteorológicas cercanas a Huilo-Huilo con datos reales:

1. **Estación Huilo-Huilo Centro** (-39.84°S, -71.81°W) - Reserva Principal
2. **Estación Neltume** (-39.82°S, -71.95°W) - Norte de la Reserva
3. **Estación Puerto Fuy** (-39.87°S, -71.88°W) - Lago Pirehueico
4. **Estación Choshuenco** (-39.93°S, -72.03°W) - Volcán Choshuenco
5. **Estación Panguipulli** (-39.64°S, -72.33°W) - Ciudad cercana

#### Datos reales obtenidos de Open-Meteo para cada estación:

- **Temperatura actual** (temperature_2m) en °C
- **Humedad relativa** (relative_humidity_2m) en %
- **Velocidad del viento** (wind_speed_10m) en km/h
- **Código meteorológico** (weather_code) convertido a descripción en español
- **Elevación** de la estación en metros
- **Hora de última actualización**

#### Pronóstico real de 7 días:

- Datos reales de temperaturas máximas y mínimas diarias
- Condiciones meteorológicas proyectadas
- Colores dinámicos según temperatura:
  - 🔴 Rojo: ≥ 20°C (cálido)
  - 🟠 Naranja: 15-19°C (templado)
  - 🟡 Amarillo: 10-14°C (fresco)
  - 🟢 Verde agua: 5-9°C (frío)
  - 🔵 Azul: < 5°C (muy frío)

#### Procesamiento de datos de Open-Meteo:

El proyecto demuestra cómo:
- Hacer peticiones con múltiples coordenadas simultáneamente
- Procesar respuestas binarias de Open-Meteo
- Convertir códigos meteorológicos WMO a descripciones legibles
- Manejar zonas horarias (America/Santiago)
- Extraer datos actuales y pronósticos de la misma petición

### Interfaz de usuario atractiva:

- Diseño responsive (adaptable a móviles)
- Animaciones suaves con hover effects
- Gradientes de color modernos
- Indicadores de estado (loading, errores)
- Iconos visuales y emojis temáticos
- Tarjetas interactivas clickeables

### Demostración educativa con Axios:

Además de Open-Meteo, el proyecto incluye:
- Petición con Axios a reqres.in para demostrar su uso
- Comparación entre APIs que requieren/no requieren autenticación
- Manejo de errores 403 al usar headers incorrectos

---

## Conclusión

Este proyecto demuestra:

✅ **Consumo de API meteorológica REAL** con Open-Meteo y `fetchWeatherApi`  
✅ **Uso de Axios** para APIs REST tradicionales (demostración con reqres.in)  
✅ **Manejo profesional de promesas** con async/await  
✅ **Manejo robusto de errores** con try...catch...finally  
✅ **Comprensión de autenticación API** (APIs públicas vs. APIs con clave)  
✅ **Procesamiento de datos reales** de 5 estaciones meteorológicas  
✅ **Pronóstico de 7 días con datos reales** de temperaturas y condiciones  
✅ **Visualización de datos** en una interfaz atractiva y responsive  
✅ **Aplicación práctica** con datos meteorológicos reales de Huilo-Huilo, Chile  

### Tecnologías utilizadas:

- **Vue 3** - Framework de JavaScript
- **Axios** - Cliente HTTP para peticiones REST
- **OpenMeteo Library** - Cliente especializado para Open-Meteo API
- **Open-Meteo API** - Proveedor de datos meteorológicos reales
- **CSS3** - Diseño responsive y animaciones

El código está completamente documentado con más de 100 líneas de comentarios explicativos y logs detallados en consola para facilitar la comprensión del proceso de consumo de APIs.

---

## Instrucciones de ejecución

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo:**
   ```bash
   npm run serve
   ```

3. **Abrir la consola del navegador (F12)** para ver:
   - Logs detallados del proceso de peticiones
   - Datos meteorológicos recibidos
   - Coordenadas de cada estación
   - Demostración de manejo de errores

4. **Observar en la interfaz:**
   - 5 estaciones con datos meteorológicos reales
   - Pronóstico de 7 días con colores según temperatura
   - Información de la API utilizada

---

**Nota:** Los datos se actualizan en tiempo real cada vez que se recarga la aplicación, obteniendo información meteorológica actual de Open-Meteo para las coordenadas de Huilo-Huilo.
