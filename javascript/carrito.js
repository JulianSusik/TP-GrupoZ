// 🛒 carrito.js
document.addEventListener("DOMContentLoaded", () => {
  const contadorCarrito = document.querySelector(".contador");
  const contenedor = document.getElementById("carrito-contenedor");

  // 🔹 Leer el usuario que inició sesión (usamos la misma clave que en login.js)
  const usuarioActivo = JSON.parse(localStorage.getItem("usuarioSesionIniciada"));

  // 🧩 Si hay contador en el header, actualizar su número
  if (contadorCarrito) {
    if (usuarioActivo) {
      const carrito = JSON.parse(localStorage.getItem(`carrito_${usuarioActivo.usuario}`));
      contadorCarrito.textContent = carrito && carrito.length > 0 ? carrito.length : "0";
    } else {
      contadorCarrito.textContent = "0";
    }
  }

  // 📄 Si estamos en carrito.html, mostrar los productos
  if (contenedor) {
    if (!usuarioActivo) {
      contenedor.innerHTML = "<p>Debes iniciar sesión para ver tu carrito.</p>";
      return;
    }

    const carrito = JSON.parse(localStorage.getItem(`carrito_${usuarioActivo.usuario}`)) || [];

    if (carrito.length === 0) {
      contenedor.innerHTML = "<p>Tu carrito está vacío 🛒</p>";
      return;
    }

    // 🧾 Crear tabla dinámica con los productos
    let total = 0;
    let html = `
      <table>
        <tr>
          <th>Producto</th>
          <th>Cantidad</th>
          <th>Precio</th>
        </tr>
    `;

    carrito.forEach(item => {
      total += item.precio * item.cantidad;
      html += `
        <tr>
          <td>${item.nombre}</td>
          <td>${item.cantidad}</td>
          <td>$${item.precio * item.cantidad}</td>
        </tr>
      `;
    });

    html += `
        <tr>
          <td colspan="2" class="total">Total:</td>
          <td><strong>$${total}</strong></td>
        </tr>
      </table>
    `;

    contenedor.innerHTML = html;
  }
});
