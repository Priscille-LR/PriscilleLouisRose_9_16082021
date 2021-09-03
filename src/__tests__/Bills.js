/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import { screen } from "@testing-library/dom"
import Bills from "../containers/Bills.js";
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import Router from '../app/Router.js'
import firestore from '../app/Firestore.js'
import { ROUTES_PATH, ROUTES } from '../constants/routes.js'
import { setLocalStorage } from '../constants/utils.js'
import userEvent from '@testing-library/user-event';
import firebase from '../__mocks__/firebase'


//define user type in local storage => employee
setLocalStorage('Employee')

//mock navigation
const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname })
}


describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    //UT LAYOUT

    //LAYOUT BILL ICON
    test("Then bill icon in vertical layout should be highlighted", () => {
      jest.mock('../app/Firestore.js'); //mock firestore (all functions)
      //override bills behaviour w/ new function
      firestore.bills = () => ({
        bills,
        get: jest.fn().mockResolvedValue(),
        where: jest.fn().mockReturnValue({ get: jest.fn().mockResolvedValue() })
      }) //new function returns bills (collection ref : doc data) bills => fixture

      //mock current page
      Object.defineProperty(window, 'location', { value: { hash: ROUTES_PATH['Bills'] } })

      const html = BillsUI({ data: [] })
      document.body.innerHTML = `<div id="root">${html}</div>`;
      Router();

      expect(screen.getByTestId('icon-window')).toHaveClass('active-icon')
    })

    //LAYOUT MAIL ICON
    test("Then mail icon in vertical layout shouldn't be highlighted", () => {

      jest.mock('../app/Firestore.js');
      firestore.bills = () => ({
        bills,
        get: jest.fn().mockResolvedValue(),
        where: jest.fn().mockReturnValue({ get: jest.fn().mockResolvedValue() })
      })

      Object.defineProperty(window, 'location', { value: { hash: ROUTES_PATH['Bills'] } })

      const html = BillsUI({ data: [] })
      document.body.innerHTML = `<div id="root">${html}</div>`;

      Router();
      expect(screen.getByTestId('icon-mail')).not.toHaveClass('active-icon')
    })

    //BILLS ORDER

    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html

      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })


  //NEW BILL CREATION

  describe("When I click on 'New Bill' ", () => {

    //FUNCTION CALL handleClickNewBill()

    test("Then handleNewBill() should be called", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html;

      //create mock class
      const testBills = new Bills({ document, onNavigate, firestore: null, localStorage: window.localStorage })
      
      //mock function
      const testHandleClickNewBill = jest.fn(() => testBills.handleClickNewBill)
      
      // const testHandleClickNewBill = jest.fn()
      // testBills.handleClickNewBill =  testHandleClickNewBill
      

      const newBillBtn = screen.getByTestId('btn-new-bill')
      newBillBtn.addEventListener('click', testHandleClickNewBill)
      userEvent.click(newBillBtn)

      expect(testHandleClickNewBill).toBeCalled()
    })

  //NEW BILL FORM LAYOUT
    test("Then New Bill Page should be rendered", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html;

      new Bills({ document, onNavigate, firestore: null, localStorage: window.localStorage })
  
      const newBillBtn = screen.getByTestId('btn-new-bill')
      //newBillBtn.addEventListener('click', testHandleClickNewBill)
      userEvent.click(newBillBtn)

      const title = document.querySelector('.content-title')
      const form = screen.getByTestId("form-new-bill")
      expect(title).toHaveTextContent("Envoyer une note de frais")
      expect(form).toBeTruthy()
    })
  })


  describe("When I click on the 'Icon Eye' ", () => {

    //FUNCTION CALL handleClickIconEye()

    test("Then handleClickIConEye() should be called", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html;

      const testBills = new Bills({ document, onNavigate, firestore: null, localStorage: window.localStorage })

      const testHandleClickIconEye = jest.fn() 
      testBills.handleClickIconEye = testHandleClickIconEye

      const iconEye = screen.getAllByTestId("icon-eye")[0]
      userEvent.click(iconEye)
      expect(testHandleClickIconEye).toBeCalled()
    })

    //MODAL OPENED

    test("Then a modal should open", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html;

      const testBills = new Bills({ document, onNavigate, firestore: null, localStorage: window.localStorage })
      
      //mock modal function of window
      $.fn.modal = jest.fn();
      
      const iconEye = screen.getAllByTestId("icon-eye")[0]
      userEvent.click(iconEye)

      expect($.fn.modal).toHaveBeenCalled()

      const modal = document.querySelector(".modal")
      expect(modal).toBeTruthy();
    })

    // IMAGE SOURCE

    test("Then the right image should be displayed in the modal", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html;

      const testBills = new Bills({ document, onNavigate, firestore: null, localStorage: window.localStorage })
      
      $.fn.modal = jest.fn();
      
      const iconEye = screen.getAllByTestId("icon-eye")[0]
      userEvent.click(iconEye)

      const billURL = iconEye.getAttribute("data-bill-url")
      const source = (document.querySelector('img')).getAttribute("src")

      expect(billURL).toEqual(source)
    })
  })
})


// INTEGRATION TEST GET
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills Page", () => {
    test("fetches bills from mock API GET", async () => {
       const getSpy = jest.spyOn(firebase, "get")
       const bills = await firebase.get()
       expect(getSpy).toHaveBeenCalledTimes(1)
       expect(bills.data.length).toBe(4)
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})