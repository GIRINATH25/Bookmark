import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ViewBookmark from "./pages/ViewBookmark";
import axios from "axios";

function App() {
  axios.defaults.baseURL = process.env.REACT_APP_BACK_URL;
  axios.defaults.withCredentials = true;
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/bookmark" element={<ViewBookmark />} />
    </Routes>
  );
}

export default App;
