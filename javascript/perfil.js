
// =========================
// Cargar datos del usuario
// =========================
const usuarioSesion = JSON.parse(localStorage.getItem("usuarioSesionIniciada"));
let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

if (!usuarioSesion) {
  alert("Debe iniciar sesión primero");
  window.location.href = "../index.html";
}

// Buscar el usuario en la base
const usuarioLogueado = usuarios.find(
  (u) => u.usuario === usuarioSesion.usuario
);

// =========================
// Referencias del DOM
// =========================
const nombre = document.getElementById("nombre");
const apellido = document.getElementById("apellido");
const usuario = document.getElementById("usuario");
const email = document.getElementById("email");
const contrasenia = document.getElementById("contrasenia");
const nuevaContrasenia = document.getElementById("ingresar-contrasenia");
const repetirContrasenia = document.getElementById("repetir-contrasenia");

const metodoTarjeta = document.getElementById("tarjeta");
const metodoCupon = document.getElementById("cupon");
const metodoTransferencia = document.getElementById("transferencia");

const numeroTarjeta = document.getElementById("numeroTarjeta");
const codigoSeguridad = document.getElementById("codigoSeguridad");

const pagoFacil = document.getElementById("pago-facil");
const rapipago = document.getElementById("rapipago");

const form = document.querySelector(".perfil-form");

// Historial
const historialContainer = document.getElementById("historial-container");

// =========================
// Cargar datos en pantalla
// =========================
document.getElementById("nombre-usuario").textContent = usuarioLogueado.usuario;

nombre.value = usuarioLogueado.nombre;
apellido.value = usuarioLogueado.apellido;
usuario.value = usuarioLogueado.usuario;
email.value = usuarioLogueado.email;
contrasenia.value = usuarioLogueado.contrasenia;

// Cargar datos de tarjeta si existen
numeroTarjeta.value = usuarioLogueado.numeroTarjeta || "";
codigoSeguridad.value = usuarioLogueado.codigoSeguridad || "";

// =========================
// Cargar método de pago
// =========================
function cargarMetodoPago() {
  const mp = usuarioLogueado.metodoPago || "";

  pagoFacil.checked = false;
  rapipago.checked = false;

  if (mp.startsWith("tarjeta")) {
    metodoTarjeta.checked = true;
    // numeroTarjeta.value = usuarioLogueado.numeroTarjeta || "";
    // codigoSeguridad.value = usuarioLogueado.codigoSeguridad || "";
    // Dejamos los campos VACÍOS para ingresar tarjeta nueva
    numeroTarjeta.value = "";
    codigoSeguridad.value = "";
    mostrarCamposTarjeta(true);
    mostrarCupon(false);
  }

  if (mp.startsWith("cupón")) {
    metodoCupon.checked = true;
    mostrarCamposTarjeta(false);
    mostrarCupon(true);

    if (mp.includes("pago fácil")) pagoFacil.checked = true;
    if (mp.includes("rapipago")) rapipago.checked = true;
  }

  if (mp === "transferencia") {
    metodoTransferencia.checked = true;
    mostrarCamposTarjeta(false);
    mostrarCupon(false);
  }
}

cargarMetodoPago();

// =========================
// Mostrar/Ocultar según método
// =========================
function mostrarCamposTarjeta(mostrar) {
  numeroTarjeta.parentElement.style.display = mostrar ? "block" : "none";
  codigoSeguridad.parentElement.style.display = mostrar ? "block" : "none";
}

function mostrarCupon(mostrar) {
  pagoFacil.parentElement.style.display = mostrar ? "inline-block" : "none";
  rapipago.parentElement.style.display = mostrar ? "inline-block" : "none";
}

metodoTarjeta.addEventListener("change", () => {
  mostrarCamposTarjeta(true);
  mostrarCupon(false);
});

metodoCupon.addEventListener("change", () => {
  mostrarCamposTarjeta(false);
  mostrarCupon(true);
});

metodoTransferencia.addEventListener("change", () => {
  mostrarCamposTarjeta(false);
  mostrarCupon(false);
});

// =========================
// GUARDAR CAMBIOS
// =========================
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Validación contraseña
  if (nuevaContrasenia.value || repetirContrasenia.value) {
    if (nuevaContrasenia.value !== repetirContrasenia.value) {
      return alert("Las contraseñas no coinciden");
    }
    usuarioLogueado.contrasenia = nuevaContrasenia.value;
  }

  // Datos básicos
  usuarioLogueado.nombre = nombre.value;
  usuarioLogueado.apellido = apellido.value;
  usuarioLogueado.email = email.value;

  // ====== GUARDAR MÉTODO DE PAGO ====== (OPCIONAL)
  let metodoFinal = "";

  if (metodoTarjeta.checked) {
    // if (!numeroTarjeta.value || !codigoSeguridad.value) {
    //   return alert("Debe ingresar número de tarjeta y código de seguridad.");
    // }

    metodoFinal = "tarjeta";
    usuarioLogueado.numeroTarjeta = numeroTarjeta.value;
    usuarioLogueado.codigoSeguridad = codigoSeguridad.value;
  }

  if (metodoCupon.checked) {
    let opciones = [];
    if (pagoFacil.checked) opciones.push("pago fácil");
    if (rapipago.checked) opciones.push("rapipago");

    // if (opciones.length === 0) {
    //   return alert(
    //     "Debe seleccionar un cupón de pago (Rapipago o Pago Fácil)."
    //   );
    // }

    metodoFinal =
      "cupón" + (opciones.length ? " - " + opciones.join(", ") : "");
  }

  if (metodoTransferencia.checked) {
    metodoFinal = "transferencia";
  }

  usuarioLogueado.metodoPago = metodoFinal;

  // Guardado
  const index = usuarios.findIndex(
    (u) => u.usuario === usuarioLogueado.usuario
  );
  usuarios[index] = usuarioLogueado;

  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  localStorage.setItem(
    "usuarioSesionIniciada",
    JSON.stringify(usuarioLogueado)
  );

  alert("Cambios guardados correctamente.");
});

// =========================
// MOSTRAR HISTORIAL DE COMPRAS
// =========================
function cargarHistorial() {
  const historialKey = `historial_${usuarioSesion.usuario}`;
  const historial = JSON.parse(localStorage.getItem(historialKey)) || [];

  if (historial.length === 0) {
    historialContainer.innerHTML = `<p>Aún no has realizado ninguna compra.</p>`;
    return;
  }

  let html = "";

  historial
    .slice()
    .reverse()
    .forEach((compra) => {
      html += `
        <div class="compra-record">
          <div class="compra-header">
            <h4>Compra realizada el ${compra.fecha}</h4>
            <span>Total: $${compra.total}</span>
          </div>
          <ul class="compra-items">
      `;

      compra.items.forEach((item) => {
        html += `<li>${item.cantidad}x ${item.nombre}</li>`;
      });

      html += `
          </ul>
        </div>
      `;
    });

  historialContainer.innerHTML = html;
}

cargarHistorial();

// =========================
// ELIMINAR CUENTA
// =========================
document.getElementById("btn-eliminar").addEventListener("click", () => {
  if (!confirm("¿Seguro que desea eliminar su cuenta?")) return;

  usuarios = usuarios.filter((u) => u.usuario !== usuarioLogueado.usuario);

  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  localStorage.removeItem("usuarioSesionIniciada");

  // También borramos historial
  localStorage.removeItem(`historial_${usuarioLogueado.usuario}`);

  alert("Cuenta eliminada correctamente.");
  window.location.href = "../index.html";
});
