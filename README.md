# Arcade de Frases Epicas - SQLite en el Navegador

[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/SQLite-sql.js_WASM-003B57?logo=sqlite&logoColor=white)](https://sql.js.org/)
[![pnpm](https://img.shields.io/badge/pnpm-12.x-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)](https://arcade-de-frases-picas.vercel.app)

Sitio web interactivo con tematica Retro Arcade que permite a los usuarios descubrir, registrar, editar, votar y gestionar citas celebres de videojuegos, cine, anime y cultura digital.

La aplicacion utiliza un motor SQLite real en el navegador impulsado por WebAssembly (sql.js), con persistencia de datos en localStorage.

---

## Enlaces del Proyecto

* **URL de Despliegue en Vercel:** [https://arcade-de-frases-picas.vercel.app](https://arcade-de-frases-picas.vercel.app)
* **Repositorio de GitHub:** [https://github.com/Jonyx08/Arcade-de-Frases-picas](https://github.com/Jonyx08/Arcade-de-Frases-picas)

---

## Caracteristicas Principales

* **Base de Datos SQLite Real:** Tabla `frases` creada y administrada directamente en SQLite mediante sentencias SQL estandar (`CREATE TABLE`, `INSERT`, `SELECT`, `UPDATE`, `DELETE`).
* **Persistencia entre Sesiones:** El binario exportado por SQLite (`db.export()`) se almacena codificado en `localStorage`. Al recargar la pagina, el estado completo de la base de datos se restaura de forma automatica.
* **Operaciones CRUD:**
  * **Crear:** Registro de frases con autor, obra de origen, categoria e icono.
  * **Leer:** Listado interactivo con filtrado por categoria (Videojuegos, Cine, Anime, Memes), busqueda en tiempo real y ordenamiento por votos, fecha o nombre.
  * **Actualizar:** Edicion de todos los atributos de cada registro y sistema de votacion incremental reflejado en SQLite.
  * **Eliminar:** Borrado de registros con solicitud de confirmacion.
* **Salon de la Fama:** Seccion superior que presenta en tiempo real las tres frases con mayor puntuacion.
* **Restauracion de Datos:** Opcion para restablecer la base de datos a sus registros semilla originales.
* **Diseno Adaptativo:** Interfaz inspirada en terminales arcade, desarrollada con CSS moderno y compatible con dispositivos moviles y pantallas de escritorio.

---

## Tecnologias Utilizadas

* **Vite 6:** Empaquetador y servidor de desarrollo.
* **TypeScript 5:** Lenguaje con tipado estatico y estructuracion modular.
* **SQL.js (WebAssembly):** Compilacion de SQLite para ejecucion nativa en el navegador cliente.
* **CSS3:** Diseno modular, variables de color y animaciones.
* **pnpm:** Gestor de paquetes y dependencias del proyecto.
* **Vercel:** Plataforma de despliegue continuo vinculada al repositorio de GitHub.

---

## Estructura del Proyecto

El codigo se organiza bajo el patron arquitectonico Modelo-Vista-Controlador (MVC):

```text
arcade-de-frases-epicas/
├── index.html                   # Punto de entrada HTML
├── package.json                 # Configuracion de dependencias y scripts
├── pnpm-lock.yaml               # Archivo de bloqueo de dependencias de pnpm
├── pnpm-workspace.yaml          # Configuracion de politicas de construccion de pnpm
├── vite.config.ts               # Configuracion de Vite
├── tsconfig.json                # Opciones del compilador de TypeScript
├── README.md                    # Documentacion del proyecto
├── .gitignore                   # Exclusion de archivos de control de versiones
├── public/
│   ├── sql-wasm.wasm            # Binario WebAssembly estandar de SQLite
│   └── sql-wasm-browser.wasm    # Binario WebAssembly para navegador
└── src/
    ├── main.ts                  # Punto de arranque de la aplicacion
    ├── db/
    │   └── database.ts          # Inicializacion SQLite, persistencia y semillas
    ├── models/
    │   └── frase.ts             # Modelo de entidad Frase y operaciones SQL
    ├── views/
    │   └── fraseView.ts         # Generacion de la interfaz de usuario y modales
    ├── controllers/
    │   └── fraseController.ts   # Coordinacion de eventos y comunicacion modelo-vista
    └── styles/
        └── styles.css           # Estilos visuales del proyecto
```

---

## Esquema de la Base de Datos SQLite

```sql
CREATE TABLE IF NOT EXISTS frases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  frase TEXT NOT NULL,
  autor TEXT NOT NULL,
  origen TEXT NOT NULL,
  categoria TEXT NOT NULL,
  votos INTEGER NOT NULL DEFAULT 0,
  icono TEXT NOT NULL DEFAULT 'arcade',
  fecha TEXT NOT NULL
);
```

---

## Ejecucion Local

### Requisitos Previos

* Node.js v18 o superior instalado.
* pnpm instalado de forma global (`npm install -g pnpm`).

### Instrucciones

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Jonyx08/Arcade-de-Frases-picas.git
   cd Arcade-de-Frases-picas
   ```

2. **Instalar dependencias:**
   ```bash
   pnpm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   pnpm run dev
   ```

4. **Compilar el proyecto para produccion:**
   ```bash
   pnpm run build
   ```

5. **Previsualizar la compilacion:**
   ```bash
   pnpm run preview
   ```

---

## Despliegue en Vercel

1. Acceder al panel de Vercel e importar el repositorio publico `Arcade-de-Frases-picas`.
2. Seleccionar el ajuste predeterminado de Vite (`Vite Framework Preset`).
3. Comando de construccion: `pnpm run build`.
4. Directorio de salida: `dist`.
5. Ejecutar el despliegue.

---

## Informacion Academica

* **Estudiante:** Jonathan De la O
* **Materia:** Programacion Orientada a Eventos
* **Actividad:** Laboratorio 3 - SQLite, GitHub y Vercel
