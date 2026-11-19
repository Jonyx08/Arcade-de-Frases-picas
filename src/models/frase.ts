import { getDb, saveDatabase } from '../db/database';

export interface Frase {
  id: number;
  frase: string;
  autor: string;
  origen: string;
  categoria: 'Videojuegos' | 'Cine' | 'Anime' | 'Memes' | string;
  votos: number;
  icono: string;
  fecha: string;
}

export type FraseInput = Omit<Frase, 'id' | 'votos'>;

export interface FraseFiltros {
  categoria?: string;
  busqueda?: string;
  ordenarPor?: 'votos' | 'recientes' | 'alfabetico';
}

/**
 * Obtiene todas las frases aplicando filtros opcionales de búsqueda y categoría
 */
export function getAllFrases(filtros: FraseFiltros = {}): Frase[] {
  const db = getDb();
  let sql = 'SELECT id, frase, autor, origen, categoria, votos, icono, fecha FROM frases WHERE 1=1';
  const params: (string | number)[] = [];

  if (filtros.categoria && filtros.categoria !== 'todas') {
    sql += ' AND categoria = ?';
    params.push(filtros.categoria);
  }

  if (filtros.busqueda && filtros.busqueda.trim() !== '') {
    sql += ' AND (frase LIKE ? OR autor LIKE ? OR origen LIKE ?)';
    const searchPattern = `%${filtros.busqueda.trim()}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  switch (filtros.ordenarPor) {
    case 'recientes':
      sql += ' ORDER BY id DESC';
      break;
    case 'alfabetico':
      sql += ' ORDER BY frase ASC';
      break;
    case 'votos':
    default:
      sql += ' ORDER BY votos DESC, id DESC';
      break;
  }

  const stmt = db.prepare(sql);
  if (params.length > 0) {
    stmt.bind(params);
  }

  const list: Frase[] = [];
  while (stmt.step()) {
    list.push(stmt.getAsObject() as unknown as Frase);
  }
  stmt.free();

  return list;
}

/**
 * Obtiene el Top de frases más votadas (para el Hall of Fame)
 */
export function getTopFrases(limite: number = 3): Frase[] {
  const db = getDb();
  const stmt = db.prepare('SELECT id, frase, autor, origen, categoria, votos, icono, fecha FROM frases ORDER BY votos DESC LIMIT ?');
  stmt.bind([limite]);

  const list: Frase[] = [];
  while (stmt.step()) {
    list.push(stmt.getAsObject() as unknown as Frase);
  }
  stmt.free();

  return list;
}

/**
 * Obtiene una frase por ID
 */
export function getFraseById(id: number): Frase | null {
  const db = getDb();
  const stmt = db.prepare('SELECT id, frase, autor, origen, categoria, votos, icono, fecha FROM frases WHERE id = ?');
  stmt.bind([id]);

  if (stmt.step()) {
    const row = stmt.getAsObject() as unknown as Frase;
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
}

/**
 * [C] CREATE: Inserta una nueva frase en SQLite
 */
export function createFrase(data: FraseInput): Frase {
  const db = getDb();
  const fecha = data.fecha || new Date().toISOString().slice(0, 10);
  const icono = data.icono || '👾';

  db.run(
    `INSERT INTO frases (frase, autor, origen, categoria, votos, icono, fecha)
     VALUES (?, ?, ?, ?, 0, ?, ?);`,
    [data.frase.trim(), data.autor.trim(), data.origen.trim(), data.categoria, icono, fecha]
  );

  saveDatabase();

  const res = db.exec('SELECT last_insert_rowid() AS id;');
  const newId = Number(res[0].values[0][0]);
  return getFraseById(newId)!;
}

/**
 * [U] UPDATE: Actualiza una frase existente en SQLite
 */
export function updateFrase(
  id: number,
  data: Partial<Pick<Frase, 'frase' | 'autor' | 'origen' | 'categoria' | 'icono'>>
): Frase | null {
  const actual = getFraseById(id);
  if (!actual) return null;

  const db = getDb();
  const nuevaFrase = data.frase !== undefined ? data.frase.trim() : actual.frase;
  const nuevoAutor = data.autor !== undefined ? data.autor.trim() : actual.autor;
  const nuevoOrigen = data.origen !== undefined ? data.origen.trim() : actual.origen;
  const nuevaCategoria = data.categoria !== undefined ? data.categoria : actual.categoria;
  const nuevoIcono = data.icono !== undefined ? data.icono : actual.icono;

  db.run(
    `UPDATE frases
     SET frase = ?, autor = ?, origen = ?, categoria = ?, icono = ?
     WHERE id = ?;`,
    [nuevaFrase, nuevoAutor, nuevoOrigen, nuevaCategoria, nuevoIcono, id]
  );

  saveDatabase();
  return getFraseById(id);
}

/**
 * [D] DELETE: Elimina una frase de SQLite
 */
export function deleteFrase(id: number): boolean {
  const db = getDb();
  db.run('DELETE FROM frases WHERE id = ?;', [id]);
  saveDatabase();
  return true;
}

/**
 * Incrementa o decrementa los votos de una frase en SQLite (+1 o -1)
 */
export function votarFrase(id: number, delta: number = 1): number {
  const db = getDb();
  db.run('UPDATE frases SET votos = MAX(0, votos + ?) WHERE id = ?;', [delta, id]);
  saveDatabase();

  const res = db.exec(`SELECT votos FROM frases WHERE id = ${id};`);
  if (res.length > 0 && res[0].values.length > 0) {
    return Number(res[0].values[0][0]);
  }
  return 0;
}

/**
 * Estadísticas generales para el dashboard
 */
export function getStats(): { total: number; totalVotos: number; topCategoria: string } {
  const db = getDb();

  const totalRes = db.exec('SELECT COUNT(*) AS total, IFNULL(SUM(votos), 0) AS totalVotos FROM frases;');
  const total = Number(totalRes[0].values[0][0]);
  const totalVotos = Number(totalRes[0].values[0][1]);

  let topCategoria = 'N/A';
  const catRes = db.exec(`
    SELECT categoria, COUNT(*) as c
    FROM frases
    GROUP BY categoria
    ORDER BY c DESC
    LIMIT 1;
  `);

  if (catRes.length > 0 && catRes[0].values.length > 0) {
    topCategoria = String(catRes[0].values[0][0]);
  }

  return { total, totalVotos, topCategoria };
}
