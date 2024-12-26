// getting places from APIs
function loadPlaces(position) {
    return Promise.resolve(courseData);
};

window.onload = () => {
    const scene = document.querySelector('a-scene');
    // than use it to load from remote APIs some places nearby
    loadPlaces({})
        .then(({ Status, ErrorMessage, GPSList }) => {
            if (Status == '1') {
                GPSList.forEach((place) => {
                    const latitude = place.centerLat
                    const longitude = place.centerLon
                    console.log(latitude, longitude);
                    // add markers
                    const placeText = document.createElement('a-image');
                    placeText.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);
                    placeText.setAttribute('title', "hole_" + place.holeNumber);
                    // placeText.setAttribute('color', "yellow");
                    placeText.setAttribute('src', "#pin");
                    placeText.setAttribute('look-at', "[gps-camera]");
                    placeText.setAttribute('position', '1 1 -5');

                    placeText.addEventListener('loaded', () => {
                        window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
                    });

                    scene.appendChild(placeText);
                });
            }
        })

}; 