document.addEventListener("DOMContentLoaded", () => {

  fetch("../navbar/navbar.html")
    .then(res => res.text())
    .then(data => {
      document.body.insertAdjacentHTML("beforeend", data);
    });

});