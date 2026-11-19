# 👾 Arcade de Frases Épicas • SQLite en el Navegador

[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/SQLite-sql.js_WASM-003B57?logo=sqlite&logoColor=white)](https://sql.js.org/)
[![pnpm](https://img.shields.io/badge/pnpm-12.x-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)](https://vercel.com/)

Un sitio web interactivo y creativo con temática **Retro Arcade** que permite a los usuarios descubrir, registrar, editar, votar y gestionar citas legendarias de videojuegos, cine, anime y cultura de internet. 

La aplicación utiliza un motor **SQLite real en el navegador** impulsado por WebAssembly (`sql.js`), con persistencia de estado en `localStorage`.

---

## 🔗 Enlaces del Proyecto

* **Repositorio de GitHub:** [https://github.com/Jonyx08/Arcade-de-Frases-picas](https://github.com/Jonyx08/Arcade-de-Frases-picas)
* **URL de Despliegue en Vercel:** *(Vinculada al repositorio público)*

---

## 🌟 Características Principales

* 💾 **Base de Datos SQLite Real:** Tabla `frases` creada y administrada directamente en SQLite mediante consultas SQL estándar (`CREATE TABLE`, `INSERT`, `SELECT`, `UPDATE`, `DELETE`).
* 🔄 **Persistencia entre Sesiones:** Los datos exportados por SQLite (`db.export()`) se preservan en `localStorage` en formato codificado. Al recargar la página, la base de datos se restaura automáticamente con todas tus modificaciones.
* ⚡ **CRUD Completo:**
  * **[C] Crear:** Formulario modal para registrar frases legendarias con autor, origen, categoría e icono temático.
  * **[R] Leer:** Visualización en cuadrícula con filtros en tiempo real por categoría (*Videojuegos, Cine, Anime, Memes*), buscador instantáneo y selector de orden (*Más Votadas, Recientes, Alfabético*).
  * **[U] Actualizar:** Modificación completa de campos de la frase y sistema de votos (+1 / -1) reflejados en SQLite.
  * **[D] Eliminar:** Borrado seguro de registros con confirmación previa.
* 🏆 **Salón de la Fama (Hall of Fame):** Podio visual en tiempo real que premia las 3 frases más votadas con medallas de oro, plata y bronce.
* 🎨 **Diseño Creativo y Original:** Estética neón cyberpunk/arcade retro con fuentes pixeladas, efectos de resplandor, microinteracciones, animaciones y diseño totalmente adaptativo para dispositivos móviles y escritorio.
* 🔄 **Restauración de Semillas:** Botón de un solo clic para resetear los datos a las frases legendarias preconfiguradas.

---

## 🛠️ Tecnologías Utilizadas

* **Vite 6** como entorno de desarrollo rápido y bundler.
* **TypeScript 5** para tipado estricto y seguridad en el código.
* **SQL.js (WebAssembly)** para ejecutar SQLite completo dentro del navegador cliente sin necesidad de servidores pesados.
* **CSS3 Moderno** (variables CSS, glassmorphism, flexbox, grid, animaciones neon).
* **pnpm** como gestor de paquetes optimizado.
* **Vercel** para despliegue y alojamiento en la nube.

---

## 📂 Estructura del Proyecto

El proyecto sigue estrictamente el patrón de arquitectura Modelo-Vista-Controlador (MVC):

```text
arcade-de-frases-epicas/
├── index.html                   # Punto de entrada HTML y montaje del DOM
├── package.json                 # Dependencias, scripts y configuración
├── pnpm-lock.yaml               # Bloqueo de dependencias de pnpm
├── vite.config.ts               # Configuración de Vite y exclusión de WASM
├── tsconfig.json                # Configuración de TypeScript
├── README.md                    # Documentación y guía del proyecto
├── .gitignore                   # Archivos ignorados por Git
├── public/
│   └── sql-wasm.wasm            # Binario WebAssembly de SQLite
└── src/
    ├── main.ts                  # Inicialización y arranque de la aplicación
    ├── db/
    │   └── database.ts          # Conexión SQLite, persistencia en localStorage y semillas
    ├── models/
    │   └── frase.ts             # Modelo de datos y sentencias SQL (CRUD)
    ├── views/
    │   └── fraseView.ts         # Interfaz de usuario, modales, podio y notificaciones
    ├── controllers/
    │   └── fraseController.ts   # Coordinación de eventos, búsqueda y flujo de datos
    └── styles/
        └── styles.css           # Estilos temáticos Retro Arcade Neon
```

---

## 🗄️ Esquema de la Base de Datos SQLite

```sql
CREATE TABLE IF NOT EXISTS frases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  frase TEXT NOT NULL,
  autor TEXT NOT NULL,
  origen TEXT NOT NULL,
  categoria TEXT NOT NULL,
  votos INTEGER NOT NULL DEFAULT 0,
  icono TEXT NOT NULL DEFAULT '👾',
  fecha TEXT NOT NULL
);
```

---

## 🚀 Cómo Ejecutar el Proyecto Localmente

### Prerrequisitos
* **Node.js** (versión 18 o superior recomendada).
* **pnpm** instalado globalmente (`npm install -g pnpm`).

### Pasos

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Jonyx08/Arcade-de-Frases-picas.git
   cd Arcade-de-Frases-picas
   ```

2. **Instalar dependencias con pnpm:**
   ```bash
   pnpm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   pnpm run dev
   ```
   Abre [http://localhost:5173](http://localhost:5173) en tu navegador para ver la aplicación funcionando.

4. **Compilar para producción:**
   ```bash
   pnpm run build
   ```

5. **Previsualizar la compilación de producción:**
   ```bash
   pnpm run preview
   ```

---

## ☁️ Despliegue en Vercel

1. Importar el repositorio desde el panel de [Vercel](https://vercel.com/new).
2. Framework Preset: **Vite**.
3. Build Command: `pnpm run build` (o `vite build`).
4. Output Directory: `dist`.
5. Hacer clic en **Deploy**. Al ser una aplicación estricta de cliente con WebAssembly y SQLite en localStorage, el despliegue es instantáneo, 100% estable y sin problemas de lectura de archivos en entornos serverless.

---

## 👨‍💻 Autor

* **Estudiante:** Jonathan De la O
* **Materia:** Programación Orientada a Eventos
* **Actividad:** Laboratorio 3 - SQLite, GitHub y Vercel
