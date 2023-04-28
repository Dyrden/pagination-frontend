const SERVER_URL = "http://localhost:8080/"
import { paginator } from "../../lib/paginator/paginate-bootstrap.js"
import { sanitizeStringWithTableRows } from "../../utils.js"
const SIZE = 10
let TOTAL = Math.ceil(1000 / SIZE)  //Should come from the backend
//useBootStrap(true)

const navigoRoute = "minFilter"

let cars = [];

let sortField;
let sortOrder = "desc"

let initialized = false

let filterColumn = "color";
let filterValue = "red"

function handleSort(pageNo, match) {
  sortOrder = sortOrder == "asc" ? "desc" : "asc"
  sortField = "brand"
  load(pageNo, match)
}




export async function load(pg, match) {
  //We dont wan't to setup a new handler each time load fires
  if (!initialized) {
    initialized = true
  }
  const p = match?.params?._page || pg  //To support Navigo
  let pageNo = Number(p)

  let queryString = `?column=${filterColumn}&val=${filterValue}&_sort=${sortField}&order=${sortOrder}&size=${SIZE}&page=` + (pageNo - 1)
  try { 
    let response = await fetch(`${SERVER_URL}api/cars/filter${queryString}`)
      .then(res => res.json())
      cars = response.cars
      TOTAL = Math.ceil(response.total / SIZE)
  } catch (e) {
    console.error(e)
  }
  const rows = cars.map(car => `
  <tr>
    <td>${car.id}</td>
    <td>${car.brand}</td>
    <td>${car.model}</td>
    <td>${car.color}</td>
    <td>${car.kilometers}</td>
  `).join("")

  //DON'T forget to sanitize the string before inserting it into the DOM
  document.getElementById("tbody").innerHTML = sanitizeStringWithTableRows(rows)

  // (C1-2) REDRAW PAGINATION
  paginator({
    target: document.getElementById("car-paginator"),
    total: TOTAL,
    current: pageNo,
    click: load
  });
  //Update URL to allow for CUT AND PASTE when used with the Navigo Router
  //callHandler: false ensures the handler will not be called again (twice)
  window.router?.navigate(`/${navigoRoute}${queryString}`, { callHandler: false, updateBrowserURL: true })
}
