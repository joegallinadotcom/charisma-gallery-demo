import { modalDialog } from "../utils/modal.js";
import { scroll, toTop, toBtm } from "../utils/scroll.js";

window.onscroll = scroll;
window.toTop = toTop;
window.toBtm = toBtm;

document.addEventListener("DOMContentLoaded", () => {
  const route = parseWorksURL();
  const typeBtns = document.querySelectorAll(".typeBtn");

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
    getWorksAdmin();
  }

  typeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const sort = btn.textContent.trim().toLowerCase();
      window.location.href = `gallery/by/${sort}`;
    });
  });

  async function getRowCount() {
    try {
      const response = await fetch(
        `http://joegallina.com/portfolio/charisma/api/gallery/all`
      );
      if (!response.ok) {
        throw new Error(`Response Status: ${response.status}`);
      }

      const output = await response.json();
      var rowCount = output.data.length;
      fillDisplayOrder(rowCount);
    } catch (err) {
      console.error(err.message);
    }
  }
  getRowCount();
});

const jsonDisEl = document.querySelector(".display");

function parseWorksURL() {
  const parts = window.location.pathname.split("/").filter(Boolean);

  if (parts.length === 3 && parts[2] === "admin") {
    return { type: "default" };
  }

  if (
    parts.length === 5 &&
    parts[2] === "admin" &&
    parts[3] === "gallery" &&
    /^\d+$/.test(parts[4])
  ) {
    return { type: "id", value: parts[4] };
  }

  if (parts.length === 6 && parts[3] === "gallery" && parts[4] === "by") {
    return { type: "sort", value: parts[5] };
  }

  if (
    parts.length === 7 &&
    parts[3] === "gallery" &&
    parts[4] === "by" &&
    parts[5] === "year"
  ) {
    return { type: "year", value: parts[6] };
  }

  return { type: "unknown" };
}

async function getWorksBySort(sort) {
  try {
    const res = await fetch(
      `http://joegallina.com/portfolio/charisma/api/admin/gallery/by/${sort}`
    );
    const data = await res.json();
    renderResults(data);
  } catch (err) {
    console.error(err);
    jsonDisEl.textContent = "Error loading gallery.  Try the buttons above!";
  }
}

function renderResults(data) {
  const container = jsonDisEl;
  container.innerHTML = "";

  if (!data.output || data.output.length === 0) {
    container.textContent = "No results found.  Try the buttons above!";
    return;
  }

  data.output.forEach((i) => {
    scaffoldingAdmin(i);
    setTimeout(() => {
      displayWorksAdmin(i);
    }, 100);
  });
}

async function loadYearButtons(activeYear) {
  try {
    const res = await fetch(
      `http://joegallina.com/portfolio/charisma/api/admin/gallery/years`
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
        window.location.href = `http://joegallina.com/portfolio/charisma/admin/gallery/by/year/${year}`;
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
      `http://joegallina.com/portfolio/charisma/api/admin/gallery/by/year/${year}`
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
      `http://joegallina.com/portfolio/charisma/api/gallery/${id}`
    );
    const data = await response.json();

    renderResults(data);
  } catch (error) {
    const container = document.querySelector(".display");
    container.innerHTML = `Error loading work.  Try the buttons above!`;
  }
}

async function getWorksAdmin() {
  try {
    const response = await fetch(
      `http://joegallina.com/portfolio/charisma/api/gallery/all`
    );
    if (!response.ok) {
      throw new Error(`Response Status: ${response.status}`);
    }

    const output = await response.json();
    var rowCount = output.data.length;
    fillDisplayOrder(rowCount);

    for (let i = 0; i < rowCount; i++) {
      await new Promise((resolve) => {
        scaffoldingAdmin(output.data[i]);
        resolve();
      });
      displayWorksAdmin(output.data[i]);
    }
  } catch (err) {
    console.error(err.message);
  }
}

function fillDisplayOrder(rowCount) {
  if (rowCount) {
    document.querySelector(".order").value = rowCount + 1;
  } else {
    document.querySelector(".order").value = 1;
  }
}

