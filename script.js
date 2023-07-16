
function onboarding(){
    const locationName = "powys";
    const appid = "1777b6252cacbfaadcdd94227bf20ba6";
    const units = "metric";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${locationName}&appid=${appid}&units=${units}`;
    fetch(url)
    .then((response) => response.json())
    .then((data) => {
        searchResponse(data);
    
    })

}

let fetchData = function fetchWeather(locationName){
    return new Promise((resolve, reject) => {
        locationName = document.getElementById("locationName").value;
        const appid = "1777b6252cacbfaadcdd94227bf20ba6";
        const units = "metric";
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${locationName}&appid=${appid}&units=${units}`;
        data = fetch(url)
        .then((response) => {
          if (!response.ok) {
            if (response.status === 404) {
              throw new Error("Location not found");
            } else if (response.status === 500) {
              throw new Error("Internal server error.");
            }else if (locationName.length == 0) {
              throw new Error("Enter a location Name.");
            } else {
              throw new Error("An error occurred");
            }
          }
          return response.json();
        })
          .then((data) => {
              resolve(data);  
        })
        .catch((error) => {
          reject((error.message));
        })
    })   
}

function clock() {
  let today = new Date();
  let hours = today.getHours();
  let minutes = today.getMinutes();
  let seconds = String(today.getSeconds()).padStart(2, '0');
  let timePeriod = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; //covert 0 to 12
  let time = hours + ":" + (minutes < 10 ? '0' + minutes : minutes) + ":" + seconds +  ' ' + timePeriod;
  setTimeout(() =>{
    document.getElementById('time').textContent = time;
  },1000) 
  
}

// Update the seconds every second
setInterval(clock, 1000);

function searchResponse(data) {
    let today = new Date();
    let months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
    let monthIndex = today.getMonth();
    let monthName = months[monthIndex];
    let dates = today.getDate() + " " + monthName + " " + today.getFullYear();
    let daysOfWeek = ["Sunday", "Monday", "Tuesday" , "Wednesday", "Thursday", "Friday", "Saturday"];
    let dayIndex = today.getDay();
    let dayName = daysOfWeek[dayIndex];  
    
    document.getElementById("date").innerHTML = dates;
    document.getElementById("day").innerHTML = dayName;
    document.getElementById("name").innerHTML = data.name + ",";
    document.getElementById("country").innerHTML = data.sys.country;
    let description = data.weather[0].description;
    let weatherDescription = description.charAt(0).toUpperCase() + description.slice(1);
    document.getElementById("weather_description").innerHTML = weatherDescription;
    document.getElementById("temperature").innerHTML = data.main.temp + " °C" ;
    document.getElementById("humidity").innerHTML =  `<img width="30" height="30" style="filter: invert(100%)"; src="https://img.icons8.com/external-yogi-aprelliyanto-glyph-yogi-aprelliyanto/32/000000/external-humidity-smart-farm-yogi-aprelliyanto-glyph-yogi-aprelliyanto.png" alt=""/>` + data.main.humidity + " %" ;
    document.getElementById("pressure").innerHTML = `<img width="30" height="30" style="filter: invert(100%)"; src="https://img.icons8.com/ios/50/3d-touch.png" alt="3d-touch"/>` +  data.main.pressure + " Pa";
    document.getElementById("wind_speed").innerHTML = `<img width="30" height="30" style="filter: invert(100%)"; src="https://img.icons8.com/ios-filled/50/000000/wind--v1.png" alt="wind--v1"/>` +  data.wind.speed + " km / h";
    const weatherIconId = data.weather[0].icon;
    const weatherIconElement =  document.getElementById("top__section-weatherIcon")
    weatherIconElement.innerHTML = `<img style="height:100px; width:100px;"src="http://openweathermap.org/img/w/${weatherIconId}.png">`;
    document.getElementById("temp_min").innerHTML = data.main.temp_min + ' °C';
    document.getElementById("temp_max").innerHTML = data.main.temp_max + ' °C'; 
    document.getElementById("footer").innerHTML = `&copy Hanok Tamang. All rights reserved. Made with <a href="https://openweathermap.org/" target="_blank">openWeatherMap</a>`
}

function setData(data){
   setTimeout(()=>{
       searchResponse(data);
   }, 1000);
}

async function main() {
  let errorMessageElement = document.querySelector(".errorMessage");
  const mainSection = document.querySelector(".container");
  let bodySection = document.querySelector('body');
 try {
     const locationName = document.querySelector("#locationName").value;
     data = await fetchData(locationName);
     setData(data);
     mainSection.style.display = "block";
     errorMessageElement.style.display = "none";
     bodySection.style.backgroundColor = "#4b595e";
    
 } catch (error) {
    mainSection.style.display = "none";
    bodySection.style.backgroundColor = "#4f595d";
    errorMessageElement.style.display = "block";
    errorMessageElement.innerHTML = `<img width="70" height="70" style="filter: invert(100%)"; 
                                      src="https://img.icons8.com/ios/50/broken-robot.png" alt="broken-robot"/>
                                       <h3>An error occured :</h3> ${error}`;
     
 }
} 

// loading page
let loader = document.getElementById("preloader");
window.addEventListener("load", function(){
  this.setTimeout(() =>{
    loader.style.display = "none"
  }, 4000)
})


document.getElementById("Search").addEventListener("click", main);
document.querySelector("input").addEventListener("keypress", function(event) {
     if (event.key === "Enter") {
         event.preventDefault();
         main();
     }
 });

onboarding()
clock()

