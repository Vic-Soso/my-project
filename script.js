/* ===== MENU TOGGLE ===== */
function toggleMenu() {
  document.querySelector(".navbar").classList.toggle("active");
}
document.querySelectorAll(".navbar a").forEach(a => {
  a.addEventListener("click", () => {
    document.querySelector(".navbar")?.classList.remove("active");
  });
});

/* ===== BOOKS ===== */
const bookList = document.getElementById("bookList");
let currentQuery = "harry potter";

function getBooks(query) {
  if (query) currentQuery = query;
  if (!bookList) return;

  bookList.innerHTML = '<div class="loading">✨ Loading books...</div>';

  fetch("https://openlibrary.org/search.json?q=" + encodeURIComponent(currentQuery) + "&limit=20")
    .then(res => res.json())
    .then(data => showBooks(data.docs.slice(0, 20)))
    .catch(() => {
      bookList.innerHTML = '<div class="loading">⚠️ Could not load books. Check your connection.</div>';
    });
}

function showBooks(books) {
  if (!bookList) return;
  bookList.innerHTML = "";

  books.forEach(book => {
    let image = book.cover_i
      ? "https://covers.openlibrary.org/b/id/" + book.cover_i + "-M.jpg"
      : "https://placehold.co/190x230/f0e8d0/a08040?text=No+Cover";

    let author = book.author_name ? book.author_name[0] : "Unknown Author";
    let title = book.title || "Untitled";

    // Check if a free readable version exists
    let hasRead = book.ia && book.ia.length > 0;
    let iaId = hasRead ? book.ia[0] : null;
    let olKey = book.key ? book.key.replace("/works/", "") : null;

    let readLabel = hasRead ? "📖 Read Free" : "Not Available";
    let readClass = hasRead ? "read-btn" : "read-btn no-read";
    let readAction = hasRead
      ? `onclick="openReader('${iaId}', '${title.replace(/'/g, "\\'")}', '${olKey}')"`
      : "";

    bookList.innerHTML +=
      "<div class='book'>" +
        "<img src='" + image + "' alt='" + title + "' loading='lazy'>" +
        "<div class='book-info'>" +
          "<h3>" + title + "</h3>" +
          "<p>" + author + "</p>" +
          "<button class='" + readClass + "' " + readAction + ">" + readLabel + "</button>" +
        "</div>" +
      "</div>";
  });
}

function searchBooks() {
  let q = document.getElementById("searchInput")?.value.trim();
  if (q) getBooks(q);
}

// Allow Enter key to search
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("searchInput")?.addEventListener("keydown", e => {
    if (e.key === "Enter") searchBooks();
  });
  if (bookList) getBooks();
});

/* ===== READER ===== */
function openReader(iaId, title, olKey) {
  const overlay = document.getElementById("readerOverlay");
  const frame = document.getElementById("readerFrame");
  const titleEl = document.getElementById("readerTitle");
  const unavailable = document.getElementById("readerUnavailable");
  const olLink = document.getElementById("olLink");

  titleEl.textContent = title;
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";

  if (iaId) {
    // Try Internet Archive embedded reader
    let url = "https://archive.org/embed/" + iaId + "?ui=embed#mode/1up";
    frame.style.display = "block";
    unavailable.style.display = "none";
    frame.src = url;
  } else {
    frame.style.display = "none";
    frame.src = "";
    unavailable.style.display = "flex";
    if (olKey) olLink.href = "https://openlibrary.org/works/" + olKey;
  }
}

function closeReader() {
  const overlay = document.getElementById("readerOverlay");
  const frame = document.getElementById("readerFrame");
  overlay.classList.remove("open");
  frame.src = "";
  document.body.style.overflow = "";
}

// Close on backdrop click
document.getElementById("readerOverlay")?.addEventListener("click", function(e) {
  if (e.target === this) closeReader();
});

// Close on Escape
document.addEventListener("keydown", e => { if (e.key === "Escape") closeReader(); });

/* ===== DEVTOOLS DETERRENT ===== */
(function() {
  const threshold = 160;
  let warned = false;
  setInterval(() => {
    if (
      (window.outerWidth - window.innerWidth > threshold ||
       window.outerHeight - window.innerHeight > threshold) && !warned
    ) {
      warned = true;
      document.body.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background:#1a1208;color:#c8a94a;font-family:serif;text-align:center;padding:40px;">
          <div style="font-size:60px;">📚</div>
          <h2 style="font-size:28px;margin:20px 0 10px;">Soki's Books</h2>
          <p style="color:rgba(255,255,255,0.6);max-width:400px;">This content is protected. Please close developer tools to continue reading.</p>
          <button onclick="location.reload()" style="margin-top:24px;padding:12px 28px;background:#c8a94a;color:#1a1208;border:none;border-radius:20px;font-weight:bold;font-size:15px;cursor:pointer;">Reload Page</button>
        </div>`;
    }
    if (window.outerWidth - window.innerWidth <= threshold &&
        window.outerHeight - window.innerHeight <= threshold) {
      warned = false;
    }
  }, 1000);

  // Disable right-click
  document.addEventListener("contextmenu", e => e.preventDefault());

  // Disable F12, Ctrl+Shift+I/J/C/U
  document.addEventListener("keydown", e => {
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && ["I","J","C"].includes(e.key.toUpperCase())) ||
      (e.ctrlKey && e.key.toUpperCase() === "U")
    ) {
      e.preventDefault();
    }
  });
})();
