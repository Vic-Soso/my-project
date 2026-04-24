const bookList = document.getElementById("bookList");
function toggleMenu() {
    document.querySelector(".navbar").classList.toggle("active");
}

function getBooks(query) {
    if (!query) query = "harry potter";

    fetch("https://openlibrary.org/search.json?q=" + query)
        .then(res => res.json())
        .then(data => {
            showBooks(data.docs.slice(0, 15));
            // console.log("data", data);
            // console.log("books", data.docs);
        });
        
}

function showBooks(books) {
    bookList.innerHTML = "";
    // console.log(books);

    books.forEach(function(book) {
        let image;

        if (book.cover_i) {
            image = "https://covers.openlibrary.org/b/id/" + book.cover_i + "-M.jpg";
        } else {
            image = "nil";
        }

        let author = book.author_name ? book.author_name[0] : "Unknown";

        bookList.innerHTML +=
            "<div class='book'>" +
                "<img src='" + image + "'>" +
                "<h3>" + book.title + "</h3>" +
                "<p>" + author + "</p>" +
            "</div>";
    });
    
}

function searchBooks() {
    let query = document.getElementById("searchInput").value;
    getBooks(query);
}

getBooks();