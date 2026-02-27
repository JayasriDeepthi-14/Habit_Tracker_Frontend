import { BrowserRouter,Routes,Route } from "react-router-dom";
import './App.css'

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Habits from "./pages/Habits";
import Reports from "./pages/Reports";

import { AuthProvider } from "./context/AuthContext";

export default function App(){

  return(

    <AuthProvider>

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/habits" element={<Habits/>}/>
        <Route path="/reports" element={<Reports/>}/>

      </Routes>

    </BrowserRouter>

    </AuthProvider>
  );
}