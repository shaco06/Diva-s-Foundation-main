/* esto es la funcion del reloj hasta la fiesta */
const fechaObjetivo = new Date('2026-12-25T18:00:00');

function actualizarTiempo() {
  const ahora = new Date();
  const diferencia = fechaObjetivo - ahora;

  if (diferencia <= 0) {
    document.getElementById('inicio_dias').textContent = '00';
    document.getElementById('inicio_horas').textContent = '00';
    document.getElementById('inicio_minutos').textContent = '00';
    return;
  }

  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diferencia / (1000 * 60)) % 60);

  document.getElementById('inicio_dias').textContent = String(dias).padStart(2, '0');
  document.getElementById('inicio_horas').textContent = String(horas).padStart(2, '0');
  document.getElementById('inicio_minutos').textContent = String(minutos).padStart(2, '0');
}

actualizarTiempo();
setInterval(actualizarTiempo, 1000 * 60);

/* selecciona un monto y habilita la donación solo con una cantidad válida */
const donacionInput = document.querySelector(".donacion_input");
const donacionOpciones = document.querySelectorAll(".donacion_boton");
const donacionBoton = document.querySelector(".donacion_boton-donar");
const donacionEstado = document.querySelector(".donacion_parra");
const donacionModal = document.querySelector(".donacion_modal");
const donacionModalCerrar = document.querySelector(".donacion_modal-cerrar");
const donacionModalMonto = document.querySelector("#donacion_modal_monto");
const donacionModalSinpe = document.querySelector("#donacion_modal_sinpe");
const donacionModalWhatsapp = document.querySelector("#donacion_modal_whatsapp");

function obtenerMontoSeleccionado() {
    const opcionSeleccionada = document.querySelector(".donacion_boton.is-selected");

    if (opcionSeleccionada) {
        return opcionSeleccionada.textContent.trim();
    }

    return `₡${Number(donacionInput.value).toLocaleString("es-CR")}`;
}

donacionBoton.addEventListener("click", () => {
    if (donacionBoton.disabled) {
        return;
    }

    const monto = obtenerMontoSeleccionado();
    const numeroWhatsapp = donacionModalSinpe.dataset.phone;
    const mensaje = `Hola, realicé una donación de ${monto} por SINPE. Adjunto el comprobante.`;

    donacionModalMonto.textContent = monto;
    donacionModalWhatsapp.href = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensaje)}`;
    donacionModal.showModal();
});

donacionModalCerrar.addEventListener("click", () => {
    donacionModal.close();
});

donacionOpciones.forEach((opcion) => {
    opcion.addEventListener("click", () => {
        donacionOpciones.forEach((otraOpcion) => {
            otraOpcion.classList.remove("is-selected");
            otraOpcion.setAttribute("aria-pressed", "false");
        });

        opcion.classList.add("is-selected");
        opcion.setAttribute("aria-pressed", "true");
        donacionInput.value = "";
        donacionBoton.disabled = false;
        donacionEstado.textContent = `Seleccionaste ${opcion.textContent.trim()}.`;
    });
});

donacionInput.addEventListener("input", () => {
    donacionInput.value = donacionInput.value.replace(/\D/g, "");

    donacionOpciones.forEach((opcion) => {
        opcion.classList.remove("is-selected");
        opcion.setAttribute("aria-pressed", "false");
    });

    const montoValido = Number(donacionInput.value) > 0;
    donacionBoton.disabled = !montoValido;
    donacionEstado.textContent = montoValido
        ? "Monto personalizado seleccionado."
        : "Selecciona una cantidad o escribe un monto mayor que cero.";
});