function scaffoldingAdmin(i) {
  var dbid = i.id;

  const jsonDisEl = document.querySelector(".display");

  // JSON Card DIV
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "content-admin");
  genDiv.setAttribute("data-dbid", dbid);
  jsonDisEl.appendChild(genDiv);

  const jsonCardEl = document.querySelector(
    `.content-admin[data-dbid='${dbid}']`
  );

  // Form Tag
  var genForm = document.createElement("form");
  genForm.setAttribute("class", "worksForm-admin");
  genForm.setAttribute("data-dbid", dbid);
  jsonCardEl.appendChild(genForm);

  const formEl = document.querySelector(
    `.worksForm-admin[data-dbid='${dbid}']`
  );

  // JSON IMG DIV
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "imgDiv-admin");
  genDiv.setAttribute("data-dbid", dbid);
  formEl.appendChild(genDiv);

  const jsonImgEl = document.querySelector(
    `.imgDiv-admin[data-dbid='${dbid}']`
  );

  // Primary DIV
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "primaryDiv");
  genDiv.setAttribute("data-dbid", dbid);
  jsonImgEl.appendChild(genDiv);

  const primaryEl = document.querySelector(`.primaryDiv[data-dbid='${dbid}']`);

  // Primary IMG Tag
  var genDiv = document.createElement("img");
  genDiv.setAttribute("class", "primaryImg");
  genDiv.setAttribute(
    "src",
    `http://joegallina.com/portfolio/charisma/gallery/` + i.primary_img
  );
  primaryEl.appendChild(genDiv);

  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "detailDiv");
  genDiv.setAttribute("data-dbid", dbid);
  jsonImgEl.appendChild(genDiv);

  const detailEl = document.querySelector(`.detailDiv[data-dbid='${dbid}']`);

  // Up to 5 detail "hidden" IMG placeholders
  for (let imgIndex = 0; imgIndex < 5; imgIndex++) {
    const img = document.createElement("img");
    img.setAttribute("class", "detailImg");
    img.setAttribute("data-imgIndex", imgIndex);
    img.style.display = "none";
    detailEl.appendChild(img);
  }

  // Spacer DIV
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "spacerDiv");
  formEl.appendChild(genDiv);

  // ID DIV
  var genDiv = document.createElement("div");
  var textNode = document.createTextNode("Database ID:");
  genDiv.appendChild(textNode);
  genDiv.setAttribute("class", "id");
  genDiv.setAttribute("data-dbid", dbid);
  formEl.appendChild(genDiv);

  // Posted DIV
  var genDiv = document.createElement("div");
  var textNode = document.createTextNode("Posted:");
  genDiv.appendChild(textNode);
  genDiv.setAttribute("class", "posted");
  genDiv.setAttribute("data-dbid", dbid);
  formEl.appendChild(genDiv);

  // Updated DIV
  var genDiv = document.createElement("div");
  var textNode = document.createTextNode("Updated:");
  genDiv.appendChild(textNode);
  genDiv.setAttribute("class", "updated");
  genDiv.setAttribute("data-dbid", dbid);
  formEl.appendChild(genDiv);

  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "controls");
  genDiv.setAttribute("data-dbid", dbid);
  formEl.appendChild(genDiv);

  const controlsEl = document.querySelector(`.controls[data-dbid='${dbid}']`);

  // Save BUTTON
  var genButton = document.createElement("button");
  genButton.setAttribute("class", "updateWork");
  genButton.setAttribute("type", "submit");
  genButton.setAttribute("data-dbid", dbid);
  genButton.textContent = "Save";
  controlsEl.appendChild(genButton);

  // Delete BUTTON
  var genButton = document.createElement("button");
  genButton.setAttribute("class", "deleteWork");
  genButton.setAttribute("type", "submit");
  genButton.setAttribute("data-dbid", dbid);
  genButton.textContent = "Delete";
  controlsEl.appendChild(genButton);

  // Year DIV
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "yearDiv");
  genDiv.setAttribute("data-dbid", dbid);
  formEl.appendChild(genDiv);

  const yearDivEl = document.querySelector(`.yearDiv[data-dbid='${dbid}']`);

  // Year INPUT
  var yearText = document.createTextNode("Year:  ");
  var genInput = document.createElement("input");
  genInput.setAttribute("class", "year");
  genInput.setAttribute("size", 7);
  genInput.setAttribute("maxlength", 6);
  genInput.setAttribute("minlength", 4);
  genInput.setAttribute("data-dbid", dbid);
  yearDivEl.appendChild(yearText);
  yearDivEl.appendChild(genInput);
  formEl.appendChild(yearDivEl);

  // Display DIV
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "displayDiv");
  genDiv.setAttribute("data-dbid", dbid);
  formEl.appendChild(genDiv);

  const displayDivEl = document.querySelector(
    `.displayDiv[data-dbid='${dbid}']`
  );

  // Display SELECT
  var displayText = document.createTextNode("Display:  ");
  var myParent = document.querySelector(`.content-admin[data-dbid='${dbid}']`);
  myParent.appendChild(displayText);
  var opt = ["Hide", "Show"];
  // Create and append SELECT list
  var genSelect = document.createElement("select");
  genSelect.className = "displaySel";
  myParent.appendChild(genSelect);
  // Create and append the SELECT OPTIONS
  for (var i = 0; i < opt.length; i++) {
    var opts = document.createElement("option");
    if (opt[i] == "Hide") {
      opts.value = 0;
    } else {
      opts.value = 1;
    }
    opts.text = opt[i];
    genSelect.appendChild(opts);
    genSelect.setAttribute("data-dbid", dbid);
  }
  displayDivEl.appendChild(displayText);
  displayDivEl.appendChild(genSelect);
  formEl.appendChild(displayDivEl);

  // Display Order DIV
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "orderDiv");
  genDiv.setAttribute("data-dbid", dbid);
  formEl.appendChild(genDiv);

  const orderDivEl = document.querySelector(`.orderDiv[data-dbid='${dbid}']`);

  // Display Order INPUT
  var orderText = document.createTextNode("Order:  ");
  var genInput = document.createElement("input");
  genInput.setAttribute("class", "order");
  genInput.setAttribute("size", 4);
  genInput.setAttribute("data-dbid", dbid);
  orderDivEl.appendChild(orderText);
  orderDivEl.appendChild(genInput);
  formEl.appendChild(orderDivEl);

  // Title DIV
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "titleDiv");
  genDiv.setAttribute("data-dbid", dbid);
  formEl.appendChild(genDiv);

  const titleDivEl = document.querySelector(`.titleDiv[data-dbid='${dbid}']`);

  // Title INPUT
  var titleInput = document.createTextNode("Title:");
  var genInput = document.createElement("input");
  genInput.setAttribute("class", "title");
  genInput.setAttribute("data-dbid", dbid);
  titleDivEl.appendChild(titleInput);
  titleDivEl.appendChild(genInput);
  formEl.appendChild(titleDivEl);

  // Medium DIV
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "mediumDiv");
  genDiv.setAttribute("data-dbid", dbid);
  formEl.appendChild(genDiv);

  const mediumDivEl = document.querySelector(`.mediumDiv[data-dbid='${dbid}']`);

  // Medium Input
  var mediumInput = document.createTextNode("Medium:");
  var genInput = document.createElement("input");
  genInput.setAttribute("class", "medium");
  genInput.setAttribute("data-dbid", dbid);
  mediumDivEl.appendChild(mediumInput);
  mediumDivEl.appendChild(genInput);
  formEl.appendChild(mediumDivEl);

  // Dimensions DIV
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "dimensionsDiv");
  genDiv.setAttribute("data-dbid", dbid);
  formEl.appendChild(genDiv);

  const dimensionsDivEl = document.querySelector(
    `.dimensionsDiv[data-dbid='${dbid}']`
  );

  // Dimensions INPUT
  var dimensionsText = document.createTextNode("Dimensions:  ");
  var genInput = document.createElement("input");
  genInput.setAttribute("class", "dimensions");
  genInput.setAttribute("data-dbid", dbid);
  dimensionsDivEl.appendChild(dimensionsText);
  dimensionsDivEl.appendChild(genInput);
  formEl.appendChild(dimensionsDivEl);

  // Statement DIV
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "statementDiv");
  genDiv.setAttribute("data-dbid", dbid);
  formEl.appendChild(genDiv);

  const statementDivEl = document.querySelector(
    `.statementDiv[data-dbid='${dbid}']`
  );

  // Statement TEXTAREA
  var statementText = document.createTextNode("Statement:");
  var genTextarea = document.createElement("textarea");
  genTextarea.setAttribute("class", "statement");
  genTextarea.setAttribute("rows", 4);
  genTextarea.setAttribute("data-dbid", dbid);
  statementDivEl.appendChild(statementText);
  statementDivEl.appendChild(genTextarea);
  formEl.appendChild(statementDivEl);

  // Primary DIV
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "primary");
  genDiv.setAttribute("data-dbid", dbid);
  formEl.appendChild(genDiv);

  // Detail DIV
  var genDiv = document.createElement("div");
  genDiv.setAttribute("class", "detail");
  genDiv.setAttribute("data-dbid", dbid);
  formEl.appendChild(genDiv);
}

