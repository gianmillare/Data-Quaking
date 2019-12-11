var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(queryUrl, function(data) {
	createFeatures(data.features);
	console.log(data.features)
});

function createFeatures(earthquake) {
	function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  function radiusSize(rating) {
  	return rating * 10000;
  }

  function circles(rating) {
  	if (rating < 1) {
  		return "#7FFFD4"
  	}

  	else if (rating < 2) {
  		return "#0000FF"
  	}

  	else if (rating < 3) {
  		return "#8B008B"
  	}

  	else if (rating < 4) {
  		return "#DC143C"
  	}

  	else if (rating < 5) {
  		return "#800000"
  	}

  	else {
  		return "#FF0000"
  	}
  }

  var earthquakes = L.geoJSON(earthquake, {
  	pointToLayer: function(earthquake, latlng) {
  		return L.circle(latlng, {
  			radius: radiusSize(earthquake.properties.mag),
  			color: circles(earthquake.properties.mag),
  			fillOpacity: 1
  		});
  	},
  	onEachFeature: onEachFeature
  });

  createMap(earthquakes);
}

function createMap(earthquakes) {
	var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
		attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
		maxZoom: 20,
		id: "mapbox.streets",
		accessToken: API_KEY
	});

	var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
		attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
		maxZoom: 20,
		id: "mapbox.dark",
		accessToken: API_KEY
	});

	var baseMaps = {
		"Street Map": streetmap,
		"Dark Map": darkmap
	};

	var overlayMaps = {
		Earthquakes: earthquakes
	};
	var myMap = L.map("map", {
		center: [
		  37.09, -95.71
		  ],
		  zoom: 5,
		  layers: [streetmap, darkmap, earthquakes]
	});

  var info = L.control({
    position: "bottomright"
  });

  info.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    return div;
  };
  info.addTo(myMap);
}