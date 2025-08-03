import { modalDialog } from "../utils/modal.js";

document.addEventListener("DOMContentLoaded", () => {
  getAbout();
});

var aboutFormEl = document.querySelector("#about-form");

// About Page Updater
aboutFormEl.addEventListener("submit", function (event) {
  event.preventDefault();
  saveAbout(event);
});

// Get About content
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
    }, 500);
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

async function saveAbout(event) {
  // const type = "about";
  // const content = document.querySelector(`textarea[id='about-text']`).value;

  // try {
  //   const response = await fetch(
  //     `http://joegallina.com/portfolio/charisma/api/about/save`,
  //     {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ type, content }),
  //     }
  //   );
  //   const output = await response.json();

  //   if (response.ok) {
  const confirmation = await modalDialog(`About content updated!`, "", "OK");
  if (confirmation) {
    location.replace(window.location.href);
  }
}
//   } catch (err) {
//     console.error(`saveAbout(), error:  ${err.message}`);
//   }
// }
