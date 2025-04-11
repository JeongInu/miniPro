document.addEventListener('DOMContentLoaded', () => {
  const headerTarget = document.querySelector("header");
  if (headerTarget) {
    fetch("/frontend/components/header.html")
      .then(res => res.text())
      .then(data => {
        headerTarget.innerHTML = data;

        const headerScript = document.createElement("script");
        headerScript.src = "/frontend/assets/js/common/header.js";
        document.body.appendChild(headerScript);
      });
  }
    const footerTarget = document.querySelector("footer");
    if (footerTarget) {
      fetch("/frontend/components/footer.html")
        .then(res => res.text())
        .then(data => {
          footerTarget.innerHTML = data;

          const footerScript = document.createElement("script");
          footerScript.src = "/frontend/assets/js/common/footer.js";
          document.body.appendChild(footerScript);
        });
    }

});
