import './App.css';
import Login from './components/Login'
import Register from './components/Register'
import { createBrowserRouter, RouterProvider } from "react-router-dom"

const router = createBrowserRouter([
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