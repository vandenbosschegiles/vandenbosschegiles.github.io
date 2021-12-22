"use strict";
let visible = 1;

const chartCelcius = function() {
const xmlhttp = new XMLHttpRequest();
const url = "http://127.0.0.1:5502/../script/weather_celcius_today.json";
xmlhttp.open("GET",url, true)
xmlhttp.send();
xmlhttp.onreadystatechange = function(){
  
  if(this.readyState == 4 && this.status == 200){
    
    const data = JSON.parse(this.responseText);
    // console.log(data)
    const temps = data.hourly.map(function(elem){
        // console.log(temps)
        return Math.round(elem.temp);
    });
    const hours = data.hourly.map(function(elem){
      return _parseMillisecondsIntoReadableTime(elem.dt) ;
    });
    temps.length = 12;
    hours.length = 12;
    // console.log(temps)
    // console.log(hours)
    const ctx = document.getElementById('canvas').getContext('2d');
    const myChartCelc = new Chart(ctx, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Temp',
                data: temps,
                backgroundColor: [
                    'rgba(0, 0, 0, 1)'
                ],
                borderColor: [
                    'rgba(121, 199, 166, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
          legend: {
            labels: {
                fontColor: "red"
            }
        },
          responsive: true,
          maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    min: -10,
                    max: 40
                }
            },
      }
        
    });
      }
}

};


 const chartFahrenheit = function() {
  const xmlhttp = new XMLHttpRequest();
  const url = "http://127.0.0.1:5502/../script/weather_fahrenheit_today.json";
  xmlhttp.open("GET",url, true)
  xmlhttp.send();
  xmlhttp.onreadystatechange = function(){
    
    if(this.readyState == 4 && this.status == 200){
      
      const data = JSON.parse(this.responseText);
      // console.log(data)
      const temps = data.hourly.map(function(elem){
          return Math.round(elem.temp);
      });
      const hours = data.hourly.map(function(elem){
        return _parseMillisecondsIntoReadableTime(elem.dt) ;
      });
      temps.length = 12;
      hours.length = 12;
      // console.log(temps)
      // console.log(hours)
      const ctx1 = document.getElementById('canvas1').getContext('2d');
      const myChartFahr = new Chart(ctx1, {
          type: 'line',
          data: {
              labels: hours,
              datasets: [{
                  label: 'Temp1',
                  data: temps,
                  backgroundColor: [
                      'rgba(0, 0, 0, 1)'
                  ],
                  borderColor: [
                      'rgba(122, 199, 166, 1)'
                  ],
                  borderWidth: 1
              }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
              scales: {
                  y: {
                      beginAtZero: true,
                      min: 0,
                      max: 104
                  }
              },
        }
          
      });
        }
  }
  
  };

function change_table() {
  const t1 = document.querySelector("#table1");
  const t2 = document.querySelector("#table2");
  const c1 = document.querySelector("#chartcelc");
  const c2 = document.querySelector("#chartfahr");
  // console.log(t2)
  if(visible == 2) {
    visible = 1;
    t1.style.display = 'none';
    t2.style.display = 'block';
    c1.style.display = 'none';
    c2.style.display = 'block';
  } else {
    visible = 2;
    t1.style.display = 'block';
    t2.style.display = 'none';
    c1.style.display = 'block';
    c2.style.display = 'none';
  }
}
function _parseMillisecondsIntoReadableTime(timestamp) {
	//Get hours from milliseconds
	const date = new Date(timestamp * 1000);
	// Hours part from the timestamp
	const hours = '0' + date.getHours();
	// Minutes part from the timestamp
	const minutes = '0' + date.getMinutes();
	// Seconds part from the timestamp (gebruiken we nu niet)
	// const seconds = '0' + date.getSeconds();

	// Will display time in 10:30(:23) format
	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

const dayToENG = function(daynumber) {
    if (daynumber >= 0 && daynumber <= 6) {
      let arrdagen = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ];
      return arrdagen[daynumber];
    } else {
      return "niet gevonden";
    }
};

const monthToENG = function(monthNumber) {
    if (monthNumber >= 0 && monthNumber <= 12) {
      let arrMonths = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ];
      return arrMonths[monthNumber];
    } else {
      return "niet gevonden";
    }
};

