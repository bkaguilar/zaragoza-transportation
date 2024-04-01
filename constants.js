export const base = 'urbanTransportation';

export const classes = {
  base: `${base}__base`,
  nearButton: `${base}__button--near`,
  poleButton: `${base}__button--pole`,
  input: `${base}__input`,
  radio: `${base}__radio`,
  radioOptions: `${base}__radioOptions`,
  skeletonHTML: `${base}__skeletonWrapper`,
  resultsHTML: `${base}__results`,
  info: `${base}__info`,
  label: `${base}__label`,
  list: `${base}__list`,
  stopBox: `${base}__stopBox`,
  stopName: `${base}__stopName`,
  directionName: `${base}__directionName`,
  arrivalTime: `${base}__arrivalTime`,
  arrivalTimeNow: `${base}__arrivalTimeNow`,
  arrivalTimeNext: `${base}__arrivalTimeNext`,
  filter: `${base}__filter`,
  filterOptions: `${base}__filerOptions`,
  updateButton: `${base}__button--update`,
  updatedTimeLabel: `${base}__lastUpdatedTime`,
  isHidden: 'is-hidden',
}

export const constants = {
  apiEndpoint: "https://www.zaragoza.es/sede/servicio/urbanismo-infraestructuras/transporte-urbano/parada-tranvia.json?rf=html&srsname=wgs84",
}


export const icons = {
  pin: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"><path fill="currentColor" fill-rule="evenodd" d="M16.272 10.272a4 4 0 1 1-8 0 4 4 0 0 1 8 0Zm-2 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" clip-rule="evenodd"/><path fill="currentColor" fill-rule="evenodd" d="M5.794 16.518a9 9 0 1 1 12.724-.312l-6.206 6.518-6.518-6.206Zm11.276-1.691-4.827 5.07-5.07-4.827a7 7 0 1 1 9.897-.243Z" clip-rule="evenodd"/></svg>'
}
