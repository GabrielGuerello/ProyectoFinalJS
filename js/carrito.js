// Obtener productos en el carrito desde el almacenamiento local
let productosEnCarrito = localStorage.getItem("productos-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

// Seleccionar elementos del DOM
const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

// Función para cargar productos en el carrito
function cargarProductosCarrito() {
  if (productosEnCarrito && productosEnCarrito.length > 0) {
    contenedorCarritoVacio.classList.add("disabled");
    contenedorCarritoProductos.classList.remove("disabled");
    contenedorCarritoAcciones.classList.remove("disabled");
    contenedorCarritoComprado.classList.add("disabled");

    contenedorCarritoProductos.innerHTML = "";

    productosEnCarrito.forEach((producto) => {
      // Crear un elemento para cada producto en el carrito
      const div = document.createElement("div");
      div.classList.add("carrito-producto");
      div.innerHTML = `
        <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${
        producto.titulo
      }">
        <div class="carrito-producto-titulo">
          <small>Título</small>
          <h3>${producto.titulo}</h3>
        </div>
        <div class="carrito-producto-cantidad">
          <small>Cantidad</small>
          <p>${producto.cantidad}</p>
        </div>
        <div class="carrito-producto-precio">
          <small>Precio</small>
          <p>$${producto.precio}</p>
        </div>
        <div class="carrito-producto-subtotal">
          <small>Subtotal</small>
          <p>$${producto.precio * producto.cantidad}</p>
        </div>
        <button class="carrito-producto-eliminar" id="${
          producto.id
        }"><i class="bi bi-trash-fill"></i></button>
      `;

      contenedorCarritoProductos.append(div);
    });

    actualizarBotonesEliminar();
    actualizarTotal();
  } else {
    // Mostrar mensaje de carrito vacío
    contenedorCarritoVacio.classList.remove("disabled");
    contenedorCarritoProductos.classList.add("disabled");
    contenedorCarritoAcciones.classList.add("disabled");
    contenedorCarritoComprado.classList.add("disabled");
  }
}

// Cargar productos en el carrito al cargar la página
cargarProductosCarrito();

// Función para actualizar los botones de eliminar producto
function actualizarBotonesEliminar() {
  botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

  botonesEliminar.forEach((boton) => {
    boton.addEventListener("click", eliminarDelCarrito);
  });
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(e) {
  // Mostrar mensaje de confirmación de eliminación
  Toastify({
    text: "Producto eliminado",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "linear-gradient(to right, #FB6F92, #fcc1cf)",
      borderRadius: "2rem",
      textTransform: "uppercase",
      fontSize: ".75rem",
    },
    offset: {
      x: "1.5rem",
      y: "1.5rem",
    },
    onClick: function () {},
  }).showToast();

  // Obtener el ID del producto a eliminar
  const idBoton = e.currentTarget.id;
  // Encontrar el índice del producto en el carrito
  const index = productosEnCarrito.findIndex(
    (producto) => producto.id === idBoton
  );
  // Eliminar el producto del carrito
  productosEnCarrito.splice(index, 1);
  // Recargar la vista del carrito
  cargarProductosCarrito();
  // Actualizar el almacenamiento local con los cambios
  localStorage.setItem(
    "productos-en-carrito",
    JSON.stringify(productosEnCarrito)
  );
}

// Escuchar el evento de clic en el botón para vaciar el carrito
botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito() {
  // Mostrar un cuadro de diálogo de confirmación
  Swal.fire({
    title: "¿Estás seguro?",
    icon: "question",
    html: `Se van a borrar ${productosEnCarrito.reduce(
      (acc, producto) => acc + producto.cantidad,
      0
    )} productos.`,
    showCancelButton: true,
    focusConfirm: false,
    confirmButtonText: "Sí",
    cancelButtonText: "No",
  }).then((result) => {
    if (result.isConfirmed) {
      // Vaciar el carrito
      productosEnCarrito.length = 0;
      // Actualizar el almacenamiento local con los cambios
      localStorage.setItem(
        "productos-en-carrito",
        JSON.stringify(productosEnCarrito)
      );
      // Recargar la vista del carrito
      cargarProductosCarrito();
    }
  });
}

// Función para actualizar el total del carrito
function actualizarTotal() {
  // Calcular el total sumando los subtotales de cada producto
  const totalCalculado = productosEnCarrito.reduce(
    (acc, producto) => acc + producto.precio * producto.cantidad,
    0
  );
  // Actualizar el contenido del elemento HTML que muestra el total
  contenedorTotal.innerText = `$${totalCalculado}`;
}

// Escuchar el evento de clic en el botón para comprar
botonComprar.addEventListener("click", comprarCarrito);
function comprarCarrito() {
  // Vaciar el carrito después de realizar la compra
  productosEnCarrito.length = 0;
  // Actualizar el almacenamiento local con los cambios
  localStorage.setItem(
    "productos-en-carrito",
    JSON.stringify(productosEnCarrito)
  );

  // Actualizar la interfaz gráfica para mostrar el mensaje de compra realizada
  contenedorCarritoVacio.classList.add("disabled");
  contenedorCarritoProductos.classList.add("disabled");
  contenedorCarritoAcciones.classList.add("disabled");
  contenedorCarritoComprado.classList.remove("disabled");
}