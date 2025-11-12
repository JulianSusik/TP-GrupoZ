// carrito.js
document.addEventListener("DOMContentLoaded", () => {
  const contadorCarritoEl = document.getElementById("contador");
  const containerCarritoTbody = document.getElementById("containerCarrito");
  const vaciarCarritoBtn = document.getElementById("vaciarCarrito");
  const paginaCarritoContenedor = document.getElementById("carrito-contenedor");

  // 2. FUNCIÓN PARA ACTUALIZAR VISTAS (contador y resumen)
  const actualizarVistasCarrito = () => {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioSesionIniciada"));
    const carrito = (usuarioActivo && JSON.parse(localStorage.getItem(`carrito_${usuarioActivo.usuario}`))) || [];

    // Calcular total de items y precio total
    const totalItems = carrito.reduce((sum, item) => sum + (item.cantidad || 1), 0);
    const precioTotal = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    // Actualizar contador
    if (contadorCarritoEl) {
      contadorCarritoEl.textContent = totalItems;
    }

    // Actualizar contenido del resumen emergente (si existe en la página)
    if (containerCarritoTbody) {
      containerCarritoTbody.innerHTML = ""; // Limpiar antes de llenar
      const totalResumenEl = document.getElementById("carrito-total-resumen");

      if (carrito.length === 0) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="4" style="text-align:center;">Tu carrito está vacío.</td>`;
        containerCarritoTbody.appendChild(tr);
        if (totalResumenEl) totalResumenEl.textContent = "Total: $0";
      } else {
        carrito.forEach(item => {
          const subtotal = item.precio * item.cantidad;
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${item.nombre}</td>
            <td>${item.cantidad}</td>
            <td>$${item.precio * item.cantidad}</td>
            <td><button class="btn-eliminar-item" data-id="${item.id}" data-tipo="${item.tipo}" title="Eliminar item">X</button></td>
          `;
          containerCarritoTbody.appendChild(tr);
        });

        // Actualizar el total en el pie de la tabla
        if (totalResumenEl) totalResumenEl.textContent = `Total: $${precioTotal}`;
      }
    }
  };

  // --- NUEVA FUNCIÓN PARA ELIMINAR UN ITEM ---
  const eliminarItemDelCarrito = (id, tipo) => {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioSesionIniciada"));
    if (!usuarioActivo) return;

    const carritoKey = `carrito_${usuarioActivo.usuario}`;
    let carrito = JSON.parse(localStorage.getItem(carritoKey)) || [];

    // Buscamos el item en el carrito
    const itemIndex = carrito.findIndex(item => item.id == id && item.tipo === tipo);

    if (itemIndex > -1) {
      // Si el item existe, reducimos su cantidad
      carrito[itemIndex].cantidad--;

      // Si la cantidad llega a 0, lo eliminamos del array
      if (carrito[itemIndex].cantidad <= 0) {
        carrito.splice(itemIndex, 1);
      }

      // Guardamos el carrito actualizado en localStorage
      localStorage.setItem(carritoKey, JSON.stringify(carrito));

      // Actualizamos todas las vistas
      actualizarVistasCarrito();
       // Redirigir a carrito.html después de eliminar el item
       window.location.href = 'carrito.html';

    }
  };

  // --- NUEVO EVENT LISTENER DELEGADO PARA ELIMINAR ---
  document.addEventListener('click', (e) => {
    if (e.target.matches('.btn-eliminar-item')) {
      const id = e.target.dataset.id;
      const tipo = e.target.dataset.tipo;
      eliminarItemDelCarrito(id, tipo);
    }
  });

  // 3. EVENTO PARA VACIAR CARRITO
  if (vaciarCarritoBtn) {
    vaciarCarritoBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const usuarioActivo = JSON.parse(localStorage.getItem("usuarioSesionIniciada"));
      if (usuarioActivo) {
        localStorage.removeItem(`carrito_${usuarioActivo.usuario}`);
        actualizarVistasCarrito(); // Actualiza la vista inmediatamente
        // Si estamos en la página del carrito, también actualizamos su contenido principal
        if (window.location.pathname.includes("carrito.html")) {
            location.reload();
        }
      }
    });
  }

  // 4. LÓGICA PARA LA PÁGINA carrito.html
  if (paginaCarritoContenedor) {
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioSesionIniciada"));
    if (!usuarioActivo) {
      paginaCarritoContenedor.innerHTML = "<p>Debes iniciar sesión para ver tu carrito.</p>";
      return;
    }

    const carrito = JSON.parse(localStorage.getItem(`carrito_${usuarioActivo.usuario}`)) || [];

    if (carrito.length === 0) {
      paginaCarritoContenedor.innerHTML = "<p>Tu carrito está vacío 🛒</p>";

      // Ocultar el botón de compra y los métodos de pago si el carrito está vacío
      const btnComprar = document.querySelector('.btn-comprar');
      const metodosPago = document.querySelector('.metodos-pago');
      if (btnComprar) {
        btnComprar.style.display = 'none';
      }
      if (metodosPago) {
        metodosPago.style.display = 'none';
      }
      return;
    }

    let total = 0;
    let html = `
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
    `;

    carrito.forEach(item => {
      const subtotal = item.precio * item.cantidad;
      total += subtotal;
      html += `
        <tr>
          <td>${item.nombre}</td>
          <td>${item.cantidad}</td>
          <td>$${item.precio}</td>
          <td>$${subtotal}</td>
        </tr>
      `;
    });

    html += `
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" class="total">Total:</td>
            <td><strong>$${total}</strong></td>
          </tr>
        </tfoot>
      </table>
    `;

    paginaCarritoContenedor.innerHTML = html;
  }

  // 5. INICIALIZACIÓN
  actualizarVistasCarrito();
});
