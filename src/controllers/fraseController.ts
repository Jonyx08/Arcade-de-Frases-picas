import {
  getAllFrases,
  getTopFrases,
  getFraseById,
  createFrase,
  updateFrase,
  deleteFrase,
  votarFrase,
  getStats,
  type FraseFiltros,
} from '../models/frase';
import { resetDatabaseToSeeds } from '../db/database';
import { FraseView } from '../views/fraseView';

export class FraseController {
  private view: FraseView;
  private filtros: FraseFiltros = {
    categoria: 'todas',
    busqueda: '',
    ordenarPor: 'votos',
  };

  constructor(view: FraseView) {
    this.view = view;
  }

  /**
   * Inicializa la interfaz y enlaza todos los eventos del usuario
   */
  public init(): void {
    this.view.renderShell();
    this.bindEvents();
    this.refreshAll();
  }

  /**
   * Refresca las vistas: grid, salón de la fama y estadísticas
   */
  public refreshAll(): void {
    const frases = getAllFrases(this.filtros);
    const topFrases = getTopFrases(3);
    const stats = getStats();

    this.view.renderGrid(frases);
    this.view.renderPodium(topFrases);
    this.view.renderStats(stats);
  }

  private bindEvents(): void {
    // 1. Búsqueda en tiempo real
    const searchInput = document.getElementById('search-input') as HTMLInputElement | null;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.filtros.busqueda = (e.target as HTMLInputElement).value;
        const frases = getAllFrases(this.filtros);
        this.view.renderGrid(frases);
      });
    }

    // 2. Filtro de Categorías (Pills)
    const pillsContainer = document.getElementById('category-pills');
    if (pillsContainer) {
      pillsContainer.addEventListener('click', (e) => {
        const target = (e.target as HTMLElement).closest('.pill-btn') as HTMLButtonElement | null;
        if (!target) return;

        pillsContainer.querySelectorAll('.pill-btn').forEach((p) => p.classList.remove('active'));
        target.classList.add('active');

        this.filtros.categoria = target.getAttribute('data-category') || 'todas';
        const frases = getAllFrases(this.filtros);
        this.view.renderGrid(frases);
      });
    }

    // 3. Ordenamiento
    const sortSelect = document.getElementById('sort-select') as HTMLSelectElement | null;
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.filtros.ordenarPor = (e.target as HTMLSelectElement).value as any;
        const frases = getAllFrases(this.filtros);
        this.view.renderGrid(frases);
      });
    }

    // 4. Botón Abrir Modal Crear
    const btnOpenCreate = document.getElementById('btn-open-create');
    if (btnOpenCreate) {
      btnOpenCreate.addEventListener('click', () => {
        this.view.openModal('crear');
      });
    }

    // 5. Botones Cerrar / Cancelar Modal
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnCancelModal = document.getElementById('btn-cancel-modal');
    const modalOverlay = document.getElementById('frase-modal');

    [btnCloseModal, btnCancelModal].forEach((btn) => {
      btn?.addEventListener('click', () => this.view.closeModal());
    });

    modalOverlay?.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        this.view.closeModal();
      }
    });

    // 6. Selector de Emojis dentro del Modal
    const emojiPicker = document.getElementById('emoji-picker');
    if (emojiPicker) {
      emojiPicker.addEventListener('click', (e) => {
        const btn = (e.target as HTMLElement).closest('.emoji-btn') as HTMLButtonElement | null;
        if (!btn) return;
        const emoji = btn.getAttribute('data-emoji');
        if (emoji) {
          this.view.setSelectedEmoji(emoji);
        }
      });
    }

    // 7. Envío del Formulario (Crear o Editar en SQLite)
    const form = document.getElementById('frase-form') as HTMLFormElement | null;
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const idVal = (document.getElementById('form-id') as HTMLInputElement).value;
        const frase = (document.getElementById('form-frase') as HTMLTextAreaElement).value;
        const autor = (document.getElementById('form-autor') as HTMLInputElement).value;
        const origen = (document.getElementById('form-origen') as HTMLInputElement).value;
        const categoria = (document.getElementById('form-categoria') as HTMLSelectElement).value;
        const icono = (document.getElementById('form-icono') as HTMLInputElement).value || '👾';

        if (!frase.trim() || !autor.trim() || !origen.trim()) {
          this.view.showToast('Por favor completa todos los campos requeridos', 'error');
          return;
        }

        if (idVal) {
          // [U] UPDATE en SQLite
          const id = parseInt(idVal, 10);
          updateFrase(id, { frase, autor, origen, categoria, icono });
          this.view.showToast('Frase actualizada con éxito en SQLite', 'success');
        } else {
          // [C] CREATE en SQLite
          createFrase({
            frase,
            autor,
            origen,
            categoria,
            icono,
            fecha: new Date().toISOString().slice(0, 10),
          });
          this.view.showToast('¡Frase legendaria guardada en SQLite!', 'success');
        }

        this.view.closeModal();
        this.refreshAll();
      });
    }

    // 8. Restaurar Semillas Originales
    const btnResetSeeds = document.getElementById('btn-reset-seeds');
    if (btnResetSeeds) {
      btnResetSeeds.addEventListener('click', () => {
        if (confirm('¿Deseas restaurar la base de datos a sus frases iniciales? Se conservará la estructura SQLite.')) {
          resetDatabaseToSeeds();
          this.view.showToast('Base de datos restaurada a sus semillas iniciales', 'info');
          this.refreshAll();
        }
      });
    }

    // 9. Delegación de eventos en el Grid (Votos, Editar, Eliminar)
    const frasesGrid = document.getElementById('frases-grid');
    if (frasesGrid) {
      frasesGrid.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;

        // VOTO POSITIVO (+1)
        const upBtn = target.closest('.btn-upvote') as HTMLButtonElement | null;
        if (upBtn) {
          const id = Number(upBtn.getAttribute('data-id'));
          votarFrase(id, 1);
          this.refreshAll();
          return;
        }

        // VOTO NEGATIVO (-1)
        const downBtn = target.closest('.btn-downvote') as HTMLButtonElement | null;
        if (downBtn) {
          const id = Number(downBtn.getAttribute('data-id'));
          votarFrase(id, -1);
          this.refreshAll();
          return;
        }

        // EDITAR
        const editBtn = target.closest('.edit-btn') as HTMLButtonElement | null;
        if (editBtn) {
          const id = Number(editBtn.getAttribute('data-id'));
          const frase = getFraseById(id);
          if (frase) {
            this.view.openModal('editar', frase);
          }
          return;
        }

        // ELIMINAR [D] DELETE
        const deleteBtn = target.closest('.delete-btn') as HTMLButtonElement | null;
        if (deleteBtn) {
          const id = Number(deleteBtn.getAttribute('data-id'));
          const frase = getFraseById(id);
          const confirmText = frase
            ? `¿Seguro que deseas eliminar la frase "${frase.frase.slice(0, 30)}..." de SQLite?`
            : '¿Seguro que deseas eliminar esta frase?';

          if (confirm(confirmText)) {
            deleteFrase(id);
            this.view.showToast('Frase eliminada de SQLite', 'info');
            this.refreshAll();
          }
          return;
        }
      });
    }
  }
}
