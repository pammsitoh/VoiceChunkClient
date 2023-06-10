// obtener la referencia al modal y al botón de cerrar
var modal = document.querySelector("#modal");
var closeButton = document.querySelector("#close");

// agregar un evento de clic al botón de cerrar
closeButton.addEventListener("click", function() {
  modal.classList.remove("show");
});

// función para mostrar el modal
function showModal() {
    modal.classList.add("block");
    modal.classList.remove("hidden");
}

function closeModal() {
    modal.classList.add("hidden");
    modal.classList.remove("block");
}
