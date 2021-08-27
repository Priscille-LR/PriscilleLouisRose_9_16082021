import firestore from "./Firestore.js"
import Login, { PREVIOUS_LOCATION } from "../containers/Login.js"
import Bills  from "../containers/Bills.js"
import NewBill from "../containers/NewBill.js"
import Dashboard from "../containers/Dashboard.js"

import BillsUI from "../views/BillsUI.js"
import DashboardUI from "../views/DashboardUI.js"

import { ROUTES, ROUTES_PATH } from "../constants/routes.js"

export default () => {
  const rootDiv = document.getElementById('root')
  rootDiv.innerHTML = ROUTES({ pathname: window.location.pathname })

  window.onNavigate = (pathname) => {

    window.history.pushState(
      {},
      pathname,
      window.location.origin + pathname
    )
    if (pathname === ROUTES_PATH['Login']) {
      rootDiv.innerHTML = ROUTES({ pathname })
      renderLogin()
    } else if (pathname === ROUTES_PATH['Bills']) {
      rootDiv.innerHTML = ROUTES({ pathname, loading: true })
      renderBills(rootDiv, pathname)
    } else if (pathname === ROUTES_PATH['NewBill']) {
      rootDiv.innerHTML = ROUTES({ pathname, loading: true })
      renderNewBill()
    } else if (pathname === ROUTES_PATH['Dashboard']) {
      rootDiv.innerHTML = ROUTES({ pathname, loading: true })
      renderDashboard(rootDiv, pathname)
    }
  }
  
  window.onpopstate = (e) => {
    const user = JSON.parse(localStorage.getItem('user'))
    if (window.location.pathname === "/" && !user) {
      document.body.style.backgroundColor="#0E5AE5"
      rootDiv.innerHTML = ROUTES({ pathname: window.location.pathname })
    }
    else if (user) {
      onNavigate(PREVIOUS_LOCATION)
    }
  }

  if (window.location.pathname === "/" && window.location.hash === "") {
    renderLogin()
  } else if (window.location.hash !== "") {
    if (window.location.hash === ROUTES_PATH['Bills']) {
      rootDiv.innerHTML = ROUTES({ pathname: window.location.hash, loading: true })
      renderBills(rootDiv, window.location.hash)
    } else if (window.location.hash === ROUTES_PATH['NewBill']) {
      rootDiv.innerHTML = ROUTES({ pathname: window.location.hash, loading: true })
      renderNewBill()
    } else if (window.location.hash === ROUTES_PATH['Dashboard']) {
      renderDashboard(rootDiv, window.location.hash)

    }
  }

  return null
}
 
function renderDashboard(rootDiv, pathname) {
  const bills = new Dashboard({ document, onNavigate, firestore, bills: [], localStorage })
  bills.getBillsAllUsers().then(bills => {
    rootDiv.innerHTML = DashboardUI({ data: { bills } })
    new Dashboard({ document, onNavigate, firestore, bills, localStorage })
  }).catch(error => {
    rootDiv.innerHTML = ROUTES({ pathname, error })
  })
}

function renderNewBill() {
  new NewBill({ document, onNavigate, firestore, localStorage })
  highlightIconMail()
}

function renderBills(rootDiv, pathname) {
  highlightIconWindow()
  const bills = new Bills({ document, onNavigate, firestore, localStorage })
  bills.getBills().then(data => {
    rootDiv.innerHTML = BillsUI({ data })
    highlightIconWindow()
    new Bills({ document, onNavigate, firestore, localStorage })
  }).catch(error => {
    rootDiv.innerHTML = ROUTES({ pathname, error })
  })
}

function renderLogin() {
  new Login({ document, localStorage, onNavigate, PREVIOUS_LOCATION, firestore })
  document.body.style.backgroundColor = "#0E5AE5"
}

function highlightIconMail() {
  const divIcon1 = document.getElementById('layout-icon1')
  const divIcon2 = document.getElementById('layout-icon2')
  divIcon1.classList.remove('active-icon')
  divIcon2.classList.add('active-icon')
}

function highlightIconWindow() {
  const divIcon1 = document.getElementById('layout-icon1')
  const divIcon2 = document.getElementById('layout-icon2')
  divIcon1.classList.add('active-icon')
  divIcon2.classList.remove('active-icon')
}

