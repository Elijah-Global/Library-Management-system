document.addEventListener("DOMContentLoaded", () => {
    const wishlistContainer = document.getElementById("wishlist");
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const exportCsvButton = document.getElementById("export-csv");
    const clearWishlistButton = document.getElementById("clear-wishlist");
    const sortWishlistSelect = document.getElementById("sort-wishlist");
    const filterAvailabilitySelect = document.getElementById("filter-availability");
    const searchWishlistInput = document.getElementById("search-wishlist");
    const resetStorageButton = document.getElementById("reset-storage");

  // Reset LocalStorage Logic
  resetStorageButton.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset all data in localStorage? This action cannot be undone.")) {
      localStorage.clear();
      alert("LocalStorage has been cleared. The page will now reload.");
      location.reload();
    }
  });
  
    // Fetch wishlist and books from localStorage
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const books = JSON.parse(localStorage.getItem("books")) || [];
  
    // Filter books in the wishlist
    let wishlistBooks = books.filter(book => wishlist.includes(book.title));
  
    // Display wishlist books
    function displayWishlistBooks() {
      if (wishlistBooks.length === 0) {
        wishlistContainer.innerHTML = "<p>Your wishlist is empty.</p>";
      } else {
        wishlistContainer.innerHTML = wishlistBooks.map(book => `
          <div class="book">
            <img src="${book.coverImage}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p>Author: ${book.author}</p>
            <p>Genre: ${book.genre}</p>
            <p>Status: ${book.availability}</p>
            <button class="remove-wishlist-btn" data-title="${book.title}">Remove from Wishlist</button>
          </div>
        `).join("");
  
        // Add event listeners to remove buttons
        document.querySelectorAll(".remove-wishlist-btn").forEach(button => {
          button.addEventListener("click", handleRemoveFromWishlist);
        });
      }
    }
  
    displayWishlistBooks();
  
    function handleRemoveFromWishlist(event) {
      const bookTitle = event.target.dataset.title;
  
      // Remove book from wishlist
      const updatedWishlist = wishlist.filter(title => title !== bookTitle);
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  
      // Refresh the wishlist
      location.reload();
    }
  
    // Sorting Logic
    sortWishlistSelect.addEventListener("change", () => {
      const sortBy = sortWishlistSelect.value;
      wishlistBooks.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return -1;
        if (a[sortBy] > b[sortBy]) return 1;
        return 0;
      });
      displayWishlistBooks();
    });
  
    // Filtering Logic
    filterAvailabilitySelect.addEventListener("change", () => {
      const filterBy = filterAvailabilitySelect.value;
      wishlistBooks = books.filter(book => wishlist.includes(book.title));
      if (filterBy !== "all") {
        wishlistBooks = wishlistBooks.filter(book => book.availability === filterBy);
      }
      displayWishlistBooks();
    });
  
    // Search Logic
    searchWishlistInput.addEventListener("input", () => {
      const query = searchWishlistInput.value.toLowerCase();
      wishlistBooks = books.filter(book => wishlist.includes(book.title));
      wishlistBooks = wishlistBooks.filter(book =>
        book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query)
      );
      displayWishlistBooks();
    });
  
    // Dark Mode Toggle Logic
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
      document.querySelector("header").classList.add("dark-mode");
    }
  
    darkModeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      document.querySelector("header").classList.toggle("dark-mode");
  
      // Save dark mode preference to localStorage
      const darkModeEnabled = document.body.classList.contains("dark-mode");
      localStorage.setItem("darkMode", darkModeEnabled);
    });
  
    // Export to CSV Logic
    exportCsvButton.addEventListener("click", () => {
      if (wishlistBooks.length === 0) {
        alert("Your wishlist is empty. Nothing to export.");
        return;
      }
  
      const csvContent = "data:text/csv;charset=utf-8," +
        ["Title,Author,Genre,Availability"].join(",") + "\n" +
        wishlistBooks.map(book => 
          `"${book.title}","${book.author}","${book.genre}","${book.availability}"`
        ).join("\n");
  
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "wishlist.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  
    // Clear Wishlist Logic
    clearWishlistButton.addEventListener("click", () => {
      if (confirm("Are you sure you want to clear your wishlist?")) {
        localStorage.removeItem("wishlist");
        location.reload();
      }
    });
  });