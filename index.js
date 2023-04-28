import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import {
  loadTemplate,
  adjustForMissingHash,
  setActiveLink,
  renderTemplate,

} from "./utils.js"

import { load } from "./pages/cars/cars.js"
import { load as loadV2 } from "./pages/cars-bootstrap/cars.js"
import { load as loadV3 } from "./pages/min-filter-cars/cars.js"

window.addEventListener("load", async () => {
  const templateHome = await loadTemplate("./pages/home/home.html")
  const templateCars = await loadTemplate("./pages/cars/cars.html")
  const templateCarsBootstrap = await loadTemplate("./pages/cars-bootstrap/cars.html")
  const templateGrid = await loadTemplate("./pages/grid/grid.html")
  const templateMitEndpoint = await loadTemplate("./pages/min-filter-cars/cars.html")

  const router = new Navigo("/", { hash: true });
  window.router = router

  adjustForMissingHash()
  router
    .hooks({
      before(done, match) {
        setActiveLink("topnav", match.url)
        done()
      }
    })
    .on({
      "/": () => renderTemplate(templateHome, "content"),
      "/cars": (match) => {
        renderTemplate(templateCars, "content")
        load(1, match)
      },
      "/cars-v2": (match) => {
        renderTemplate(templateCarsBootstrap, "content")
        loadV2(1, match)
      }
      ,
      "/grid": (match) => {
        renderTemplate(templateGrid, "content")
      }
      ,
      "/minFilter": (match) => {
        renderTemplate(templateMitEndpoint, "content")
        loadV3(1, match)
      }
    })
    .notFound(() => renderTemplate("No page for this route found", "content"))
    .resolve()
});


window.onerror = (e) => alert(e)