function displayWorksAdmin(i) {
  var dbid = i.id;

  const idEl = document.querySelector(`.id[data-dbid='${dbid}']`);
  const postedEl = document.querySelector(`.posted[data-dbid='${dbid}']`);
  const updatedEl = document.querySelector(`.updated[data-dbid='${dbid}']`);
  const yearEl = document.querySelector(`.year[data-dbid='${dbid}']`);
  const displayEl = document.querySelector(`.displaySel[data-dbid='${dbid}']`);
  const orderEl = document.querySelector(`.order[data-dbid='${dbid}']`);
  const titleEl = document.querySelector(`.title[data-dbid='${dbid}']`);
  const mediumEl = document.querySelector(`.medium[data-dbid='${dbid}']`);
  const dimensionsEl = document.querySelector(
    `.dimensions[data-dbid='${dbid}']`
  );
  const detailEl = document.querySelector(`.detail[data-dbid='${dbid}']`);
  const detailFilenames = JSON.parse(i.detail_imgs || "[]");
  const imgTags = document.querySelectorAll(
    `.imgDiv-admin[data-dbid='${dbid}'] .detailImg`
  );

  imgTags.forEach((img, index) => {
    if (detailFilenames[index]) {
      img.setAttribute(
        "src",
        `http://joegallina.com/portfolio/charisma/gallery/` +
          detailFilenames[index]
      );
      img.style.display = "inline";
    } else {
      img.style.display = "none";
    }
  });

  const primaryEl = document.querySelector(`.primary[data-dbid='${dbid}']`);
  idEl.textContent = `Database ID:  ${dbid}`;
  const postedDate = new Date(i.posted).toLocaleDateString("en-US");
  const postedTime = new Date(i.posted).toLocaleTimeString("en-US");
  postedEl.innerHTML = `Posted:  ${postedDate} ${postedTime}`;
  const updatedDate = new Date(i.updated).toLocaleDateString("en-US");
  const updatedTime = new Date(i.updated).toLocaleTimeString("en-US");
  updatedEl.innerHTML = `Updated:  ${updatedDate} ${updatedTime}`;
  yearEl.value = i.year;
  if (i.display === 0) {
    displayEl.value = 0;
  } else {
    displayEl.value = 1;
  }
  orderEl.value = i.display_order;
  titleEl.value = i.title;
  mediumEl.value = i.medium;
  dimensionsEl.value = i.dimensions;
  document.querySelector(`.statement[data-dbid='${dbid}']`).innerHTML =
    i.statement;
  primaryEl.innerHTML =
    `Primary:<br/><a href='http://joegallina.com/portfolio/charisma/gallery/` +
    i.primary_img +
    `' target='_blank'>http://joegallina.com/portfolio/charisma/gallery/` +
    i.primary_img +
    `</a></div>`;
  detailEl.innerHTML =
    `Detail (&lt;=5, customizable):<br/>` +
    detailFilenames
      .map(
        (filename) =>
          `<a href='http://joegallina.com/portfolio/charisma/gallery/${filename}' target='_blank'>http://joegallina.com/portfolio/charisma/gallery/${filename}</a><br/>`
      )
      .join("");
}

