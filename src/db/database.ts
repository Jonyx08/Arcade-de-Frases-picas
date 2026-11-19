import initSqlJs, { type Database } from 'sql.js';

const STORAGE_KEY = 'arcade_frases_sqlite_db_v1';

let dbInstance: Database | null = null;

/**
 * Convierte Uint8Array a Base64 para almacenar SQLite en localStorage
 */
function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  const chunkSize = 8192;
  for (let i = 0; i < len; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, len));
    binary += String.fromCharCode.apply(null, chunk as unknown as number[]);
  }
  return btoa(binary);
}

/**
 * Convierte Base64 de localStorage de vuelta a Uint8Array
 */
function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Carga el binario WASM de forma segura con múltiples fuentes de respaldo
 */
async function loadWasmBinary(): Promise<ArrayBuffer | undefined> {
  const sources = [
    '/sql-wasm-browser.wasm',
    '/sql-wasm.wasm',
    'https://sql.js.org/dist/sql-wasm.wasm',
    'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/sql-wasm.wasm',
  ];

  for (const src of sources) {
    try {
      const resp = await fetch(src);
      if (resp.ok) {
        return await resp.arrayBuffer();
      }
    } catch {
      // Continuar con siguiente fuente de respaldo
    }
  }
  return undefined;
}

/**
 * Inicializa la base de datos SQLite con sql.js WebAssembly
 */
export async function initDatabase(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  const wasmBinary = await loadWasmBinary();

  const SQL = await initSqlJs({
    locateFile: (file) => `/${file}`,
    ...(wasmBinary ? { wasmBinary } : {}),
  });

  const savedData = localStorage.getItem(STORAGE_KEY);

  if (savedData) {
    try {
      const uInt8Array = base64ToUint8Array(savedData);
      dbInstance = new SQL.Database(uInt8Array);
      console.log('🎮 [SQLite] Base de datos restaurada con éxito desde localStorage.');
    } catch (err) {
      console.warn('⚠️ [SQLite] Error restaurando localStorage. Creando base de datos limpia:', err);
      dbInstance = new SQL.Database();
      setupSchemaAndSeed(dbInstance);
      saveDatabase();
    }
  } else {
    dbInstance = new SQL.Database();
    setupSchemaAndSeed(dbInstance);
    saveDatabase();
    console.log('🎮 [SQLite] Base de datos creada e inicializada con frases semilla.');
  }

  return dbInstance;
}

/**
 * Obtiene la instancia activa de SQLite
 */
export function getDb(): Database {
  if (!dbInstance) {
    throw new Error('La base de datos aún no ha sido inicializada. Llama a initDatabase() primero.');
  }
  return dbInstance;
}

/**
 * Persiste el estado actual de SQLite en localStorage
 */
export function saveDatabase(): void {
  if (!dbInstance) return;
  const data = dbInstance.export();
  const base64 = uint8ArrayToBase64(data);
  localStorage.setItem(STORAGE_KEY, base64);
}

/**
 * Reinicia la base de datos a sus valores iniciales
 */
export function resetDatabaseToSeeds(): void {
  if (!dbInstance) return;
  dbInstance.run('DROP TABLE IF EXISTS frases;');
  setupSchemaAndSeed(dbInstance);
  saveDatabase();
}

/**
 * Crea la tabla y datos iniciales para el docente
 */
function setupSchemaAndSeed(db: Database): void {
  db.run(`
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
  `);

  const seedFrases = [
    {
      frase: "It's dangerous to go alone! Take this.",
      autor: "Old Man",
      origen: "The Legend of Zelda (NES)",
      categoria: "Videojuegos",
      votos: 48,
      icono: "🗡️",
      fecha: "1986-02-21",
    },
    {
      frase: "The cake is a lie.",
      autor: "GLaDOS / Doug Rattmann",
      origen: "Portal",
      categoria: "Videojuegos",
      votos: 39,
      icono: "🎂",
      fecha: "2007-10-10",
    },
    {
      frase: "Que la Fuerza te acompañe.",
      autor: "Obi-Wan Kenobi",
      origen: "Star Wars: Episodio IV",
      categoria: "Cine",
      votos: 54,
      icono: "✨",
      fecha: "1977-05-25",
    },
    {
      frase: "Hasta la vista, baby.",
      autor: "T-800",
      origen: "Terminator 2: El Juicio Final",
      categoria: "Cine",
      votos: 37,
      icono: "🕶️",
      fecha: "1991-07-03",
    },
    {
      frase: "El trabajo duro supera al talento natural cuando el talento no se esfuerza.",
      autor: "Rock Lee",
      origen: "Naruto",
      categoria: "Anime",
      votos: 31,
      icono: "🥋",
      fecha: "2003-04-16",
    },
    {
      frase: "No es un bug, es una característica no documentada.",
      autor: "Desarrollador Anónimo",
      origen: "Cultura Hacker",
      categoria: "Memes",
      votos: 42,
      icono: "🐛",
      fecha: "2024-01-01",
    },
  ];

  const stmt = db.prepare(`
    INSERT INTO frases (frase, autor, origen, categoria, votos, icono, fecha)
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `);

  try {
    for (const f of seedFrases) {
      stmt.run([f.frase, f.autor, f.origen, f.categoria, f.votos, f.icono, f.fecha]);
    }
  } finally {
    stmt.free();
  }
}
