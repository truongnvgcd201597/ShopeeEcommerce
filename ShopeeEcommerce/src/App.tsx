import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import useRouteElement from './useRouteElement'
import { useContext, useEffect } from 'react'
import { localStorageEventTarget } from './utils/auth'
import { AppContext } from './contexts/app.context'

function App() {
  const routeElement = useRouteElement()
  const { reset } = useContext(AppContext)
  useEffect(() => {
    localStorageEventTarget.addEventListener('clearLocalStorage', reset)

    localStorageEventTarget.removeEventListener('clearLocalStorage', reset)
  }, [reset])
  return (
    <>
      {routeElement}
      <ToastContainer />
    </>
  )
}

export default App
