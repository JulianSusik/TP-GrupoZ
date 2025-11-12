document.addEventListener('DOMContentLoaded', () => {
    // Referencias a la preview
    const card      = document.getElementById('card');
    const cardName  = document.getElementById('cardName');
    const amountTxt = document.getElementById('amountText');
    const badge     = document.getElementById('amountBadge');

  
    // Controles
    const nameInput = document.getElementById('nombre');
    const colorRadios = document.querySelectorAll('input[name="color"]');
    const sizeRadios  = document.querySelectorAll('input[name="size"]');
    const montoInput  = document.getElementById('monto');
    const bgRadios    = document.querySelectorAll('input[name="bg"]');
    const posRadios   = document.querySelectorAll('input[name="pos"]');
  
    /* 1) Nombre / título (se refleja en la h2 de la preview) */
    if (nameInput && cardName) {
      const updateName = () => {
        const v = nameInput.value.trim();
        cardName.textContent = v || 'Destinatario';
      };
      nameInput.addEventListener('input', updateName);
      updateName(); // inicial
    }
  
    /* 2) Color del nombre */
    const applyNameColor = (val) => {
      // Si tu CSS ya usa var(--name-color) en .card-name, setea la variable:
      // card.style.setProperty('--name-color', val);
      // Para asegurar compatibilidad, también seteo el color directo:
      cardName.style.color = val;
    };
    colorRadios.forEach(r => {
      r.addEventListener('change', () => r.checked && applyNameColor(r.value));
      if (r.checked) applyNameColor(r.value);
    });
  
    /* 3) Tamaño de fuente del nombre */
    const applyNameSize = (px) => {
      // Si usas var(--name-size) en CSS, podrías setearla:
      // card.style.setProperty('--name-size', px + 'px');
      cardName.style.fontSize = px + 'px';
      cardName.style.lineHeight = '1.1';
      cardName.style.fontWeight = '800';
    };
    sizeRadios.forEach(r => {
      r.addEventListener('change', () => r.checked && applyNameSize(parseInt(r.value, 10)));
      if (r.checked) applyNameSize(parseInt(r.value, 10));
    });
  
    /* 4) Monto (formatea y muestra/oculta el badge si está vacío) */
    const updateAmount = () => {
      const raw = montoInput.value;
      if (raw === '' || Number(raw) < 0) {
        amountTxt.textContent = '$0.-';
        badge.style.display = 'none';
        return;
      }
      const n = Math.floor(Math.abs(Number(raw))); // entero positivo
      // formateo básico estilo $12.345.-
      const formatted = n.toLocaleString('es-AR');
      amountTxt.textContent = `$${formatted}.-`;
      badge.style.display = '';
    };
    montoInput.addEventListener('input', updateAmount);
    updateAmount(); // inicial
  
    /* 5) Fondo (solid / gradient / pattern / photo) */
    const resetBgClasses = () => {
      card.classList.remove('bg-gradient', 'bg-pattern', 'bg-photo');
    };
    const applyBg = (value) => {
      resetBgClasses();
      if (value === 'gradient') card.classList.add('bg-gradient');
      else if (value === 'pattern') card.classList.add('bg-pattern');
      else if (value === 'photo') card.classList.add('bg-photo');
      // 'solid' queda con el fondo por defecto de .card
    };
    bgRadios.forEach(r => {
      r.addEventListener('change', () => r.checked && applyBg(r.value));
      if (r.checked) applyBg(r.value);
    });

    /* 6) Posición del monto */
    const applyBadgePosition = (posValue) => {
      card.dataset.pos = posValue;
    };

    posRadios.forEach(r => {
      r.addEventListener('change', () => r.checked && applyBadgePosition(r.value));
      if (r.checked) applyBadgePosition(r.value); // Aplica la posición inicial
    });
  });
  
// VALIDAR CAMPOS COMPLETOS ANTES DE AGREGAR GIFTCARD 
const openBtn   = document.getElementById('openModalBtn');
const errorDlg  = document.getElementById('errorDlg');
const errorMsg  = document.getElementById('errorMsg');
const confirmBtn= document.getElementById('confirmBtn');
const confirmDlg= document.getElementById('confirmDlg');
const form      = document.getElementById('giftcardForm'); // Referencia al nuevo formulario

openBtn.addEventListener('click', () => {
    const campoName = document.getElementById("nombre");
    const campoMonto = document.getElementById("monto");

    if (campoName.value.trim() === "" || campoMonto.value.trim() === "" || parseFloat(campoMonto.value) <= 0) {
      // Mostrar modal de ERRORES si el nombre está vacío o el monto es inválido
      const html = `
        <div>
          Por favor, ingresa un destinatario y un monto válido mayor a cero.
        </div>`;
      errorMsg.innerHTML = html;
      errorDlg.showModal();
    } else {
      // Si todo está OK, abrimos el modal de confirmación
      confirmDlg.showModal(); 
    }
  });

/* ===================================================
   AGREGAR AL CARRITO (AHORA CONECTADO AL BOTÓN CORRECTO)
=================================================== */
if (confirmBtn) {
  confirmBtn.addEventListener("click", () => {
    // 1. Obtener el usuario activo
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioSesionIniciada"));
    if (!usuarioActivo) {
      alert("Debes iniciar sesión para agregar giftcards al carrito.");
      window.location.href = "../index.html";
      return;
    }

    // 2. Obtener los datos de la giftcard desde los campos del formulario
    const nombreDestinatario = document.getElementById("nombre").value.trim() || "Destinatario";
    const monto = parseFloat(document.getElementById("monto").value) || 0;

    const carritoKey = `carrito_${usuarioActivo.usuario}`;
    let carrito = JSON.parse(localStorage.getItem(carritoKey)) || [];

    // 3. Crear y añadir el objeto de la giftcard
    carrito.push({
      id: `gift-${Date.now()}`, // ID único para la giftcard
      nombre: `Gift Card para ${nombreDestinatario}`,
      precio: monto,
      cantidad: 1,
      tipo: 'giftcard' // Tipo para diferenciar de los cursos
    });

    // 4. Guardar en localStorage y redirigir
    localStorage.setItem(carritoKey, JSON.stringify(carrito));
    window.location.href = 'carrito.html';
  });
}
