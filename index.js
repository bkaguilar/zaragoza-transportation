console.log('test');

const app = document.querySelector('.urbanTransportation__base');
const nearButton = app.querySelector('.urbanTransportation__button--near');
const poleButton = app.querySelector('.urbanTransportation__button--pole');
const poleInput = app.querySelector('.urbanTransportation__input');

poleInput.addEventListener('input', ( { target }) => {
    let isValid = true;
    const value = Number(target.value);

    if(!Number.isInteger(value)) {
        console.warn("Add a valid value");
        isValid = false;
    }

    poleButton.disabled = !isValid;
})

nearButton.addEventListener('click', () => {
    const apiUrl = (extraParams = '') => `https://www.zaragoza.es/sede/servicio/urbanismo-infraestructuras/transporte-urbano/parada-tranvia.json?rf=html&srsname=wgs84&${extraParams}`
    getMyLocation(apiUrl);
})

poleButton.addEventListener('click', () => {
    const pole = Number(poleInput.value);
    const apiUrl = () => `https://www.zaragoza.es/sede/servicio/urbanismo-infraestructuras/transporte-urbano/parada-tranvia/${pole}.json?rf=html&srsname=wgs84`;
    fetchAPI(apiUrl);
})


function fetchAPI(endpoint, extraParams) {
    const apiUrl = endpoint(extraParams)
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Request failed with status:');
            }

            return response.json();
        })
        .then((data) => {

            console.log(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

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
            nearButton.disabled = true;
            console.warn(`You are out of Zaragoza`);
            coordinates = '';

        }

        const extraParams = coordinates ? `point=${coordinates}` : '';
        fetchAPI(apiUrl, extraParams);
    }

    const onError = (err) => { console.warn(`ERROR(${err.code}): ${err.message}`);}
    const options = { enableHighAccuracy: true }

    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
}
