// document.addEventListener("DOMContentLoaded", () => {
//   // Recuperamos la sesión guardada
//   const usuarioSesion = JSON.parse(
//     localStorage.getItem("usuarioSesionIniciada")
//   );

//   if (!usuarioSesion) {
//     // Si no hay sesión activa, redirige al login
//     alert("Debes iniciar sesión para acceder al perfil.");
//     window.location.href = "../index.html";
//     return;
//   }

//   // Mostrar nombre en la cabecera del perfil
//   const nombreUsuario = document.getElementById("nombre-usuario");
//   if (nombreUsuario) {
//     // Muestra nombre y apellido si existen, si no, el usuario
//     const nombreCompleto = (usuarioSesion.nombre && usuarioSesion.apellido)
//       ? `${usuarioSesion.nombre} ${usuarioSesion.apellido}`
//       : usuarioSesion.usuario;
//     nombreUsuario.textContent = nombreCompleto || "Usuario";
//   }

//   // Mostrar datos en los inputs
//   document.getElementById("nombre").value = usuarioSesion.nombre || "";
//   document.getElementById("apellido").value = usuarioSesion.apellido || "";
//   document.getElementById("usuario").value = usuarioSesion.usuario || "";
//   document.getElementById("email").value = usuarioSesion.email || "";

//   document.getElementById("contrasenia").value =
//     usuarioSesion.contrasenia || "";

//   // Cargar datos de tarjeta desde la sesión o desde la lista de usuarios si no están en la sesión
//   let numeroTarjeta = usuarioSesion.numeroTarjeta || "";
//   let codTarjeta = usuarioSesion.codTarjeta || "";

//   if (!numeroTarjeta || !codTarjeta) {
//     const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
//     const usuarioGuardado = usuarios.find(u => u.usuario === usuarioSesion.usuario);
//     if (usuarioGuardado) {
//       numeroTarjeta = usuarioGuardado.numeroTarjeta || "";
//       codTarjeta = usuarioGuardado.codTarjeta || "";
//       // Actualizar la sesión con los datos cargados
//       usuarioSesion.numeroTarjeta = numeroTarjeta;
//       usuarioSesion.codTarjeta = codTarjeta;
//       localStorage.setItem("usuarioSesionIniciada", JSON.stringify(usuarioSesion));
//     }
//   }

//   document.getElementById("numeroTarjeta").value = numeroTarjeta;
//   // NUEVO: Asignar valor al campo del código de seguridad
//   const codTarjetaInput = document.getElementById("codTarjeta");
//   if (codTarjetaInput) codTarjetaInput.value = codTarjeta;

//   // ✅ Cerrar sesión correctamente
//   const btnCerrar = document.querySelector(".btn-cerrar");
//   btnCerrar.addEventListener("click", (e) => {
//     e.preventDefault();
//     localStorage.removeItem("usuarioSesionIniciada");
//     alert("Sesión cerrada correctamente.");
//     window.location.href = "../index.html";
//   });

//   // ✅ Guardar cambios (si querés permitir modificar datos)
//   const form = document.querySelector(".perfil-form");
//   form.addEventListener("submit", (e) => {
//     e.preventDefault();

//     const nuevoNombre = document.getElementById("nombre").value.trim();
//     const nuevoApellido = document.getElementById("apellido").value.trim();
//     const nuevoEmail = document.getElementById("email").value.trim();
//     const nuevaPass = document
//       .getElementById("ingresar-contrasenia")
//       .value.trim();
//     const repetirPass = document
//       .getElementById("repetir-contrasenia")
//       .value.trim();

//     if (nuevaPass && nuevaPass !== repetirPass) {
//       alert("Las contraseñas no coinciden.");
//       return;
//     }

//     // Actualiza los datos del usuario en localStorage
//     usuarioSesion.nombre = nuevoNombre;
//     usuarioSesion.apellido = nuevoApellido;
//     usuarioSesion.email = nuevoEmail;
//     if (nuevaPass) usuarioSesion.contrasenia = nuevaPass;
//     usuarioSesion.numeroTarjeta = document.getElementById("numeroTarjeta").value.trim();
//     const nuevoCodTarjeta = document.getElementById("codTarjeta").value.trim();

//     // Validar que el código de seguridad tenga 3 o 4 dígitos si se proporciona
//     const reCvv = /^\d{3,4}$/;
//     if (nuevoCodTarjeta && !reCvv.test(nuevoCodTarjeta)) {
//       alert("El código de seguridad debe tener 3 o 4 dígitos numéricos.");
//       return; // Detener el proceso de guardado
//     }
//     usuarioSesion.codTarjeta = nuevoCodTarjeta;

//     // Actualizar también en la lista de usuarios
//     let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
//     const usuarioIndex = usuarios.findIndex(u => u.usuario === usuarioSesion.usuario);
//     if (usuarioIndex !== -1) {
//       usuarios[usuarioIndex] = { ...usuarios[usuarioIndex], ...usuarioSesion };
//       localStorage.setItem("usuarios", JSON.stringify(usuarios));
//     }

