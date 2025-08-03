import { scroll, toTop, toBtm } from "../../js/utils/scroll.js";

window.onscroll = scroll;
window.toTop = toTop;
window.toBtm = toBtm;

document.addEventListener("DOMContentLoaded", () => {
  const route = parseGalleryURL();
  const typeBtns = document.querySelectorAll(".typeBtn");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.querySelector(".lightbox-image");
  const lightboxThumbs = document.querySelector(".lightbox-thumbnails");
  const lightboxClose = document.querySelector(".lightbox-close");

  if (route.type === "year") {
    activeButton(null);
    loadYearButtons(route.value);
    getWorksByYear(route.value);
  } else if (route.type === "sort") {
    activeButton(route.value);
    loadYearButtons(null);
    getWorksBySort(route.value);
  } else if (route.type === "id") {
    activeButton(null);
    loadYearButtons(null);
    getWorksById(route.value);
  } else {
    activeButton(null);
    loadYearButtons(null);
    getWorks();
  }

  typeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const sort = btn.textContent.trim().toLowerCase();
      window.location.href = `http://joegallina.com/portfolio/charisma/gallery/by/${sort}`;
    });
  });

  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("primaryInd")) {
      event.preventDefault();
      const primaryUrl = event.target.src;
      const detailJson = event.target.getAttribute("data-detail");
      const fullImageStatement = event.target.getAttribute("alt");
      lightboxImage.src = primaryUrl;
      lightboxImage.alt = fullImageStatement;
      lightbox.style.display = "flex";

      lightboxThumbs.innerHTML = "";

      const primaryThumb = document.createElement("img");
      primaryThumb.src = primaryUrl;
      primaryThumb.alt = fullImageStatement;

      primaryThumb.addEventListener("click", () => {
        lightboxImage.src = primaryUrl;
        lightboxImage.alt = fullImageStatement;
      });

      lightboxThumbs.appendChild(primaryThumb);

      try {
        const detailArray = JSON.parse(detailJson);

        detailArray.forEach((filename) => {
          const thumbImg = document.createElement("img");
          thumbImg.src = `http://joegallina.com/portfolio/charisma/gallery/${filename}`;
          thumbImg.alt = fullImageStatement;

          thumbImg.addEventListener("click", () => {
            lightboxImage.src = thumbImg.src;
          });
          lightboxThumbs.appendChild(thumbImg);
        });
      } catch (err) {
        console.warn("Invalid JSON in data-detail:", err);
      }
    }
  });

  lightboxClose.addEventListener("click", () => {
    lightbox.style.display = "none";
    lightboxImage.src = "";
    lightboxImage.alt = "";
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox || event.target === lightboxImage) {
      lightbox.style.display = "none";
      lightboxImage.src = "";
      lightboxImage.alt = "";
    }
  });

  function isThumbnailScrollNeeded() {
    const container = document.querySelector(".lightbox-thumbnails");
    if (!container) return;

    const isOverflowing = container.scrollWidth > container.clientWidth;
    container.style.justifyContent = isOverflowing ? "flex-start" : "center";
  }
  isThumbnailScrollNeeded();
});

const jsonDisplay = document.querySelector(".display");

function parseGalleryURL() {
  const parts = window.location.pathname.split("/").filter(Boolean);

  if (parts.length === 3 && parts[2] === "gallery") {
    return { type: "default" };
  }

  if (parts.length === 4 && parts[2] === "gallery" && /^\d+$/.test(parts[3])) {
    return { type: "id", value: parts[3] };
  }

  if (parts.length === 5 && parts[2] === "gallery" && parts[3] === "by") {
    return { type: "sort", value: parts[4] };
  }

  if (
    parts.length === 6 &&
    parts[2] === "gallery" &&
    parts[3] === "by" &&
    parts[4] === "year"
  ) {
    return { type: "year", value: parts[5] };
  }

  return { type: "unknown" };
}

async function getWorksBySort(sort) {
  try {
    const res = await fetch(
      `http://joegallina.com/portfolio/charisma/api/gallery/by/${sort}`
    );
    const data = await res.json();
    renderResults(data);
  } catch (err) {
    console.error(err);
    jsonDisplay.textContent = "Error loading gallery.  Try the buttons above!";
  }
}

