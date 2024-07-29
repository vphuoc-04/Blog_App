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
import Recover from './components/Recover';
import Identify from './components/Identify';
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
    children: 
    [
      { path: "/", element: <Home /> }, 
      { path: "/profile/:username", element : <ProfileUser /> },
      { path: "/contact", element: <Contact /> }, 
      { path: "/about", element: <About /> }, 
      { path: "/post/:id", element: <Content /> }
    ]
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/identify", element: <Identify /> },
  { path: "/recover", element: <Recover /> }
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