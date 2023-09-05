// Declaring constant variables.
const weatherApiKey = "1777b6252cacbfaadcdd94227bf20ba6";
const defaultLocation = "Powys";
const units = "metric";

// function to fetch weather data for search location
async function fetchWeather(searchedLocation){

    // Try to retrieve data from local storage if available
    localData = JSON.parse(localStorage.getItem(searchedLocation));
    if(navigator.onLine){
      console.log("Online");
      if(localData == null) {
      // If data is not available in local storage, fetch it from the API
       data = await retrievedData(searchedLocation);

    if(errorHandling(data)) {
      let today = new Date();
      let date = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
      data["date"] = date;
      localStorage.setItem(searchedLocation, JSON.stringify(data));
       display(data); 
     } else {
       alert(`Sorry, ${searchedLocation} city data not found.`);
     }
      } 
      else{
        let today = new Date();
        let date = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
        //  data["date"] = date;
        if(date == localData["date"]){
          console.log(searchedLocation);
          console.log("Fetched from local storage.");
          display(localData);
        } else{
          let data = await retrievedData(searchedLocation);
          if (data) {
          display(data);
          } else{
            console.log(`No data found for entered ${searchedLocation} in API.`);
          }
        }
      }
    } else{
      console.log("Offline")
      localData = JSON.parse(localStorage.getItem(searchedLocation));
      if(localData == null ){
        console.log(`No data found for entered ${searchedLocation} in local storage.`);
        alert(`Sorry, ${searchedLocation} city data not available`);
      }else{
        display(localData);
        console.log(searchedLocation)
        console.log("Data from Local storage")
      }
    }
}

// Function to send weather data to a database.
async function dataToDatabase(data){
    let response = await fetch("./php/insert.php", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data) 
    })
}
  
// Function to display weather data 
 function display(data) {
  let today = new Date();
  let months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
  let monthIndex = today.getMonth();
  let monthName = months[monthIndex];
  let date = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
  let currentDate = today.getDate() + " " + monthName + " " + today.getFullYear();
  let daysOfWeek = ["Sunday", "Monday", "Tuesday" , "Wednesday", "Thursday", "Friday", "Saturday"];
  let dayIndex = today.getDay();
  let dayName = daysOfWeek[dayIndex]; 
  // data['dates'] = date;
  document.getElementById("date").innerHTML = currentDate;
  document.getElementById("day").innerHTML = dayName;
  document.getElementById("name").innerHTML = data.name;
  countryName =  data.sys.country;
  document.getElementById("country").innerHTML =  "," + countryName;
  let description = data.weather[0].description;
  let weatherDescription = description.charAt(0).toUpperCase() + description.slice(1);
  document.getElementById("weather_description").innerHTML = weatherDescription;
  document.getElementById("temperature").innerHTML = data.main.temp + " °C" ;
  document.getElementById("humidity").innerHTML =  `<img width="30" height="30" style="filter: invert(100%)"; src="https://img.icons8.com/external-yogi-aprelliyanto-glyph-yogi-aprelliyanto/32/000000/external-humidity-smart-farm-yogi-aprelliyanto-glyph-yogi-aprelliyanto.png" alt=""/>` + data.main.humidity + " %" ;
  document.getElementById("pressure").innerHTML = `<img width="30" height="30" style="filter: invert(100%)"; src="https://img.icons8.com/ios/50/3d-touch.png" alt="3d-touch"/>` +  data.main.pressure + " Pa";
  document.getElementById("wind_speed").innerHTML = `<img width="30" height="30" style="filter: invert(100%)"; src="https://img.icons8.com/ios-filled/50/000000/wind--v1.png" alt="wind--v1"/>` +  data.wind.speed + " km / h";
  let weatherIconId = data.weather[0].icon;
  let weatherIconElement =  document.getElementById("top__section-weatherIcon")
  weatherIconElement.innerHTML = `<img style="height:100px; width:100px;"src="https://openweathermap.org/img/w/${weatherIconId}.png">`;
  document.getElementById("temp_min").innerHTML = data.main.temp_min + ' °C';
  document.getElementById("temp_max").innerHTML = data.main.temp_max + ' °C'; 
  document.getElementById("footer").innerHTML = `&copy Hanok Tamang. All rights reserved. Made with <a href="https://openweathermap.org/" target="_blank">openWeatherMap</a>`;


}

