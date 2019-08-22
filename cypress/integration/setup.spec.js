import Ulysses from "../../src/main.js";
import mapboxgl from "mapbox-gl";

const mapOptions = {
  container: "#map",
  accessToken: Cypress.env("MAPBOX_ACCESS_TOKEN"),
  style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 9 // starting zoom
};

describe("Unit tests for setting up a Ulysses story", function() {
  it("creates a new story", function() {
    cy.visit("/");

    cy.get("#map")
      .then(container => new mapboxgl.Map({ mapOptions }))
      .as("map");
  });
});
