let productos = []; // Variable para almacenar la lista de productos

// Obtener datos de productos desde un archivo JSON
fetch("/productos.json")
  .then((response) => {
    console.log("Estado de la respuesta:", response.status);
    if (!response.ok) {
      throw new Error(`Error de red: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    productos = data;
    cargarProductos(productos);
  })
  .catch((error) => {
    console.error("Error durante la carga de productos:", error);
  });

// Elementos del DOM
const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

// Ocultar un aside cuando se hace clic en un botón de categoría
botonesCategorias.forEach((boton) =>
  boton.addEventListener("click", () => {
    aside.classList.remove("aside-visible");
  })
);

// Función para cargar productos en la interfaz
function cargarProductos(productosElegidos) {
  // Limpiar el contenedor de productos
  contenedorProductos.innerHTML = "";

  // Crear elementos HTML para cada producto y agregarlos al contenedor
  productosElegidos.forEach((producto) => {
    const div = document.createElement("div");
    div.classList.add("producto");
    div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;

    contenedorProductos.append(div);
  });

  // Actualizar eventos de los botones "Agregar al carrito"
  actualizarBotonesAgregar();
}

// Manejar clics en los botones de categoría
botonesCategorias.forEach((boton) => {
  boton.addEventListener("click", (e) => {
    // Remover la clase 'active' de todos los botones de categoría
    botonesCategorias.forEach((boton) => boton.classList.remove("active"));
    // Agregar la clase 'active' al botón de categoría clicado
    e.currentTarget.classList.add("active");

    // Filtrar productos por categoría y actualizar la interfaz
    if (e.currentTarget.id != "todos") {
      const productoCategoria = productos.find(
        (producto) => producto.categoria.id === e.currentTarget.id
      );
      tituloPrincipal.innerText = productoCategoria.categoria.nombre;
      const productosBoton = productos.filter(
        (producto) => producto.categoria.id === e.currentTarget.id
      );
      cargarProductos(productosBoton);
    } else {
      // Si se selecciona la categoría "todos", mostrar todos los productos
      tituloPrincipal.innerText = "Todos los productos";
      cargarProductos(productos);
    }
  });
});

// Función para actualizar eventos de los botones "Agregar al carrito"
function actualizarBotonesAgregar() {
  botonesAgregar = document.querySelectorAll(".producto-agregar");

  // Agregar evento "click" a cada botón "Agregar al carrito"
  botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", agregarAlCarrito);
  });
}

// Variables para almacenar productos en el carrito
let productosEnCarrito;

// Obtener productos en el carrito desde el almacenamiento local
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

// Si hay productos en el carrito almacenados localmente, cargarlos
if (productosEnCarritoLS) {
  productosEnCarrito = JSON.parse(productosEnCarritoLS);
  // Actualizar el número que indica la cantidad de productos en el carrito
  actualizarNumerito();
} else {
  // Si no hay productos en el carrito almacenados localmente, inicializar la variable
  productosEnCarrito = [];
}

// Función para agregar un producto al carrito
function agregarAlCarrito(e) {
  // Mostrar una notificación de producto agregado
  Toastify({
    text: "Producto agregado",
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

  // Obtener el ID del producto desde el botón clicado
  const idBoton = e.currentTarget.id;
  // Encontrar el producto correspondiente en la lista de productos
  const productoAgregado = productos.find(
    (producto) => producto.id === idBoton
  );

  // Verificar si el producto ya está en el carrito
  if (productosEnCarrito.some((producto) => producto.id === idBoton)) {
    // Si el producto ya está en el carrito, incrementar la cantidad
    const index = productosEnCarrito.findIndex(
      (producto) => producto.id === idBoton
    );
    productosEnCarrito[index].cantidad++;
  } else {
    // Si el producto no está en el carrito, agregarlo con cantidad 1
    productoAgregado.cantidad = 1;
    productosEnCarrito.push(productoAgregado);
  }

  // Actualizar la interfaz y el almacenamiento local
  actualizarNumerito();
  localStorage.setItem(
    "productos-en-carrito",
    JSON.stringify(productosEnCarrito)
  );
}

// Función para actualizar el número que indica la cantidad de productos en el carrito
function actualizarNumerito() {
  let nuevoNumerito = productosEnCarrito.reduce(
    (acc, producto) => acc + producto.cantidad,
    0
  );
  numerito.innerText = nuevoNumerito;
}