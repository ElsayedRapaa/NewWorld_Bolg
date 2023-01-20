import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function ASide({ showSide, setShowSide, user }) {
  const [active, setActive] = useState("/");

  useEffect(() => {
    setActive(window.location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname]);

  const addActive = () => {
    setShowSide(false);
  };

  const handleSide = (e) => {
    e.stopPropagation();
  };

  const closeSide = () => {
    setShowSide(false);
  };

  return (
    <>
      {user && (
        <div
          className={`w-64 min-h-screen flex flex-col justify-between z-10 fixed top-0 ${
            showSide ? "left-0" : "-left-full"
          }  bg-slate-900 pt-3 transition-all`}
          onClick={handleSide}
        >
          <div className="logo_links">
            <div className="top text-white flex items-center justify-between px-4">
              <Link to="/" className="logo text-2xl">
                NewWorld
              </Link>
              <div
                className="mt-1 transition-colors w-8 h-8 hover:bg-gray-700 cursor-pointer flex justify-center items-center rounded-full"
                onClick={closeSide}
              >
                <i className="ri-close-line text-xl"></i>
              </div>
            </div>
            <div className="bottom mt-4 text-white flex flex-col justify-center">
              <Link
                to="/"
                className={`bg-slate-800 px-4 py-2 border-b border-gray-700/75 transition-colors hover:bg-slate-800/50 ${
                  active === "/" && "bg-slate-800/50"
                }`}
                onClick={() => addActive()}
              >
                Home
              </Link>
              <Link
                to="/addblog"
                className={`bg-slate-800 px-4 py-2 border-b border-gray-700/75 transition-colors hover:bg-slate-800/50 ${
                  active === "/addblog" && "bg-slate-800/50"
                }`}
                onClick={() => addActive()}
              >
                Add Blog
              </Link>
              <Link
                to="/trending"
                className={`bg-slate-800 px-4 py-2 border-b border-gray-700/75 transition-colors hover:bg-slate-800/50 ${
                  active === "/trending" && "bg-slate-800/50"
                }`}
                onClick={() => addActive()}
              >
                Trending
              </Link>
              <Link
                to={`/profile/${user.displayName.split(" ").join("")}`}
                className={`bg-slate-800 px-4 py-2 border-b border-gray-700/75 transition-colors hover:bg-slate-800/50 ${
                  active === "/profile" && "bg-slate-800/50"
                }`}
                onClick={() => addActive()}
              >
                Profile
              </Link>
            </div>
          </div>
          <div className="footer text-gray-400 text-center text-xs px-8 pb-2">
            Copyright &copy; 2023 NewWorld Blog | Created By{" "}
            <span className="text-sky-500">Elsayed Rapaa</span>
          </div>
        </div>
      )}
    </>
  );
}

export default ASide;