//     localStorage.setItem(
//       "usuarioSesionIniciada",
//       JSON.stringify(usuarioSesion)
//     );
//     alert("Datos actualizados correctamente.");
//   });

//   // ✅ Eliminar cuenta
//   const btnEliminar = document.getElementById("btn-eliminar");
//   btnEliminar.addEventListener("click", () => {
//     const confirmacion = confirm(
//       "¿Seguro que querés eliminar tu cuenta? Esta acción no se puede deshacer."
//     );

//     if (confirmacion) {
//       // Obtener todos los usuarios
//       let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

//       // Filtrar para eliminar el usuario actual
//       const usuarioActual = usuarioSesion.usuario;
//       usuarios = usuarios.filter((u) => u.usuario !== usuarioActual);

//       // Guardar lista actualizada
//       localStorage.setItem("usuarios", JSON.stringify(usuarios));

//       // Borrar sesión actual
//       localStorage.removeItem("usuarioSesionIniciada");

//       alert("Tu cuenta ha sido eliminada correctamente.");
//       window.location.href = "../index.html";
//     }
//   });

//   // --- NUEVO: Cargar y mostrar historial de compras ---
//   const historialContainer = document.getElementById("historial-container");
//   if (historialContainer && usuarioSesion) {
//     const historialKey = `historial_${usuarioSesion.usuario}`;
//     const historial = JSON.parse(localStorage.getItem(historialKey)) || [];

//     if (historial.length === 0) {
//       historialContainer.innerHTML = "<p>Aún no has realizado ninguna compra.</p>";
//     } else {
//       let historialHtml = "";
//       // Mostramos las compras de la más reciente a la más antigua
//       historial.slice().reverse().forEach((compra, index) => {
//         historialHtml += `
//           <div class="compra-record">
//             <div class="compra-header">
//               <h4>Compra realizada el ${compra.fecha}</h4>
//               <span>Total: $${compra.total}</span>
//             </div>
//             <ul class="compra-items">
//         `;

//         compra.items.forEach(item => {
//           historialHtml += `<li>${item.cantidad}x ${item.nombre}</li>`;
//         });

//         historialHtml += `
//             </ul>
//           </div>
//         `;
//       });
//       historialContainer.innerHTML = historialHtml;
//     }
//   }
// });

// document.addEventListener("DOMContentLoaded", () => {
//   // Recuperamos la sesión guardada
//   const usuarioSesion = JSON.parse(
//     localStorage.getItem("usuarioSesionIniciada")
//   );

//   if (!usuarioSesion) {
//     alert("Debes iniciar sesión para acceder al perfil.");
//     window.location.href = "../index.html";
//     return;
//   }

//   // Mostrar nombre en la cabecera del perfil
//   const nombreUsuario = document.getElementById("nombre-usuario");
//   if (nombreUsuario) {
//     const nombreCompleto =
//       usuarioSesion.nombre && usuarioSesion.apellido
//         ? `${usuarioSesion.nombre} ${usuarioSesion.apellido}`
//         : usuarioSesion.usuario;
//     nombreUsuario.textContent = nombreCompleto || "Usuario";
//   }

//   // Mostrar datos en los inputs
//   document.getElementById("nombre").value = usuarioSesion.nombre || "";
//   document.getElementById("apellido").value = usuarioSesion.apellido || "";
//   document.getElementById("usuario").value = usuarioSesion.usuario || "";
//   document.getElementById("email").value = usuarioSesion.email || "";

//   document.getElementById("contrasenia").value =
//     usuarioSesion.contrasenia || "";

//   // Cargar datos de tarjeta
//   let numeroTarjeta = usuarioSesion.numeroTarjeta || "";
//   let codTarjeta = usuarioSesion.codTarjeta || "";

//   if (!numeroTarjeta || !codTarjeta) {
//     const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
//     const usuarioGuardado = usuarios.find(
//       (u) => u.usuario === usuarioSesion.usuario
//     );
//     if (usuarioGuardado) {
//       numeroTarjeta = usuarioGuardado.numeroTarjeta || "";
//       codTarjeta = usuarioGuardado.codTarjeta || "";
//       usuarioSesion.numeroTarjeta = numeroTarjeta;
//       usuarioSesion.codTarjeta = codTarjeta;
//       localStorage.setItem(
//         "usuarioSesionIniciada",
//         JSON.stringify(usuarioSesion)
//       );
//     }
//   }

//   document.getElementById("numeroTarjeta").value = numeroTarjeta;
//   const codTarjetaInput = document.getElementById("codTarjeta");
//   if (codTarjetaInput) codTarjetaInput.value = codTarjeta;

//   // ================================
//   //   GUARDAR CAMBIOS DEL PERFIL
//   // ================================
//   const form = document.querySelector(".perfil-form");
//   form.addEventListener("submit", (e) => {
//     e.preventDefault();

//     const nuevoNombre = document.getElementById("nombre").value.trim();
//     const nuevoApellido = document.getElementById("apellido").value.trim();
//     const nuevoEmail = document.getElementById("email").value.trim();
//     const nuevaPass = document
//       .getElementById("ingresar-contrasenia")
//       .value.trim();
//     const repetirPass = document
//       .getElementById("repetir-contrasenia")
//       .value.trim();

