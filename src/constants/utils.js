import { localStorageMock } from "../__mocks__/localStorage";

export function setLocalStorage(userType) {
  Object.defineProperty(window, 'localStorage', { value: localStorageMock })
  window.localStorage.setItem('user', JSON.stringify({
    type: userType,
    email: 'user@email.com'
  }))
}