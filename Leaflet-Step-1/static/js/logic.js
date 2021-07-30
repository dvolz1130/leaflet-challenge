
// Get the data set
//var allMonth = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Read in the json data
// d3.json(allMonth).then(function (data) {
//     //console.log(data.features);
//     createMarkers(data.features)
// });
//d3.json(allMonth).then(createMarkers);

var quake = new L.LayerGroup();

// create map 
// create tile layers for the background
var satMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery Â© <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
});

var maplite = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery Â© <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox/light-v10",
    accessToken: API_KEY
});


// base layer
var baseMaps = {
    "SatelliteMap": satMap,
    "LiteMap": maplite
};

// create a overLayMap object to hold the quakelayer
var overlayMaps = {
    "Quake Map": quake
};


// create map objects with layers
var myMap = L.map("map", {
    center: [37.0902, -95.7129],
    zoom: 3.5,
    layers: [maplite, quake]
});

// create a layer control
L.control.layers(baseMaps, overlayMaps).addTo(myMap);
//
//

// Get the data set
var allMonth = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";


d3.json(allMonth).then(function(quakeData) {

    //console.log(quakeFeatures.map(q => q.properties.mag));
    console.log(quakeData);

    // var f = quake.features;
    // var properties = f.map(p =>p.properties);
    // var magnitude = properties.map(m => m.mag);
    // console.log(magnitude);

    // function to get Radius
    function getRadius(mRadius) {
        return mRadius * 2;
    };

    // function to get circle color based on magnitude
    function getColor(mColor) {
        if (mColor > 7) {
            return "#063000"
        }
        else if (mColor > 6) {
            return "#064400"
        }
        else if (mColor > 5) {
            return "#2db300"
        }
        else if (mColor > 4) {
            return "#39e600"
        }
        else if (mColor > 3) {
            return "#66ff33"
        }
        else if (mColor > 2) {
            return "#8cff66"
        }
        else if (mColor > 1) {
            return "#b3ff99"
        }
        else {
            return "#b3ffb3"
        }
    };

    // Create geojsonMarkerOptions
    function optionsGeo(feature) {
        return {
        radius: getRadius(feature.properties.mag),
        color: getColor(feature.properties.mag),
        fillOpacity: 0.8
        }
    };

    // Creating a geoJSON layer
    L.geoJSON(quakeData.features, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng)
        },
        style: optionsGeo,
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Place: " + feature.properties.place + "<br>Magnitude: " +
                feature.properties.mag + "<br>MagType: " +
                feature.properties.magType + "<br>Time: " +
                new Date(feature.properties.time));
        }
    }).addTo(quake);
    quake.addTo(myMap);

    // Set Up Legend
    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "info legend"),
            mag = [0, 1, 2, 3, 4, 5, 6, 7];

        div.innerHTML += "<h2>Magnitude</h2>"
        for (var x = 0; x < mag.length; x++) {
            div.innerHTML +=
                '<li style="background-color: ' + getColor(mag[x] + 1) + '"></li> ' +
                mag[x] + (mag[x + 1] ? '&ndash;' + mag[x + 1] + '<br>' : '+');
        }
        return div;
    };
    // Add Legend to the Map
    legend.addTo(myMap);

});