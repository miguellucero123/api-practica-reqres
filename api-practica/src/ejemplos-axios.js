// ========================================
// EJEMPLO: Cómo usar Axios para consumir APIs
// ========================================

import axios from 'axios';

/**
 * EJEMPLO 1: Petición GET simple
 * API pública sin autenticación
 */
async function ejemploGetSimple() {
  try {
    const response = await axios.get('https://api.ejemplo.com/datos');
    console.log('Datos recibidos:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

/**
 * EJEMPLO 2: Petición GET con parámetros
 * Similar a Open-Meteo pero con Axios
 */
async function ejemploGetConParametros() {
  try {
    const response = await axios.get('https://api.ejemplo.com/clima', {
      params: {
        ciudad: 'Huilo-Huilo',
        unidades: 'metric',
        idioma: 'es'
      }
    });
    console.log('Clima:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

/**
 * EJEMPLO 3: Petición con headers personalizados
 * Usado para APIs que requieren autenticación
 */
async function ejemploConHeaders() {
  try {
    const response = await axios.get('https://api.ejemplo.com/privado', {
      headers: {
        'Authorization': 'Bearer tu_token_aqui',
        'Content-Type': 'application/json',
        'x-api-key': 'tu_clave_api_aqui'
      }
    });
    console.log('Datos privados:', response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      // El servidor respondió con un código de error
      console.error('Código de error:', error.response.status);
      console.error('Mensaje:', error.response.data);
    } else if (error.request) {
      // La petición fue enviada pero no hubo respuesta
      console.error('No se recibió respuesta del servidor');
    } else {
      // Error al configurar la petición
      console.error('Error:', error.message);
    }
  }
}

/**
 * EJEMPLO 4: Petición POST para enviar datos
 */
async function ejemploPost() {
  try {
    const datosAEnviar = {
      nombre: 'Estación Huilo-Huilo',
      temperatura: 15,
      ubicacion: { lat: -39.84, lon: -71.81 }
    };

    const response = await axios.post('https://api.ejemplo.com/estaciones', datosAEnviar, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Estación creada:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al crear estación:', error.message);
  }
}

/**
 * EJEMPLO 5: Configuración global de Axios
 * Útil cuando todas las peticiones usan los mismos headers
 */
function configurarAxiosGlobal() {
  // Configurar base URL
  axios.defaults.baseURL = 'https://api.ejemplo.com';
  
  // Configurar headers por defecto
  axios.defaults.headers.common['Authorization'] = 'Bearer tu_token';
  axios.defaults.headers.post['Content-Type'] = 'application/json';
  
  // Configurar timeout
  axios.defaults.timeout = 10000; // 10 segundos
}

/**
 * EJEMPLO 6: Interceptores para logging
 * Útil para debugging y manejo de errores global
 */
function configurarInterceptores() {
  // Interceptor de peticiones
  axios.interceptors.request.use(
    config => {
      console.log('📡 Enviando petición a:', config.url);
      console.log('📊 Parámetros:', config.params);
      return config;
    },
    error => {
      console.error('❌ Error en petición:', error);
      return Promise.reject(error);
    }
  );

  // Interceptor de respuestas
  axios.interceptors.response.use(
    response => {
      console.log('✅ Respuesta recibida:', response.status);
      return response;
    },
    error => {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            console.error('🔒 No autorizado - Verifica tu API key');
            break;
          case 403:
            console.error('⛔ Prohibido - No tienes permisos');
            break;
          case 404:
            console.error('🔍 No encontrado - Verifica la URL');
            break;
          case 500:
            console.error('💥 Error del servidor');
            break;
          default:
            console.error('❌ Error:', error.response.status);
        }
      }
      return Promise.reject(error);
    }
  );
}

/**
 * EJEMPLO 7: Múltiples peticiones en paralelo
 */
async function ejemploPeticionesParalelas() {
  try {
    const [estaciones, pronostico, alertas] = await Promise.all([
      axios.get('https://api.ejemplo.com/estaciones'),
      axios.get('https://api.ejemplo.com/pronostico'),
      axios.get('https://api.ejemplo.com/alertas')
    ]);

    console.log('Estaciones:', estaciones.data);
    console.log('Pronóstico:', pronostico.data);
    console.log('Alertas:', alertas.data);

    return {
      estaciones: estaciones.data,
      pronostico: pronostico.data,
      alertas: alertas.data
    };
  } catch (error) {
    console.error('Error en peticiones paralelas:', error.message);
  }
}

/**
 * EJEMPLO 8: Manejo completo de errores
 * Patrón recomendado para producción
 */
async function ejemploManejoCompleto() {
  try {
    const response = await axios.get('https://api.ejemplo.com/datos', {
      timeout: 5000,
      validateStatus: status => status < 500 // Acepta todos los códigos < 500
    });

    if (response.status === 200) {
      console.log('✅ Éxito:', response.data);
      return { success: true, data: response.data };
    } else if (response.status === 401) {
      console.error('🔒 Error de autenticación');
      return { success: false, error: 'No autorizado' };
    } else if (response.status === 404) {
      console.error('🔍 Recurso no encontrado');
      return { success: false, error: 'No encontrado' };
    }
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ La petición excedió el tiempo límite');
      return { success: false, error: 'Timeout' };
    } else if (error.code === 'ERR_NETWORK') {
      console.error('🌐 Error de red');
      return { success: false, error: 'Sin conexión' };
    } else {
      console.error('❌ Error desconocido:', error.message);
      return { success: false, error: error.message };
    }
  }
}

// ========================================
// COMPARACIÓN: Open-Meteo vs Axios
// ========================================

/**
 * Open-Meteo con fetchWeatherApi:
 * - Optimizado para datos meteorológicos
 * - Maneja respuestas binarias eficientemente
 * - API específica de Open-Meteo
 * 
 * Axios:
 * - Biblioteca general para cualquier API REST
 * - Maneja JSON, texto, blobs, etc.
 * - Más configurable y flexible
 * - Más interceptores y middleware
 */

// Ejemplo comparativo:

// Con fetchWeatherApi (Open-Meteo):
import { fetchWeatherApi } from 'openmeteo';

async function usarOpenMeteo() {
  const params = {
    latitude: [-39.84],
    longitude: [-71.81],
    current: ["temperature_2m"]
  };
  
  const responses = await fetchWeatherApi(
    'https://api.open-meteo.com/v1/forecast',
    params
  );
  
  const current = responses[0].current();
  const temperature = current.variables(0).value();
  console.log('Temperatura:', temperature);
}

// Con Axios (API REST tradicional):
async function usarAxios() {
  const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
    params: {
      q: 'Huilo-Huilo,CL',
      appid: 'TU_API_KEY',
      units: 'metric'
    }
  });
  
  const temperature = response.data.main.temp;
  console.log('Temperatura:', temperature);
}

// ========================================
// NOTAS IMPORTANTES
// ========================================

/**
 * 1. Axios es necesario cuando:
 *    - Consumes APIs REST que devuelven JSON
 *    - Necesitas configurar headers personalizados
 *    - Requieres interceptores globales
 *    - Trabajas con múltiples APIs diferentes
 * 
 * 2. fetchWeatherApi es mejor cuando:
 *    - Solo usas Open-Meteo
 *    - Necesitas eficiencia con datos binarios
 *    - Quieres una API simplificada
 * 
 * 3. Ambos manejan promesas con async/await
 * 
 * 4. Ambos requieren manejo de errores con try...catch
 * 
 * 5. En este proyecto, fetchWeatherApi fue suficiente
 *    porque solo consumimos Open-Meteo
 */

export {
  ejemploGetSimple,
  ejemploGetConParametros,
  ejemploConHeaders,
  ejemploPost,
  configurarAxiosGlobal,
  configurarInterceptores,
  ejemploPeticionesParalelas,
  ejemploManejoCompleto
};
