var GeoStyle = {
    'Point': new ol.style.Style({
        image: new ol.style.Icon({
//            anchor: [0.5, 0.5],
//            anchorXUnits: 'fraction',
//            anchorYUnits: 'pixels',
            src: '../img/bike.png',
            scale: 0.08,
//            crossOrigin: 'anonymous'
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
var url = 'https://api.opensensemap.org/statistics/idw?bbox=9.118815,47.653129,9.228427,47.698786&phenomenon=Temperatur&gridType=hex&cellWidth=0.2';
fetch(url).then(value => {
    value.json().then(value => {
        var featureJson = value.data.featureCollection;
        var features = (new ol.format.GeoJSON()).readFeatures(featureJson);

        var vectorSource = new ol.source.Vector({
            features: features,
            projection: ol.proj.get('EPSG:4326')
        });

        var vectorLayer = new ol.layer.Vector({
            source: vectorSource,
        });

        map.addLayer(vectorLayer);
    });
}, error => { console.log(error) });
*/
