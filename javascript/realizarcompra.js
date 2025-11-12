document.addEventListener("DOMContentLoaded", () => {
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
  const reCvv = /^\d{3}$/;
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
        if (!reCvv.test(codTarjeta)) errores.push("CVV inválido.");
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

  btnConfirmar.addEventListener("click", () => {
    const errores = validarFormulario();

    if (errores.length > 0) {
      mostrarError(errores);
    } else {
      // Simulación de datos del curso
      const curso = JSON.parse(localStorage.getItem("cursoSeleccionado")) || {
        titulo: "Curso sin nombre",
        modalidad: "Online",
        fecha: "No definida",
        precio: 20,
      };

      felicitacionMsg.innerHTML = `
        <p>¡Tu inscripción fue exitosa!</p>
        <p><strong>Curso:</strong> ${curso.titulo}</p>
        <p><strong>Modalidad:</strong> ${curso.modalidad}</p>
        <p><strong>Fecha:</strong> ${curso.fecha}</p>
        <p><strong>Precio:</strong> $${curso.precio} USD</p>
      `;

      felicitacionDlg.showModal();
    }
  });

  continuarBtn.addEventListener("click", () => {
    felicitacionDlg.close();
    window.location.href = form.action;
  });
});
