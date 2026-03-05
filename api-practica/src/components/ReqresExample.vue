<template>
  <div class="reqres-app">
    <header class="app-header">
      <div class="header-content">
        <div class="header-icon">👥</div>
        <div class="header-text">
          <h1>CRUD de Usuarios - Reqres API</h1>
          <p class="subtitle">Práctica con API REST • Compatible con Postman</p>
          <p class="subtitle-small">https://reqres.in/ • Operaciones GET, POST, PUT, DELETE</p>
        </div>
      </div>
    </header>

    <!-- Panel de información de la API -->
    <section class="api-panel">
      <h2>🔗 Información de la API</h2>
      <div class="api-info-grid">
        <div class="api-info-item">
          <strong>Base URL:</strong>
          <code>{{ baseUrl }}</code>
        </div>
        <div class="api-info-item">
          <strong>x-api-key:</strong>
          <code>Configurada ✓</code>
        </div>
        <div class="api-info-item">
          <strong>Peticiones realizadas:</strong>
          <span class="counter">{{ requestCount }}</span>
        </div>
      </div>
    </section>

    <!-- Mensajes de estado -->
    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>

    <!-- Indicador de carga -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Procesando petición...</p>
    </div>

    <div class="dashboard">
      <!-- Formulario para crear/editar usuario -->
      <section class="form-section">
        <h2>{{ editingUser ? '✏️ Editar Usuario' : '➕ Crear Usuario' }}</h2>
        <form @submit.prevent="editingUser ? updateUser() : createUser()" class="user-form">
          <div class="form-group">
            <label for="name">Nombre:</label>
            <input 
              type="text" 
              id="name" 
              v-model="formData.name" 
              placeholder="Ingresa el nombre"
              required
            >
          </div>
          <div class="form-group">
            <label for="job">Trabajo:</label>
            <input 
              type="text" 
              id="job" 
              v-model="formData.job" 
              placeholder="Ingresa el trabajo"
              required
            >
          </div>
          <div class="form-buttons">
            <button type="submit" class="btn btn-primary">
              {{ editingUser ? 'Actualizar' : 'Crear' }}
            </button>
            <button v-if="editingUser" type="button" class="btn btn-secondary" @click="cancelEdit">
              Cancelar
            </button>
          </div>
        </form>
      </section>

      <!-- Lista de usuarios -->
      <section class="users-section">
        <div class="section-header">
          <h2>📋 Lista de Usuarios</h2>
          <div class="pagination-controls">
            <button @click="changePage(-1)" :disabled="currentPage <= 1" class="btn btn-small">
              ← Anterior
            </button>
            <span class="page-info">Página {{ currentPage }} de {{ totalPages }}</span>
            <button @click="changePage(1)" :disabled="currentPage >= totalPages" class="btn btn-small">
              Siguiente →
            </button>
          </div>
        </div>

        <div class="users-grid">
          <div v-for="user in users" :key="user.id" class="user-card">
            <img :src="user.avatar" :alt="user.first_name" class="user-avatar">
            <div class="user-info">
              <h3>{{ user.first_name }} {{ user.last_name }}</h3>
              <p class="user-email">{{ user.email }}</p>
              <p class="user-id">ID: {{ user.id }}</p>
            </div>
            <div class="user-actions">
              <button @click="getUserById(user.id)" class="btn btn-info" title="Ver detalles">
                👁️
              </button>
              <button @click="editUser(user)" class="btn btn-warning" title="Editar">
                ✏️
              </button>
              <button @click="deleteUser(user.id)" class="btn btn-danger" title="Eliminar">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Usuario creado/actualizado localmente -->
      <section v-if="createdUsers.length > 0" class="created-users-section">
        <h2>🆕 Usuarios Creados/Actualizados (Sesión actual)</h2>
        <div class="created-users-grid">
          <div v-for="user in createdUsers" :key="user.id" class="created-user-card">
            <div class="created-user-info">
              <h4>{{ user.name }}</h4>
              <p><strong>Trabajo:</strong> {{ user.job }}</p>
              <p><strong>ID:</strong> {{ user.id }}</p>
              <p><strong>Creado:</strong> {{ formatDate(user.createdAt || user.updatedAt) }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Detalle del usuario seleccionado -->
      <section v-if="selectedUser" class="user-detail-section">
        <h2>👤 Detalle del Usuario</h2>
        <div class="user-detail-card">
          <img :src="selectedUser.avatar" :alt="selectedUser.first_name" class="detail-avatar">
          <div class="detail-info">
            <h3>{{ selectedUser.first_name }} {{ selectedUser.last_name }}</h3>
            <p><strong>Email:</strong> {{ selectedUser.email }}</p>
            <p><strong>ID:</strong> {{ selectedUser.id }}</p>
          </div>
          <button @click="selectedUser = null" class="btn btn-secondary">Cerrar</button>
        </div>
      </section>

      <!-- Guía de Postman -->
      <section class="postman-guide">
        <h2>📮 Guía para usar con Postman</h2>
        <div class="guide-content">
          <div class="endpoint-card important">
            <h4>⚠️ Header requerido</h4>
            <code>x-api-key: TU_API_KEY</code>
            <p>Obtén tu API key en: <a href="https://app.reqres.in/api-keys" target="_blank">app.reqres.in/api-keys</a></p>
          </div>
          <div class="endpoint-card">
            <h4>GET - Listar usuarios</h4>
            <code>GET {{ baseUrl }}/users?page=1</code>
            <p>Obtiene una lista paginada de usuarios</p>
          </div>
          <div class="endpoint-card">
            <h4>GET - Usuario por ID</h4>
            <code>GET {{ baseUrl }}/users/2</code>
            <p>Obtiene los detalles de un usuario específico</p>
          </div>
          <div class="endpoint-card">
            <h4>POST - Crear usuario</h4>
            <code>POST {{ baseUrl }}/users</code>
            <pre>Body (JSON):
{
  "name": "Juan Pérez",
  "job": "Desarrollador"
}</pre>
          </div>
          <div class="endpoint-card">
            <h4>PUT - Actualizar usuario</h4>
            <code>PUT {{ baseUrl }}/users/2</code>
            <pre>Body (JSON):
{
  "name": "Juan Pérez",
  "job": "Senior Developer"
}</pre>
          </div>
          <div class="endpoint-card">
            <h4>DELETE - Eliminar usuario</h4>
            <code>DELETE {{ baseUrl }}/users/2</code>
            <p>Elimina un usuario (retorna 204 No Content)</p>
          </div>
        </div>
      </section>

      <!-- Log de peticiones -->
      <section class="request-log">
        <h2>📜 Log de Peticiones</h2>
        <div class="log-container">
          <div v-for="(log, index) in requestLogs" :key="index" :class="['log-entry', log.type]">
            <span class="log-method">{{ log.method }}</span>
            <span class="log-url">{{ log.url }}</span>
            <span class="log-status">{{ log.status }}</span>
            <span class="log-time">{{ log.time }}</span>
          </div>
          <p v-if="requestLogs.length === 0" class="no-logs">
            No hay peticiones registradas. Interactúa con la API para ver el log.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

// Crear instancia de axios con configuración para Reqres
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    // API Key de Reqres - obtén la tuya en https://reqres.in/signup
    'x-api-key': 'reqres_741ddb40f3c64ce497b391f2033848c9'
  }
});

