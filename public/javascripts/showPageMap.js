mapboxgl.accessToken = mapToken;
console.log(moment)
const map = new mapboxgl.Map({
    container:'map',
    // customize the map
    style: 'mapbox://styles/mapbox/light-v10',
    center: moment.geometry.coordinates,
    zoom: 8
});
map.addControl(new mapboxgl.NavigationControl())
//Add a marker on the map
new mapboxgl.Marker()
    .setLngLat(moment.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({offset: 25}).setHTML(`<h5>${moment.title}</h5><p>${moment.location}</p>`))// add popup
    .addTo(map)

