import './App.css';
import Login from './components/Login'
import Register from './components/Register'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  }
]);

function App() {
  return (
    <div className = "App">
      <div className = "container">
        <RouterProvider router = { router } />
      </div>
    </div>
  );
}
export default App;