function clickHandler(event, dbid) {
  if (dbid) {
    // Update Existing Work When DBID is Present
    var yearInput = document.querySelector(
      `input[class='year'][data-dbid='${dbid}']`
    ).value;
    var displaySelection = document.querySelector(
      `select[class='displaySel'][data-dbid='${dbid}']`
    ).value;
    var orderInput = document.querySelector(
      `input[class='order'][data-dbid='${dbid}']`
    ).value;
    var titleInput = document.querySelector(
      `input[class='title'][data-dbid='${dbid}']`
    ).value;
    var mediumText = document.querySelector(
      `input[class='medium'][data-dbid='${dbid}']`
    ).value;
    var dimensionsInput = document.querySelector(
      `input[class='dimensions'][data-dbid='${dbid}']`
    ).value;
    var statementText = document.querySelector(
      `textarea[class='statement'][data-dbid='${dbid}']`
    ).value;

    if (!yearInput) {
      modalDialog(
        `The "Year" field on Database ID ${dbid} is empty.`,
        "",
        "OK"
      );
      return false;
    } else if (!orderInput) {
      modalDialog(
        `The "Order" field on Database ID ${dbid} is empty.`,
        "",
        "OK"
      );
      return false;
    } else if (!titleInput) {
      modalDialog(
        `The "Title" field on Database ID ${dbid} is empty.`,
        "",
        "OK"
      );
      return false;
    } else if (!mediumText) {
      modalDialog(
        `The "Medium" field on Database ID ${dbid} is empty.`,
        "",
        "OK"
      );
      return false;
    } else if (!dimensionsInput) {
      modalDialog(
        `The "Dimensions" field on Database ID ${dbid} is empty.`,
        "",
        "OK"
      );
      return false;
    } else if (!statementText) {
      modalDialog(
        `The "Statement" field on Database ID ${dbid} is empty.`,
        "",
        "OK"
      );
      return false;
    }

    let data = {
      id: dbid,
      year: yearInput,
      display: displaySelection,
      display_order: orderInput,
      title: titleInput,
      medium: mediumText,
      dimensions: dimensionsInput,
      statement: statementText,
    };

    saveUpdatedWork(data);
  } else {
    // Create New Work when DBID is not present
    var yearInput = document.querySelector("input[class='year']").value;
    var displaySelection = document.querySelector(
      "select[class='displaySel']"
    ).value;
    var orderInput = document.querySelector("input[class='order']").value;
    var titleInput = document.querySelector("input[class='title']").value;
    var dimensionsInput = document.querySelector(
      "input[class='dimensions']"
    ).value;
    var mediumInput = document.querySelector("input[class='medium']").value;
    var statementText = document.querySelector(
      "textarea[class='statement']"
    ).value;
    var primaryInput =
      document.querySelector("input[class='primary']").files[0]?.name || "";
    var primaryLength = document.querySelector("input[class='primary']")
      .files[0]?.length;
    var detailLength = document.querySelector("input.detail").files.length;
    const detailInput = document.querySelector("input.detail");
    const detailFiles = Array.from(detailInput.files || []);
    const detailNames = detailFiles.map((file) => file.name);

    if (!yearInput) {
      modalDialog('The "Year" field is empty.', "", "OK");
      return false;
    } else if (!orderInput) {
      modalDialog('The "Order" field is empty.', "", "OK");
      return false;
    } else if (!titleInput) {
      modalDialog('The "Title" field is empty.', "", "OK");
      return false;
    } else if (!mediumInput) {
      modalDialog('The "Medium" field is empty.', "", "OK");
      return false;
    } else if (!dimensionsInput) {
      modalDialog('The "Dimensions" field is empty.', "", "OK");
      return false;
    } else if (!statementText) {
      modalDialog('The "Statement" field is empty.', "", "OK");
      return false;
    } else if (!primaryInput) {
      modalDialog('No "Primary" image file was selected for upload.', "", "OK");
      return false;
    } else if (primaryLength > 1) {
      modalDialog('Only one (1) "Primary" image is allowed.', "", "OK");
    } else if (!detailNames) {
      modalDialog(
        'No "Detail" image file(s) were selected for upload.',
        "",
        "OK"
      );
      return false;
    } else if (detailLength > 5) {
      modalDialog('Up to five (5) "Detail" images are allowed.', "", "OK");
      return false;
    }

    const formData = new FormData(event.target);

    formData.append("display", displaySel.value);
    formData.append("primary", primaryInput);
    detailNames.forEach((file) => formData.append("detail", file));

    saveNewWork(formData);
  }
}

