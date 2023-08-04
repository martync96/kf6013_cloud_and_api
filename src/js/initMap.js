$(document).ready(function () {
    //initialise the map
    function initMap() {
        let map;
        let mapOptions = {
            center: new google.maps.LatLng(54.976713, -1.60728),
            zoom: 20,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: true,
            overviewMapControl: false,
            rotateControl: false,
            scaleControl: false,
            panControl: false,
        };

        map = new google.maps.Map(document.getElementById('map'), mapOptions);

        const modal = document.getElementById("myModal");
        const closeBtn = document.querySelector(".close");
        
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });

        //latitude and longitude of Living Planet's HQ
        let lat = "54.976713";
        let lang = "-1.60728";

        //LatLngBounds object for adjusting zoom of map based on markers
        var bounds = new google.maps.LatLngBounds();

        //array of marker icon urls
        const markers =
        {
            climatechange: "./img/climatechange.png",
            netzero: "./img/netzero.png",
            combined: "./img/combined.png",
        }

        //make new directions service and renderer
        directionsService = new google.maps.DirectionsService();
        let directionsRenderer = new google.maps.DirectionsRenderer({
            map: map,
        });

        //function to plot the directions on the map code adapted from distance matrix work done by Kay Rogage
        function plotDirections(data) {

            let origin1 = "NE1 8ST";
            let destination1 = data.results[0].formatted_address;

            directionsService.route(
                {
                    origin: origin1,
                    destination: destination1,
                    travelMode: google.maps.TravelMode.DRIVING,
                    unitSystem: google.maps.UnitSystem.IMPERIAL,
                    avoidHighways: false,
                    avoidTolls: false

                    //when the service responds run the callback function   
                }, directionsCallback);

            function directionsCallback(response, status) {

                clearDirections(directionsRenderer)

                //if the status is OK then procedd to get the journey details.
                if (status == google.maps.DirectionsStatus.OK) {

                    //use index notation to access the route and steps, they're consistent across the board 
                    const route = response.routes[0];
                    const steps = route.legs[0].steps;

                    let directions = '<h3>Directions:</h2>';

                    steps.forEach(function (step, index) {

                        directions += `${index + 1}. ${step.instructions}<br>`; //loop through each step and 

                    });

                    // Display the directions in the specified container div
                    const directionsContainer = document.getElementById("directions");
                    directionsContainer.innerHTML = directions; //send directions to HTML
                    directionsRenderer.setDirections(response); //render directions to map 

                }
            }
        }

        $.getJSON("http://api.geonames.org/findNearByWeatherJSON?lat=" + lat + "&lng=" + lang + "&username=martync", function (result) {


            var weather = result.weatherObservation;

            $("#station-name").text(weather.stationName);
            $("#clouds").text(weather.clouds);
            $("#humidity").text(weather.humidity);
            $("#windspeed").text(weather.windSpeed);

        })

        // load in the json file
        $.getJSON("./data/kf6013_assignment_data.json", function (data) {

            //loop through each object
            data.statuses.forEach(function (status) {

                //convert all the text to lower case
                var text = status.text.toLowerCase();
                var hashTag = ""; //initialise hashtag variable

                //check if any of the tweets contain the two hashtags 
                if (text.includes('#climatechange') || text.includes('#netzero')) {

                    //if tweet contains either hashtag, call this function and check which which combination of hashtags they have
                    hashTag = hashTagCheck(text, hashTag);

                    //function call to check location of a tweet
                    checkLocation(status.user.location, status.user.name, status.text, hashTag)

                    // Create a new tweet box element
                    var tweetBox = $("<div>").addClass("tweet-box").html("<p>" + text + "</p>");

                    // Append the tweet box element to the feed
                    $("#tweet-feed").append(tweetBox);
                }
            })
        });

        function hashTagCheck(text, hashTag) {

            //sets hashTag variable to combined, netzero or climatechange depending on what hashtags are contained
            if (text.includes('#climatechange') && text.includes('#netzero')) {
                hashTag = "combined";
            } else if (text.includes('#netzero')) {
                hashTag = "netzero";
            } else if (text.includes('#climatechange')) {
                hashTag = "climatechange";
            }

            return hashTag;

        }

        function checkLocation(location, username, text, hashTag, callback) {
            //checks location in user profile isn't empty
            if (location !== "") {
                //function call to check whether that country is great britain 
                countryCheck(location, function (isGB) {
                    //if country is GB, call function to plot market 
                    if (isGB) {
                        plotMarkers(location, username, text, hashTag, bounds)
                    }
                });
            }
        }

        function countryCheck(location, callback) {

            var isGB = false;

            $.post("https://maps.googleapis.com/maps/api/geocode/json?&address=" + location + "&key=AIzaSyCn_BsG8u9vl5pnJaLtV4VC2qOANLLurxY", function (data) {
                $.each(data.results, function (index, item) {
                    $.each(item.address_components, function (index, component) {
                        if (component.short_name === "GB") {
                            isGB = true;
                            callback(isGB); // Call the callback with the result
                            return false; // Exit loop
                        }
                    });
                    if (isGB) {
                        return false; // Exit loop
                    }
                });
                if (!isGB) {
                    callback(isGB); // Call the callback with the result
                }
            });
        }

        function clearDirections(directionsRenderer) {

            directionsRenderer.setDirections({ routes: [] }); //reset the route so multiple routes are not plotted

        }

        //Gets the geolocation of a tweet and then plots markers on a map
        function plotMarkers(location, username, text, hashTag, bounds) {

            $.post("https://maps.googleapis.com/maps/api/geocode/json?&address=" + location + "&components=country:GB&key=AIzaSyCn_BsG8u9vl5pnJaLtV4VC2qOANLLurxY", function (data) {

                //saves the latitude and longitude to variables 
                var markerLat = parseFloat(data.results[0].geometry.location.lat)
                var markerLang = parseFloat(data.results[0].geometry.location.lng)

                const tweetInfo =
                    '<div id="content">' +
                    '<div id="siteNotice">' +
                    "</div>" +
                    '<h1 id="firstHeading" class="firstHeading">' + username + '</h1>' +
                    '<div id="bodyContent">' +
                    "<p>" + text + "</p>" +
                    "</div>" +
                    "</div>";

                const tweetMarker = new google.maps.Marker({
                    position: { lat: markerLat, lng: markerLang },
                    map,
                    icon: markers[hashTag], //sets icon: to the correspending value of hashTag which are stored in an array
                });

                bounds.extend(tweetMarker.getPosition());

                const tweetWindow = new google.maps.InfoWindow({
                    content: tweetInfo,
                    arialabel: "hi",
                });

                //event listener to display window on mouseover
                tweetMarker.addListener("mouseover", () => {
                    tweetWindow.open({
                        anchor: tweetMarker,
                        map,
                    })
                });

                //event listener to close window upon exit hovering
                tweetMarker.addListener("mouseout", () => {
                    tweetWindow.close()
                });

                tweetMarker.addListener("click", () => {

                    plotDirections(data);
                    getDistance(data);
                    UpdateWeather(markerLat, markerLang, location)
                    modal.style.display = "block";

                });

                map.fitBounds(bounds);
            });

            function UpdateWeather(markerLat, markerLang, location) {

                //pass the lat and long of the marker to the geoNames API
                $.getJSON("http://api.geonames.org/findNearByWeatherJSON?lat=" + markerLat + "&lng=" + markerLang + "&username=martync", function (result) {

                    //save the returned object to a variable
                    var weather = result.weatherObservation;

                    $("#weatherLocation").text(location); //update the header to show new location instead of living planet HQ
                    //write the other variables to markers
                    $("#station-name").text(weather.stationName);
                    $("#clouds").text(weather.clouds);
                    $("#humidity").text(weather.humidity);
                    $("#windspeed").text(weather.windSpeed);

                })
            }

            //Code adapted from work done by Kay Rogage 
            function getDistance(data) {

                let origin = "NE1 8ST";
                let destination = data.results[0].formatted_address; //index notation used to access the first result
                let service = new google.maps.DistanceMatrixService();

                //call the getDistanceMatrix
                service.getDistanceMatrix(
                    {
                        //pass in the origin and destination values and set the other values such as travelmode etc
                        origins: [origin],
                        destinations: [destination],
                        travelMode: google.maps.TravelMode.DRIVING,
                        unitSystem: google.maps.UnitSystem.IMPERIAL,
                        avoidHighways: false,
                        avoidTolls: false


                    }, distanceMatrixCallback); //when the service responds run the callback function


                //get the response and status details from the call to the getDistanceMatrix
                function distanceMatrixCallback(response, status) {

                    //if status okay proceed with function
                    if (status == google.maps.DistanceMatrixStatus.OK) {

                        //get origin and destination for jouney
                        let origins = response.originAddresses;
                        let destinations = response.destinationAddresses;

                        //loop through each step and save row to results
                        $.each(origins, function (originIndex) {
                            let results = response.rows[originIndex].elements;
                            //loop through each result and save to variables 
                            $.each(results, function (resultIndex) {
                                let element = results[resultIndex];
                                let distance = element.distance.text;
                                let duration = element.duration.text;
                                let from = origins[originIndex];
                                let to = destinations[resultIndex];

                                //for each journey create a div element using jQuery to display the journey information 
                                $("#distance").empty().prepend("<dl id='distance-dl'><dt>Distance: </dt><dd>" +
                                    distance + "</dd> <dt>Duration: </dt><dd>" +
                                    duration + "</dd> <dt>From: </dt><dd>" +
                                    from + "</dd> <dt>To: </dt><dd>" +
                                    to + "</dd> </dl>");
                            });
                        });
                    }
                }
            }
        }
    }
    window.initMap = initMap;
});





