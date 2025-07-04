import './App.css'
import { Routes, Route } from "react-router"
import Navbar from "./components/Navbar"

import Home from "./pages/home";
import Tools from "./pages/tools";
import BerryTool from "./pages/tools/berry";
import Leaderboard from "./pages/leaderboard";
import Stats from "./pages/stats";
import Profile from "./pages/profile";
import NoPage from "./pages/NoPage"


function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/tools" element={<Tools />}/>
        <Route path="/tools/berry" element={<BerryTool />}/>
        <Route path="/leaderboard" element={<Leaderboard />}/>
        <Route path="/stats" element={<Stats />}/>
        <Route path="/profile" element={<Profile />}/>
        <Route path="*" element={<NoPage />}/>
      </Routes>
    </div>
  )
}

export default App