async function saveNewWork(formData) {
  // try {
  //   const response = await fetch(
  //     `http://joegallina.com/portfolio/charisma/api/gallery/new`,
  //     {
  //       method: "POST",
  //       body: formData,
  //     }
  //   );

  //   const output = await response.json();
  //   if (response.ok) {
  const confirmation = await modalDialog(
    `Creation of new Work with Database ID # [ID shown here] was successful!`,
    "",
    "OK"
  );
  if (confirmation) {
    location.replace(window.location.href);
  }
}
//   } catch (err) {
//     console.log(`saveNewWork(), response:  ${err}`);
//   }
// }

async function saveUpdatedWork(data) {
  var dbid = data.id;
  // try {
  //   const response = await fetch(
  //     `http://joegallina.com/portfolio/charisma/api/gallery/:id`,
  //     {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(data),
  //     }
  //   );

  //   const output = await response.json();

  //   if ((output.changes = 1)) {
  const confirmation = await modalDialog(
    `Work with Database ID # ${dbid} updated!`,
    "",
    "OK"
  );
}
//   } catch (err) {
//     console.error(`saveUpdatedWork(), error:  ${err.message}`);
//   }
// }

async function deleteWorkImages(dbid) {
  // try {
  //   const response = await fetch(
  //     `http://joegallina.com/portfolio/charisma/api/gallery/image-removal/${dbid}`,
  //     {
  //       method: "POST",
  //     }
  //   );

  //   const output = await response.json();
  //   if (output.message == "Success") {
  deleteWorkFromDatabase(dbid);
  //   } else {
  //     console.error(
  //       `deleteWorkImages() fetch reports something other than "Success": ${output.message}`
  //     );
  //   }
  // } catch (err) {
  //   console.error(`${err.message}`);
}
// }

