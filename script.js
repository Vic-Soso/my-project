const bookList = document.getElementById("bookList");
const nav = document.getElementById("nav");



async function fetchBooks(query="harry potter"){
    const response = await fetch(`https://openlibrary.org/search.json?q=${query}`);
    const data = await response.json();

    displayBooks(data.docs.slice(0,12));
}

function displayBooks(books){
    bookList.innerHTML = "";

    books.forEach(book => {
        let image = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : "https://via.placeholder.com/200x250";

        bookList.innerHTML += `
        <div class="book">
            <img src="${image}">
            <h3>${book.title}</h3>
            <p>${book.author_name ? book.author_name[0] : "Unknown"}</p>
        </div>
        `;
    });
}

function searchBooks(){
    let query = document.getElementById("searchInput").value;
    fetchBooks(query);
}

fetchBooks();
