<template>
  <div class="weather-app">
    <header class="app-header">
      <div class="header-content">
        <div class="header-icon">🌦️</div>
        <div class="header-text">
          <h1>Sistema Meteorológico Huilo-Huilo</h1>
          <p class="subtitle">Reserva Nacional Huilo-Huilo • Región de Los Ríos, Chile</p>
          <p class="subtitle-small">Monitoreo en Tiempo Real • Open-Meteo API</p>
        </div>
      </div>
    </header>

    <!-- Mensaje de error -->
    <div v-if="error" class="error-message">
      <h3>⚠️ Error al cargar datos</h3>
      <p>{{ error }}</p>
    </div>

    <!-- Indicador de carga -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Cargando datos meteorológicos...</p>
    </div>

    <div v-if="!loading && !error" class="dashboard">
      <!-- Mapa Georreferencial Leaflet -->
      <section class="map-section">
        <h2>📍 Mapa Georreferencial de Estaciones</h2>
        <div class="map-info">
          <p>🗺️ Reserva Nacional Huilo-Huilo, Región de Los Ríos, Chile</p>
        </div>
        <div id="map" class="leaflet-map"></div>
      </section>

      <!-- Estaciones Meteorológicas -->
      <section class="stations-container">
        <h2>📊 Datos de Estaciones</h2>
        <div class="stations-grid">
          <div 
            v-for="station in stations" 
            :key="station.id" 
            class="station-card"
            :class="{ active: selectedStation === station.id }"
            @click="selectStation(station.id)"
          >
            <div class="station-header">
              <h3>{{ station.name }}</h3>
              <span class="station-id">EST-{{ station.id }}</span>
            </div>
            <p class="location">{{ station.location }}</p>
            <div class="temperature">
              <span class="temp-value">{{ station.temperature }}°C</span>
            </div>
            <div class="weather-info">
              <div class="info-item">
                <span class="label">Humedad:</span>
                <span class="value">{{ station.humidity }}%</span>
              </div>
              <div class="info-item">
                <span class="label">Viento:</span>
                <span class="value">{{ station.wind }} km/h</span>
              </div>
              <div class="info-item">
                <span class="label">Condición:</span>
                <span class="value">{{ station.condition }}</span>
              </div>
            </div>
            <small class="timestamp">Actualizado: {{ station.lastUpdate }}</small>
          </div>
        </div>
      </section>

      <!-- Gráficos -->
      <section class="charts-section">
        <div class="charts-grid">
          <!-- Gráfico de Temperatura -->
          <div class="chart-card">
            <h3>📈 Temperatura - Próximos 7 Días</h3>
            <div class="chart-wrapper">
              <canvas ref="temperatureChart"></canvas>
            </div>
          </div>
          
          <!-- Gráfico de Precipitación Simulada -->
          <div class="chart-card">
            <h3>💧 Probabilidad de Precipitación</h3>
            <div class="chart-wrapper">
              <canvas ref="precipitationChart"></canvas>
            </div>
          </div>
        </div>
      </section>

      <!-- Pronóstico Detallado -->
      <section class="forecast-container">
        <h2>📅 Pronóstico Detallado</h2>
        <div class="forecast-table">
          <div 
            v-for="day in forecast" 
            :key="day.date" 
            class="forecast-row"
          >
            <div class="forecast-date">
              <div class="day-name">{{ day.dayName }}</div>
              <div class="day-date">{{ day.date }}</div>
            </div>
            <div class="forecast-temps">
              <div class="temp-item">
                <span class="temp-label">Máx:</span>
                <span class="temp-max">{{ day.tempMax }}°C</span>
              </div>
              <div class="temp-item">
                <span class="temp-label">Mín:</span>
                <span class="temp-min">{{ day.tempMin }}°C</span>
              </div>
            </div>
            <div class="forecast-condition">{{ day.condition }}</div>
            <div class="forecast-bar">
              <div 
                class="temp-bar" 
                :style="{ width: getTempBarWidth(day.temp) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Información de API -->
      <section class="api-info">
        <h3>ℹ️ Información de la API</h3>
        <p><strong>Proveedor:</strong> Open-Meteo.com</p>
        <p><strong>Endpoint:</strong> {{ apiEndpoint }}</p>
        <p><strong>Método:</strong> GET con múltiples coordenadas</p>
        <p><strong>Autenticación:</strong> {{ apiKey }}</p>
        <p><strong>Total de solicitudes exitosas:</strong> {{ requestCount }}</p>
        <p><strong>Datos obtenidos:</strong> Temperatura, humedad, viento, pronóstico 7 días</p>
        
        <div class="api-note">
          <h4>📝 Uso de Open-Meteo:</h4>
          <p>
            <strong>Open-Meteo</strong> es una API meteorológica gratuita y de código abierto 
            que NO requiere registro ni autenticación.
          </p>
          <p>
            Este proyecto usa <code>fetchWeatherApi</code> de la librería <code>openmeteo</code> 
            para obtener datos reales de las 5 estaciones en Huilo-Huilo.
          </p>
          <p>
            La librería openmeteo está optimizada para procesar datos binarios de forma eficiente.
            Para APIs REST tradicionales que devuelven JSON, se usaría <strong>Axios</strong>.
          </p>
          <p>
            <strong>Ventajas de Open-Meteo:</strong> Sin clave API, sin límites, datos de alta calidad,
            pronósticos precisos para cualquier coordenada del mundo.
          </p>
          <p>
            Revisa la consola del navegador (F12) para ver todos los logs detallados del proceso.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { fetchWeatherApi } from 'openmeteo';