async function deleteWorkFromDatabase(dbid) {
  // try {
  //   const response = await fetch(
  //     `http://joegallina.com/portfolio/charisma/api/gallery/${dbid}`,
  //     {
  //       method: "DELETE",
  //     }
  //   );

  //   const output = await response.json();

  //   if (response.ok) {
  const confirmation = await modalDialog(
    `Work with Database ID # ${dbid} removed!`,
    "",
    "OK"
  );
  // if (confirmation) {
  //   location.replace(window.location.href);
  // }
}
//   } catch (err) {
//     console.error(`deleteWorkFromDatabase(), error:  ${err.message}`);
//   }
// }

jsonDisEl.addEventListener("click", async function (event) {
  event.preventDefault();
  // If the Save button is clicked and the "closest" Form has a DBID
  if (event.target.textContent === "Save" && event.target.closest("form")) {
    var dbid = event.target.getAttribute("data-dbid");
    clickHandler(event, dbid);
  }
  // If the Delete button is clicked and the "closest" Form has a DBID
  else if (
    event.target.textContent === "Delete" &&
    event.target.closest("form")
  ) {
    var dbid = event.target.getAttribute("data-dbid");
    if (
      (await modalDialog(
        `Are you sure you wish to remove the Work with Database ID # ${dbid}?`,
        "No",
        "Yes"
      )) == true
    ) {
      deleteWorkImages(parseInt(dbid));
    }
  } else if (event.target.tagName === "A") {
    const href = event.target.getAttribute("href");
    if (href) {
      window.open(href, "_blank");
    }
  }
});

const worksFormNewEl = document.querySelector(".newWorksForm");

worksFormNewEl.addEventListener("submit", function (event) {
  event.preventDefault();
  clickHandler(event);
});