// Function to retrieve weather data from the OpenWeatherMap API

async function retrievedData(cityName){
   try{
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${weatherApiKey}&units=${units}`)
    let data = await response.json()
        if(data.cod > 400) {
            return data;
        } else{
        console.log(cityName);
        console.log("Data fetched from api");
        
        dataToDatabase(data);  
        return data;
        }
    } catch (error) {
        document.querySelector(".errorMessage_content").textContent 
        = `Failed to get weather details of ${cityName}, please try again.`;
   } 

} 

// Function to display the current time
async function clock() {
  let today = new Date();
  let hours = today.getHours();
  let minutes = today.getMinutes();
  let seconds = String(today.getSeconds()).padStart(2, '0');
  let timePeriod = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; //covert 0 to 12
  let time = hours + ":" + (minutes < 10 ? '0' + minutes : minutes) + ":" + seconds +  ' ' + timePeriod;
  document.getElementById('time').textContent = time;  
}
// Update the seconds every second
setInterval(clock, 1000);

// Function to handle errors in weather data retrieval
function errorHandling(data) {
  if(data.cod < 400) {
    return true;
  }
  return false;
}

// Main function to be executed when the page loads
async function main() {

    localData = JSON.parse(localStorage.getItem(defaultLocation));

    if(navigator.onLine){
      console.log("Online");
      if(localData == null) {
       data = await retrievedData(defaultLocation);
     
        let today = new Date();
        let date = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
        data["date"] = date;
     //    console.log(data);
        localStorage.setItem(defaultLocation, JSON.stringify(data));
         display(data); 
       
      } 
      else{
        let today = new Date();
        let date = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
        //  data["date"] = date;
        if(date == localData["date"]){
          console.log(defaultLocation);
          console.log("Fetched from local storage.");
          display(localData);
        } else{
          data = await retrievedData(defaultLocation);
          console.log(data);
          display(data);
        }
      }
    } else{
      console.log("Offline")
      localData = JSON.parse(localStorage.getItem(defaultLocation));
      if(localData == null ){
        alert(`Sorry, ${defaultLocation} city data not available`)
      }else{
        display(localData);
        console.log(defaultLocation);
        console.log("Data from Local storage")
      }
    }

  } 


// searched the entered city name while clicking enter key is pressed
document.querySelector("input").addEventListener("keypress", function(event) {
     if (event.key === "Enter") {
         event.preventDefault();
         city = document.querySelector("#searchLocation").value;
         if(city == ""){
          alert("Please enter a city name.")
         } else{

          function capitalizeWords(preStr) {
            return preStr.split(' ').map(word => {
                if (word.length > 0) {
                    return word[0].toUpperCase() + word.slice(1).toLowerCase();
                }
                return word;
            }).join(' ');
        }
        let searchedCity = capitalizeWords(city);
        // console.log(searchedCity);
        fetchWeather(searchedCity);
         }
     }
 });

// Hide the preloader element when the page is fully loaded
let loader = document.getElementById("preloader");
window.addEventListener("load", function(){
  this.setTimeout(() => {
    loader.style.display = "none";
  }, 2000)
})

// triggers history page
document.querySelector(".history").addEventListener("click", () => {
  console.log("Button clicked!");
  let city = document.getElementById("name").textContent;
  window.location.href = `history.html?city=${city}`;
});

// searched the entered city name while clicking search button
document.getElementById("Search").addEventListener("click", function buttonClick() {
    try{
    searchedCity = document.querySelector("#searchLocation").value;
    // console.log(searchedCity);
    if(searchedCity == ""){
      alert("Please enter a city name.")
     } else{
      fetchWeather(searchedCity);
     }
    } catch (error) {
        console.error("Error handling the 'search' buton click: ", error);
    }
})

//calling the functions
main()
clock()


