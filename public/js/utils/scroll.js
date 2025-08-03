// Scroll assist
const topBtn = document.getElementById("topBtn");
const btmBtn = document.getElementById("btmBtn");

export function scroll() {
  window.onscroll = () => {
    scrollHandler();
  };
}

function scrollHandler() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    topBtn.style.display = "block";
  } else {
    topBtn.style.display = "none";
  }

  if (
    (document.documentElement.scrollHeight || document.body.scrollHeight) -
      (document.documentElement.scrollTop || document.body.scrollTop) -
      document.documentElement.clientHeight >
    20
  ) {
    btmBtn.style.display = "block";
  } else {
    btmBtn.style.display = "none";
  }
}

export function toTop() {
  document.body.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function toBtm() {
  document.body.scrollIntoView({ behavior: "smooth", block: "end" });
}
