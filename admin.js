document.addEventListener("DOMContentLoaded", () => {
  const adminEmail = "elijaholabisi@gmail.com";
  const adminPassword = "Admin12345";

  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  // Redirect if not admin
  if (!user || user.email !== adminEmail || user.password !== adminPassword) {
    alert("You must be logged in as admin to view the catalog.");
    window.location.href = "/index.html";
    return;
  }

  document.getElementById("logoutLink").addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/index.html";
  });

  const searchInput = document.getElementById("search");
  const filterSelect = document.getElementById("filter");
  const bookForm = document.getElementById("book-form");
  const formTitle = document.getElementById("form-title");
  const list = document.getElementById("book-list");

  let editingBookId = null;

  function generateBookId() {
    return 'book-' + Date.now();
  }

  function handleAddOrUpdateBook(event) {
    event.preventDefault();

    const title = document.getElementById("title").value.trim();
    const author = document.getElementById("author").value.trim();
    const genre = document.getElementById("genre").value.trim();
    const coverImage = document.getElementById("coverImage").value.trim();
    const availability = document.getElementById("availability").value;

    if (!title || !author || !genre) {
      alert("Please fill in all required fields.");
      return;
    }

    const books = JSON.parse(localStorage.getItem("books")) || [];

    const bookData = {
      id: editingBookId || generateBookId(),
      title,
      author,
      genre,
      coverImage: coverImage || "https://via.placeholder.com/150",
      availability,
      borrowedBy: availability === "Checked Out" ? (user.email || "Unknown") : null,
      borrowedDate: availability === "Checked Out" ? new Date().toLocaleDateString() : null
    };

    if (editingBookId) {
      const index = books.findIndex(book => book.id === editingBookId);
      books[index] = { ...books[index], ...bookData };
      alert("Book updated successfully.");
    } else {
      books.push(bookData);
      alert("Book added successfully.");
    }

    localStorage.setItem("books", JSON.stringify(books));
    bookForm.reset();
    editingBookId = null;
    formTitle.textContent = "Add a New Book";

    const cancelBtn = document.getElementById("cancelEdit");
    if (cancelBtn) cancelBtn.remove();

    displayBooks();
  }

  function displayBooks() {
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const searchTerm = searchInput.value.toLowerCase();
    const selectedGenre = filterSelect.value;

    list.innerHTML = "";

    const filteredBooks = books.filter(book => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm);
      const matchesGenre = selectedGenre === "all" || book.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    });

    if (filteredBooks.length === 0) {
      list.innerHTML = "<p>No books match your criteria.</p>";
      return;
    }

    filteredBooks.forEach(book => {
      const item = document.createElement("div");
      item.className = "book-item gap-3 m-3 p-2 border rounded";
      item.innerHTML = `
        <img src="${book.coverImage}" alt="${book.title}" width="100" height="150" />
        <div>
          <h3>${book.title}</h3>
          <p><strong>Author:</strong> ${book.author}</p>
          <p><strong>Genre:</strong> ${book.genre}</p>
          <p><strong>Availability:</strong> ${book.availability}</p>
          ${book.borrowedBy ? `<p><strong>Borrowed By:</strong> ${book.borrowedBy}</p>` : ''}
          ${book.borrowedDate ? `<p><strong>Borrowed On:</strong> ${book.borrowedDate}</p>` : ''}
          <button class="btn btn-sm btn-primary me-2 edit-btn">Edit</button>
          <button class="btn btn-sm btn-danger delete-btn">Delete</button>
        </div>
      `;

      const editBtn = item.querySelector(".edit-btn");
      const deleteBtn = item.querySelector(".delete-btn");

      editBtn.addEventListener("click", () => handleEditBook(book.id));
      deleteBtn.addEventListener("click", () => handleDeleteBook(book.id));

      list.appendChild(item);
    });
  }

  function handleEditBook(bookId) {
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const book = books.find(book => book.id === bookId);
    if (!book) return;

    editingBookId = book.id;

    document.getElementById("title").value = book.title;
    document.getElementById("author").value = book.author;
    document.getElementById("genre").value = book.genre;
    document.getElementById("coverImage").value = book.coverImage;
    document.getElementById("availability").value = book.availability;

    formTitle.textContent = "Edit Book";

    if (!document.getElementById("cancelEdit")) {
      const cancelBtn = document.createElement("button");
      cancelBtn.id = "cancelEdit";
      cancelBtn.type = "button";
      cancelBtn.className = "btn btn-secondary mt-2";
      cancelBtn.textContent = "Cancel Edit";
      cancelBtn.addEventListener("click", () => {
        bookForm.reset();
        editingBookId = null;
        formTitle.textContent = "Add a New Book";
        cancelBtn.remove();
      });
      bookForm.appendChild(cancelBtn);
    }
  }

  function handleDeleteBook(bookId) {
    let books = JSON.parse(localStorage.getItem("books")) || [];
    books = books.filter(book => book.id !== bookId);
    localStorage.setItem("books", JSON.stringify(books));
    alert("Book deleted.");
    displayBooks();
  }

  // Event listeners
  bookForm.addEventListener("submit", handleAddOrUpdateBook);
  searchInput.addEventListener("input", displayBooks);
  filterSelect.addEventListener("change", displayBooks);

  // Initial load
  displayBooks();
});
