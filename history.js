document.addEventListener("DOMContentLoaded", () => {
    const historyContainer = document.getElementById("history");
  
    // Load borrowed books from localStorage
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const borrowedBooks = books.filter(book => book.availability === "Checked Out");
  
    // Display borrowed books
    displayBorrowedBooks(borrowedBooks);
  
    function displayBorrowedBooks(borrowedBooks) {
      if (borrowedBooks.length === 0) {
        historyContainer.innerHTML = "<p>No borrowed books.</p>";
        return;
      }
  
      historyContainer.innerHTML = borrowedBooks.map(book => `
        <div class="book">
          <img src="${book.coverImage}" alt="${book.title}">
          <h3>${book.title}</h3>
          <p>Author: ${book.author}</p>
          <p>Genre: ${book.genre}</p>
          <p>Status: ${book.availability}</p>
          <button class="return-btn" data-title="${book.title}">Return</button>
        </div>
      `).join("");
  
      // Add event listeners to return buttons
      document.querySelectorAll(".return-btn").forEach(button => {
        button.addEventListener("click", handleReturn);
      });
    }
  
    function handleReturn(event) {
      const bookTitle = event.target.dataset.title;
  
      // Find the book and update its availability
      const bookIndex = books.findIndex(book => book.title === bookTitle);
      if (bookIndex !== -1) {
        books[bookIndex].availability = "Available";
  
        // Save updated books to localStorage
        localStorage.setItem("books", JSON.stringify(books));
  
        // Refresh the borrowing history
        const updatedBorrowedBooks = books.filter(book => book.availability === "Checked Out");
        displayBorrowedBooks(updatedBorrowedBooks);
  
        alert(`You have successfully returned "${bookTitle}".`);
      }
    }
  });