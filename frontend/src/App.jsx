import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/navbar';
import Home from './pages/Home';    
import Animals from './pages/Animals';
import GiftShop from './pages/GiftShop';
import Events from './pages/Events';
import Login from './components/login';
import AdminLogin from './components/AdminLogin';
import Signup from './components/signup';
import Payment from "./components/payment";
import Tickets from "./pages/Tickets";
//import Donate from "./pages/Donate"
import DonatePage from "./pages/donatePage";
import ProductPage from './components/ProductPage';
import Admin from './pages/AdminPage';
import Member from './pages/MemberPage';
import SettingsPage from "./components/SettingsPage";
import Checkout from "./pages/checkout";
import MemSignup from "./pages/MemberSignup";
import TotalReport from "./adminpages/totalReport";
import AnimalPage from "./components/AnimalPage";
import EmployeeTable from "./components/employeeTable";
import AnimalTable from "./components/animalTable"
import GiftsTable from "./components/giftshopTable";
import FeedingReport from './components/feedingReport';
import DonoationReport from './adminpages/donationReport'
import './App.css';

function App() {
    return (
        <div>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/AdminLogin" element={<AdminLogin />} />
                    <Route path="/animals" element={<Animals />} />
                    <Route path="/Admin/:employeeID/animals" element={<Animals />} />
                    <Route path="/member/:memberId/animals" element={<Animals />} />
                    <Route path="/giftshop" element={<GiftShop />} />
                    <Route path="/Admin/:employeeID/giftshop" element={<GiftShop />} />
                    <Route path="/product/:name" element={<ProductPage />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/member/:memberId/events" element={<Events />} />
                    <Route path="/Admin/:employeeId/events" element={<Events />} />  
                    <Route path="/signup" element={<Signup/>} />
                    <Route path="/tickets" element={<Tickets />} />
                    <Route path="member/:memberId/tickets" element={<Tickets />} />
                    <Route path="Admin/:employeeID/tickets" element={<Tickets />} />
                    <Route path="/payment" element={<Payment />} /> 
                    <Route path="/member/:memberId/payment" element={<Payment />} />
                    <Route path="/Admin/:employeeID/payment" element={<Payment />} />
                   {/* <Route path="/Donate" element={<Donate />} /> */}
                   <Route path="/DonatePage" element={<DonatePage/>} /> 
                   <Route path ="/Admin" element={<Admin />} />
                   <Route path="/Admin/:employeeID" element={<Admin />} />
                   {/* <Route path ="/Member" element={<Member />} /> */}
                    <Route path="/member/:memberId" element={<Member />} /> 
                    {/* <Route path="/settings" element={<SettingsPage />} />  */}
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/MemSignup" element={<MemSignup />} />
                    <Route path="/Admin/:employeeID/MemSignup" element={<MemSignup />} />
                    <Route path="/member/:memberId/settings" element={<SettingsPage />} />
                    <Route path="Admin/:employeeID/totalReport" element={<TotalReport />} />
                    <Route path="/animal/:name" element={<AnimalPage />} />
                    <Route path="Admin/:employeeID/employeeTable" element={<EmployeeTable />} />  
                    <Route path="Admin/:employeeID/animalTable" element={<AnimalTable />} /> 
                    <Route path="Admin/:employeeID/giftshopTable" element={<GiftsTable />} />
                    <Route path="member/:memberId/Checkout" element={<Checkout />} />
                    <Route path="Admin/:employeeID/feedingSchedule" element={<FeedingReport />} />
                    <Route path="Admin/:employeeID/donationReport" element={<DonoationReport />} />
                </Routes>
            </Router>
        </div>
    );
}

export default App;
