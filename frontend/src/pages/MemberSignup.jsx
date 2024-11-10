import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMedal } from '@fortawesome/free-solid-svg-icons';

function MemberSignup() {
  return (
    <div className="bg-[#fef7e7] py-10">
      <header>
        {/* Add your header content here */}
      </header>
      <div className="membership-levels grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 place-items-center">
        <div className="text-center w-64">
          <div className="circle h-64 w-64 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md">
            <div>
            <Link to="/checkout" state={{ membershipType: "Bronze" }}>
                <h3 className="font-bold text-lg font-mono text-amber-800">Bronze Membership</h3>
              </Link>
              <FontAwesomeIcon icon={faMedal} className="text-amber-800 justify-center" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-bold text-gray-700">$99</p>
            <p className="font-semibold italic">Basic access to zoo exhibits and seasonal newsletters</p>
          </div>
        </div>

        <div className="text-center w-64">
          <div className="circle h-64 w-64 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md">
          <div>
            <Link to="/checkout" state={{membershipType: "Silver"}}>
              <h3 className="font-bold text-gray-400 text-lg font-mono ">Silver Membership</h3>
              </Link>
            <FontAwesomeIcon icon={faMedal} className="text-gray-400 justify-center" />
          </div>
          </div>
          <div className="mt-4">
            <p className="font-bold text-gray-700">$149</p>
            <p className=" font-semibold italic">Extended zoo access, plus discounts on zoo events</p>
          </div>
        </div>

        <div className="text-center w-64">
          <div className="circle h-64 w-64 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md">
          <div>
          <Link to="/checkout" state={{ membershipType: "Gold" }}>
            <h3 className="font-bold text-yellow-400 text-lg font-mono ">Gold Membership</h3>
            </Link>
            <FontAwesomeIcon icon={faMedal} className="text-yellow-400 justify-center" />
          </div>
          </div>
          <div className="mt-4">
            <p className="font-bold text-gray-700">$199</p>
            <p className=" font-semibold italic">Priority access to events, early exhibit entry</p>
          </div>
        </div>

        <div className="text-center w-64">
          <div className="circle h-64 w-64 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md">
          <div>
          <Link to="/checkout" state={{ membershipType: "Platinum" }}>
            <h3 className="font-bold text-[#EBE7E1] text-lg font-mono ">Platinum Membership</h3>
            </Link>
            <FontAwesomeIcon icon={faMedal} className="text-[#EBE7E1] justify-center" />
          </div>
          </div>
          <div className="mt-4">
            <p className="font-bold text-gray-700">$299</p>
            <p className=" font-semibold italic">Unlimited guest passes, member-exclusive events</p>
          </div>
        </div>

        <div className="text-center w-64">
          <div className="circle h-64 w-64 rounded-full bg-white flex items-center justify-center overflow-hidden shadow-md">
          <div>
          <Link to="/checkout" state={{ membershipType: "Diamond" }}>
            <h3 className="font-bold text-[#b9f2ff] text-lg font-mono ">Diamond Membership</h3>
            </Link>
            <FontAwesomeIcon icon={faMedal} className="text-[#b9f2ff] justify-center" />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-bold text-gray-700">$399</p>
            <p className=" font-semibold italic">All-access perks, exclusive animal encounters</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default MemberSignup;
