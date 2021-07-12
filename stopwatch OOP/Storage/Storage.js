export const local = JSON.parse( localStorage.getItem('dataStore'))
export const storage = local||{};
export const rootDiv = document.querySelector(".root");
