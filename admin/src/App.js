import './App.css';
import Navbar from './components/Navbar';
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Post from './components/Post';
import Allpost from './components/Allpost';
import Dashboard from './components/Dashboard';
import LoginAdmin from './components/LoginAdmin'
import User from './components/User';

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
        path: "/allpost",
        element: <Allpost />
      },
      {
        path: "/user",
        element: <User />
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
