import { classes } from "./constants.js";

const app = document.querySelector(`.${classes.base}`);
const nearButton = app.querySelector(`.${classes.nearButton}`);
const poleButton = app.querySelector(`.${classes.poleButton}`);
const poleInput = app.querySelector(`.${classes.input}`);
const resultsHTML = app.querySelector(`.${classes.resultsHTML}`);
const infoHTML = app.querySelector(`.${classes.info}`);
const filter = app.querySelector(`.${classes.filter}`);
const filterOptions = app.querySelector(`.${classes.filterOptions}`);

let results;

function init() {
    const apiUrl = () => `https://www.zaragoza.es/sede/servicio/urbanismo-infraestructuras/transporte-urbano/parada-tranvia.json?rf=html&srsname=wgs84`;
    fetchAPI(apiUrl);
}

init();

const obj = {
    value: 0
  };

// Create a Proxy for the object
const proxy = new Proxy(obj, {
    // Define a trap for setting properties
    set(target, key, value) {
        console.log(`Setting ${key} to ${value}`);
        // Set the property value on the target object
        target[key] = value;
        // Indicate that the operation was successful
        return true;
    }
});

poleInput.addEventListener('change', ( { target }) => {
    const value = Number(target.value);

    if(!Number.isInteger(value)) {
        infoHTML.textContent = `Add a valid value`;
    }

    const list = document.querySelectorAll(`.${classes.stopBox}`);

    [...list].filter(li => {
        if(target.value && li.dataset.id !== target.value){
            li.setAttribute('hidden', true);
            return li;
        }

        li.removeAttribute('hidden')
        return li;
    })

})

nearButton.addEventListener('click', () => {
    const apiUrl = (extraParams = '') => `https://www.zaragoza.es/sede/servicio/urbanismo-infraestructuras/transporte-urbano/parada-tranvia.json?rf=html&srsname=wgs84&${extraParams}`
    getMyLocation(apiUrl);
})

filter.addEventListener('submit', (event) => {
    event.preventDefault();
})

// poleButton.addEventListener('click', () => {
//     const pole = Number(poleInput.value);
//     const apiUrl = () => `https://www.zaragoza.es/sede/servicio/urbanismo-infraestructuras/transporte-urbano/parada-tranvia/${pole}.json?rf=html&srsname=wgs84`;
//     fetchAPI(apiUrl);
// })


function fetchAPI(endpoint, extraParams) {
    const apiUrl = endpoint(extraParams)
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Request failed with status:');
            }

            return response.json();
        })
        .then((data = []) => {
            resultsHTML.innerHTML = '';
            results = [...(data.result ?? [data])];

            resultsHTML.append(getHTML(results));

            filterOptions.innerHTML = results.map(r => `<option value="${r.id}">${r.title}</option>`);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

}

function getHTML(data) {
    const list = document.createElement('ul');
    list.classList.add(classes.list);

    list.innerHTML = data.map(( {id = "", title = "", destinos = [],}) => {
        let htmlDirection;
        const htmlDestinations = destinos.map((destination, index) => {
            htmlDirection = htmlDirection ?? `<span class="${classes.directionName}">${destination?.destino}</span>`;
            return `<li class="${index === 0 ? classes.arrivalTimeNow : classes.arrivalTimeNext}"><span>${destination?.minutos}</span><span class="${classes.label}"> MNTS</span></li>`
        });

        return destinos.length
            ? `<li class="${classes.stopBox}" data-id="${id}">
                <h3>
                    <span class="${classes.stopName}">📍 ${title.toLowerCase()}</span>
                    <span class="${classes.label}">➡️ ${htmlDirection.toLowerCase()}</span>
                </h3>
                <ul class="${classes.arrivalTime}">${htmlDestinations.join('')}</ul>
              </li>`
            : '';

    }).join('') || 'Out of service';

    return list;
}

function getMyLocation(apiUrl) {
    if (!navigator.geolocation) {
        console.warn("Geolocation is not supported by this browser.");
        return "";
    }

    const onSuccess = ({ coords }) => {
        const { latitude, longitude } = coords;
        let coordinates = `${longitude},${latitude}`;
        console.log(`Longitude: ${longitude},Latitude: ${latitude}`);

        if(!latitude.toString().startsWith('41')) {
            console.warn(`You are out of Zaragoza`);
            infoHTML.textContent = `You are out of Zaragoza`;
            coordinates = '';

        }

        const extraParams = coordinates ? `point=${coordinates}` : '';
        fetchAPI(apiUrl, extraParams);
    }

    const onError = (err) => { console.warn(`ERROR(${err.code}): ${err.message}`);}
    const options = { enableHighAccuracy: true }

    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
}
