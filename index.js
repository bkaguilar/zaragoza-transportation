import { classes, constants, icons } from "./constants.js";

class urbanTransportationApp {
    constructor() {
        this.results = [];

        this.init();
    }

    init() {
        this.setElements()
        this.addEventListeners();

        this.renderResults(this.filter.dataset.value);
    }

    setElements() {
        this.app = document.querySelector(`.${classes.base}`);
        this.radioOptions = this.app.querySelector(`.${classes.radioOptions}`);
        this.poleInput = this.app.querySelector(`.${classes.input}`);
        this.resultsHTML = this.app.querySelector(`.${classes.resultsHTML}`);
        this.infoHTML = this.app.querySelector(`.${classes.info}`);
        this.filter = this.app.querySelector(`.${classes.filter}`);
        this.filterOptions = this.app.querySelector(`.${classes.filterOptions}`);
        this.buttonUpdate = this.app.querySelector(`.${classes.updateButton}`);
        this.updatedTimeLabel = this.app.querySelector(`.${classes.updatedTimeLabel}`);
    }

    addEventListeners() {
        this.poleInput.addEventListener('change', ( { target }) => {
            const value = Number(target.value);

            if(!Number.isInteger(value)) {
                this.infoHTML.textContent = `Add a valid value`;
                return;
            }

            const list = this.app.querySelectorAll(`.${classes.stopBox}`);

            console.log(list);

            [...list].filter(li => {
                if(target.value && li.dataset.id !== target.value){
                    li.setAttribute('hidden', true);
                    return li;
                }

                li.removeAttribute('hidden')
                return li;
            })
        });

        this.radioOptions.addEventListener('change', ( { target }) => {
            this.renderResults(target.value);
            this.filter.dataset.value = target.value;
        });

        this.filter.addEventListener('submit', (event) => {
            event.preventDefault();
        });

        this.buttonUpdate.addEventListener('click', () => {
            this.renderResults(this.filter.dataset.value);
            this.clearInput();
        })

    }

    clearInput() {
        poleInput.value = '';
    }

    renderResults(value) {
        if(value === "all") {
            this.fetchAPI();
            this.infoHTML.classList.add(classes.isHidden);
        } else {
            this.getMyLocation();
        }
    }

    fetchAPI(extraParams = '') {
        const apiUrl = `${constants.apiEndpoint}${extraParams}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Request failed with status:');
                }

                return response.json();
            })
            .then((data = []) => {
                this.resultsHTML.innerHTML = '';
                this.results = [...(data.result ?? [data])];
                const {list, options, lastUpdatedTime} = this.getHTML(this.results);

                this.resultsHTML.append(list);

                this.filterOptions.innerHTML = options;

                this.updatedTimeLabel.textContent = lastUpdatedTime;
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    getHTML(data) {
        const list = document.createElement('ul');
        let html;
        let options = '';
        let htmlDirection;
        let lastUpdatedTime;
        list.classList.add(classes.list);

        html = data.map(( {id = "", title = "", destinos = [], lastUpdated}) => {
            const htmlDestinations = destinos.map((destination, index) => {
                htmlDirection = htmlDirection ?? `<span class="${classes.directionName}">${destination?.destino.toLowerCase()}</span>`;
                lastUpdatedTime = lastUpdatedTime ?? new Date(lastUpdated).toLocaleTimeString();
                return `<li class="${index === 0 ? classes.arrivalTimeNow : classes.arrivalTimeNext}"><span>${destination?.minutos}</span><span class="${classes.label}"> MNTS</span></li>`
            });

            options+= `<option value="${id}">${title}</option>`;

            return destinos.length
                ? `<li class="${classes.stopBox}" data-id="${id}">
                    <div>
                        <h3 class="${classes.stopName}">
                            <span>${icons.pin}</span>
                            <span>${title.toLowerCase()}</span>
                        </h3>
                        <span class="${classes.label}">➡️ ${htmlDirection}</span>
                    </div>
                    <ul class="${classes.arrivalTime}">${htmlDestinations.join('')}</ul>
                  </li>`
                : '';

        }).join('') || 'Out of service';


        list.innerHTML = html;

        return {
            list,
            options,
            lastUpdatedTime,
        };
    }


    getMyLocation() {
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
                this.infoHTML.classList.remove(classes.isHidden)
                coordinates = '';

            }

            const extraParams = coordinates ? `&point=${coordinates}` : '';

            this.fetchAPI(extraParams);
        }

        const onError = (err) => { console.warn(`ERROR(${err.code}): ${err.message}`);}
        const options = { enableHighAccuracy: true }

        navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    }
}

new urbanTransportationApp();
