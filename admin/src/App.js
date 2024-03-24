import './App.css';
import Navbar from './components/Navbar';
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Post from './components/Post';
import Listpost from './components/Listpost';
import Dashboard from './components/Dashboard';
import LoginAdmin from './components/LoginAdmin'

const Layout = () => {
  return (
    <>
      <Navbar />
      <Dashboard />
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginAdmin />
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/write",
        element: <Post />
      },
      {
        path: "/listpost",
        element: <Listpost />
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
