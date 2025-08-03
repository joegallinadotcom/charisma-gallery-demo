export function modalDialog(
  contentMessage,
  contentCancel,
  contentConfirmation
) {
  // Create Reusable Modal for Former "Alert" Dialogs
  var modal = document.getElementById("modal");
  var message = document.getElementById("message");
  var cancel = document.getElementById("cancel");
  var confirmation = document.getElementById("confirmation");

  message.textContent = contentMessage;
  cancel.textContent = contentCancel;
  confirmation.textContent = contentConfirmation;
  confirmation.style.display = "block";
  modal.style.display = "block";
  if (!contentCancel) {
    cancel.style.display = "none";
  } else {
    cancel.style.display = "block";
  }

  return new Promise((resolve) => {
    const closeModal = (result) => {
      confirmation.removeEventListener("click", confirmed);
      cancel.removeEventListener("click", cancelled);
      modal.style.display = "none";
      message.innerHTML = "";
      cancel.style.display = "none";
      confirmation.style.display = "none";
      resolve(result);
    };

    const confirmed = () => closeModal(true);
    const cancelled = () => closeModal(false);

    confirmation.addEventListener("click", confirmed);
    cancel.addEventListener("click", cancelled);
  });
}
