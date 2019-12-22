var GeoStyle = {
    'Point': new ol.style.Style({
        image: new ol.style.Icon({
//            anchor: [0.5, 0.5],
//            anchorXUnits: 'fraction',
//            anchorYUnits: 'pixels',
            src: '../img/bike.png',
            scale: 0.08,
        })
    }),
    'Circle': new ol.style.Circle({
        fill: new ol.style.Fill({
            color: 'rgba(255,255,255,0.4)'
        }),
        stroke: ol.style.Stroke({
            color: '#3399CC',
            width: 1.25
        }),
        radius: 5
    })
};

function GeoStyleFunc (feature,resolution) {
    return GeoStyle[feature.getGeometry().getType()];
}

var VectorSource =  new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    url: 'https://api.opensensemap.org/boxes?bbox=9.118815,47.653129,9.228427,47.698786&format=geojson&exposure=mobile',
});

var VectorTile = new ol.source.XYZ({
    url: 'http://tile.memomaps.de/tilegen/{z}/{x}/{y}.png ',
    attributions: 'Map &#169; <a href="https://www.openstreetmap.org">OSM</a> | Tiles &#169; <a href="memomaps.de">MeMoMaps</a> | Data &#169; <a href="https://opensensemap.org/">OpenSenseMap</a>'
});

var map = new ol.Map({
    target: document.getElementById('map'),
    layers: [
        new ol.layer.Tile({
            source: VectorTile
        }),
        new ol.layer.Vector({
            source: VectorSource,
            style: GeoStyleFunc
        })
    ],
    controls: ol.control.defaults({ zoom: true, attribution: true }),
    view: new ol.View({
        center: ol.proj.fromLonLat([9.173, 47.672]),
        zoom: 15,
        maxZoom: 17,
        minZoom: 13
    })
});

/*
https://overpass-turbo.eu/
	[out:json][timeout:5];
	{{geocodeArea:"Konstanz"}};
	rel(pivot);
	// print results
	out body geom;
*/

var bbox;

var featuresCity = new ol.Feature();
var url_city = 'https://overpass-api.de/api/interpreter?data=%5Bout%3Ajson%5D%5Btimeout%3A5%5D%3B%0Aarea%283602784842%29%3B%0Arel%28pivot%29%3B%0A%2F%2F%20print%20results%0Aout%20body%20geom%3B%0A';
fetch(url_city).then(value => {
	value.json().then(value => {
        var cityJson = value.elements[0].members;
//		featuresCity = (new ol.format.GeoJSON()).readFeatures(cityJson);


        bbox = value.elements[0].bounds.minlon 
            + "," + value.elements[0].bounds.minlat
            + "," + value.elements[0].bounds.maxlon
            + "," + value.elements[0].bounds.maxlat;
    });
}, error => { console.log(error) });

// TODO: use bbox from overpass API 9.0853854,47.6539842,9.2179906,47.7627374
var url = 'https://api.opensensemap.org/statistics/idw?bbox=9.0853854,47.6539842,9.2179906,47.7627374&phenomenon=Temperatur&gridType=hex&cellWidth=0.5';
fetch(url).then(value => {
    value.json().then(value => {
        var featureJson = value.data.featureCollection;
        var featuresHex = (new ol.format.GeoJSON()).readFeatures(featureJson, {
            dataProjection: 'EPSG:4326',
            featureProjection: map.getView().getProjection()
        });
/*
        var features;
        featuresCity.forEach(function (f, i) {
            features[i] = turf.intersect(f, featuresHex);
        });
*/
        var vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: featuresHex,
            })
//            style: GeoStyleFunc
        });

        map.addLayer(vectorLayer);
    });
}, error => { console.log(error) });