import { Chart, registerables } from 'chart.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

Chart.register(...registerables);

export default {
  name: 'ApiExample',
  data() {
    return {
      stations: [],
      forecast: [],
      loading: false,
      error: null,
      selectedStation: null,
      apiEndpoint: 'https://api.open-meteo.com/v1/forecast',
      requestCount: 0,
      apiKey: 'No requiere - API pública',
      tempChart: null,
      precipChart: null,
      map: null,
      markers: [],
      // Coordenadas de las 5 estaciones cercanas a Huilo-Huilo
      stationsLocations: [
        { name: 'Estación Huilo-Huilo Centro', location: 'Reserva Principal', lat: -39.84, lon: -71.81 },
        { name: 'Estación Neltume', location: 'Norte de la Reserva', lat: -39.82, lon: -71.95 },
        { name: 'Estación Puerto Fuy', location: 'Lago Pirehueico', lat: -39.87, lon: -71.88 },
        { name: 'Estación Choshuenco', location: 'Volcán Choshuenco', lat: -39.93, lon: -72.03 },
        { name: 'Estación Panguipulli', location: 'Ciudad cercana', lat: -39.64, lon: -72.33 }
      ]
    };
  },
  
  // Hook del ciclo de vida - se ejecuta cuando el componente está montado
  mounted() {
    console.log('✅ Componente ApiExample montado - Iniciando carga de datos');
    this.fetchWeatherData();
  },

  beforeUnmount() {
    // Limpiar mapa al desmontar componente
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
    // Limpiar gráficos
    if (this.tempChart) this.tempChart.destroy();
    if (this.precipChart) this.precipChart.destroy();
  },

  methods: {
    /**
     * Función principal que realiza la petición a la API Open-Meteo
     * Utiliza async/await para manejar promesas
     */
    async fetchWeatherData() {
      this.loading = true;
      this.error = null;
      
      try {
        console.log('🌐 Realizando peticiones a la API Open-Meteo...');
        console.log('📡 Endpoint:', this.apiEndpoint);
        console.log('🔑 Esta API NO requiere autenticación (es pública y gratuita)');
        console.log(`📍 Consultando ${this.stationsLocations.length} estaciones meteorológicas...`);

        // ==================== PETICIÓN CON OPEN-METEO ====================
        // Preparar parámetros para todas las estaciones
        const params = {
          latitude: this.stationsLocations.map(s => s.lat),
          longitude: this.stationsLocations.map(s => s.lon),
          current: ["temperature_2m", "relative_humidity_2m", "wind_speed_10m", "weather_code"],
          daily: ["temperature_2m_max", "temperature_2m_min", "weather_code"],
          timezone: "America/Santiago",
          forecast_days: 7
        };

        console.log('📊 Parámetros de consulta:', params);
        
        // Realizar petición con fetchWeatherApi de openmeteo
        const responses = await fetchWeatherApi(this.apiEndpoint, params);
        
        console.log('✅ Respuesta exitosa de Open-Meteo!');
        console.log(`📦 Total de respuestas recibidas: ${responses.length}`);
        this.requestCount++;

        // Procesar los datos meteorológicos reales
        this.processWeatherData(responses);
        
        console.log('🎉 Datos meteorológicos procesados correctamente');

        // ==================== NOTA: DEMOSTRACIÓN CON AXIOS ====================
        // En una aplicación real, Axios se puede usar para APIs REST tradicionales
        // Open-Meteo usa su propia librería optimizada para datos binarios
        console.log('\n📚 Nota: Este proyecto usa fetchWeatherApi de openmeteo');
        console.log('💡 Para APIs REST tradicionales, se usaría Axios de forma similar');
        console.log('💡 Axios permite configurar headers, parámetros, timeout, etc.');
        console.log('💡 Ambas librerías manejan promesas con async/await');

      } catch (err) {
        // Manejo de errores con try...catch
        console.error('❌ Error al consumir la API:', err);
        
        if (err.response) {
          // El servidor respondió con un código de error
          console.error('📛 Código de error:', err.response.status);
          console.error('📝 Datos del error:', err.response.data);
          this.error = `Error ${err.response.status}: ${err.response.statusText}`;
        } else if (err.request) {
          // La petición fue hecha pero no se recibió respuesta
          console.error('📡 No se recibió respuesta del servidor');
          this.error = 'No se pudo conectar con el servidor. Verifica tu conexión a Internet.';
        } else {
          // Algo sucedió al configurar la petición
          console.error('⚙️ Error al configurar la petición:', err.message);
          this.error = `Error: ${err.message}`;
        }

        // En caso de error, cargar datos de ejemplo
        console.log('ℹ️ Cargando datos de ejemplo para demostración...');
        this.loadExampleData();
      } finally {
        // Este bloque se ejecuta siempre, haya error o no
        this.loading = false;
        console.log('🏁 Proceso de carga finalizado\n');
      }
    },

    /**
     * Procesa los datos recibidos de Open-Meteo
     * Convierte los datos de cada estación en un formato amigable
     */
    processWeatherData(responses) {
      console.log('🔄 Procesando datos de Open-Meteo...');
      
      this.stations = responses.map((response, index) => {
        const stationInfo = this.stationsLocations[index];
        
        // Obtener coordenadas y datos básicos
        const latitude = response.latitude();
        const longitude = response.longitude();
        const elevation = response.elevation();
        const utcOffsetSeconds = response.utcOffsetSeconds();
        
        console.log(`\n📍 Estación ${index + 1}: ${stationInfo.name}`);
        console.log(`   Coordenadas: ${latitude}°S ${longitude}°W`);
        console.log(`   Elevación: ${elevation}m`);
        
        // Obtener datos actuales
        const current = response.current();
        const temperature = current.variables(0).value(); // temperature_2m
        const humidity = current.variables(1).value(); // relative_humidity_2m
        const windSpeed = current.variables(2).value(); // wind_speed_10m
        const weatherCode = current.variables(3).value(); // weather_code
        
        console.log(`   Temperatura: ${temperature.toFixed(1)}°C`);
        console.log(`   Humedad: ${humidity.toFixed(0)}%`);
        console.log(`   Viento: ${windSpeed.toFixed(1)} km/h`);
        
        // Procesar datos diarios para pronóstico
        const daily = response.daily();
        const dailyTime = Array.from(
          { length: 7 },
          (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
        );
        const dailyTempMax = daily.variables(0).valuesArray(); // temperature_2m_max
        const dailyTempMin = daily.variables(1).valuesArray(); // temperature_2m_min
        const dailyWeatherCode = daily.variables(2).valuesArray(); // weather_code
        
        // Guardar pronóstico para la primera estación (Huilo-Huilo Centro)
        if (index === 0) {
          this.forecast = dailyTime.map((date, i) => ({
            date: date.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' }),
            dayName: date.toLocaleDateString('es-CL', { weekday: 'long' }),
            temp: Math.round((dailyTempMax[i] + dailyTempMin[i]) / 2),
            tempMax: Math.round(dailyTempMax[i]),
            tempMin: Math.round(dailyTempMin[i]),
            condition: this.getWeatherCondition(dailyWeatherCode[i])
          }));
        }
        
        return {
          id: index + 1,
          name: stationInfo.name,
          location: stationInfo.location,
          temperature: Math.round(temperature),
          humidity: Math.round(humidity),
          wind: Math.round(windSpeed),
          condition: this.getWeatherCondition(weatherCode),
          lastUpdate: new Date().toLocaleTimeString('es-CL'),
          lat: latitude,
          lon: longitude,
          elevation: Math.round(elevation)
        };
      });
      
      console.log(`\n✅ ${this.stations.length} estaciones procesadas correctamente`);
      
      // Crear los gráficos y mapa después de procesar los datos
      this.$nextTick(() => {
        this.createCharts();
        
        // Inicializar mapa con un pequeño delay para asegurar que el DOM está listo
        setTimeout(() => {
          this.initMap();
        }, 100);
      });
    },

    /**
     * Carga datos de ejemplo en caso de error de API
     */
    loadExampleData() {
      console.log('📦 Cargando datos de ejemplo...');
      
      this.stations = this.stationsLocations.map((station, index) => ({
        id: index + 1,
        name: station.name,
        location: station.location,
        temperature: Math.round(8 + Math.random() * 12),
        humidity: Math.round(70 + Math.random() * 20),
        windSpeed: Math.round(8 + Math.random() * 10),
        condition: 'Datos no disponibles',
        lastUpdate: new Date().toLocaleTimeString('es-CL'),
        lat: station.lat,
        lon: station.lon
      }));

      // Generar pronóstico de ejemplo
      const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const conditions = ['Soleado', 'Parcialmente nublado', 'Nublado', 'Lluvioso'];
      
      this.forecast = [];
      const today = new Date();

      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const temp = Math.round(10 + Math.random() * 10);

        this.forecast.push({
          date: date.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' }),
          dayName: days[date.getDay()],
          temp: temp,
          tempMax: temp + Math.round(Math.random() * 5),
          tempMin: temp - Math.round(Math.random() * 5),
          condition: conditions[Math.floor(Math.random() * conditions.length)]
        });
      }
      
      // Inicializar gráficos y mapa con datos de ejemplo
      this.$nextTick(() => {
        this.createCharts();
        
        setTimeout(() => {
          this.initMap();
        }, 100);
      });
    },

    /**
     * Convierte el código meteorológico de Open-Meteo a descripción en español
     * Basado en: https://open-meteo.com/en/docs
     */
    getWeatherCondition(code) {
      const weatherCodes = {
        0: 'Despejado',
        1: 'Principalmente despejado',
        2: 'Parcialmente nublado',
        3: 'Nublado',
        45: 'Neblina',
        48: 'Neblina con escarcha',
        51: 'Llovizna ligera',
        53: 'Llovizna moderada',
        55: 'Llovizna intensa',
        56: 'Llovizna helada ligera',
        57: 'Llovizna helada intensa',
        61: 'Lluvia ligera',
        63: 'Lluvia moderada',
        65: 'Lluvia intensa',
        66: 'Lluvia helada ligera',
        67: 'Lluvia helada intensa',
        71: 'Nieve ligera',
        73: 'Nieve moderada',
        75: 'Nieve intensa',
        77: 'Granizo',
        80: 'Chubascos ligeros',
        81: 'Chubascos moderados',
        82: 'Chubascos intensos',
        85: 'Chubascos de nieve ligeros',
        86: 'Chubascos de nieve intensos',
        95: 'Tormenta',
        96: 'Tormenta con granizo ligero',
        99: 'Tormenta con granizo intenso'
      };
      
      return weatherCodes[code] || `Código ${code}`;
    },

    /**
     * Calcula el color de fondo según la temperatura
     * Colores más cálidos para temperaturas altas, más fríos para bajas
     */
    getTemperatureColor(temp) {
      if (temp >= 20) return '#ff6b6b'; // Rojo cálido
      if (temp >= 15) return '#ffa94d'; // Naranja
      if (temp >= 10) return '#ffd93d'; // Amarillo
      if (temp >= 5) return '#95e1d3'; // Verde agua
      return '#74b9ff'; // Azul frío
    },

    /**
     * Selecciona una estación específica
     */
    selectStation(stationId) {
      this.selectedStation = stationId;
      console.log(`📍 Estación seleccionada: ${stationId}`);
      
      // Actualizar iconos de marcadores en el mapa
      if (this.map && this.markers.length > 0) {
        const selectedIcon = L.divIcon({
          className: 'custom-marker selected',
          html: `<div class="marker-pin"></div>`,
          iconSize: [36, 50],
          iconAnchor: [18, 50],
          popupAnchor: [0, -50]
        });
        
        const normalIcon = L.divIcon({
          className: 'custom-marker',
          html: `<div class="marker-pin"></div>`,
          iconSize: [30, 42],
          iconAnchor: [15, 42],
          popupAnchor: [0, -42]
        });

        this.markers.forEach(({ id, marker }) => {
          marker.setIcon(id === stationId ? selectedIcon : normalIcon);
        });
      }
    },

    /**
     * Inicializa el mapa de Leaflet con las estaciones meteorológicas
     */
    initMap() {
      // Verificar que el contenedor del mapa existe en el DOM
      const mapContainer = document.getElementById('map');
      if (!mapContainer) {
        console.warn('⚠️ Contenedor del mapa no encontrado en el DOM');
        return;
      }

      // Limpiar mapa existente si hay uno
      if (this.map) {
        this.map.remove();
        this.map = null;
      }

      // Configurar fix para iconos de Leaflet
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      // Centro del mapa (promedio de las estaciones)
      const centerLat = (this.stations.reduce((sum, s) => sum + s.lat, 0)) / this.stations.length;
      const centerLon = (this.stations.reduce((sum, s) => sum + s.lon, 0)) / this.stations.length;

      // Crear mapa
      this.map = L.map('map').setView([centerLat, centerLon], 11);

      // Agregar capa de tiles de OpenStreetMap con estilo claro
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
        minZoom: 9
      }).addTo(this.map);

      // Icono personalizado para estaciones
      const stationIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div class="marker-pin"></div>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -42]
      });

      const selectedIcon = L.divIcon({
        className: 'custom-marker selected',
        html: `<div class="marker-pin"></div>`,
        iconSize: [36, 50],
        iconAnchor: [18, 50],
        popupAnchor: [0, -50]
      });

      // Agregar marcadores para cada estación
      this.markers = this.stations.map(station => {
        const icon = this.selectedStation === station.id ? selectedIcon : stationIcon;
        const marker = L.marker([station.lat, station.lon], { icon })
          .addTo(this.map)
          .bindPopup(`
            <div class="station-popup">
              <h3>${station.name}</h3>
              <div class="popup-temp">${station.temperature}°C</div>
              <p><strong>Humedad:</strong> ${station.humidity}%</p>
              <p><strong>Viento:</strong> ${station.windSpeed} km/h</p>
              <p><strong>Condición:</strong> ${station.condition}</p>
            </div>
          `);

        // Evento click en marcador
        marker.on('click', () => {
          this.selectStation(station.id);
        });

        return { id: station.id, marker };
      });

      // Ajustar vista para mostrar todas las estaciones
      const bounds = L.latLngBounds(this.stations.map(s => [s.lat, s.lon]));
      this.map.fitBounds(bounds, { padding: [50, 50] });
    },

    /**
     * Calcula el ancho de la barra de temperatura (0-100%)
     */
    getTempBarWidth(temp) {
      // Rango esperado: 0°C a 25°C
      const minTemp = 0;
      const maxTemp = 25;
      return Math.min(100, Math.max(0, ((temp - minTemp) / (maxTemp - minTemp)) * 100));
    },

    /**
     * Crea los gráficos con Chart.js
     */
    createCharts() {
      this.$nextTick(() => {
        if (!this.forecast || this.forecast.length === 0) return;

        // Destruir gráficos previos si existen
        if (this.tempChart) this.tempChart.destroy();
        if (this.precipChart) this.precipChart.destroy();

        // Gráfico de Temperatura
        const tempCtx = this.$refs.temperatureChart;
        if (tempCtx) {
          this.tempChart = new Chart(tempCtx, {
            type: 'line',
            data: {
              labels: this.forecast.map(d => d.dayName.substring(0, 3)),
              datasets: [
                {
                  label: 'Temperatura Máxima (°C)',
                  data: this.forecast.map(d => d.tempMax),
                  borderColor: '#475569',
                  backgroundColor: 'rgba(71, 85, 105, 0.1)',
                  borderWidth: 3,
                  tension: 0.4,
                  fill: true,
                  pointBackgroundColor: '#475569',
                  pointBorderColor: '#ffffff',
                  pointBorderWidth: 2,
                  pointRadius: 4
                },
                {
                  label: 'Temperatura Mínima (°C)',
                  data: this.forecast.map(d => d.tempMin),
                  borderColor: '#0f172a',
                  backgroundColor: 'rgba(15, 23, 42, 0.1)',
                  borderWidth: 3,
                  tension: 0.4,
                  fill: true,
                  pointBackgroundColor: '#0f172a',
                  pointBorderColor: '#ffffff',
                  pointBorderWidth: 2,
                  pointRadius: 4
                }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                  labels: {
                    color: '#1e293b',
                    font: { size: 12, weight: '600' }
                  }
                },
                tooltip: {
                  backgroundColor: '#1e293b',
                  titleColor: '#f8fafc',
                  bodyColor: '#f8fafc',
                  borderColor: '#475569',
                  borderWidth: 1
                }
              },
              scales: {
                y: {
                  beginAtZero: false,
                  grid: { color: '#e2e8f0' },
                  ticks: { color: '#475569', font: { size: 11 } }
                },
                x: {
                  grid: { color: '#e2e8f0' },
                  ticks: { color: '#475569', font: { size: 11 } }
                }
              }
            }
          });
        }

        // Gráfico de Precipitación (simulada basada en condiciones)
        const precipCtx = this.$refs.precipitationChart;
        if (precipCtx) {
          const precipData = this.forecast.map(d => {
            // Simular probabilidad basada en condición
            if (d.condition.includes('Lluvia') || d.condition.includes('lluvioso')) return 70 + Math.random() * 30;
            if (d.condition.includes('Nublado') || d.condition.includes('nublado')) return 30 + Math.random() * 40;
            if (d.condition.includes('Nieve')) return 60 + Math.random() * 30;
            return Math.random() * 30;
          });

          this.precipChart = new Chart(precipCtx, {
            type: 'bar',
            data: {
              labels: this.forecast.map(d => d.dayName.substring(0, 3)),
              datasets: [{
                label: 'Probabilidad (%)',
                data: precipData,
                backgroundColor: precipData.map(val => {
                  if (val > 70) return '#0f172a';
                  if (val > 40) return '#334155';
                  return '#64748b';
                }),
                borderColor: '#0f172a',
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  backgroundColor: '#1e293b',
                  titleColor: '#f8fafc',
                  bodyColor: '#f8fafc',
                  borderColor: '#475569',
                  borderWidth: 1,
                  callbacks: {
                    label: (context) => `Probabilidad: ${context.parsed.y.toFixed(0)}%`
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  grid: { color: '#e2e8f0' },
                  ticks: { 
                    color: '#475569',
                    font: { size: 11 },
                    callback: (value) => value + '%'
                  }
                },
                x: {
                  grid: { display: false },
                  ticks: { color: '#475569', font: { size: 11 } }
                }
              }
            }
          });
        }
      });
    }
  }
};
</script>

