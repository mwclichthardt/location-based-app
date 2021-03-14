const loadPlaces = function(coords) {
  const PLACES = [
    {
      name: "Hello there, you caught me!",
      location: {
        lat: coords.latitude + 0.0001,
        lng: coords.longitude + 0.0001
      }
    },
    {
      name: "You caught me at Marienplatz!",
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

  return navigator.geolocation.getCurrentPosition(
    function(position) {
      loadPlaces(position.coords).then(places => {

        places.forEach(place => {
          const latitude = place.location.lat;
          const longitude = place.location.lng;

          const model = document.createElement("a-entity");
          model.setAttribute(
            "gps-entity-place",
            `latitude: ${latitude}; longitude: ${longitude};`
          );
          model.setAttribute("name", place.name);
          model.setAttribute("scale", "0.08 0.08 0.08");
          model.setAttribute("rotation", "0 180 0");
          model.setAttribute("gltf-model", "./assets/dragonite/scene.gltf");
 
          model.addEventListener("loaded", () =>
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
              }, 2000);
            }
          };

          model.addEventListener("click", clickListener);

          scene.appendChild(model);
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
