import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

function Navbar({ setShowSide, user }) {
  const handleSignout = () => {
    signOut(auth);
  };

  const handleSide = () => {
    setShowSide(true);
  };

  return (
    <div className="h-[7vh] min-w-full px-4 sticky top-0 left-0 border-b border-gray-500 flex items-center justify-between bg-slate-900 z-50">
      <div className="left text-white flex items-center gap-6">
        {user && (
          <div
            className="mt-1 transition-colors w-8 h-8 hover:bg-gray-700 cursor-pointer flex justify-center items-center rounded-full"
            onClick={handleSide}
          >
            <i className="ri-menu-line text-xl"></i>
          </div>
        )}
        <Link to="/" className="logo text-2xl">
          NewWorld
        </Link>
      </div>
      {user && (
        <div className="right">
          <button
            className="px-8 py-1 bg-sky-500 rounded-md transition-colors hover:bg-sky-500/75 text-white"
            onClick={handleSignout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Navbar;
