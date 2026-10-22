const form = document.getElementById("search-form");
const input = document.getElementById("search-input");
const results = document.getElementById("results");
const emptyState = document.getElementById("empty-state");
const resultsNote = document.querySelector(".results-note");
let activeController;

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query = input.value.trim();
  if (!query) {
    return;
  }

  activeController?.abort();
  const controller = new AbortController();
  activeController = controller;

  results.replaceChildren();
  results.setAttribute("aria-busy", "true");
  emptyState.hidden = true;
  resultsNote.classList.add("is-loading");
  resultsNote.textContent = `Searching for “${query}”…`;

  const url = `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=12&gsrsearch=${encodeURIComponent(query)}&prop=imageinfo&iiprop=url&iiurlwidth=640`;

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Image search failed with status ${response.status}.`);
    }

    const data = await response.json();
    if (controller.signal.aborted) {
      return;
    }

    const pages = Object.values(data.query?.pages ?? {});
    let renderedCount = 0;

    for (const page of pages) {
      const imageInfo = page.imageinfo?.[0];
      const imageUrl = imageInfo?.thumburl ?? imageInfo?.url;
      if (!imageUrl) {
        continue;
      }

      const card = document.createElement("article");
      card.className = "image-card";

      const link = document.createElement("a");
      link.className = "image-card-link";
      link.href = imageInfo.url ?? imageUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", `Open ${page.title} on Wikimedia Commons`);

      const image = document.createElement("img");
      image.src = imageUrl;
      image.alt = page.title;
      image.loading = "lazy";

      const caption = document.createElement("p");
      caption.className = "image-card-caption";
      caption.textContent = page.title.replace(/^File:/, "");

      link.appendChild(image);
      card.appendChild(link);
      card.appendChild(caption);
      results.appendChild(card);
      renderedCount += 1;
    }

    resultsNote.textContent = `Showing ${renderedCount} ${
      renderedCount === 1 ? "result" : "results"
    } for “${query}”`;
    if (renderedCount === 0) {
      emptyState.hidden = false;
      emptyState.querySelector("span:last-child").textContent =
        `No images found for “${query}”. Try another search.`;
    }
  } catch (error) {
    if (controller.signal.aborted) {
      return;
    }

    resultsNote.textContent = "The image search could not be completed.";
    emptyState.hidden = false;
    emptyState.querySelector("span:last-child").textContent =
      "Please check your connection and try searching again.";
    console.error(error);
  } finally {
    if (activeController === controller) {
      results.setAttribute("aria-busy", "false");
      resultsNote.classList.remove("is-loading");
    }
  }
});

document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    input.value = chip.textContent.trim();
    form.requestSubmit();
  });
});
