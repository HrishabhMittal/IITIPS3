document.querySelector("body").height = innerHeight;
let city = 'Faridabad';
let timeZone = "Asia/Kolkata";
const searchInput = document.getElementById("bar");
const searchResults = document.getElementById("search-results");
searchInput.addEventListener("input", handleSearch);  
searchInput.addEventListener("keydown", handleEnter);
function getCurrentTimeByTimeZone(timeZone) {
    const now = new Date();
    const timeFormat = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: timeZone,
        hour12: false  
    });
    return timeFormat.format(now);
}
function displayWeather(data) {
    document.getElementById("time").innerHTML = getCurrentTimeByTimeZone(timeZone);
    document.getElementById("other").innerHTML = data.main.temp+",feels like "+data.main.feels_like;
    console.log(data.weather[0].main);
    setBackground(data.weather[0].main);
}

function fetchWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayWeather(data);
        })
        .catch(error => console.error('Error:', error));
}
setInterval(fetchWeather, 2000);
fetchWeather();
async function fetchLocations() {
    const response = await fetch('locations.txt');
    const text = await response.text();
    return text.split("\n").map(loc => loc.trim()).filter(loc => loc.length > 0); 
}
let locations = [];
async function func() {
locations = await fetchLocations();
}
func();
async function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    const filteredLocations = locations.filter(location =>
        location.toLowerCase().includes(query)
    );
    displaySearchResults(filteredLocations);
}
function displaySearchResults(filteredLocations) {
    searchResults.innerHTML = '';  
    filteredLocations.forEach(location => {
        const cityName = location.split("/")[1]; 
        const resultDiv = document.createElement("div");
        resultDiv.classList.add("result-item");
        resultDiv.textContent = cityName; 
        resultDiv.addEventListener("click", function () {
            handleLocation(location, cityName);
        });
        searchResults.appendChild(resultDiv);
    });
}
function handleLocation(location, cityName) {
    city=cityName;
    timeZone=location;
}
function handleEnter(event) {
    if (event.key === "Enter") {
        const firstResult = searchResults.querySelector(".result-item");
        if (firstResult) {
            const selectedCity = firstResult.textContent;
            const fullLocation = locations.find(loc => loc.split("/")[1] === selectedCity);
            handleLocation(fullLocation, selectedCity);
        }
    }
}
function setBackground(weatherCondition) {
    const body = document.querySelector('body');
    let bg = '';
    if (weatherCondition === 'Clear') {
        bg = '#4287f5'; 
    } else if (weatherCondition === 'Clouds') {
        bg= '#92b7e0'; 
    } else if (weatherCondition === 'Rain') {
        bg= '#1b1f94'; 
    }
    body.bgColor = bg;
}
