(function () {
  function renderFooter() {
    var repo =
      (window.SHAR && window.SHAR.githubRepo) ||
      "https://github.com/russian-immigrant/Hello-Weather";
    var el = document.getElementById("site-footer");
    if (!el) return;
    el.innerHTML =
      '<div class="footer-inner">' +
      '<p class="footer-credit">Made by a Russian immigrant.</p>' +
      '<p class="footer-links">' +
      '<a href="' +
      repo +
      '" target="_blank" rel="noopener noreferrer">GitHub repository</a>' +
      "</p>" +
      "</div>";
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderFooter);
  } else {
    renderFooter();
  }
})();
