document.getElementById("logOut").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "/index.html";
});

const bookDisplay = document.getElementById("book");
const book = document.querySelector(".book");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const bookBorrow = document.getElementById("borrowBook");
      
      let books = JSON.parse(localStorage.getItem("books")) || [];
 
// Save current books to localStorage
function saveToLocalStorage() {
  localStorage.setItem("books", JSON.stringify(books));
}

// Load books from data.json or localStorage
async function loadBooks() {
  try {
    const response = await fetch("/data.json");
    if (!response.ok) throw new Error("Failed to fetch data.json");
    const data = await response.json();

    if (!localStorage.getItem("books")) {
      books = data.map(book => ({
        ...book,
        availability: book.availability || "Available",
        borrowedBy: book.borrowedBy || null
      }));
      saveToLocalStorage();
    }

    displayBooks(books);
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}

loadBooks();

// Display books in the catalog
function displayBooks(bookList) {
  const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

  book.innerHTML = bookList.map(book => {
    const isBorrowed = book.availability === "Checked Out";
    const isBorrowedByUser = book.borrowedBy === currentUser?.email;

    return `
      <div class="book">
        <img src="${book.coverImage}" alt="${book.title}" class="book-cover">
        <h3>${book.title}</h3>
        <p>Author: ${book.author}</p>
        <p>Genre: ${book.genre}</p>
        <p>Status: ${book.availability}</p>

        ${!isBorrowed || isBorrowedByUser
          ? `<button class="borrow-btn" data-title="${book.title}" ${isBorrowed ? "disabled" : ""}>
              ${isBorrowed ? "Unavailable" : "Borrow"}
            </button>`
          : ""
        }

        ${isBorrowedByUser
          ? `<button class="return-btn" data-title="${book.title}">Return</button>`
          : ""
        }
      </div>
    `;
  }).join("");

  document.querySelectorAll(".borrow-btn").forEach(button => {
    button.addEventListener("click", handleBorrow);
  });

  document.querySelectorAll(".return-btn").forEach(button => {
    button.addEventListener("click", handleReturn);
  });
}

bookDisplay.addEventListener('click', function() {
  bookDisplay.style.display = "block";
  const brr = document.querySelector('.borrow');
  brr.style.display = "none";
  displayBooks(books);
});

async function handleBorrow(event) {
  const bookTitle = event.target.dataset.title;

  // Get logged-in user data
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!loggedInUser) {
    alert("Please log in to borrow a book.");
    return;
  }

  // Find and update book availability
  const bookIndex = books.findIndex(book => book.title === bookTitle);
  if (bookIndex !== -1) {
    books[bookIndex].availability = "Checked Out";
    books[bookIndex].borrowedBy = loggedInUser.email;

    saveToLocalStorage();
    alert(`You have successfully borrowed "${books[bookIndex].title}"`);

    // Refresh the book list
    displayBooks(books);
  }
}

// Handle returning
async function handleReturn(event) {
  const bookTitle = event.target.dataset.title;
  const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const index = books.findIndex(book => book.title === bookTitle);
  if (index !== -1 && books[index].borrowedBy === currentUser.email) {
    books[index].availability = "Available";
    books[index].borrowedBy = null;
    saveToLocalStorage();
    alert(`You have returned "${bookTitle}".`);
    displayBooks(books);
  } else {
    alert("You are not allowed to return this book.");
  }
}

// Search
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const filtered = books.filter(book =>
    book.title.toLowerCase().includes(query) ||
    book.author.toLowerCase().includes(query)
  );
  displayBooks(filtered);
});

// Filter by genre
filterSelect.addEventListener("change", () => {
  const genre = filterSelect.value;
  const filtered = genre === "all"
    ? books
    : books.filter(book => book.genre === genre);
  displayBooks(filtered);
});

// Show borrowed books
bookBorrow.addEventListener("click", async function() {
  const currentUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!currentUser) return alert("Please log in first");

  const borrowedBooks = books.filter(book => book.borrowedBy === currentUser.email);

  const borrow = document.querySelector('.borrow');
  const bookRow = document.querySelector(".home");
  const home = document.querySelector(".book");
  
  // Clear previous content
  home.innerHTML = "";
  bookRow.innerHTML = "";

  // Show the borrowed books section
  borrow.style.display = 'block';
  document.querySelector(".home").style.display = "block";

  if (borrowedBooks.length === 0) {
    alert("You haven't borrowed any books.");
    return;
  }

  borrowedBooks.forEach(book => {
    const bookShelf = document.createElement("section");
    const imageSrc = book.coverImage || "https://via.placeholder.com/150";

    bookShelf.classList.add("shelf");
    bookShelf.innerHTML = `
      <img src="${imageSrc}" alt="${book.title}" onerror="this.src='https://via.placeholder.com/150'">
      <h3>${book.title}</h3>
      <h5>${Array.isArray(book.author) ? book.author[0] : book.author}</h5>
      <p>${book.genre}</p>
      <p class="status">Borrowed by you</p>
      <button class="return-book">Return Book</button>
    `;

    const returnBtn = bookShelf.querySelector(".return-book");
    returnBtn.addEventListener("click", () => {
      book.availability = "Available";
      book.borrowedBy = null;
      saveToLocalStorage();
      alert(`You returned: ${book.title}`);
      bookBorrow.click(); // Refresh the borrowed books section
    });

    bookRow.appendChild(bookShelf);
  });
});
