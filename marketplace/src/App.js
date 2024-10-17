import logo from './logo.svg';
import './App.css';

import NavBar from "./components/Navbar"
import SellNFT from './components/SellNFT';
import Marketplace from './components/Marketplace';
import Profile from './components/Profile';
import NFTPage from './components/NFTpage';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";


function App() {
  return (
    
    <div className="App">
      <BrowserRouter>
            <Routes>
              <Route path="/" element={<Marketplace />}/>
              <Route path="/nftPage" element={<NFTPage />}/>  
              <Route path="/sellNFT" element={<SellNFT />}/>        
              <Route path="/profile" element={<Profile />}/>           
            </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
