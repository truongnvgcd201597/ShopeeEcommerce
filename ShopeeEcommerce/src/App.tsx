import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import useRouteElement from './useRouteElement'

function App() {
  const routeElement = useRouteElement()
  return (
    <>
      {routeElement}
      <ToastContainer />
    </>
  )
}

export default App