const weatherCodeToImage = function(code) {
  // als de code niet uit 3 tekens bestaat, thorw een error
  if (code.toString().length === 3) {
    let codeString = code.toString();
    let eersteDigit = codeString.substring(0, 1);
    let image = "";

    switch (eersteDigit) {
      case "2": //Onweer
        image = "weer_onweer.svg";
        break;
      case "3": //lichte regen
        image = "weer_regen.svg";
        break;
      case "5": //regen
        image = "weer_regen.svg";
        break;
      case "6": //sneeuw
        image = "weer_sneeuw.svg";
        break;
      case "7": //mist
        image = "weer_mist.svg";
        break;
      case "8": //helder / bewolkt
        if (codeString === "800") {
          image = "weer_helder.svg";
        } else if (codeString === "801") {
          image = "weer_helder-wolk.svg";
        } else if (codeString === "802") {
          image = "weer_helder-wolk.svg";
        } else {
          image = "weer_helder-wolk.svg";
        }
        break;
      case "9": //storm
        image = "weer_onweer.svg";
        break;
    }
    return image;
  }
};

const showWeatherWeekCelcius = queryResponse =>  {
  const totalDays = queryResponse.daily.length;
  const nextdays = document.querySelector(".js-forecastcelcius__table");
  let htmlString = "";
  // console.log(`Aantal dagen: ${totalDays}`);
  for (let i = 1; i < totalDays; i++) {
    const element = queryResponse.daily[i];
    // console.log(element)
    const datumUTC = element.dt;
    const date = new Date(datumUTC * 1000);
    const dayName = dayToENG(date.getDay());
    const weatherIcon = element.weather[0].id;
    const weatherType = element.weather[0].main;
    const weatherRain = element.humidity;
    const tempMax = Math.round(element.temp.max);
    const tempMin = Math.round(element.temp.min);
    // console.log(`Het weerweatherIcon ${tempMax}`);
    // <td class="c-rainchance">
    
    htmlString = `          
                <tr>
                  <td class="c-day-name">${dayName}</td>
                  <td>
                      <svg class="c-raindrop__icon" id="Layer_1" data-name="Layer 1"
                          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 199.33 216.17">
                          <g>
                              <path id="raindrop" class="cls-2"
                                  d="M99.86,193.68c-35.19-.05-63.63-27.74-62.54-61,.34-10.25,3.57-19.89,7.35-29.3,13.64-34,33-64.77,53.29-95,1.09-1.62,2-3.23,3.79-.55,22.31,33.81,44.18,67.79,57.5,106.5C173.75,156.37,140.48,193.9,99.86,193.68Z"
                                  transform="translate(-0.34 13.85)" />
                          </g>
                      </svg> ${weatherRain}%
                  </td>
                  <td><img class="c-weather-type" src="/images/weericonen/${weatherCodeToImage(
                    weatherIcon
                  )}" alt="${weatherType}" /></td>
                  <td><span class="c-min-temp"> Min. ${tempMin}°C </span> </td>
                  <td><span class="c-max-temp">
                          Max. ${tempMax}°C
                      </span></td>
              </tr>`
    nextdays.innerHTML += htmlString;
  }
}