<style scoped>
/* Colores corporativos: azules #1e40af, #3b82f6, #93c5fd; grises #1e293b, #475569, #64748b, #e2e8f0 */

.weather-app {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  background-color: #f8fafc;
}

.app-header {
  margin-bottom: 30px;
  padding: 32px 40px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  color: white;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(15, 23, 42, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.header-icon {
  font-size: 3.5em;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.header-text {
  text-align: left;
}

.app-header h1 {
  margin: 0 0 8px 0;
  font-size: 2em;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: #ffffff;
}

.subtitle {
  margin: 4px 0 0 0;
  font-size: 1em;
  opacity: 0.85;
  font-weight: 400;
  color: #cbd5e1;
}

.subtitle-small {
  margin: 4px 0 0 0;
  font-size: 0.85em;
  opacity: 0.7;
  font-weight: 300;
  color: #94a3b8;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 12px;
  }
  
  .header-text {
    text-align: center;
  }
  
  .app-header h1 {
    font-size: 1.6em;
  }
}

/* Mapa georeferencial Leaflet */
.map-section {
  margin-bottom: 30px;
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.map-section h2 {
  color: #1e293b;
  font-size: 1.5em;
  font-weight: 600;
  margin: 0 0 12px 0;
}

.map-info {
  margin-bottom: 16px;
  padding: 12px;
  background: #f1f5f9;
  border-radius: 6px;
  border-left: 4px solid #0f172a;
}

.map-info p {
  margin: 0;
  color: #475569;
  font-size: 0.95em;
  font-weight: 500;
}

.leaflet-map {
  height: 500px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Marcadores personalizados de Leaflet */
.custom-marker {
  background: transparent;
  border: none;
}

.marker-pin {
  width: 30px;
  height: 30px;
  border-radius: 50% 50% 50% 0;
  background: #334155;
  position: absolute;
  transform: rotate(-45deg);
  left: 50%;
  top: 50%;
  margin: -15px 0 0 -15px;
  border: 3px solid #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.marker-pin::after {
  content: '';
  width: 12px;
  height: 12px;
  margin: 6px 0 0 6px;
  background: #ffffff;
  position: absolute;
  border-radius: 50%;
}

.custom-marker.selected .marker-pin {
  background: #0f172a;
  width: 36px;
  height: 36px;
  margin: -18px 0 0 -18px;
  border-width: 4px;
  animation: pulse 2s infinite;
}

.custom-marker.selected .marker-pin::after {
  width: 14px;
  height: 14px;
  margin: 8px 0 0 8px;
}

@keyframes pulse {
  0%, 100% {
    transform: rotate(-45deg) scale(1);
  }
  50% {
    transform: rotate(-45deg) scale(1.1);
  }
}

/* Popup personalizado */
.station-popup h3 {
  margin: 0 0 12px 0;
  color: #0f172a;
  font-size: 1.1em;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 8px;
}

.popup-temp {
  font-size: 2em;
  font-weight: 700;
  color: #0f172a;
  text-align: center;
  margin: 12px 0;
  padding: 8px;
  background: #f1f5f9;
  border-radius: 6px;
}

.station-popup p {
  margin: 6px 0;
  color: #475569;
  font-size: 0.9em;
}

.station-popup strong {
  color: #1e293b;
}

/* Gráficos */
.charts-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

@media (max-width: 900px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
}

.chart-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-card h3 {
  color: #1e293b;
  font-size: 1.2em;
  font-weight: 600;
  margin: 0 0 16px 0;
}

.chart-wrapper {
  position: relative;
  height: 250px;
}

/* Mensajes de error */
.error-message {
  background-color: #fef2f2;
  border-left: 4px solid #dc2626;
  padding: 20px;
  margin: 20px 0;
  border-radius: 8px;
}

.error-message h3 {
  margin-top: 0;
  color: #991b1b;
}

/* Indicador de carga */
.loading {
  text-align: center;
  padding: 60px 20px;
}

.spinner {
  border: 4px solid #e2e8f0;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Estaciones Meteorológicas */
.stations-container {
  margin: 30px 0;
}

.stations-container h2 {
  color: #1e293b;
  font-size: 1.5em;
  font-weight: 600;
  margin-bottom: 20px;
}

.stations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
}

.station-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.station-card:hover {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-color: #64748b;
}

.station-card.active {
  border-color: #0f172a;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15);
}

.station-card h3 {
  margin: 0 0 4px 0;
  color: #1e293b;
  font-size: 1.1em;
  font-weight: 600;
}

.location {
  color: #64748b;
  font-size: 0.9em;
  margin: 0 0 16px 0;
  font-weight: 400;
}

.temperature {
  text-align: center;
  margin: 20px 0;
}

.temp-value {
  font-size: 2.8em;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
}

.weather-info {
  border-top: 1px solid #e2e8f0;
  padding-top: 12px;
  margin-top: 12px;
}

.weather-info p {
  margin: 6px 0;
  color: #475569;
  font-size: 0.9em;
}

.timestamp {
  display: block;
  text-align: center;
  color: #94a3b8;
  font-size: 0.8em;
  margin-top: 12px;
}

/* Pronóstico 7 Días */
.forecast-container {
  margin: 30px 0;
}

.forecast-container h2 {
  color: #1e293b;
  font-size: 1.5em;
  font-weight: 600;
  margin-bottom: 20px;
}

.forecast-map {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .forecast-map {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
}

.forecast-day {
  padding: 16px 12px;
  border-radius: 6px;
  text-align: center;
  background: #f1f5f9;
  color: #1e293b;
  font-weight: 500;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
}

.forecast-day:hover {
  background: #e2e8f0;
  border-color: #64748b;
  transform: translateY(-2px);
}

.day-name {
  font-size: 1em;
  font-weight: 600;
  margin-bottom: 4px;
  color: #475569;
}

.day-date {
  font-size: 0.85em;
  color: #64748b;
  margin-bottom: 12px;
}

.day-temp {
  font-size: 1.8em;
  font-weight: 700;
  color: #0f172a;
  margin: 12px 0;
}

.day-condition {
  font-size: 0.85em;
  color: #475569;
  margin-bottom: 8px;
}

.temp-range {
  display: flex;
  justify-content: space-around;
  font-size: 0.8em;
  margin-top: 8px;
  color: #64748b;
}

/* Información de API */
.api-info {
  background: white;
  border-left: 4px solid #3b82f6;
  padding: 20px;
  margin: 30px 0;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.api-info h3 {
  margin-top: 0;
  color: #1e293b;
  font-weight: 600;
}

.api-info p {
  margin: 10px 0;
  color: #475569;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.api-note {
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 16px;
  margin-top: 20px;
  border-radius: 6px;
}

.api-note h4 {
  margin-top: 0;
  color: #92400e;
  font-size: 1em;
  font-weight: 600;
}

.api-note p {
  margin: 8px 0;
  color: #78350f;
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  font-size: 0.9em;
  line-height: 1.5;
}

.api-note code {
  background: #fef3c7;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  color: #b45309;
  border: 1px solid #fbbf24;
}
</style>