export default {
  name: 'ReqresExample',
  data() {
    return {
      // Usa proxy local para evitar CORS, en Postman usar https://reqres.in/api
      baseUrl: 'https://reqres.in/api',
      apiKey: 'reqres_741ddb40f3c64ce497b391f2033848c9',
      users: [],
      selectedUser: null,
      createdUsers: [],
      loading: false,
      message: '',
      messageType: 'success',
      requestCount: 0,
      currentPage: 1,
      totalPages: 1,
      formData: {
        name: '',
        job: ''
      },
      editingUser: null,
      requestLogs: []
    };
  },

  mounted() {
    console.log('✅ Componente ReqresExample montado');
    console.log('🔗 Base URL:', this.baseUrl);
    console.log(' Esta API es compatible con Postman para pruebas');
    this.fetchUsers();
  },

  methods: {
    /**
     * Registra una petición en el log
     */
    logRequest(method, url, status) {
      this.requestLogs.unshift({
        method,
        url,
        status,
        time: new Date().toLocaleTimeString('es-CL'),
        type: status >= 200 && status < 300 ? 'success' : 'error'
      });
      // Mantener solo las últimas 10 peticiones
      if (this.requestLogs.length > 10) {
        this.requestLogs.pop();
      }
    },

    /**
     * Muestra mensaje temporal
     */
    showMessage(text, type = 'success') {
      this.message = text;
      this.messageType = type;
      setTimeout(() => {
        this.message = '';
      }, 3000);
    },

    /**
     * GET - Obtener lista de usuarios
     */
    async fetchUsers() {
      this.loading = true;
      try {
        console.log(`🌐 GET /api/users?page=${this.currentPage}`);
        
        const response = await api.get('/users', {
          params: { page: this.currentPage }
        });
        
        this.users = response.data.data;
        this.totalPages = response.data.total_pages;
        this.requestCount++;
        
        this.logRequest('GET', `/users?page=${this.currentPage}`, response.status);
        console.log('✅ Usuarios obtenidos:', this.users.length);
        
      } catch (error) {
        console.error('❌ Error al obtener usuarios:', error);
        this.showMessage('Error al obtener usuarios', 'error');
        this.logRequest('GET', `/users?page=${this.currentPage}`, error.response?.status || 500);
      } finally {
        this.loading = false;
      }
    },

    /**
     * GET - Obtener usuario por ID
     */
    async getUserById(id) {
      this.loading = true;
      try {
        console.log(`🌐 GET /api/users/${id}`);
        
        const response = await api.get(`/users/${id}`);
        
        this.selectedUser = response.data.data;
        this.requestCount++;
        
        this.logRequest('GET', `/users/${id}`, response.status);
        console.log('✅ Usuario obtenido:', this.selectedUser);
        
      } catch (error) {
        console.error('❌ Error al obtener usuario:', error);
        this.showMessage(`Error al obtener usuario con ID ${id}`, 'error');
        this.logRequest('GET', `/users/${id}`, error.response?.status || 500);
      } finally {
        this.loading = false;
      }
    },

    /**
     * POST - Crear nuevo usuario
     */
    async createUser() {
      if (!this.formData.name || !this.formData.job) {
        this.showMessage('Por favor completa todos los campos', 'error');
        return;
      }

      this.loading = true;
      try {
        console.log(`🌐 POST /api/users`);
        console.log('📦 Datos enviados:', this.formData);
        
        const response = await api.post('/users', this.formData);
        
        this.createdUsers.unshift(response.data);
        this.requestCount++;
        
        this.logRequest('POST', '/users', response.status);
        console.log('✅ Usuario creado:', response.data);
        
        this.showMessage(`Usuario "${this.formData.name}" creado exitosamente (ID: ${response.data.id})`);
        this.resetForm();
        
      } catch (error) {
        console.error('❌ Error al crear usuario:', error);
        this.showMessage('Error al crear usuario', 'error');
        this.logRequest('POST', '/users', error.response?.status || 500);
      } finally {
        this.loading = false;
      }
    },

    /**
     * PUT - Actualizar usuario
     */
    async updateUser() {
      if (!this.formData.name || !this.formData.job) {
        this.showMessage('Por favor completa todos los campos', 'error');
        return;
      }

      this.loading = true;
      try {
        const userId = this.editingUser.id;
        console.log(`🌐 PUT /api/users/${userId}`);
        console.log('📦 Datos enviados:', this.formData);
        
        const response = await api.put(`/users/${userId}`, this.formData);
        
        // Agregar a usuarios actualizados
        this.createdUsers.unshift({
          ...response.data,
          id: userId
        });
        this.requestCount++;
        
        this.logRequest('PUT', `/users/${userId}`, response.status);
        console.log('✅ Usuario actualizado:', response.data);
        
        this.showMessage(`Usuario "${this.formData.name}" actualizado exitosamente`);
        this.cancelEdit();
        
      } catch (error) {
        console.error('❌ Error al actualizar usuario:', error);
        this.showMessage('Error al actualizar usuario', 'error');
        this.logRequest('PUT', `/users/${this.editingUser.id}`, error.response?.status || 500);
      } finally {
        this.loading = false;
      }
    },

    /**
     * DELETE - Eliminar usuario
     */
    async deleteUser(id) {
      if (!confirm(`¿Estás seguro de eliminar el usuario con ID ${id}?`)) {
        return;
      }

      this.loading = true;
      try {
        console.log(`🌐 DELETE /api/users/${id}`);
        
        const response = await api.delete(`/users/${id}`);
        
        this.requestCount++;
        
        // Reqres retorna 204 No Content para DELETE exitoso
        this.logRequest('DELETE', `/users/${id}`, response.status || 204);
        console.log('✅ Usuario eliminado');
        
        this.showMessage(`Usuario con ID ${id} eliminado exitosamente`);
        
        // Nota: Reqres no elimina realmente, es una API de prueba
        // En una API real, refrescaríamos la lista
        
      } catch (error) {
        console.error('❌ Error al eliminar usuario:', error);
        this.showMessage('Error al eliminar usuario', 'error');
        this.logRequest('DELETE', `/users/${id}`, error.response?.status || 500);
      } finally {
        this.loading = false;
      }
    },

    /**
     * Cambiar página
     */
    changePage(delta) {
      const newPage = this.currentPage + delta;
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.currentPage = newPage;
        this.fetchUsers();
      }
    },

    /**
     * Preparar edición de usuario
     */
    editUser(user) {
      this.editingUser = user;
      this.formData.name = `${user.first_name} ${user.last_name}`;
      this.formData.job = 'Actualizar trabajo aquí';
    },

    /**
     * Cancelar edición
     */
    cancelEdit() {
      this.editingUser = null;
      this.resetForm();
    },

    /**
     * Resetear formulario
     */
    resetForm() {
      this.formData.name = '';
      this.formData.job = '';
    },

    /**
     * Formatear fecha
     */
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleString('es-CL');
    }
  }
};
</script>

