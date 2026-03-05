# 🌦️ Aplicación Meteorológica Huilo-Huilo

Aplicación Vue.js que consume la API Open-Meteo para mostrar datos meteorológicos reales de 5 estaciones cercanas a la Reserva Nacional Huilo-Huilo, Chile.

## 📋 Características

- ✅ **Datos meteorológicos reales** de 5 estaciones en Huilo-Huilo
- ✅ **Pronóstico de 7 días** con temperaturas máximas y mínimas
- ✅ **Mapa de temperatura** con colores dinámicos
- ✅ **Consumo de API** con Open-Meteo y demostración con Axios
- ✅ **Manejo robusto de errores** con try...catch
- ✅ **Interfaz responsive** y atractiva

## 🗺️ Estaciones Meteorológicas

1. **Huilo-Huilo Centro** (-39.84°S, -71.81°W) - Reserva Principal
2. **Neltume** (-39.82°S, -71.95°W) - Norte de la Reserva
3. **Puerto Fuy** (-39.87°S, -71.88°W) - Lago Pirehueico
4. **Choshuenco** (-39.93°S, -72.03°W) - Volcán Choshuenco
5. **Panguipulli** (-39.64°S, -72.33°W) - Ciudad cercana

## 🚀 Instalación y Ejecución

### Project setup
```bash
npm install
```

### Compiles and hot-reloads for development
```bash
npm run serve
```

### Compiles and minifies for production
```bash
npm run build
```

### Lints and fixes files
```bash
npm run lint
```

**Nota:** Abrir la consola del navegador (F12) para ver logs detallados del proceso

## 📦 Dependencias

- **Vue 3** - Framework JavaScript
- **Axios** - Cliente HTTP (ejemplos en src/ejemplos-axios.js)
- **openmeteo** - Cliente para Open-Meteo API (usado en la app principal)

## 🔧 Archivos Importantes

- `src/components/ApiExample.vue` - Componente principal con consumo de Open-Meteo
- `src/ejemplos-axios.js` - 8 ejemplos completos de cómo usar Axios
- `src/App.vue` - Aplicación raíz

## 📊 Datos Obtenidos

**Para cada estación:**
- Temperatura actual (°C)
- Humedad relativa (%)
- Velocidad del viento (km/h)
- Condición meteorológica
- Elevación (m)

**Pronóstico de 7 días:**
- Temperaturas máximas y mínimas diarias
- Condiciones meteorológicas
- Visualización con colores según temperatura

## 🎓 Propósito Educativo

Este proyecto demuestra:

1. **Consumo de API meteorológica real** con fetchWeatherApi (Open-Meteo)
2. **Manejo de promesas** con async/await
3. **Manejo de errores** con try...catch...finally
4. **Procesamiento de datos reales** meteorológicos
5. **Visualización de datos** en interfaz de usuario
6. **Ejemplos de Axios** para otras APIs REST (ver src/ejemplos-axios.js)

### Diferencia entre fetchWeatherApi y Axios

**En este proyecto:**
- `fetchWeatherApi` se usa para Open-Meteo (optimizado para datos binarios)
- `Axios` se explica con ejemplos en src/ejemplos-axios.js

**fetchWeatherApi es mejor para:**
- Datos meteorológicos de Open-Meteo
- Respuestas binarias eficientes
- API simplificada

**Axios es mejor para:**
- APIs REST tradicionales con JSON
- Headers personalizados y autenticación
- Múltiples APIs diferentes
- Ver 8 ejemplos completos en [src/ejemplos-axios.js](src/ejemplos-axios.js)

## 🌡️ Colores según Temperatura

- 🔴 **Rojo** (≥ 20°C): Cálido
- 🟠 **Naranja** (15-19°C): Templado
- 🟡 **Amarillo** (10-14°C): Fresco
- 🟢 **Verde** (5-9°C): Frío
- 🔵 **Azul** (< 5°C): Muy frío

## 🌍 API Utilizada

**Open-Meteo** (https://open-meteo.com)
- API meteorológica gratuita y de código abierto
- Sin registro ni autenticación requerida
- Datos de alta calidad de fuentes gubernamentales

## 👨‍💻 Alumno

**Alicia Piero** - Módulo 7 L2D3 - AIEP 2026

## 📖 Documentación

Ver `Explicacion_Proyecto_API.md` en la carpeta superior para documentación detallada.

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
