/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom'
import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import userEvent from "@testing-library/user-event"
import { setLocalStorage } from '../constants/utils.js'
import { ROUTES_PATH, ROUTES } from '../constants/routes.js'
import firestore from '../app/Firestore.js'
import firebase from '../__mocks__/firebase'
import BillsUI from "../views/BillsUI.js"

//define user type in local storage => employee
setLocalStorage('Employee')

//mock navigation
const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname })
}

//mock current page
Object.defineProperty(window, 'location', { value: { hash: ROUTES_PATH['NewBill'] } })


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {

    //NEW BILL LAYOUT 

    test("Then New Bill Page should be rendered", () => {
      const html = NewBillUI()
      document.body.innerHTML = html

      const title = screen.getAllByText("Envoyer une note de frais")
      expect(title).toBeTruthy();

      const form = screen.getByTestId("form-new-bill")
      expect(form).toBeTruthy()
    })

    //FILE WITH CORRECT EXTENSION
    describe("When I upload a file with a right extension", () => {
      test("Then it should appear in the file handler", () => {

        jest.mock('../app/Firestore.js')
        firestore.storage = {
          ref: jest.fn(() => {
            return {
              put: jest.fn().mockResolvedValue({ ref: { getDownloadURL: jest.fn() } })
            }
          })
        }

        const html = NewBillUI()
        document.body.innerHTML = html

        const testNewBill = new NewBill({ document, onNavigate, firestore, localStorage: window.localStorage })

        const testHandleChangeFile = jest.fn(() => testNewBill.handleChangeFile)

        const inputFile = screen.getByTestId("file")
        inputFile.addEventListener("change", testHandleChangeFile)
        userEvent.upload(inputFile, new File(["sample.png"], "sample.png", { type: "img/png" }))

        const numberOfFiles = inputFile.files.length
        expect(numberOfFiles).toEqual(1)
        expect(testHandleChangeFile).toHaveBeenCalled()
      })
    })

    //FILE WITH INCORRECT EXTENSION

    describe("When I upload a file with an incorrect extension", () => {
      test("Then an alert should be displayed", () => {
        const html = NewBillUI()
        document.body.innerHTML = html

        const testNewBill = new NewBill({ document, onNavigate, firestore: null, localStorage: window.localStorage })

        const testHandleChangeFile = jest.fn(() => testNewBill.handleChangeFile)

        window.alert = () => { }
        const alert = jest.spyOn(window, 'alert').mockImplementation(() => { })

        const inputFile = screen.getByTestId("file")
        inputFile.addEventListener("change", testHandleChangeFile)
        userEvent.upload(inputFile, new File(["sample.txt"], "sample.txt", { type: "text/txt" }))


        expect(alert).toHaveBeenCalledTimes(1);
        expect(document.querySelector(`input[data-testid="file"]`).value).toBe('')

      })
    })

    //SUBMIT FORM & FUNCTION CALL

    describe("When I click on Submit and the form is valid", () => {

      describe('And there is a format error', () => {
        test('bill should not be created', () => {
          const html = NewBillUI()
          document.body.innerHTML = html

          const testNewBill = new NewBill({ document, onNavigate, firestore: null, localStorage: window.localStorage })

          jest.spyOn(testNewBill, 'createBill')
          jest.spyOn(testNewBill, 'onNavigate')
          const testHandleSubmit = jest.fn(() => testNewBill.handleSubmit)

          const form = screen.getByTestId("form-new-bill")
          form.addEventListener("submit", testHandleSubmit);
          testNewBill.formatError = true;
          fireEvent.submit(form)

          expect(testNewBill.createBill).not.toHaveBeenCalled()
          expect(testNewBill.onNavigate).not.toHaveBeenCalled()
        })
      });

      test("Then a new bill should be created", async () => {

        const html = NewBillUI()
        document.body.innerHTML = html

        const testNewBill = new NewBill({ document, onNavigate, firestore: null, localStorage: window.localStorage })
        jest.spyOn(testNewBill, 'createBill')
        jest.spyOn(testNewBill, 'onNavigate')
        const testHandleSubmit = jest.fn(() => testNewBill.handleSubmit)

        const form = screen.getByTestId("form-new-bill")
        form.addEventListener("submit", testHandleSubmit);
        fireEvent.submit(form)

        expect(testHandleSubmit).toHaveBeenCalled()
        expect(testNewBill.createBill).toHaveBeenCalled()
        expect(testNewBill.onNavigate).toHaveBeenCalled()
      })
    })
  })
})

// test d'intégration POST
describe("Given I am a user connected as Employee", () => {
  describe("When I post a New Bill", () => {
    test("post new bill to mock API ", async () => {
      const postSpy = jest.spyOn(firebase, "post")
      const newBill = {
        id: "BeKy5Mo4jkmdfPGYpTxZ",
        email: "user@email.com",
        type: "Transports",
        name: "Billet Paris-Marseille",
        amount: 89,
        date: "2021-07-31",
        vat: "50",
        pct: 20,
        commentary: "no comment",
        fileUrl: "http://transports.blog.lemonde.fr/files/2012/12/Billet-un-virgule-cinq-euro.jpg",
        fileName: "integration-test-post.png",
        status: 'pending'
      }
      const bills = await firebase.post(newBill)
      expect(postSpy).toHaveBeenCalledTimes(1)
      expect(bills.data.length).toBe(5)
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      // firebase.post.mockImplementationOnce(() =>
      //   Promise.reject(new Error("Erreur 404"))
      // )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      // firebase.post.mockImplementationOnce(() =>
      //   Promise.reject(new Error("Erreur 500"))
      // )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})