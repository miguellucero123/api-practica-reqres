<template>
  <div id="app">
    <!-- Selector de Sistema -->
    <nav class="system-selector">
      <h2>Selecciona un Sistema</h2>
      <div class="selector-buttons">
        <button 
          :class="['selector-btn', { active: currentSystem === 'weather' }]"
          @click="currentSystem = 'weather'"
        >
          🌦️ Sistema Meteorológico
        </button>
        <button 
          :class="['selector-btn', { active: currentSystem === 'reqres' }]"
          @click="currentSystem = 'reqres'"
        >
          👥 CRUD Usuarios (Reqres + Postman)
        </button>
      </div>
    </nav>

    <!-- Componentes -->
    <ApiExample v-if="currentSystem === 'weather'" />
    <ReqresExample v-else-if="currentSystem === 'reqres'" />
  </div>
</template>

<script>
import ApiExample from './components/ApiExample.vue'
import ReqresExample from './components/ReqresExample.vue'

export default {
  name: 'App',
  components: {
    ApiExample,
    ReqresExample
  },
  data() {
    return {
      currentSystem: 'reqres' // Por defecto muestra Reqres
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: 100vh;
}

#app {
  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding: 20px;
  min-height: 100vh;
}

.system-selector {
  background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
  border-radius: 16px;
  padding: 20px 30px;
  margin-bottom: 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(30, 58, 95, 0.3);
}

.system-selector h2 {
  color: white;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.selector-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.selector-btn {
  padding: 12px 25px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.selector-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.selector-btn.active {
  background: white;
  color: #1e3a5f;
  border-color: white;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
}
</style>
