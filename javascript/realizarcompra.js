document.addEventListener("DOMContentLoaded", () => {
  // Cargar datos de tarjeta del usuario si están guardados
  const usuarioSesion = JSON.parse(localStorage.getItem("usuarioSesionIniciada"));
  if (usuarioSesion) {
    const numeroTarjetaInput = document.getElementById("numeroTarjeta");
    const codTarjetaInput = document.getElementById("codTarjeta");

    if (numeroTarjetaInput && usuarioSesion.numeroTarjeta) {
      numeroTarjetaInput.value = usuarioSesion.numeroTarjeta;
    }
    if (codTarjetaInput && usuarioSesion.codigoSeguridad) {
  codTarjetaInput.value = usuarioSesion.codigoSeguridad;
}

    // 🔹 Cargar método de pago guardado (NUEVO BLOQUE)
    if (usuarioSesion.metodoPago) {
      const metodo = usuarioSesion.metodoPago;

      if (metodo === "tarjeta") {
        document.getElementById("tarjeta").checked = true;
      }

      if (metodo.startsWith("cupón")) {
        document.getElementById("cupon").checked = true;

        if (metodo.includes("pago fácil")) {
          document.getElementById("pago-facil").checked = true;
        }

        if (metodo.includes("rapipago")) {
          document.getElementById("rapipago").checked = true;
        }
      }

      if (metodo === "transferencia") {
        document.getElementById("transferencia").checked = true;
      }

      // 🔹 Disparar la visibilidad correcta
      // Si el método es 'cupón-rapipago', el valor del input es solo 'cupon'
      const normalizado = metodo.startsWith("cupón") ? "cupon" : metodo;
      document.querySelector(`input[value="${normalizado}"]`)
        ?.dispatchEvent(new Event("change"));
    }
  }

  const form = document.querySelector(".form-section");
  const btnConfirmar = document.getElementById("btn-confirmar-compra");

  // Modales
  const errorDlg = document.getElementById("errorDlg");
  const errorMsg = document.getElementById("errorMsg");
  const felicitacionDlg = document.getElementById("felicitacionDlg");
  const felicitacionMsg = document.getElementById("felicitacionMsg");
  const continuarBtn = document.getElementById("continuarBtn");

  // Inputs específicos
  const cuponOpciones = document.querySelectorAll('input[name="tipoCupon"]');

  // Regex
  const reTarjeta = /^\d{16}$/;
  const reCvv = /^\d{3,4}$/; // Corregido para aceptar 3 o 4 dígitos
  const reCbu = /^\d{22}$/;

  function mostrarError(mensajes) {
    errorMsg.innerHTML = `
      <ul>${mensajes.map((msg) => `<li>${msg}</li>`).join("")}</ul>
    `;
    errorDlg.showModal();
  }

  function validarFormulario() {
    const metodoPago = document.querySelector('input[name="metodoPago"]:checked');
    const errores = [];

    if (!metodoPago) {
      errores.push("Por favor, selecciona un método de pago.");
      return errores;
    }

    switch (metodoPago.value) {
      case "tarjeta":
        const numTarjeta = document.getElementById("numeroTarjeta").value.trim();
        const codTarjeta = document.getElementById("codTarjeta").value.trim();
        if (!reTarjeta.test(numTarjeta)) errores.push("Número de tarjeta inválido.");
        if (!reCvv.test(codTarjeta)) errores.push("El CVV debe tener 3 o 4 dígitos.");
        break;

      case "cupon":
        const cuponSeleccionado = document.querySelector('input[name="tipoCupon"]:checked');
        if (!cuponSeleccionado) errores.push("Selecciona un tipo de cupón (Pago Fácil o RapiPago).");
        break;

      case "transferencia":
        const cbu = document.getElementById("cbu").value.trim();
        if (!reCbu.test(cbu)) errores.push("El CBU debe tener 22 dígitos.");
        break;
    }

    return errores;
  }

  // 🔹 Activar/desactivar opciones de cupón según el método de pago elegido
  document.querySelectorAll('input[name="metodoPago"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      const esCupon = e.target.value === "cupon";

      cuponOpciones.forEach((chk) => {
        chk.disabled = !esCupon;
        if (!esCupon) chk.checked = false;
      });
    });
  });

  // Inicialmente desactivar las opciones de cupón
  cuponOpciones.forEach((chk) => (chk.disabled = true));

  // =================================================================
  // 🔹 AHORA, CARGAR DATOS DEL USUARIO (TARJETA Y MÉTODO DE PAGO)
  // =================================================================
  if (usuarioSesion) {
    // Cargar datos de tarjeta
    const numeroTarjetaInput = document.getElementById("numeroTarjeta");
    const codTarjetaInput = document.getElementById("codTarjeta");
    if (numeroTarjetaInput && usuarioSesion.numeroTarjeta) {
      numeroTarjetaInput.value = usuarioSesion.numeroTarjeta;
    }
    if (codTarjetaInput && usuarioSesion.codigoSeguridad) {
      codTarjetaInput.value = usuarioSesion.codigoSeguridad;
    }

    // Cargar método de pago guardado
    if (usuarioSesion.metodoPago) {
      const metodo = usuarioSesion.metodoPago;
      const normalizado = metodo.startsWith("cupón") ? "cupon" : metodo;
      const inputMetodo = document.querySelector(`input[value="${normalizado}"]`);

      if (inputMetodo) {
        inputMetodo.checked = true;
        // Disparamos el 'change' para que se muestren/oculten los campos correctos
        inputMetodo.dispatchEvent(new Event("change"));
      }

      // Si es cupón, marcamos la opción específica (Pago Fácil / Rapipago)
      if (metodo.startsWith("cupón")) {
        if (metodo.includes("pago fácil")) {
          document.getElementById("pago-facil").checked = true;
        }
        if (metodo.includes("rapipago")) {
          document.getElementById("rapipago").checked = true;
        }
      }
    }
  }

  btnConfirmar.addEventListener("click", () => {
    const errores = validarFormulario();

    if (errores.length > 0) {
      mostrarError(errores);
    } else {
      // --- LÓGICA PARA MOSTRAR RESUMEN Y VACIAR CARRITO ---
      const usuarioActivo = JSON.parse(localStorage.getItem("usuarioSesionIniciada"));
      let resumenHtml = '<p>¡Tu compra ha sido procesada con éxito!</p>'; // Mensaje por defecto

      if (usuarioActivo) {
        const carritoKey = `carrito_${usuarioActivo.usuario}`;
        const carrito = JSON.parse(localStorage.getItem(carritoKey)) || [];

        if (carrito.length > 0) {
          let total = 0;
          resumenHtml = "<h4>Resumen de tu compra:</h4><ul>";

          carrito.forEach(item => {
            const subtotal = item.precio * item.cantidad;
            resumenHtml += `<li>${item.cantidad}x ${item.nombre} - $${subtotal}</li>`;
            total += subtotal;
          });

          resumenHtml += `</ul><p class="resumen-total"><strong>Total pagado: $${total}</strong></p>`;

          // --- NUEVO: Guardar en el historial antes de vaciar ---
          const historialKey = `historial_${usuarioActivo.usuario}`;
          let historial = JSON.parse(localStorage.getItem(historialKey)) || [];
          const hoy = new Date().toLocaleDateString();
          
          // Buscamos si ya hay una compra registrada hoy
          let compraDeHoy = historial.find(compra => compra.fecha === hoy);

          if (compraDeHoy) {
            // Si existe, agregamos los nuevos items y sumamos el total
            compraDeHoy.items.push(...carrito);
            compraDeHoy.total += total;
          } else {
            // Si no existe, creamos un nuevo registro para el día
            historial.push({ fecha: hoy, items: carrito, total: total });
          }
          
          localStorage.setItem(historialKey, JSON.stringify(historial));

          // Ahora sí, vaciar el carrito
          localStorage.removeItem(carritoKey);
        }
      }

      felicitacionMsg.innerHTML = resumenHtml;

      felicitacionDlg.showModal();
    }
  });

  continuarBtn.addEventListener("click", () => {
    window.location.href = "perfil.html";
  });
});
