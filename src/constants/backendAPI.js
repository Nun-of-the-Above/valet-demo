/* eslint-disable no-restricted-globals */

const BASE_URL =
  location.hostname === "localhost"
    ? "http://localhost:5001/valet-app-2ab35/us-central1/"
    : "https://us-central1-valet-app-2ab35.cloudfunctions.net/";

export { BASE_URL };