const showWeatherWeekFahrenheit= queryResponse =>  {
  console.log("functie wordt uitgevoerd")
  const totalDays = queryResponse.daily.length;
  // console.log(totalDays)
  const nextdays = document.querySelector(".js-forecastfahrenheit__table");
  let htmlString = "";
  // console.log(`Aantal dagen: ${totalDays}`);
  for (let i = 1; i < totalDays; i++) {
    const element = queryResponse.daily[i];
    // console.log(element)
    const datumUTC = element.dt;
    const date = new Date(datumUTC * 1000);
    const dayName = dayToENG(date.getDay());
    const weatherIcon = element.weather[0].id;
    const weatherType = element.weather[0].main;
    const weatherRain = element.humidity;
    const tempMax = Math.round(element.temp.max);
    const tempMin = Math.round(element.temp.min);

    htmlString = `               
                <tr>
                  <td class="c-day-name">${dayName}</td>
                  <td>
                      <svg class="c-raindrop__icon" id="Layer_1" data-name="Layer 1"
                          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 199.33 216.17">
                          <g>
                              <path id="raindrop" class="cls-2"
                                  d="M99.86,193.68c-35.19-.05-63.63-27.74-62.54-61,.34-10.25,3.57-19.89,7.35-29.3,13.64-34,33-64.77,53.29-95,1.09-1.62,2-3.23,3.79-.55,22.31,33.81,44.18,67.79,57.5,106.5C173.75,156.37,140.48,193.9,99.86,193.68Z"
                                  transform="translate(-0.34 13.85)" />
                          </g>
                      </svg> ${weatherRain}%
                  </td>
                  <td><img class="c-weather-type" src="/images/weericonen/${weatherCodeToImage(
                    weatherIcon
                  )}" alt="${weatherType}" /></td>
                  <td><span class="c-min-temp"> Min. ${tempMin}°F </span> </td>
                  <td><span class="c-max-temp">
                          Max. ${tempMax}°F
                      </span></td>
              </tr>`
      nextdays.innerHTML += htmlString;
  }
}
// Met de data van de API kunnen we de app opvullen
const showWeatherTodayCelc = queryResponse =>  {
	const currentTemp = document.querySelector('.js-current-temp');
	const dateName = document.querySelector('.js-forecast__date');
  const city = document.querySelector('.js-forecast__city');
  const sunrise = document.querySelector('.js-sunrise');
  const sunset = document.querySelector('.js-sunset');
  const weatherIcon = document.querySelector('.js-forecast__today');
  const windSpeed  = document.querySelector('.js-forecast__windspeed');
  const rainChance = document.querySelector('.js-forecast__rain');
  
  // const country = document.querySelector('.js-forecast__country');
	// const location = document.querySelector('.js-weather-placeholder');
  const dayUTC = queryResponse.current.dt;
  const currentDay = new Date(dayUTC * 1000);
  // console.log(`De dag van vandaag is: ${currentDay}`)
  const dayName = dayToENG(currentDay.getDay());
  // console.log(`De dag van vandaag is: ${dayName}`)
  const monthName = monthToENG(currentDay.getMonth());
  // console.log(`De maandnummer van vandaag is: ${currentDay.getMonth()}`)
  // console.log(`De maand van vandaag is: ${monthName}`)
  const dayDate =  currentDay.getDate();
  //console.log(`De dag van vandaag is: ${dayDate}`)
  const cityName = queryResponse.city;
  const countryName = queryResponse.country;
  const sunriseTime = _parseMillisecondsIntoReadableTime(queryResponse.current.sunrise);
  const sunsetTime = _parseMillisecondsIntoReadableTime(queryResponse.current.sunset);
  const rainProb = queryResponse.current.humidity;
  const wind = queryResponse.current.wind_speed;
  // console.log(wind)
  const icon = queryResponse.current.weather[0].id;
  // console.log(icon);
  currentTemp.innerHTML = `${Math.round(queryResponse.current.temp)}°C`;
  dateName.innerHTML = `${dayName}, ${dayDate} ${monthName}`;
  city.innerHTML = `${cityName}, ${countryName}`;
  sunrise.innerHTML = `Sunrise ${sunriseTime}`;
  sunset.innerHTML = `Sunset ${sunsetTime}`;
  rainChance.innerHTML = `${rainProb}%`;
  windSpeed.innerHTML = `${wind}km/u`;
  weatherIcon.innerHTML = `<img class="c-forecast__symbol" src="images/weericonen/${weatherCodeToImage(icon)}"> <h3 class="c-title__today">Today </h3 />`
}