async function loadYearButtons(activeYear) {
  try {
    const res = await fetch(
      `http://joegallina.com/portfolio/charisma/api/gallery/years`
    );
    const data = await res.json();
    const container = document.querySelector(".dynBtns");

    data.year.forEach((year) => {
      const button = document.createElement("button");
      button.textContent = year;
      button.className = "yearBtn";
      button.setAttribute("data-year", year);

      if (year.toString() === activeYear) {
        button.classList.add("active");
      }

      button.addEventListener("click", () => {
        window.location.href = `http://joegallina.com/portfolio/charisma/gallery/by/year/${year}`;
      });

      container.appendChild(button);
    });
  } catch (err) {
    console.error("Failed to load year buttons:", err);
  }
}

function activeButton(activeType) {
  const buttons = document.querySelectorAll(".typeBtn");

  buttons.forEach((btn) => {
    const btnText = btn.textContent.trim().toLowerCase();
    if (btnText === activeType?.toLowerCase()) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

async function getWorksByYear(year) {
  try {
    const response = await fetch(
      `http://joegallina.com/portfolio/charisma/api/gallery/by/year/${year}`
    );

    const data = await response.json();

    renderResults(data);
  } catch (error) {
    const container = document.querySelector(".display");
    container.innerHTML = `Error loading gallery for ${year}.  Try the buttons above!`;
  }
}

async function getWorksById(id) {
  try {
    const response = await fetch(
      `http://joegallina.com/portfolio/charisma/api/gallerie/by/${id}`
    );
    const data = await response.json();

    renderResults(data);
  } catch (error) {
    const container = document.querySelector(".display");
    container.innerHTML = `Error loading gallery.  Try the buttons above!`;
  }
}

async function renderResults(data) {
  console.log(`data variable entering renderResults():`, data);
  const parts = window.location.pathname.split("/").filter(Boolean);
  const container = jsonDisplay;
  container.innerHTML = "";

  if (!data.output || data.output.length === 0) {
    container.textContent = "No results found.  Try the buttons above!";
    return;
  }

  if (
    Array.isArray(data.output) &&
    data.output.length === 1 &&
    parts.length === 4 &&
    parts[2] === "gallery" &&
    /^\d+$/.test(parts[3])
  ) {
    await new Promise((resolve) => {
      scaffoldingInd(data.output[0]);
      resolve();
    });
    displayWorkInd(data.output[0]);
    setNavButtonLinks(data.output[0].id);
  } else
    for (let i = 0; i < data.output.length; i++) {
      await new Promise((resolve) => {
        scaffolding(data.output[i]);
        resolve();
      });
      displayWorks(data.output[i]);
    }
}

async function getWorks() {
  try {
    const response = await fetch(
      `http://joegallina.com/portfolio/charisma/api/gallery/`
    );
    if (!response.ok) {
      throw new Error(`Response Status: ${response.status}`);
    }

    const output = await response.json();

    for (let i = 0; i < output.data.length; i++) {
      scaffolding(output.data[i]);
      setTimeout(() => {
        displayWorks(output.data[i]);
      }, 500);
    }
  } catch (err) {
    console.error(err.message);
  }
}

function scaffolding(i) {
  var dbid = i.id;

  const jsonDisEl = document.querySelector(".display");

  // Card DIV
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "content");
  genDiv.setAttribute("data-dbid", dbid);
  jsonDisEl.appendChild(genDiv);

  const jsonCardEl = document.querySelector(`.content[data-dbid='${dbid}']`);

  // A-over-Work TAG
  var genA = document.createElement("a");
  genA.setAttribute(
    "href",
    `http://joegallina.com/portfolio/charisma/gallery/${dbid}`
  );
  genA.setAttribute("class", "a-over-work");
  genA.setAttribute("data-dbid", dbid);
  jsonCardEl.appendChild(genA);

  const aowEl = document.querySelector(`.a-over-work[data-dbid='${dbid}']`);

  // Work Tag
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "work");
  genDiv.setAttribute("data-dbid", dbid);
  aowEl.appendChild(genDiv);

  const workEl = document.querySelector(`.work[data-dbid='${dbid}']`);

  // JSON IMG DIV
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "imgDiv");
  genDiv.setAttribute("data-dbid", dbid);
  workEl.appendChild(genDiv);

  const jsonImgEl = document.querySelector(`.imgDiv[data-dbid='${dbid}']`);

  var genImg = document.createElement("img");
  genImg.setAttribute("class", "primaryImg");
  genImg.setAttribute(
    "src",
    `http://joegallina.com/portfolio/charisma/gallery/` + i.primary_img
  );
  genImg.setAttribute("alt", i.statement);
  jsonImgEl.appendChild(genImg);

  // Spacer DIV
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "spacerDiv");
  workEl.appendChild(genDiv);

  // Title DIV
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "titleDiv");
  genDiv.setAttribute("data-dbid", dbid);
  workEl.appendChild(genDiv);

  const titleDivEl = document.querySelector(`.titleDiv[data-dbid='${dbid}']`);

  // Title Text
  var titleText = document.createTextNode("Title:  ");
  titleDivEl.appendChild(titleText);
  workEl.appendChild(titleDivEl);

  // Medium DIV
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "mediumDiv");
  genDiv.setAttribute("data-dbid", dbid);
  workEl.appendChild(genDiv);

  const mediumDivEl = document.querySelector(`.mediumDiv[data-dbid='${dbid}']`);

  // Medium DIV
  var mediumText = document.createTextNode("Medium:");
  mediumDivEl.appendChild(mediumText);
  workEl.appendChild(mediumDivEl);

  // Dimensions DIV
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "dimensionsDiv");
  genDiv.setAttribute("data-dbid", dbid);
  workEl.appendChild(genDiv);

  const dimensionsDivEl = document.querySelector(
    `.dimensionsDiv[data-dbid='${dbid}']`
  );

  // Dimensions Text
  var dimensionsText = document.createTextNode("Dimensions:  ");
  dimensionsDivEl.appendChild(dimensionsText);
  workEl.appendChild(dimensionsDivEl);

  // Year DIV
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "yearDiv");
  genDiv.setAttribute("data-dbid", dbid);
  workEl.appendChild(genDiv);

  const yearDivEl = document.querySelector(`.yearDiv[data-dbid='${dbid}']`);

  // Year DIV Content
  var yearText = document.createTextNode("Year:  ");
  yearDivEl.appendChild(yearText);
  workEl.appendChild(yearDivEl);
}

