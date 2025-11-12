import { todosLosCursos } from "../javascript/cursos.js";

/* ===========================
   CARGA DEL CURSO SELECCIONADO
=========================== */
const urlParams = new URLSearchParams(window.location.search);
const cursoId = urlParams.get("id");
const curso = todosLosCursos.find((c) => c.id == cursoId);

if (curso) {
  const cursoInfoDiv = document.getElementById("curso-info");
  cursoInfoDiv.innerHTML = `
    <h2>${curso.titulo}</h2>
    <h4>INSCRIPCIÓN</h4>
  `;
} else {
  // Si no hay un curso en la URL, decidimos a dónde redirigir.
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioSesionIniciada"));
  const carrito = (usuarioActivo && JSON.parse(localStorage.getItem(`carrito_${usuarioActivo.usuario}`))) || [];

  if (carrito.length > 0) {
    alert("Ya tenes uno o mas cursos seleccionados en el carrito. Serás redirigido al carrito.");
    window.location.href = "carrito.html";
  } else {
    // Si el carrito está vacío, le pedimos que elija un curso.
    alert("Debes seleccionar un curso e inscribirte");
    window.location.href = "home.html";
  }
}

/* ===========================
   GESTIÓN DE INSCRIPCIONES
=========================== */
(function () {
  const PRICE = curso?.precio ?? 0; // precio dinámico
  const contenedor = document.getElementById("empleados");
  const addBtn = document.getElementById("addEmployeeBtn");
  const totalOut = document.getElementById("total");
  const radiosTipo = document.querySelectorAll('input[name="tipo"]');

  // Primera fila base
  function getFirstRow() {
    return (
      contenedor.querySelector('.fila[data-row="1"]') ||
      contenedor.querySelector(".fila")
    );
  }

  // Actualiza total
  function updateTotal() {
    const filas = contenedor.querySelectorAll(".fila");
    const count = filas.length || 1;
    totalOut.textContent = `$${(count * PRICE).toLocaleString("en-US")}`;
  }

  // Limpia inputs
  function clearRow(rowEl) {
    rowEl.querySelectorAll('input[type="text"]').forEach((i) => (i.value = ""));
  }

  // Crea fila nueva
  function createRow() {
    const base = getFirstRow();
    const clone = base.cloneNode(true);
    const idx = contenedor.querySelectorAll(".fila").length + 1;

    clone.setAttribute("data-row", String(idx));

    const fields = [
      { sel: 'input[name="nombre[]"]', baseId: "nombre-" },
      { sel: 'input[name="apellido[]"]', baseId: "apellido-" },
      { sel: 'input[name="documento[]"]', baseId: "documento-" },
    ];

    fields.forEach(({ sel, baseId }) => {
      const input = clone.querySelector(sel);
      input.id = baseId + idx;
      input.value = "";
      const label =
        clone.querySelector(`label[for="${input.id}"]`) ||
        clone.querySelector("label");
      if (label) label.setAttribute("for", input.id);
    });

    const btn = clone.querySelector(".btn-borrar");
    btn.setAttribute("aria-label", `Borrar campos de la fila ${idx}`);

    return clone;
  }

  // Modo persona: una sola fila
  function setPersonaMode() {
    addBtn.style.display = "none";
    const filas = contenedor.querySelectorAll(".fila");
    filas.forEach((f, i) => (i === 0 ? clearRow(f) : f.remove()));
    updateTotal();
  }

  // Modo empresa: varias filas
  function setEmpresaMode() {
    addBtn.style.display = "inline-flex";
    if (!contenedor.querySelector(".fila")) contenedor.appendChild(createRow());
    updateTotal();
  }

  // Evento agregar empleado
  addBtn.addEventListener("click", () => {
    contenedor.appendChild(createRow());
    updateTotal();
  });

  // Borrar o limpiar fila
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn-borrar");
    if (!btn) return;

    const fila = btn.closest(".fila");
    if (!fila) return;

    const isFirst = fila.matches(".fila:first-of-type");
    if (isFirst) clearRow(fila);
    else fila.remove();

    updateTotal();
  });

  // Cambio de tipo
  radiosTipo.forEach((r) => {
    r.addEventListener("change", () => {
      if (r.checked) {
        if (r.value === "persona") setPersonaMode();
        else setEmpresaMode();
      }
    });
  });

  // Init
  const current =
    document.querySelector('input[name="tipo"]:checked')?.value || "persona";
  if (current === "persona") setPersonaMode();
  else setEmpresaMode();
})();

/* ===========================
   VALIDACIÓN Y MODALES
=========================== */
const form = document.getElementById("tablaForm");
const openBtn = document.getElementById("openModalBtn");
const errorDlg = document.getElementById("errorDlg");
const errorMsg = document.getElementById("errorMsg");
const confirmDlg = document.getElementById("confirmDlg");
const confirmBtn = document.getElementById("confirmBtn");
const dlgMsg = document.getElementById("dlgMsg");
const cont = document.getElementById("empleados");

