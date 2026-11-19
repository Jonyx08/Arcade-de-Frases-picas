import type { Frase } from '../models/frase';

export class FraseView {
  private root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  /**
   * Renderiza la estructura base del arcade
   */
  public renderShell(): void {
    this.root.innerHTML = `
      <div class="container">
        <!-- HEADER -->
        <header class="arcade-header">
          <div class="arcade-badge">
            <span class="pulse-dot"></span>
            SQLite en Navegador • SQL.js WebAssembly
          </div>
          <h1 class="arcade-title">ARCADE DE FRASES ÉPICAS</h1>
          <p class="arcade-subtitle">
            Base de datos SQLite localmente persistida con las citas más legendarias de videojuegos, cine, anime y memes. ¡Vota por tus favoritas o añade las tuyas!
          </p>

          <!-- STATS RIBBON -->
          <div class="stats-ribbon" id="stats-ribbon">
            <div class="stat-item">
              <span class="stat-icon">🕹️</span>
              <div class="stat-info">
                <span class="stat-label">Total Frases</span>
                <span class="stat-value" id="stat-total">0</span>
              </div>
            </div>
            <div class="stat-item">
              <span class="stat-icon">⭐</span>
              <div class="stat-info">
                <span class="stat-label">Votos Registrados</span>
                <span class="stat-value" id="stat-votos">0</span>
              </div>
            </div>
            <div class="stat-item">
              <span class="stat-icon">👑</span>
              <div class="stat-info">
                <span class="stat-label">Categoría Líder</span>
                <span class="stat-value" id="stat-categoria">-</span>
              </div>
            </div>
            <div class="stat-item">
              <span class="stat-icon">💾</span>
              <div class="stat-info">
                <span class="stat-label">Persistencia</span>
                <span class="stat-value" style="color: var(--neon-green);">ACTIVA</span>
              </div>
            </div>
          </div>
        </header>

        <!-- HALL OF FAME / TOP PODIUM -->
        <section class="hall-of-fame">
          <h2 class="section-title">🏆 Salón de la Fama • Top 3 Más Votadas</h2>
          <div class="podium-grid" id="podium-grid">
            <!-- Inyectado dinámicamente -->
          </div>
        </section>

        <!-- CONTROLS BAR -->
        <section class="controls-bar">
          <div class="controls-row-top">
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input 
                type="text" 
                id="search-input" 
                class="search-input" 
                placeholder="Buscar por frase, personaje u obra..." 
                autocomplete="off"
              />
            </div>
            <div class="controls-actions">
              <button id="btn-reset-seeds" class="btn-secondary" title="Reinicia la BD a sus frases originales">
                🔄 Restaurar Semillas
              </button>
              <button id="btn-open-create" class="btn-primary">
                + NUEVA FRASE
              </button>
            </div>
          </div>

          <div class="controls-row-bottom">
            <div class="category-pills" id="category-pills">
              <button class="pill-btn active" data-category="todas">Todas</button>
              <button class="pill-btn" data-category="Videojuegos">🎮 Videojuegos</button>
              <button class="pill-btn" data-category="Cine">🎬 Cine</button>
              <button class="pill-btn" data-category="Anime">⛩️ Anime</button>
              <button class="pill-btn" data-category="Memes">🐸 Memes</button>
            </div>

            <div class="sort-box">
              <select id="sort-select" class="sort-select">
                <option value="votos">🔥 Más Votadas</option>
                <option value="recientes">⏱️ Más Recientes</option>
                <option value="alfabetico">🔤 Alfabético</option>
              </select>
            </div>
          </div>
        </section>

        <!-- GRID DE FRASES -->
        <main>
          <div class="frases-grid" id="frases-grid">
            <!-- Tarjetas inyectadas dinámicamente -->
          </div>
        </main>

        <!-- FOOTER -->
        <footer class="arcade-footer">
          <p><strong>Laboratorio 3 • Programación Orientada a Eventos</strong></p>
          <div class="footer-tech">
            <span class="tech-tag">SQLite (sql.js WASM)</span>
            <span class="tech-tag">TypeScript</span>
            <span class="tech-tag">Vite</span>
            <span class="tech-tag">pnpm</span>
            <span class="tech-tag">Vercel</span>
          </div>
          <p>Código fuente disponible en GitHub: <a href="https://github.com/Jonyx08/Arcade-de-Frases-picas" target="_blank" class="footer-link">Arcade-de-Frases-picas</a></p>
        </footer>
      </div>

      <!-- MODAL FORMULARIO (CREAR / EDITAR) -->
      <div class="modal-overlay" id="frase-modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title" id="modal-title">👾 NUEVA FRASE ÉPICA</h3>
            <button class="btn-close" id="btn-close-modal">&times;</button>
          </div>
          <form id="frase-form">
            <input type="hidden" id="form-id" value="" />

            <div class="form-group">
              <label class="form-label" for="form-frase">Frase Legendaria *</label>
              <textarea 
                id="form-frase" 
                class="form-control" 
                rows="3" 
                placeholder="Ej: It's dangerous to go alone! Take this." 
                required
              ></textarea>
            </div>

            <div class="form-group">
              <label class="form-label" for="form-autor">Personaje / Autor *</label>
              <input 
                type="text" 
                id="form-autor" 
                class="form-control" 
                placeholder="Ej: Old Man, Obi-Wan Kenobi, GLaDOS..." 
                required 
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="form-origen">Origen (Videojuego, Película, Serie) *</label>
              <input 
                type="text" 
                id="form-origen" 
                class="form-control" 
                placeholder="Ej: The Legend of Zelda, Star Wars..." 
                required 
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="form-categoria">Categoría *</label>
              <select id="form-categoria" class="form-control" required>
                <option value="Videojuegos">🎮 Videojuegos</option>
                <option value="Cine">🎬 Cine</option>
                <option value="Anime">⛩️ Anime</option>
                <option value="Memes">🐸 Memes</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Icono Temático</label>
              <div class="emoji-picker" id="emoji-picker">
                <button type="button" class="emoji-btn selected" data-emoji="🗡️">🗡️</button>
                <button type="button" class="emoji-btn" data-emoji="👾">👾</button>
                <button type="button" class="emoji-btn" data-emoji="🕶️">🕶️</button>
                <button type="button" class="emoji-btn" data-emoji="✨">✨</button>
                <button type="button" class="emoji-btn" data-emoji="🥋">🥋</button>
                <button type="button" class="emoji-btn" data-emoji="🐛">🐛</button>
                <button type="button" class="emoji-btn" data-emoji="🎂">🎂</button>
                <button type="button" class="emoji-btn" data-emoji="🤖">🤖</button>
                <button type="button" class="emoji-btn" data-emoji="👑">👑</button>
                <button type="button" class="emoji-btn" data-emoji="💥">💥</button>
              </div>
              <input type="hidden" id="form-icono" value="🗡️" />
            </div>

            <div class="form-actions">
              <button type="button" class="btn-secondary" id="btn-cancel-modal">Cancelar</button>
              <button type="submit" class="btn-primary" id="btn-submit-modal">Guardar en SQLite</button>
            </div>
          </form>
        </div>
      </div>

      <!-- TOAST CONTAINER -->
      <div class="toast-container" id="toast-container"></div>
    `;
  }

