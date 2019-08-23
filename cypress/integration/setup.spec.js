import Ulysses from "../../src/main.js";
import mapboxgl from "mapbox-gl";

describe("Unit tests for setting up a Ulysses story", function() {
  it("creates a new story", function() {
    cy.visit("/fires").then($window => {
      expect($window.map).to.be.ok;
      expect($window.story).to.be.ok;
    });
  });
});