// Regex
const reNombre = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ](?:[A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s'-]{1,})$/;
const reApellido = reNombre;
const reDocumento = /^\d{7,8}$/;

// Helpers
const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));
function clearFieldErrors(scope = document) {
  $$(".input-error", scope).forEach((el) =>
    el.classList.remove("input-error")
  );
}
function markError(input) {
  if (input) input.classList.add("input-error");
}
function crearListaErrores(items) {
  if (!items.length) return "";
  const ul = document.createElement("ul");
  ul.style.paddingLeft = "18px";
  ul.style.margin = 0;
  items.forEach((t) => {
    const li = document.createElement("li");
    li.className = "error-li";
    li.textContent = t;
    ul.appendChild(li);
  });
  return ul.outerHTML;
}

// Validaciones
function validarNombre(v) {
  return reNombre.test((v ?? "").trim());
}
function validarApellido(v) {
  return reApellido.test((v ?? "").trim());
}
function validarDocumento(v) {
  const s = (v ?? "").trim();
  return reDocumento.test(s) && Number.isFinite(Number(s));
}

// Valida todo el formulario
function validarFormulario() {
  clearFieldErrors(cont);
  const filas = $$(".fila", cont);
  const erroresResumen = [];
  let okGlobal = true;

  filas.forEach((row, idx) => {
    const inNombre = row.querySelector('input[name="nombre[]"]');
    const inApellido = row.querySelector('input[name="apellido[]"]');
    const inDocumento = row.querySelector('input[name="documento[]"]');

    const nombre = inNombre?.value ?? "";
    const apellido = inApellido?.value ?? "";
    const documento = inDocumento?.value ?? "";

    let okFila = true;
    const msgs = [];

    if (!validarNombre(nombre)) {
      okFila = false;
      msgs.push("Nombre inválido");
      markError(inNombre);
    }
    if (!validarApellido(apellido)) {
      okFila = false;
      msgs.push("Apellido inválido");
      markError(inApellido);
    }
    if (!validarDocumento(documento)) {
      okFila = false;
      msgs.push("Documento inválido (7 u 8 dígitos)");
      markError(inDocumento);
    }

    if (!okFila) {
      okGlobal = false;
      erroresResumen.push(`Fila ${idx + 1}: ${msgs.join(", ")}`);
    }
  });

  return { ok: okGlobal, erroresResumen };
}

/* ===========================
   MODAL DE RESUMEN
=========================== */
openBtn.addEventListener("click", () => {
  const { ok, erroresResumen } = validarFormulario();

  if (!ok) {
    const html = `
      <div>
        Se encontraron problemas en estos campos:
        ${crearListaErrores(erroresResumen)}
      </div>`;
    errorMsg.innerHTML = html;
    errorDlg.showModal();

    const firstErr = $(".input-error", cont);
    if (firstErr) firstErr.focus();
    return;
  }

  // Construir resumen
  const filas = $$(".fila", cont);
  const personas = filas.map((f, i) => {
    const nombre = f.querySelector('input[name="nombre[]"]').value.trim();
    const apellido = f.querySelector('input[name="apellido[]"]').value.trim();
    const documento = f.querySelector('input[name="documento[]"]').value.trim();
    return `${i + 1}. ${nombre} ${apellido} - DNI ${documento}`;
  });

  const total = (curso?.precio ?? 0) * personas.length;

  dlgMsg.innerHTML = `
    <h4>${curso?.titulo ?? "Curso"}</h4>
    <p><strong>Personas inscritas:</strong></p>
    <ul>${personas.map((p) => `<li>${p}</li>`).join("")}</ul>
    <p><strong>Total a pagar:</strong> $${total} USD</p>
  `;

  confirmDlg.showModal();
});

// Confirmar inscripción → redirigir al carrito
confirmBtn.addEventListener("click", () => {
  confirmDlg.close();

  // --- LÓGICA PARA AGREGAR AL CARRITO ---
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioSesionIniciada"));
  if (!usuarioActivo) {
    alert("Debes iniciar sesión para agregar cursos al carrito.");
    window.location.href = "../index.html";
    return;
  }

  const filas = $$(".fila", cont);
  const cantidad = filas.length;

  if (curso && cantidad > 0) {
    const carritoKey = `carrito_${usuarioActivo.usuario}`;
    let carrito = JSON.parse(localStorage.getItem(carritoKey)) || [];

    // Buscar si el curso ya está en el carrito
    let cursoEnCarrito = carrito.find(item => item.id === curso.id && item.tipo === 'curso');

    if (cursoEnCarrito) {
      // Si ya está, sumar la nueva cantidad
      cursoEnCarrito.cantidad += cantidad;
    } else {
      // Si no está, agregarlo como un nuevo item
      carrito.push({
        id: curso.id,
        nombre: curso.titulo,
        precio: curso.precio,
        cantidad: cantidad,
        tipo: 'curso' // Para diferenciar de giftcards
      });
    }
    localStorage.setItem(carritoKey, JSON.stringify(carrito));
  }
  window.location.href = "../html/carrito.html";
});