const showWeatherTodayFahr = queryResponse =>  {
	const currentTemp = document.querySelector('.js-current-temp');
	const dateName = document.querySelector('.js-forecast__date');
  const city = document.querySelector('.js-forecast__city');
  const sunrise = document.querySelector('.js-sunrise');
  const sunset = document.querySelector('.js-sunset');
  const weatherIcon = document.querySelector('.js-forecast__today');
  const windSpeed  = document.querySelector('.js-forecast__windspeed');
  const rainChance = document.querySelector('.js-forecast__rain');
  const dayUTC = queryResponse.current.dt;
  const currentDay = new Date(dayUTC * 1000);
  console.log(currentDay)
  const dayName = dayToENG(currentDay.getDay());
  const monthName = monthToENG(currentDay.getMonth());
  const dayDate =  currentDay.getDate();
  console.log(`De dag van vandaag is: ${dayDate}`)
  const cityName = queryResponse.city;
  // console.log(`Dit is de City: ${cityName}`)
  const countryName = queryResponse.country;
  const sunriseTime = _parseMillisecondsIntoReadableTime(queryResponse.current.sunrise);
  const sunsetTime = _parseMillisecondsIntoReadableTime(queryResponse.current.sunset);
  const rainProb = queryResponse.current.humidity;
  const wind = queryResponse.current.wind_speed
  const icon = queryResponse.current.weather[0].id;
  // console.log(icon);
  currentTemp.innerHTML = `${Math.round(queryResponse.current.temp)}°F`;
  dateName.innerHTML = `${dayName}, ${dayDate} ${monthName}`;
  city.innerHTML = `${cityName}, ${countryName}`;
  sunrise.innerHTML = `Sunrise ${sunriseTime}`;
  sunset.innerHTML = `Sunset ${sunsetTime}`;
  weatherIcon.innerHTML = `<img class="c-forecast__symbol" src="images/weericonen/${weatherCodeToImage(icon)}"> <h3 class="c-title__today">Today </h3 />`
  rainChance.innerHTML = `${rainProb}%`;
  windSpeed.innerHTML = `${wind}MPH`;
}


const filterUnit =  function(){
  const arrSwitch = document.querySelector('input[type="checkbox"]');
  arrSwitch.addEventListener('change', function () {
  if (arrSwitch.checked) {
      handleData(
        `http://127.0.0.1:5502/../script/weather_fahrenheit_today.json`,
        showWeatherTodayFahr);
    console.log('Checked');
    visible = 2
    change_table();
    // chartFahrenheit();
  } else {
    // do that
    handleData(
      `http://127.0.0.1:5502/../script/weather_celcius_today.json`,
      showWeatherTodayCelc);
    console.log('Not checked');
    visible = 1
    change_table();
    //chartCelcius();
  }
  });

}


const get = (url) => fetch(url).then((r) => r.json());
// Hier wordt de API opgehaald
const getAPI = async () => {
	
	const urlToday = `http://127.0.0.1:5502/../script/weather_celcius_today.json`;
	const weatherTodayData = await get(urlToday);
	// console.log(weatherTodayData)
  const urlWeekCelcius = `http://127.0.0.1:5502/../script/weather_celcius_week.json`;
  const weatherWeekDataCelcius = await get(urlWeekCelcius);
  // console.log(weatherWeekDataCelcius)
	const urlWeekFahrenheit = `http://127.0.0.1:5502/../script/weather_fahrenheit_week.json`;
  const weatherWeekDataFahrenheit = await get(urlWeekFahrenheit);
	// Eerst bouwen we onze url op
	// Met de fetch API proberen we de data op te halen.
	// Als dat gelukt is, gaan we naar onze showResult functie.
	showWeatherTodayCelc(weatherTodayData);
  showWeatherWeekCelcius(weatherWeekDataCelcius);
  showWeatherWeekFahrenheit(weatherWeekDataFahrenheit);
  
  filterUnit();
  // drawChart(weatherTodayData);
};

document.addEventListener('DOMContentLoaded', function() {
	getAPI();
  chartCelcius();
  chartFahrenheit();
  change_table();
  
});
  