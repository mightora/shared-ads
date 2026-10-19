const header = document.querySelector("mightora-header");
if (header) {
  const resize = () =>
    document.documentElement.style.setProperty(
      "--header-height",
      `${header.getBoundingClientRect().height}px`,
    );
  new ResizeObserver(resize).observe(header);
  resize();
  // Supply the shared header's icon without adding an icon-font download; retain its navigation.
  const enhance = () => {
    const btn = header.querySelector("button.mobile-menu-btn");
    const nav = header.querySelector(".header-nav");
    if (btn && nav && !btn.hasAttribute("data-enhanced")) {
      btn.setAttribute("data-enhanced", "true");
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-controls", "header-nav");
      btn.addEventListener("click", () => {
        btn.setAttribute(
          "aria-expanded",
          String(nav.classList.contains("open")),
        );
        btn.setAttribute(
          "aria-label",
          nav.classList.contains("open")
            ? "Close navigation menu"
            : "Open navigation menu",
        );
      });
    }
  };
  enhance();
  new MutationObserver(enhance).observe(header, {
    childList: true,
    subtree: true,
  });
}
