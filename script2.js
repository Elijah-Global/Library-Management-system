document.addEventListener("DOMContentLoaded", () => {
  // Check if the user is logged in
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!user) {
    alert("You must be logged in to view the catalog.");
    window.location.href = "/index.html"; // Redirect to login page
    return;
  }

  document.getElementById("logoutLink").addEventListener("click", () => {
    localStorage.removeItem("loggedInUser"); // Clear the logged-in user data
    window.location.href = "/index.html"; // Redirect to login page
  });
  

  // If the user is logged in, proceed to display the catalog
  const catalog = document.getElementById("book-catalog");
  const searchInput = document.getElementById("search");
  const filterSelect = document.getElementById("filter");

  let books = [];

  // Fetch books from data.json
  fetch("/data.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to fetch data.json");
      }
      return response.json();
    })
    .then(data => {
      console.log("Fetched books:", data); // Debug fetched data
      books = data;

      // Save books to localStorage if not already saved
      if (!localStorage.getItem("books")) {
        localStorage.setItem("books", JSON.stringify(books));
      } else {
        books = JSON.parse(localStorage.getItem("books"));
      }

      console.log("Books to display:", books); // Debug books to display
      displayBooks(books);
    })
    .catch(error => console.error("Error fetching books:", error));

  // Function to display books in the catalog
  function displayBooks(books) {
    catalog.innerHTML = books.map(book => `
      <div class="book">
        <img src="${book.coverImage}" alt="${book.title}" class="book-cover">
        <h3>${book.title}</h3>
        <p>Author: ${book.author}</p>
        <p>Genre: ${book.genre}</p>
        <p>Status: ${book.availability}</p>
        <button class="borrow-btn" data-title="${book.title}" ${book.availability === "Checked Out" ? "disabled" : ""}>
          ${book.availability === "Checked Out" ? "Unavailable" : "Borrow"}
        </button>
        <button class="remove-btn" data-title="${book.title}">Remove</button>
      </div>
    `).join("");

    // Add event listeners to borrow buttons
    document.querySelectorAll(".borrow-btn").forEach(button => {
      button.addEventListener("click", handleBorrow);
    });

    // Add event listeners to remove buttons
    document.querySelectorAll(".remove-btn").forEach(button => {
      button.addEventListener("click", handleRemove);
    });
  }

  // Handle borrowing a book
  function handleBorrow(event) {
    const bookTitle = event.target.dataset.title;
    const bookIndex = books.findIndex(book => book.title === bookTitle);

    if (bookIndex !== -1) {
      books[bookIndex].availability = "Checked Out";
      localStorage.setItem("books", JSON.stringify(books));
      alert(`You have successfully borrowed "${bookTitle}".`);
      displayBooks(books);
    }
  }

  // Handle removing a book
  function handleRemove(event) {
    const bookTitle = event.target.dataset.title;
    books = books.filter(book => book.title !== bookTitle);

    localStorage.setItem("books", JSON.stringify(books));
    alert(`"${bookTitle}" has been removed from the catalog.`);
    displayBooks(books);
  }

  // Search functionality
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    const filteredBooks = books.filter(book =>
      book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query)
    );
    displayBooks(filteredBooks);
  });

  // Filter functionality
  filterSelect.addEventListener("change", () => {
    const genre = filterSelect.value;
    const filteredBooks = genre === "all"
      ? books
      : books.filter(book => book.genre === genre);
    displayBooks(filteredBooks);
  });
});