//     if (nuevaPass && nuevaPass !== repetirPass) {
//       alert("Las contraseñas no coinciden.");
//       return;
//     }

//     // Guardar datos básicos
//     usuarioSesion.nombre = nuevoNombre;
//     usuarioSesion.apellido = nuevoApellido;
//     usuarioSesion.email = nuevoEmail;
//     if (nuevaPass) usuarioSesion.contrasenia = nuevaPass;

//     usuarioSesion.numeroTarjeta = document
//       .getElementById("numeroTarjeta")
//       .value.trim();

//     const nuevoCodTarjeta = document.getElementById("codTarjeta").value.trim();

//     const reCvv = /^\d{3,4}$/;
//     if (nuevoCodTarjeta && !reCvv.test(nuevoCodTarjeta)) {
//       alert("El código de seguridad debe tener 3 o 4 dígitos numéricos.");
//       return;
//     }
//     usuarioSesion.codTarjeta = nuevoCodTarjeta;

//     // ================================
//     //   NUEVO: GUARDAR LA FORMA DE PAGO
//     // ================================
//     const metodoPagoSeleccionado = document.querySelector(
//       'input[name="metodoPago"]:checked'
//     );

//     const pagoFacilCheckbox = document.getElementById("pago-facil");
//     const rapipagoCheckbox = document.getElementById("rapipago");

//     let formaPago = "";

//     if (metodoPagoSeleccionado) {
//       formaPago = metodoPagoSeleccionado.value;
//     } else {
//       let opciones = [];
//       if (pagoFacilCheckbox.checked) opciones.push("pago-facil");
//       if (rapipagoCheckbox.checked) opciones.push("rapipago");
//       formaPago = opciones.join(", ");
//     }

//     usuarioSesion.formaPago = formaPago;

//     // ================================
//     //   ACTUALIZAR LISTA DE USUARIOS
//     // ================================
//     let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
//     const usuarioIndex = usuarios.findIndex(
//       (u) => u.usuario === usuarioSesion.usuario
//     );

//     if (usuarioIndex !== -1) {
//       usuarios[usuarioIndex] = {
//         ...usuarios[usuarioIndex],
//         ...usuarioSesion,
//         formaPago: formaPago,
//       };
//       localStorage.setItem("usuarios", JSON.stringify(usuarios));
//     }

//     // Guardar sesión actualizada
//     localStorage.setItem(
//       "usuarioSesionIniciada",
//       JSON.stringify(usuarioSesion)
//     );

//     alert("Datos actualizados correctamente.");
//   });

//   // ================================
//   // CERRAR SESIÓN
//   // ================================
//   const btnCerrar = document.querySelector(".btn-cerrar");
//   btnCerrar.addEventListener("click", (e) => {
//     e.preventDefault();
//     localStorage.removeItem("usuarioSesionIniciada");
//     alert("Sesión cerrada correctamente.");
//     window.location.href = "../index.html";
//   });

//   // ================================
//   // ELIMINAR CUENTA
//   // ================================
//   const btnEliminar = document.getElementById("btn-eliminar");
//   btnEliminar.addEventListener("click", () => {
//     const confirmacion = confirm(
//       "¿Seguro que querés eliminar tu cuenta? Esta acción no se puede deshacer."
//     );

//     if (confirmacion) {
//       let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
//       usuarios = usuarios.filter((u) => u.usuario !== usuarioSesion.usuario);

//       localStorage.setItem("usuarios", JSON.stringify(usuarios));
//       localStorage.removeItem("usuarioSesionIniciada");

//       alert("Tu cuenta ha sido eliminada correctamente.");
//       window.location.href = "../index.html";
//     }
//   });

//   // --------------------------------------------------------
//   //   HISTORIAL DE COMPRAS
//   // --------------------------------------------------------
//   const historialContainer = document.getElementById("historial-container");
//   if (historialContainer && usuarioSesion) {
//     const historialKey = `historial_${usuarioSesion.usuario}`;
//     const historial = JSON.parse(localStorage.getItem(historialKey)) || [];

//     if (historial.length === 0) {
//       historialContainer.innerHTML =
//         "<p>Aún no has realizado ninguna compra.</p>";
//     } else {
//       let historialHtml = "";

//       historial
//         .slice()
//         .reverse()
//         .forEach((compra) => {
//           historialHtml += `
//           <div class="compra-record">
//             <div class="compra-header">
//               <h4>Compra realizada el ${compra.fecha}</h4>
//               <span>Total: $${compra.total}</span>
//             </div>
//             <ul class="compra-items">
//         `;

//           compra.items.forEach((item) => {
//             historialHtml += `<li>${item.cantidad}x ${item.nombre}</li>`;
//           });

//           historialHtml += `
//             </ul>
//           </div>
//         `;
//         });

//       historialContainer.innerHTML = historialHtml;
//     }
//   }
// });

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
