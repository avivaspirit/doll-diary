const collectionGrid = document.querySelector("#collectionGrid");

function renderPhoto(photo, name) {
  if (photo) {
    return `<img src="${photo}" alt="${name || "Doll photo"}" />`;
  }

  return "<span>Photo later</span>";
}

async function renderDolls() {
  if (!collectionGrid) return;

  let dolls = [];
  try {
    const data = await window.DollDiaryContent.loadJson("./content/dolls.json");
    dolls = Array.isArray(data.dolls) ? data.dolls : [];
  } catch {
    dolls = [];
  }

  collectionGrid.innerHTML = dolls
    .map(
      (doll) => {
        const name = doll?.name || "Unnamed doll";
        const caption = doll?.caption || "";
        const photo = doll?.photo || "";
        return `
        <article class="doll-card">
          <div class="doll-photo">${renderPhoto(photo, name)}</div>
          <div>
            <h3>${name}</h3>
            <p>${caption}</p>
          </div>
        </article>
      `;
      }
    )
    .join("");
}

renderDolls();
