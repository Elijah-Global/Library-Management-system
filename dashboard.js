document.addEventListener("DOMContentLoaded", () => {
    const totalBorrowedEl = document.getElementById("total-borrowed");
    const totalAvailableEl = document.getElementById("total-available");
    const genreChartEl = document.getElementById("genreChart");
  const total = document.getElementById('total');
    // Load books and borrowing history from localStorage
    const books = JSON.parse(localStorage.getItem("books")) || [];
  
    // Calculate total borrowed and available books
    const totalBorrowed = books.filter(book => book.availability === "Checked Out").length;
    const totalAvailable = books.filter(book => book.availability === "Available").length;
  
    // Update statistics in the DOM
    totalBorrowedEl.textContent = totalBorrowed;
    totalAvailableEl.textContent = totalAvailable;
    total.innerHTML = `<h2>${books.length}</h2>` ;
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
  

  
  });