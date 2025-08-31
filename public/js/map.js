maptilersdk.config.apiKey = mapToken;
const map = new maptilersdk.Map({
  container: "map", 
  style: maptilersdk.MapStyle.STREETS,
  center: listing.geometry.coordinates, 
  zoom: 9, 
});

const marker = new maptilersdk.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new maptilersdk.Popup().setHTML(
      `<h4>${listing.location}</h4><p>Exact location will be provided after booking</p>`
    )
  )
  .addTo(map);