function displayWorks(i) {
  var dbid = i.id;

  const yearEl = document.querySelector(`.yearDiv[data-dbid='${dbid}']`);
  const titleEl = document.querySelector(`.titleDiv[data-dbid='${dbid}']`);
  const mediumEl = document.querySelector(`.mediumDiv[data-dbid='${dbid}']`);
  const dimensionsEl = document.querySelector(
    `.dimensionsDiv[data-dbid='${dbid}']`
  );

  yearEl.innerHTML = `Year:  ${i.year}`;
  titleEl.innerHTML = `Title:  ${i.title}`;
  mediumEl.innerHTML = `Medium:  ${i.medium}`;
  dimensionsEl.innerHTML = `Dimensions:  ${i.dimensions}`;
}

function scaffoldingInd(i) {
  var dbid = i.id;

  const jsonDisEl = document.querySelector(".display");

  // JSON Card DIV
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "content");
  genDiv.setAttribute("data-dbid", dbid);
  jsonDisEl.appendChild(genDiv);

  const jsonCardEl = document.querySelector(`.content[data-dbid='${dbid}']`);

  // Form Tag
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "workInd");
  genDiv.setAttribute("data-dbid", dbid);
  jsonCardEl.appendChild(genDiv);

  const workEl = document.querySelector(`.workInd[data-dbid='${dbid}']`);

  // JSON IMG DIV
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "imgDiv");
  genDiv.setAttribute("data-dbid", dbid);
  workEl.appendChild(genDiv);

  const jsonImgEl = document.querySelector(`.imgDiv[data-dbid='${dbid}']`);

  // Lightbox-enabled IMGs
  var genImg = document.createElement("img");
  genImg.setAttribute("class", "primaryInd");
  genImg.setAttribute(
    "src",
    `http://joegallina.com/portfolio/charisma/gallery/` + i.primary_img
  );
  genImg.setAttribute("data-detail", i.detail_imgs);
  genImg.setAttribute("alt", i.statement);
  jsonImgEl.appendChild(genImg);

  // Spacer DIV
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "spacerDiv1");
  workEl.appendChild(genDiv);

  // Title DIV
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "titleDiv");
  genDiv.setAttribute("data-dbid", dbid);
  workEl.appendChild(genDiv);

  const titleDivEl = document.querySelector(`.titleDiv[data-dbid='${dbid}']`);

  // Title DIV
  var titleText = document.createTextNode("Title:  ");
  titleDivEl.appendChild(titleText);
  workEl.appendChild(titleDivEl);

  // Medium DIV
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "mediumDiv");
  genDiv.setAttribute("data-dbid", dbid);
  workEl.appendChild(genDiv);

  const mediumDivEl = document.querySelector(`.mediumDiv[data-dbid='${dbid}']`);

  // Medium DIV
  var mediumText = document.createTextNode("Medium:");
  mediumDivEl.appendChild(mediumText);
  workEl.appendChild(mediumDivEl);

  // Dimensions DIV
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "dimensionsDiv");
  genDiv.setAttribute("data-dbid", dbid);
  workEl.appendChild(genDiv);

  const dimensionsDivEl = document.querySelector(
    `.dimensionsDiv[data-dbid='${dbid}']`
  );

  // Dimensions Text
  var dimensionsText = document.createTextNode("Dimensions:  ");
  dimensionsDivEl.appendChild(dimensionsText);
  workEl.appendChild(dimensionsDivEl);

  // Year DIV
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "yearDiv");
  genDiv.setAttribute("data-dbid", dbid);
  workEl.appendChild(genDiv);

  const yearDivEl = document.querySelector(`.yearDiv[data-dbid='${dbid}']`);

  // Year DIV Content
  var yearText = document.createTextNode("Year:  ");
  yearDivEl.appendChild(yearText);
  workEl.appendChild(yearDivEl);

  // Spacer DIV
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "spacerDiv2");
  workEl.appendChild(genDiv);

  // Statement DIV
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "statementDiv");
  genDiv.setAttribute("data-dbid", dbid);
  workEl.appendChild(genDiv);

  const statementDivEl = document.querySelector(
    `.statementDiv[data-dbid='${dbid}']`
  );

  // Statement TEXTAREA
  var statementText = document.createTextNode("");
  statementDivEl.appendChild(statementText);
  workEl.appendChild(statementDivEl);
}

