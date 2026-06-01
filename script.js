const defaultDolls = [
  {
    id: "sample-1",
    name: "Mimi",
    color: "soft pink",
    type: "birthday shelf",
    detail: "warm fairy-light glow",
    photo: "./sample-doll-diary.png",
    caption:
      "Mimi sits in the middle of a soft birthday shelf, surrounded by tiny keepsakes and warm pink light. She looks like the first page of a very loved collection."
  },
  {
    id: "sample-2",
    name: "Lulu",
    color: "cream",
    type: "bear doll",
    detail: "sleepy face",
    caption:
      "Lulu has a calm cream-colored look and a sleepy little face. She feels like the doll version of a warm blanket."
  },
  {
    id: "sample-3",
    name: "Poppy",
    color: "mint",
    type: "cat doll",
    detail: "round cheeks",
    caption:
      "Poppy is a mint-colored cutie with round cheeks and a gentle smile. She looks ready to sit beside every happy memory."
  }
];

const storageKey = "her-doll-diary-items";
const photoInput = document.querySelector("#photoInput");
const nameInput = document.querySelector("#nameInput");
const colorInput = document.querySelector("#colorInput");
const typeInput = document.querySelector("#typeInput");
const detailInput = document.querySelector("#detailInput");
const captionInput = document.querySelector("#captionInput");
const captionButton = document.querySelector("#captionButton");
const addButton = document.querySelector("#addButton");
const exportButton = document.querySelector("#exportButton");
const importInput = document.querySelector("#importInput");
const clearButton = document.querySelector("#clearButton");
const photoPreview = document.querySelector("#photoPreview");
const collectionGrid = document.querySelector("#collectionGrid");
const editToggle = document.querySelector("#editToggle");
const editorArea = document.querySelector("#editorArea");

let currentPhoto = "";

function loadDolls() {
  const saved = localStorage.getItem(storageKey);
  if (!saved) return defaultDolls;

  try {
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : defaultDolls;
  } catch {
    return defaultDolls;
  }
}

function saveDolls(dolls) {
  localStorage.setItem(storageKey, JSON.stringify(dolls));
}

function titleCase(value) {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\.[^/.]+$/, "")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .trim();
}

function guessNameFromFile(fileName) {
  if (!fileName) return "";
  const cleanName = fileName.replace(/\.[^/.]+$/, "").split(/[-_\s]+/)[0];
  return titleCase(cleanName);
}

function generateCaption({ name, color, type, detail }) {
  const dollName = name || "This doll";
  const dollColor = color || "soft";
  const dollType = type || "little doll";
  const dollDetail = detail || "gentle charm";

  return `${dollName} is a ${dollColor} ${dollType} with ${dollDetail}. She looks sweet, cozy, and ready to become one of the most loved pieces in the collection.`;
}

function renderPhoto(photo, name) {
  if (photo) {
    return `<img src="${photo}" alt="${name || "Doll photo"}" />`;
  }

  return "<span>Photo later</span>";
}

function renderDolls() {
  const dolls = loadDolls();
  collectionGrid.innerHTML = dolls
    .map(
      (doll) => `
        <article class="doll-card">
          <div class="doll-photo">${renderPhoto(doll.photo, doll.name)}</div>
          <div>
            <h3>${doll.name || "Unnamed doll"}</h3>
            <p>${doll.caption || generateCaption(doll)}</p>
          </div>
        </article>
      `
    )
    .join("");
}

function resetForm() {
  currentPhoto = "";
  photoInput.value = "";
  nameInput.value = "";
  colorInput.value = "";
  typeInput.value = "";
  detailInput.value = "";
  captionInput.value = "";
  photoPreview.innerHTML = "<span>No photo yet</span>";
}

photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if (!file) return;

  if (!nameInput.value) {
    nameInput.value = guessNameFromFile(file.name);
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    currentPhoto = reader.result;
    photoPreview.innerHTML = `<img src="${currentPhoto}" alt="Selected doll preview" />`;
  });
  reader.readAsDataURL(file);
});

captionButton.addEventListener("click", () => {
  captionInput.value = generateCaption({
    name: nameInput.value.trim(),
    color: colorInput.value.trim(),
    type: typeInput.value.trim(),
    detail: detailInput.value.trim()
  });
});

addButton.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const color = colorInput.value.trim();
  const type = typeInput.value.trim();
  const detail = detailInput.value.trim();
  const caption =
    captionInput.value.trim() ||
    generateCaption({ name, color, type, detail });

  const dolls = loadDolls();
  dolls.unshift({
    id: crypto.randomUUID(),
    name,
    color,
    type,
    detail,
    caption,
    photo: currentPhoto
  });

  saveDolls(dolls);
  renderDolls();
  resetForm();
});

exportButton.addEventListener("click", () => {
  const data = JSON.stringify(loadDolls(), null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "doll-diary-backup.json";
  link.click();
  URL.revokeObjectURL(url);
});

importInput.addEventListener("change", () => {
  const file = importInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const dolls = JSON.parse(reader.result);
      if (Array.isArray(dolls)) {
        saveDolls(dolls);
        renderDolls();
      }
    } catch {
      alert("That backup file could not be imported.");
    }
  });
  reader.readAsText(file);
});

clearButton.addEventListener("click", () => {
  const confirmed = confirm("Clear the saved dolls in this browser?");
  if (!confirmed) return;
  localStorage.removeItem(storageKey);
  renderDolls();
});

editToggle.addEventListener("click", () => {
  const isHidden = editorArea.hidden;
  editorArea.hidden = !isHidden;
  editToggle.textContent = isHidden ? "Hide Editor" : "Edit Collection";
});

renderDolls();
