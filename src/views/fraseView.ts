import type { Frase } from '../models/frase';

export class FraseView {
  private root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  /**
   * Renderiza la estructura base del arcade con iconografia limpia
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
            Base de datos SQLite localmente persistida con las citas más legendarias de videojuegos, cine, anime y cultura digital.
          </p>

          <!-- STATS RIBBON -->
          <div class="stats-ribbon" id="stats-ribbon">
            <div class="stat-item">
              <div class="stat-info">
                <span class="stat-label">Total Frases</span>
                <span class="stat-value" id="stat-total">0</span>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-info">
                <span class="stat-label">Votos Registrados</span>
                <span class="stat-value" id="stat-votos">0</span>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-info">
                <span class="stat-label">Categoría Líder</span>
                <span class="stat-value" id="stat-categoria">-</span>
              </div>
            </div>
            <div class="stat-item">
              <div class="stat-info">
                <span class="stat-label">Persistencia</span>
                <span class="stat-value" style="color: var(--neon-green);">ACTIVA</span>
              </div>
            </div>
          </div>
        </header>

        <!-- HALL OF FAME / TOP PODIUM -->
        <section class="hall-of-fame">
          <h2 class="section-title">Salón de la Fama • Top 3 Más Votadas</h2>
          <div class="podium-grid" id="podium-grid">
            <!-- Inyectado dinámicamente -->
          </div>
        </section>

        <!-- CONTROLS BAR -->
        <section class="controls-bar">
          <div class="controls-row-top">
            <div class="search-box">
              <span class="search-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </span>
              <input 
                type="text" 
                id="search-input" 
                class="search-input" 
                placeholder="Buscar por frase, personaje u obra..." 
                autocomplete="off"
              />
            </div>
            <div class="controls-actions">
              <button id="btn-reset-seeds" class="btn-secondary" title="Reinicia la BD a sus frases iniciales">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="1 4 1 10 7 10"></polyline>
                  <polyline points="23 20 23 14 17 14"></polyline>
                  <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
                </svg>
                Restaurar Semillas
              </button>
              <button id="btn-open-create" class="btn-primary">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                NUEVA FRASE
              </button>
            </div>
          </div>

          <div class="controls-row-bottom">
            <div class="category-pills" id="category-pills">
              <button class="pill-btn active" data-category="todas">Todas</button>
              <button class="pill-btn" data-category="Videojuegos">Videojuegos</button>
              <button class="pill-btn" data-category="Cine">Cine</button>
              <button class="pill-btn" data-category="Anime">Anime</button>
              <button class="pill-btn" data-category="Memes">Memes</button>
            </div>

            <div class="sort-box">
              <select id="sort-select" class="sort-select">
                <option value="votos">Más Votadas</option>
                <option value="recientes">Más Recientes</option>
                <option value="alfabetico">Alfabético</option>
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
            <h3 class="modal-title" id="modal-title">NUEVA FRASE ÉPICA</h3>
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
                <option value="Videojuegos">Videojuegos</option>
                <option value="Cine">Cine</option>
                <option value="Anime">Anime</option>
                <option value="Memes">Memes</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Insignia Temática</label>
              <div class="emoji-picker" id="emoji-picker">
                <button type="button" class="emoji-btn selected" data-emoji="🗡️">🗡️</button>
                <button type="button" class="emoji-btn" data-emoji="🕹️">🕹️</button>
                <button type="button" class="emoji-btn" data-emoji="🕶️">🕶️</button>
                <button type="button" class="emoji-btn" data-emoji="✨">✨</button>
                <button type="button" class="emoji-btn" data-emoji="🥋">🥋</button>
                <button type="button" class="emoji-btn" data-emoji="💻">💻</button>
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
   * Actualiza el listón de estadísticas
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
      container.innerHTML = `<div class="empty-desc" style="grid-column: 1 / -1; text-align: center;">No hay frases registradas aún.</div>`;
      return;
    }

    const rankLabels = ['1ST PLACE', '2ND PLACE', '3RD PLACE'];

    container.innerHTML = frases.map((f, index) => `
      <div class="podium-card rank-${index + 1}">
        <span class="podium-badge">${rankLabels[index] || `#${index + 1}`}</span>
        <div class="card-body" style="margin-top: 0.5rem;">
          <div class="card-quote" style="font-size: 1rem;">${this.escapeHtml(f.frase)}</div>
          <div class="card-meta">
            <span class="card-author">${this.escapeHtml(f.autor)}</span>
            <span class="card-origin">${this.escapeHtml(f.origen)}</span>
          </div>
        </div>
        <div class="card-footer" style="padding-top: 0.8rem;">
          <span class="category-tag ${this.getCategoryClass(f.categoria)}">${f.categoria}</span>
          <span style="font-family: var(--font-retro); font-size: 0.75rem; color: var(--neon-yellow);">${f.votos} PTS</span>
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
          <h3 class="empty-title">SIN RESULTADOS</h3>
          <p class="empty-desc">No se encontraron frases con los filtros seleccionados.</p>
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
          <span class="card-icon" title="Insignia">${f.icono || '•'}</span>
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
            <button class="btn-icon edit-btn" data-id="${f.id}" title="Editar registro">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="btn-icon delete-btn" data-id="${f.id}" title="Eliminar registro">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
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
      if (title) title.textContent = 'EDITAR FRASE';
      if (formId) formId.value = frase.id.toString();
      if (formFrase) formFrase.value = frase.frase;
      if (formAutor) formAutor.value = frase.autor;
      if (formOrigen) formOrigen.value = frase.origen;
      if (formCat) formCat.value = frase.categoria;
      if (formIcono) formIcono.value = frase.icono;
      this.setSelectedEmoji(frase.icono);
    } else {
      if (title) title.textContent = 'NUEVA FRASE ÉPICA';
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
   * Muestra notificaciones limpias con iconos SVG estructurados
   */
  public showToast(mensaje: string, tipo: 'success' | 'info' | 'error' = 'info'): void {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    
    let iconSvg = '';
    if (tipo === 'success') {
      iconSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    } else if (tipo === 'error') {
      iconSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
      iconSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `<span class="toast-icon">${iconSvg}</span> <span>${this.escapeHtml(mensaje)}</span>`;
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