<style scoped>
.reqres-app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  color: white;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-icon {
  font-size: 3rem;
}

.header-text h1 {
  margin: 0;
  font-size: 1.8rem;
}

.subtitle {
  margin: 5px 0 0;
  opacity: 0.9;
}

.subtitle-small {
  margin: 5px 0 0;
  font-size: 0.9rem;
  opacity: 0.7;
}

/* Panel de información */
.api-panel {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.api-panel h2 {
  margin: 0 0 15px;
  color: #333;
}

.api-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.api-info-item {
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
}

.api-info-item code {
  background: #e9ecef;
  padding: 2px 8px;
  border-radius: 4px;
  font-family: monospace;
}

.counter {
  background: #667eea;
  color: white;
  padding: 2px 10px;
  border-radius: 12px;
  font-weight: bold;
}

/* Mensajes */
.message {
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-weight: 500;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

/* Loading */
.loading {
  text-align: center;
  padding: 40px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Formulario */
.form-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.form-section h2 {
  margin: 0 0 20px;
  color: #333;
}

.user-form {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: flex-end;
}

.form-group {
  flex: 1;
  min-width: 200px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 10px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-buttons {
  display: flex;
  gap: 10px;
}

/* Botones */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-info {
  background: #17a2b8;
  color: white;
  padding: 8px 12px;
}

.btn-warning {
  background: #ffc107;
  color: #212529;
  padding: 8px 12px;
}

.btn-danger {
  background: #dc3545;
  color: white;
  padding: 8px 12px;
}

.btn-small {
  padding: 6px 12px;
  font-size: 0.9rem;
  background: #667eea;
  color: white;
}

/* Lista de usuarios */
.users-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.section-header h2 {
  margin: 0;
  color: #333;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.page-info {
  font-weight: 500;
  color: #555;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.user-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 15px;
  border: 3px solid #667eea;
}

.user-info h3 {
  margin: 0 0 5px;
  color: #333;
}

.user-email {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 5px;
}

.user-id {
  color: #999;
  font-size: 0.85rem;
  margin: 0 0 15px;
}

.user-actions {
  display: flex;
  gap: 8px;
}

/* Usuarios creados */
.created-users-section {
  background: #e8f5e9;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.created-users-section h2 {
  margin: 0 0 15px;
  color: #2e7d32;
}

.created-users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

.created-user-card {
  background: white;
  border-radius: 8px;
  padding: 15px;
  border-left: 4px solid #4caf50;
}

.created-user-card h4 {
  margin: 0 0 10px;
  color: #333;
}

.created-user-card p {
  margin: 5px 0;
  font-size: 0.9rem;
  color: #555;
}

/* Detalle de usuario */
.user-detail-section {
  background: #e3f2fd;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.user-detail-section h2 {
  margin: 0 0 15px;
  color: #1565c0;
}

.user-detail-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.detail-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid #1565c0;
}

.detail-info h3 {
  margin: 0 0 10px;
  color: #333;
}

.detail-info p {
  margin: 5px 0;
  color: #555;
}

/* Guía de Postman */
.postman-guide {
  background: #fff3e0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.postman-guide h2 {
  margin: 0 0 20px;
  color: #e65100;
}

.guide-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 15px;
}

.endpoint-card {
  background: white;
  border-radius: 8px;
  padding: 15px;
  border-left: 4px solid #ff9800;
}

.endpoint-card h4 {
  margin: 0 0 10px;
  color: #333;
}

.endpoint-card code {
  display: block;
  background: #f5f5f5;
  padding: 8px 12px;
  border-radius: 4px;
  font-family: 'Consolas', monospace;
  font-size: 0.85rem;
  margin-bottom: 10px;
  word-break: break-all;
}

.endpoint-card pre {
  background: #263238;
  color: #aed581;
  padding: 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  overflow-x: auto;
  margin: 10px 0 0;
}

.endpoint-card p {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.endpoint-card.important {
  border-left-color: #e53935;
  background: #ffebee;
}

.endpoint-card.important h4 {
  color: #c62828;
}

/* Log de peticiones */
.request-log {
  background: #263238;
  border-radius: 12px;
  padding: 20px;
  color: white;
}

.request-log h2 {
  margin: 0 0 15px;
  color: #4fc3f7;
}

.log-container {
  max-height: 300px;
  overflow-y: auto;
}

.log-entry {
  display: flex;
  gap: 15px;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 5px;
  font-family: 'Consolas', monospace;
  font-size: 0.9rem;
}

.log-entry.success {
  background: rgba(76, 175, 80, 0.2);
}

.log-entry.error {
  background: rgba(244, 67, 54, 0.2);
}

.log-method {
  font-weight: bold;
  min-width: 60px;
  color: #4fc3f7;
}

.log-url {
  flex: 1;
  color: #aed581;
}

.log-status {
  min-width: 40px;
  text-align: center;
}

.log-time {
  color: #90a4ae;
  min-width: 80px;
  text-align: right;
}

.no-logs {
  color: #90a4ae;
  text-align: center;
  padding: 20px;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .section-header {
    flex-direction: column;
    text-align: center;
  }

  .user-form {
    flex-direction: column;
  }

  .form-buttons {
    width: 100%;
    justify-content: center;
  }

  .user-detail-card {
    flex-direction: column;
    text-align: center;
  }
}
</style>
