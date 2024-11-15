import React from "react";
import { Link, useNavigate} from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Navbar() {

  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token"); // Check if a token exists

  useEffect(() => {
    // Clear localStorage if necessary
    if (!isLoggedIn) {
      localStorage.removeItem("token");
    }
  }, []);
  
  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from local storage
    navigate("/login"); // Redirect to login page
  };

  if (location.pathname.startsWith('/member')) {
    return null;
  }

  return (

    <header className="bg-[#faf0e6] h-20 flex items-center justify-between px-4">
      {/* Logo Section */}
     <div className="flex items-center">
      <Link to="/" className="flex items-center">
        <img className="h-[70px]" src="Coog_Zoo.png" alt="logo" />
      </Link>

      <Link to="/AdminLogin"> {/* Link to Admin Login */}
            <button className="text-[#165e229e] ml-4 font-bold hover:text-green-800 ">
              Admin Login
            </button>
      </Link>
    </div>
      

      
      {/* Buttons Section */}
      <div className="flex items-center">
        <Link to="/MemSignup">
          <button className="text-[#165e229e] font-bold hover:text-green-900 ml-4 p-1">
            Member Plans
          </button>
        </Link>

      <div className="flex items-center">
        <Link to="/Events">
          <button className="text-[#165e229e] font-bold hover:text-green-900 ml-4 p-1">
            Upcoming Events
          </button>
        </Link>

        <Link to="/tickets">
          <button className="text-[#165e229e] font-bold hover:text-green-900 ml-4 p-1">
            Tickets
          </button>
        </Link>

        <Link to="/giftshop">
          <button className="text-[#165e229e] font-bold hover:text-green-900 ml-4 p-1">
            Merchandise
          </button>
        </Link>

        <Link to="/animals">
          <button className="text-[#165e229e] font-bold hover:text-green-900 ml-4 p-1">
            Animals
          </button>
        </Link>

        {/* Conditional rendering based on login status */}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-[#165e229e] rounded font-bold text-white hover:bg-green-900 ml-4 pl-2 pr-2 h-[35px]"
          >
            Log out
          </button>
        ) : (
          <Link to="/login">
            <button className="bg-[#165e229e] rounded font-bold text-white hover:bg-green-900 ml-4 pl-2 pr-2 h-[35px]">
              Log in
            </button>
          </Link>
        )}
        </div>
      </div>
    </header>
   );
}
