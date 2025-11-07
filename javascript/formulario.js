
 (function () {
    const PRICE = 20; // USD por persona
    const contenedor = document.getElementById('empleados');
    const addBtn = document.getElementById('addEmployeeBtn');
    const totalOut = document.getElementById('total');
  
    // Estado: tipo de inscripción
    const radiosTipo = document.querySelectorAll('input[name="tipo"]');
  
    // Asegura que la primera fila exista
    function getFirstRow() {
      return contenedor.querySelector('.fila[data-row="1"]') || contenedor.querySelector('.fila');
    }
  
    // Recalcular total (cantidad de filas visibles)
    function updateTotal() {
      const filas = contenedor.querySelectorAll('.fila');
      const count = filas.length || 1;
      totalOut.textContent = `$${(count * PRICE).toLocaleString('en-US')}`;
    }
  
    // Limpia inputs de una fila
    function clearRow(rowEl) {
      rowEl.querySelectorAll('input[type="text"]').forEach(i => i.value = '');
    }
  
    // Crea una fila nueva (clon basada en la primera)
    function createRow() {
      const base = getFirstRow();
      const clone = base.cloneNode(true);
  
      const idx = contenedor.querySelectorAll('.fila').length + 1;
      clone.setAttribute('data-row', String(idx));
  
      // Actualizar ids/for y limpiar valores
      const fields = [
        { sel: 'input[name="nombre[]"]', baseId: 'nombre-' },
        { sel: 'input[name="apellido[]"]', baseId: 'apellido-' },
        { sel: 'input[name="documento[]"]', baseId: 'documento-' }
      ];
  
      fields.forEach(({ sel, baseId }) => {
        const input = clone.querySelector(sel);
        const label = clone.querySelector(`label[for="${input.id}"]`) || clone.querySelector('label');
        input.id = baseId + idx;
        input.value = '';
        if (label) label.setAttribute('for', input.id);
      });
  
      // aria-label del botón borrar
      const btn = clone.querySelector('.btn-borrar');
      btn.setAttribute('aria-label', `Borrar campos de la fila ${idx}`);
  
      return clone;
    }
  
    // Modo Persona: ocultar botón agregar y dejar solo la primera fila (limpia valores)
    function setPersonaMode() {
      addBtn.style.display = 'none';
  
      // Elimina todas menos la primera
      const filas = contenedor.querySelectorAll('.fila');
      filas.forEach((f, i) => {
        if (i === 0) {
          clearRow(f);
        } else {
          f.remove();
        }
      });
  
      updateTotal(); // total = 1 x 20
    }
  
    // Modo Empresa: mostrar botón agregar; si no hay filas, crear al menos una
    function setEmpresaMode() {
      addBtn.style.display = 'inline-flex';
      if (!contenedor.querySelector('.fila')) {
        contenedor.appendChild(createRow());
      }
      updateTotal();
    }
  
    // Click en Agregar empleado
    addBtn.addEventListener('click', () => {
      contenedor.appendChild(createRow());
      updateTotal();
    });
  
    // Delegación para borrar / limpiar filas
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-borrar');
      if (!btn) return;
  
      const fila = btn.closest('.fila');
      if (!fila) return;
  
      const isFirst = fila.matches('.fila:first-of-type');
  
      // Si es la primera, solo limpiar
      if (isFirst) {
        clearRow(fila);
      } else {
        fila.remove();
      }
      updateTotal();
    });
  
    // Cambio de modo (Persona/Empresa)
    radiosTipo.forEach(r => {
      r.addEventListener('change', () => {
        if (r.checked) {
          if (r.value === 'persona') setPersonaMode();
          else setEmpresaMode();
        }
      });
    });
  
    // Init (respeta el radio marcado en el HTML)
    const current = document.querySelector('input[name="tipo"]:checked')?.value || 'persona';
    if (current === 'persona') setPersonaMode(); else setEmpresaMode();
  })();


