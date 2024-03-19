import './App.css';
import Navbar from './components/Navbar';
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Post from './components/Post';
import Listpost from './components/Listpost';
import Dashboard from './components/Dashboard';

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
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/post",
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
