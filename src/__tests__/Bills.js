/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import { screen } from "@testing-library/dom"
import { getByTestId } from '@testing-library/dom'
import { Bills } from "../containers/Bills.js";
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import Router from '../app/Router.js'

import { localStorageMock } from "../__mocks__/localStorage.js"
import firestore from '../app/Firestore.js'
import { ROUTES_PATH } from '../constants/routes.js'
import { setLocalStorage } from '../constants/utils.js'

describe("Given I am connected as an employee", () => {
  //define user type in local storage => employee
  setLocalStorage('Employee')
  describe("When I am on Bills Page", () => {
    it("bill icon in vertical layout should be highlighted", () => {

      jest.mock('../app/Firestore.js'); //mock firestore (all functions)
      //override bills behaviour w/ new function
      firestore.bills = () => ({ bills, get: jest.fn().mockResolvedValue() }) //new function returns bills (collection ref : doc data) bills => fixture

      //mock current page
      Object.defineProperty(window, 'location', { value: { hash: ROUTES_PATH['Bills'] } })

      const html = BillsUI({ data: [] })
      document.body.innerHTML = `
      <div id="root">${html}</div>
      `;

      Router();

      expect(screen.getByTestId('icon-window')).toHaveClass('active-icon')
    })

    // it("Then bills should be ordered from earliest to latest", () => {
    //   const html = BillsUI({ data: bills })
    //   document.body.innerHTML = html
    //   const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
    //   const antiChrono = (a, b) => ((a < b) ? 1 : -1)
    //   const datesSorted = [...dates].sort(antiChrono)
    //   expect(dates).toEqual(datesSorted)
    // })


  })
})
