import './App.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom"

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Sidebar />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/post"
        
      },
      {
        path: "/listpost"
      }
    ]
  }
])

function App() {
  return (
    <div className="App">
      <div className = "container">
        <RouterProvider router = { router } />
      </div>
    </div>
  );
}

export default App;
