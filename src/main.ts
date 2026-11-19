import './styles/styles.css';
import { initDatabase } from './db/database';
import { FraseView } from './views/fraseView';
import { FraseController } from './controllers/fraseController';

async function bootstrap() {
  const appElement = document.getElementById('app');
  if (!appElement) {
    throw new Error('Elemento #app no encontrado en el DOM.');
  }

  // Pantalla de carga mientras se inicializa el motor SQLite WebAssembly
  appElement.innerHTML = `
    <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.5rem; font-family: 'Press Start 2P', monospace; color: #00f3ff; text-align: center; padding: 1rem;">
      <div style="font-size: 3rem; animation: pulse 1s infinite;">👾</div>
      <div style="font-size: 1.1rem; text-shadow: 0 0 10px #00f3ff;">CARGANDO SQLITE (SQL.JS WASM)...</div>
      <div style="font-family: 'Outfit', sans-serif; color: #8b9bb4; font-size: 0.95rem;">Preparando base de datos y persistencia...</div>
    </div>
  `;

  try {
    // 1. Inicializar SQLite (sql.js)
    await initDatabase();

    // 2. Inicializar Vista y Controlador
    const view = new FraseView(appElement);
    const controller = new FraseController(view);
    controller.init();

    console.log('🚀 [Arcade] Base de datos y aplicación listas.');
  } catch (error) {
    console.error('❌ Error al inicializar SQLite:', error);
    appElement.innerHTML = `
      <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; color: #ff4757; text-align: center; padding: 2rem; font-family: sans-serif;">
        <h2 style="font-size: 1.5rem;">Error al inicializar la base de datos SQLite</h2>
        <p style="color: #cbd5e1; max-width: 600px;">${error instanceof Error ? error.message : String(error)}</p>
        <button onclick="window.location.reload()" style="margin-top: 1rem; padding: 0.8rem 1.5rem; background: #00f3ff; color: #0c0d14; border: none; border-radius: 6px; font-weight: bold; cursor: pointer;">
          Reintentar Carga
        </button>
      </div>
    `;
  }
}

bootstrap();
