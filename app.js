const apiKey = '8i5U3qxmXHbNcpPEWqYnaH7JPtEkRFqW7co0VO7P'; // Replace with your actual NASA API key
const apiBaseUrl = 'https://api.nasa.gov/planetary/apod';
const currentImageContainer = document.getElementById('current-image-container');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const searchHistoryContainer = document.getElementById('search-history');

// Fetch and display the current image of the day on page load
window.onload = function () {
    getCurrentImageOfTheDay();
    displaySearchHistory();
};

// Fetches the current NASA image of the day
function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split('T')[0];
    fetchImage(currentDate);
}

// Fetches the image for a specific date
function getImageOfTheDay(date) {
    fetchImage(date);
    saveSearch(date);
    addSearchToHistory(date);
}

// Fetch image and display it in the UI
function fetchImage(date) {
    const url = `${apiBaseUrl}?api_key=${apiKey}&date=${date}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayImage(data);
        })
        .catch(error => {
            console.error('Error fetching image:', error);
            currentImageContainer.innerHTML = `<p>Sorry, there was an error fetching the image.</p>`;
        });
}

// Display image and details in the container
function displayImage(data) {
    currentImageContainer.innerHTML = `
        <h2>${data.title}</h2>
        <img src="${data.url}" alt="${data.title}">
        <p>${data.explanation}</p>
    `;
}

// Save the selected date to localStorage
function saveSearch(date) {
    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    if (!searches.includes(date)) {
        searches.push(date);
        localStorage.setItem('searches', JSON.stringify(searches));
    }
}

// Display search history from localStorage
function displaySearchHistory() {
    let searches = JSON.parse(localStorage.getItem('searches')) || [];
    searches.forEach(date => addSearchToHistory(date));
}

// Add a search date to the search history list in the UI
function addSearchToHistory(date) {
    const li = document.createElement('li');
    li.textContent = date;
    li.addEventListener('click', () => fetchImage(date));
    searchHistoryContainer.appendChild(li);
}

// Handle form submission for a specific date search
searchForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const date = searchInput.value;
    if (date) {
        getImageOfTheDay(date);
    }
});
