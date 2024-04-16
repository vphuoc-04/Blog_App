import './App.css';
import Login from './components/Login'
import Register from './components/Register'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './components/Home'
import About from './components/About';
import Contact from './components/Contact';
import Content from './components/Content';
import ProfileUser from './components/ProfileUser';
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
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/setting",
        element : <ProfileUser />
      },
      {
        path: "/post/:id",
        element: <Content />
      },
      {
        path: "/about",
        element: <About />
      },
      {
        path: "/contact",
        element: <Contact />
      }
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