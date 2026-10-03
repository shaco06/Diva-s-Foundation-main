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

/* esto impide letras en el input de donación */
const donacionInput = document.querySelector(".donacion_input");

donacionInput.addEventListener("input", () => {
    donacionInput.value = donacionInput.value.replace(/\D/g, "");
});
