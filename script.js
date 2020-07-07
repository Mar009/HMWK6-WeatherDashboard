// Store previous locations in local storage in an array
var prevLocations = [];
    // Have said locations populate id= savedSearches
function start(){
    prevLocations= JSON.parse(localStorage.getItem("weathercities"));
}

//show the prevLocations
function prevLocationsShow  (){
    if (prevLocations){
        // make the btns for the previous locations
        var btn = $("<div>").attri("class","list group");
        for (var i=0; i< prevLocations.length; i++){
            btnLocation= $("<a>").attri("href","#").attri("id", "btn").text(prevLocations[i]);
            btnLocation.prepend(btn)
        }
    }
    $("#savedSearches").append(btn);
}

// get weather data from user input for present day api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}
function getWeather(city){
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=7e3154185511d5ccdc5d2529706fdf8f&units=imperial";
    $.ajax({
        url: queryURL,
        method: "GET",
       
    }).then(function (response){
      // create card with data in id = forecastData 
        var cardCurrentCity= $("<div>").attr("class", "card bg-light");
        $("#forecastData").append(cardCurrentCity);

        // Head of card = location from user input 
        var locationHead=$("<div>").attr("class","card-header").text("Current weather: " + response.name);
        cardCurrentCity.append(locationHead);

        //  row needs to be created to add icons 
        var cardRows=$("<div>").attr("class", "row no-gutters");
        cardCurrentCity.append(cardRows);

        // get icons 
        var icon=  "https://openweathermap.org/img/wn/" + response.weather[0].icon+ "@2x.png";
        var imgIcon= $("<div>").attr("class","col-md-4").append($("<img>").attr("src",icon).attr("class","card-img"));
        cardRows.append(imgIcon);

        // add text space 
        var textSpace = $("<div>").attr("class","col-md-8");
        // add text space to the body of the card
        var body= $("<div>").attr("class","card-body");
        textSpace.append(body);

        // Insert the following required data 
        // city name 
        body.append($("<h1>").attr("class","card-title").text(response.name));

        // temp in F so conversion 
        body.append($("<p>").attr("class","card-text").html("Temp: "+response.main.temp + "&#8457;"));

        // Humidity in % 
        body.append($("<p>").attr("class","card-text").text("Humidity: "+ response.main.humidity + "%"));

        // Wind speed in MPH 
        body.append($("<p>").attr("class","card-text").text("Winds: "+ response.wind.speed+"MPH"));

        cardRows.append(textSpace);
        getWeather(response.id);
    });


    
}


        
// get the 5 day forecast from https://api.openweathermap.org/data/2.5/forecast?id= + city + api key w/ &units=imperial
function futureForecast(city) {
    var queryURL= "https://api.openweathermap.org/data/2.5/forecast?id=" + city + "&appid=7e3154185511d5ccdc5d2529706fdf8f&units=imperial";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
         // add container for the new cards 
         var rowNew = $("<div>").attr("class","forecast");
         $("#forecastData").append(rowNew);
      
         // Go through an array to find forecasts for 14 hr 
         for (var i=0 ; i< response.list.length; i++){
            // make new card
            var newColumn= $("<div>").attr("class", "one-fifth");
            rowNew.append(newColumn);

            // add to card head with date & append
             var newCardSpace = $("<div>").attr("class", "card text-grey bg-primary");
            newColumn.append(newCardSpace);
            var dateHeader = $("<div>").attr("class", "card header").text(moment(response.list[i].dt, "x").format('L'));
            newCardSpace.append(dateHeader);

            // add img & append 
            var imgCard= $("<img>").attr("class","card-img-top").attr("src", "https://openweathermap.org/img/wn/"+response.list[i].weather[0].icon + "@2x.png");
            newCardSpace.append(imgCard);

            // Add body & append to card 
             var cardBody=$("<div>").attr("class","card-body");
            newCardSpace.append(cardBody);
            // append with temp & humidity to body 
            cardBody.append($("<p>").attr("class", "card-text").html("Temp: "+response.list[i].main.temp+"F"));
            cardBody.append($("<p>").attr("class", "card-text").text("Humidity: " + response.list[i].main.humidity + "%"));
         }

    });       
        
}



// clear 
function clear(){
    $("#forecastData").empty();
}

// save prevLocations in local storage & push into array 
function savePrev(locationsOld){
   prevLocations.push(locationsOld);
   localStorage.setItem("weathercities",JSON.stringify(prevLocations))
   prevLocationsShow();
}




// click event on the id=btnSearch
$("#btnSearch").on("click",function(){
    //event default 
    event.preventDefault();
    // grab the input 
    var location=$("#userSearch").val().trim();
    // IF NOT EMPTY then clear 
    if (location !== ""){
        clear();
        $("#userSearch").val("");

         // get weather data 
        getWeather(location);

    }

});



// only on search btn 
$(document).on("click", "#btnSearch",function(){
    clear();
    prevLocationsShow();
    getWeather();
})


start();

