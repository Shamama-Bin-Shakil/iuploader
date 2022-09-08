function alertError(name = "") {
  const alert_error = document.getElementById("alert-error");
  const error = document.getElementById("error");
  alert_error.classList.add("alert");
  error.innerHTML = name;
  setTimeout(() => {
    alert_error.classList.remove("alert");
  }, 4000);
}

function alertSuccess(name = "") {
  const alert_success = document.getElementById("alert-success");
  const success = document.getElementById("success");
  alert_success.classList.add("alert");
  success.innerHTML = name;
  setTimeout(() => {
    alert_success.classList.remove("alert");
  }, 4000);
}

// modal function
function modal(modaltrigger, modalopen, modalclose) {
  modaltrigger.addEventListener("click", function () {
    modalopen.classList.add("active");
  });
  modalclose.addEventListener("click", function () {
    modalopen.classList.remove("active");
  });
}