function displayWorkInd(i) {
  var dbid = i.id;

  const yearEl = document.querySelector(`.yearDiv[data-dbid='${dbid}']`);
  const titleEl = document.querySelector(`.titleDiv[data-dbid='${dbid}']`);
  const mediumEl = document.querySelector(`.mediumDiv[data-dbid='${dbid}']`);
  const dimensionsEl = document.querySelector(
    `.dimensionsDiv[data-dbid='${dbid}']`
  );
  const statementEl = document.querySelector(
    `.statementDiv[data-dbid='${dbid}']`
  );

  yearEl.innerHTML = `Year:  ${i.year}`;
  titleEl.innerHTML = `Title:  ${i.title}`;
  mediumEl.innerHTML = `Medium:  ${i.medium}`;
  dimensionsEl.innerHTML = `Dimensions:  ${i.dimensions}`;
  statementEl.innerHTML = `${i.statement}`;
}

// Navigation Links / buttons
async function setNavButtonLinks(id) {
  try {
    const res = await fetch(
      `http://joegallina.com/portfolio/charisma/api/nav/${id}`
    );
    const { prev, next } = await res.json();

    const prevDiv = document.getElementById("prevDiv");
    const nextDiv = document.getElementById("nextDiv");

    if (prev !== null) {
      document.getElementById(
        "prevBtn"
      ).href = `http://joegallina.com/portfolio/charisma/gallery/${prev}`;
      prevDiv.style.display = "flex";
    } else {
      prevDiv.style.display = "none";
    }

    if (next !== null) {
      document.getElementById(
        "nextBtn"
      ).href = `http://joegallina.com/portfolio/charisma/gallery/${next}`;
      nextDiv.style.display = "flex";
    } else {
      nextDiv.style.display = "none";
    }
  } catch (err) {
    console.warn("Navigation buttons error:", err);
  }
}
