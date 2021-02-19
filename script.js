const loadPlaces = function(coords) {
  const PLACES = [
    {
      name: "Hello there",
      location: {
        lat: coords.latitude,
        lng: coords.longitude
      },
      name: "Marienplatz",
      location: {
        lat: 48.1374003177032,
        lng: 11.575480686836404
      }
    }
  ];

  return Promise.resolve(PLACES);
};

window.onload = () => {

  const scene = document.querySelector("a-scene");

  // first get current user location
  return navigator.geolocation.getCurrentPosition(
    function(position) {
      // then use it to load from remote APIs some places nearby
      loadPlaces(position.coords).then(places => {
        places.forEach(place => {
          const latitude = place.location.lat;
          const longitude = place.location.lng;

          // add place icon
          const icon = document.createElement("a-image");
          icon.setAttribute(
            "gps-entity-place",
            `latitude: ${latitude}; longitude: ${longitude}`
          );
          icon.setAttribute("name", place.name);
          icon.setAttribute(
            "src",
            "https://mwclichthardt.github.io/location-based-app/assets/cat.png"
          );
          // for debug purposes, just show in a bigger scale, otherwise I have to personally go on places...
          icon.setAttribute("scale", "20, 20");

          icon.addEventListener("loaded", () =>
            window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"))
          );

          const clickListener = function(ev) {
            ev.stopPropagation();
            ev.preventDefault();

            const name = ev.target.getAttribute("name");
            const el =
              ev.detail.intersection && ev.detail.intersection.object.el;

            if (el && el === ev.target) {
              const label = document.createElement("span");
              const container = document.createElement("div");
              container.setAttribute("id", "place-label");
              label.innerText = name;
              container.appendChild(label);
              document.body.appendChild(container);

              setTimeout(() => {
                container.parentElement.removeChild(container);
              }, 1500);
            }
          };

          icon.addEventListener("click", clickListener);

          scene.appendChild(icon);
        });
      });
    },
    err => console.error("Error in retrieving position", err),
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 27000
    }
  );
};
