// Obtener referencias a elementos del DOM
const openMenu = document.querySelector("#open-menu"); // Botón para abrir el menú lateral
const closeMenu = document.querySelector("#close-menu"); // Botón para cerrar el menú lateral
const aside = document.querySelector("aside"); // Elemento lateral que se mostrará/ocultará

// Agregar un evento de clic al botón para abrir el menú
openMenu.addEventListener("click", () => {
  aside.classList.add("aside-visible"); // Agregar la clase 'aside-visible' para mostrar el menú
});

// Agregar un evento de clic al botón para cerrar el menú
closeMenu.addEventListener("click", () => {
  aside.classList.remove("aside-visible"); // Remover la clase 'aside-visible' para ocultar el menú
});