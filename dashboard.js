document.addEventListener("DOMContentLoaded", () => {
    const totalBorrowedEl = document.getElementById("total-borrowed");
    const totalAvailableEl = document.getElementById("total-available");
    const genreChartEl = document.getElementById("genreChart");
    const mostBorrowedEl = document.getElementById("most-borrowed");
  
    // Load books and borrowing history from localStorage
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const borrowingHistory = JSON.parse(localStorage.getItem("borrowingHistory")) || [];
  
    // Calculate total borrowed and available books
    const totalBorrowed = books.filter(book => book.availability === "Checked Out").length;
    const totalAvailable = books.filter(book => book.availability === "Available").length;
  
    // Update statistics in the DOM
    totalBorrowedEl.textContent = totalBorrowed;
    totalAvailableEl.textContent = totalAvailable;
  
    // Calculate genre distribution
    const genreCounts = books.reduce((acc, book) => {
      acc[book.genre] = (acc[book.genre] || 0) + 1;
      return acc;
    }, {});
  
    // Prepare data for the chart
    const genres = Object.keys(genreCounts);
    const counts = Object.values(genreCounts);
  
    // Create a pie chart using Chart.js
    new Chart(genreChartEl, {
      type: "pie",
      data: {
        labels: genres,
        datasets: [{
          label: "Genre Distribution",
          data: counts,
          backgroundColor: [
            "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"
          ]
        }]
      }
    });
  
    // Calculate most borrowed books
    const borrowCounts = borrowingHistory.reduce((acc, record) => {
      acc[record.title] = (acc[record.title] || 0) + 1;
      return acc;
    }, {});
  
    const sortedBorrowCounts = Object.entries(borrowCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Top 5 most borrowed books
  
    // Display most borrowed books
    mostBorrowedEl.innerHTML = sortedBorrowCounts.map(([title, count]) => `
      <li>${title} - Borrowed ${count} times</li>
    `).join("");
  });