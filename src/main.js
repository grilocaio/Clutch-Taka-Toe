import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { seedDatabase } from '@/utils/storage'

// Inicializar banco de dados no Local Storage
seedDatabase()

createApp(App).mount('#app')