/* MODALES*/

/* ====== CONFIG ====== */
const form      = document.getElementById('tablaForm');       // <- verifica tu id real
const openBtn   = document.getElementById('openModalBtn');
const errorDlg  = document.getElementById('errorDlg');
const errorMsg  = document.getElementById('errorMsg');
const confirmDlg= document.getElementById('confirmDlg');
const confirmBtn= document.getElementById('confirmBtn');
const cont      = document.getElementById('empleados');

/* ====== REGEX ====== */
// Letras (incluye acentos), espacios, ' y - (mínimo 2 caracteres)
const reNombre     = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ](?:[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'-]{1,})$/;
const reApellido   = reNombre;
// Documento: 7 u 8 dígitos positivos
const reDocumento  = /^\d{7,8}$/;

/* ====== HELPERS ====== */
const $  = (s, ctx=document) => ctx.querySelector(s);
const $$ = (s, ctx=document) => Array.from(ctx.querySelectorAll(s));

function clearFieldErrors(scope = document) {
  $$('.input-error', scope).forEach(el => el.classList.remove('input-error'));
}

function markError(input) {
  if (input) input.classList.add('input-error');
}

function crearListaErrores(items) {
  if (!items.length) return '';
  const ul = document.createElement('ul');
  ul.style.paddingLeft = '18px';
  ul.style.margin = 0;
  items.forEach(t => {
    const li = document.createElement('li');
    li.className = 'error-li';
    li.textContent = t;
    ul.appendChild(li);
  });
  return ul.outerHTML;
}

/* Validadores simples */
function validarNombre(v)    { return reNombre.test((v ?? '').trim()); }
function validarApellido(v)  { return reApellido.test((v ?? '').trim()); }
function validarDocumento(v) {
  const s = (v ?? '').trim();
  return reDocumento.test(s) && Number.isFinite(Number(s));
}

/* Valida todas las filas visibles */
function validarFormulario() {
  clearFieldErrors(cont);

  const filas = $$('.fila', cont);
  const erroresResumen = [];
  let okGlobal = true;

  filas.forEach((row, idx) => {
    const inNombre    = row.querySelector('input[name="nombre[]"]');
    const inApellido  = row.querySelector('input[name="apellido[]"]');
    const inDocumento = row.querySelector('input[name="documento[]"]');

    const nombre    = inNombre?.value ?? '';
    const apellido  = inApellido?.value ?? '';
    const documento = inDocumento?.value ?? '';

    let okFila = true;
    const msgs = [];

    if (!validarNombre(nombre))    { okFila = false; msgs.push('Nombre inválido');    markError(inNombre); }
    if (!validarApellido(apellido)){ okFila = false; msgs.push('Apellido inválido');  markError(inApellido); }
    if (!validarDocumento(documento)){ okFila = false; msgs.push('Documento inválido (7 u 8 dígitos)'); markError(inDocumento); }

    if (!okFila) {
      okGlobal = false;
      erroresResumen.push(`Fila ${idx + 1}: ${msgs.join(', ')}`);
    }
  });

  return { ok: okGlobal, erroresResumen };
}

/* ====== EVENTOS ====== */
openBtn.addEventListener('click', () => {
  const { ok, erroresResumen } = validarFormulario();

  if (!ok) {
    // Mostrar modal de ERRORES
    const html = `
      <div>
        Se encontraron problemas en estos campos:
        ${crearListaErrores(erroresResumen)}
      </div>`;
    errorMsg.innerHTML = html;
    errorDlg.showModal();
    // Focus al primer campo con error
    const firstErr = $('.input-error', cont);
    if (firstErr) firstErr.focus();
    return;
  }

  // Si todo está OK, abrimos el modal de confirmación
  confirmDlg.showModal();
});

/* Confirmar => enviar formulario respetando validaciones nativas */
confirmBtn.addEventListener('click', () => {
  confirmDlg.close();
  form.requestSubmit();
});

