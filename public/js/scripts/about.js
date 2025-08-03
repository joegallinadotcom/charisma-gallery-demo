document.addEventListener("DOMContentLoaded", () => {
  getAbout();
});

async function getAbout() {
  try {
    const response = await fetch(
      `http://joegallina.com/portfolio/charisma/api/about/get`
    );
    if (!response.ok) {
      throw new Error(`Response Status: ${response.status}`);
    }

    const output = await response.json();
    setTimeout(() => {
      displayAbout(output.data[0]);
    }, 100);
  } catch (err) {
    console.error(err.message);
  }
}

// Fill About content
function displayAbout(about) {
  const aboutEl = document.querySelector("#about-text");
  if (about.type == "about") {
    aboutEl.innerHTML = about.content;
  }
}