  /**
   * Actualiza el contador del listón de estadísticas
   */
  public renderStats(stats: { total: number; totalVotos: number; topCategoria: string }): void {
    const totalEl = document.getElementById('stat-total');
    const votosEl = document.getElementById('stat-votos');
    const catEl = document.getElementById('stat-categoria');

    if (totalEl) totalEl.textContent = stats.total.toString();
    if (votosEl) votosEl.textContent = stats.totalVotos.toString();
    if (catEl) catEl.textContent = stats.topCategoria;
  }

  /**
   * Renderiza el podio Top 3
   */
  public renderPodium(frases: Frase[]): void {
    const container = document.getElementById('podium-grid');
    if (!container) return;

    if (frases.length === 0) {
      container.innerHTML = `<div class="empty-desc" style="grid-column: 1 / -1; text-align: center;">No hay frases suficientes para el podio.</div>`;
      return;
    }

    const rankLabels = ['1ST PLACE 🥇', '2ND PLACE 🥈', '3RD PLACE 🥉'];

    container.innerHTML = frases.map((f, index) => `
      <div class="podium-card rank-${index + 1}">
        <span class="podium-badge">${rankLabels[index] || `#${index + 1}`}</span>
        <div class="card-body" style="margin-top: 0.5rem;">
          <div class="card-quote" style="font-size: 1rem;">${this.escapeHtml(f.frase)}</div>
          <div class="card-meta">
            <span class="card-author">${f.icono} ${this.escapeHtml(f.autor)}</span>
            <span class="card-origin">${this.escapeHtml(f.origen)}</span>
          </div>
        </div>
        <div class="card-footer" style="padding-top: 0.8rem;">
          <span class="category-tag ${this.getCategoryClass(f.categoria)}">${f.categoria}</span>
          <span style="font-family: var(--font-retro); font-size: 0.8rem; color: var(--neon-yellow);">⭐ ${f.votos} pts</span>
        </div>
      </div>
    `).join('');
  }

  /**
   * Renderiza el grid principal de frases
   */
  public renderGrid(frases: Frase[]): void {
    const grid = document.getElementById('frases-grid');
    if (!grid) return;

    if (frases.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">👾</div>
          <h3 class="empty-title">¡GAME OVER! NO HAY RESULTADOS</h3>
          <p class="empty-desc">No se encontraron frases con los filtros aplicados. ¡Intenta con otra búsqueda o añade una nueva frase!</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = frases.map((f) => `
      <article class="frase-card" data-id="${f.id}">
        <div class="card-top">
          <span class="category-tag ${this.getCategoryClass(f.categoria)}">
            ${f.categoria}
          </span>
          <span class="card-icon" title="Icono temático">${f.icono}</span>
        </div>

        <div class="card-body">
          <blockquote class="card-quote">${this.escapeHtml(f.frase)}</blockquote>
          <div class="card-meta">
            <span class="card-author">${this.escapeHtml(f.autor)}</span>
            <span class="card-origin">${this.escapeHtml(f.origen)}</span>
          </div>
        </div>

        <div class="card-footer">
          <div class="vote-controls">
            <button class="btn-vote btn-upvote" data-id="${f.id}" title="Voto positivo (+1)">▲</button>
            <span class="vote-count" id="vote-count-${f.id}">${f.votos}</span>
            <button class="btn-vote btn-downvote" data-id="${f.id}" title="Voto negativo (-1)">▼</button>
          </div>

          <div class="card-actions">
            <button class="btn-icon edit-btn" data-id="${f.id}" title="Editar registro en SQLite">
              ✏️
            </button>
            <button class="btn-icon delete-btn" data-id="${f.id}" title="Eliminar de SQLite">
              🗑️
            </button>
          </div>
        </div>
      </article>
    `).join('');
  }

  /**
   * Abre el modal en modo 'crear' o 'editar'
   */
  public openModal(modo: 'crear' | 'editar', frase?: Frase): void {
    const modal = document.getElementById('frase-modal');
    const title = document.getElementById('modal-title');
    const formId = document.getElementById('form-id') as HTMLInputElement;
    const formFrase = document.getElementById('form-frase') as HTMLTextAreaElement;
    const formAutor = document.getElementById('form-autor') as HTMLInputElement;
    const formOrigen = document.getElementById('form-origen') as HTMLInputElement;
    const formCat = document.getElementById('form-categoria') as HTMLSelectElement;
    const formIcono = document.getElementById('form-icono') as HTMLInputElement;

    if (!modal) return;

    if (modo === 'editar' && frase) {
      if (title) title.textContent = '✏️ EDITAR FRASE ÉPICA';
      if (formId) formId.value = frase.id.toString();
      if (formFrase) formFrase.value = frase.frase;
      if (formAutor) formAutor.value = frase.autor;
      if (formOrigen) formOrigen.value = frase.origen;
      if (formCat) formCat.value = frase.categoria;
      if (formIcono) formIcono.value = frase.icono;
      this.setSelectedEmoji(frase.icono);
    } else {
      if (title) title.textContent = '👾 NUEVA FRASE ÉPICA';
      if (formId) formId.value = '';
      if (formFrase) formFrase.value = '';
      if (formAutor) formAutor.value = '';
      if (formOrigen) formOrigen.value = '';
      if (formCat) formCat.value = 'Videojuegos';
      if (formIcono) formIcono.value = '🗡️';
      this.setSelectedEmoji('🗡️');
    }

    modal.classList.add('open');
  }

  public closeModal(): void {
    const modal = document.getElementById('frase-modal');
    if (modal) {
      modal.classList.remove('open');
    }
  }

  public setSelectedEmoji(emoji: string): void {
    const buttons = document.querySelectorAll('.emoji-btn');
    buttons.forEach((btn) => {
      if (btn.getAttribute('data-emoji') === emoji) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });
    const input = document.getElementById('form-icono') as HTMLInputElement;
    if (input) input.value = emoji;
  }

  /**
   * Muestra un toast notification retro
   */
  public showToast(mensaje: string, tipo: 'success' | 'info' | 'error' = 'info'): void {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    
    let icon = 'ℹ️';
    if (tipo === 'success') icon = '✅';
    if (tipo === 'error') icon = '❌';

    toast.innerHTML = `<span>${icon}</span> <span>${this.escapeHtml(mensaje)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  private getCategoryClass(cat: string): string {
    switch (cat.toLowerCase()) {
      case 'videojuegos': return 'cat-videojuegos';
      case 'cine': return 'cat-cine';
      case 'anime': return 'cat-anime';
      case 'memes': return 'cat-memes';
      default: return 'cat-otro';
    }
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
