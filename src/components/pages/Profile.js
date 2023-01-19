import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { database } from "../../firebase";
import { useEffect } from "react";

function Profile({ user }) {
  const [showBlogs, setShowBlogs] = useState("grid");
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    getData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    const blogCol = collection(database, "blogs");
    const queryRef = query(blogCol, where("auther", "==", user.displayName));
    await getDocs(queryRef).then((res) => {
      setBlogs(res.docs.map((doc) => ({ id: doc.id, blogs: doc.data() })));
    });
  };

  const handleShowBlogs = (text) => {
    setShowBlogs(text);
  };

  return (
    <>
      <div className="min-w-full min-h-full">
        <div className="cover w-full h-96 relative">
          <img
            src="https://images.unsplash.com/photo-1581646064576-6bc5a216f02c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fHdvcmslMjBkZXNrfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=1280&q=1080"
            referrerPolicy="no-referrer"
            alt="cover-profile"
            className="w-full h-full object-cover"
          />
          <div className="img_profile w-48 h-48 rounded-lg absolute bottom-[-25%] left-12 overflow-auto border-8 border-slate-800 max-sm:w-24 max-sm:h-24 max-sm:bottom-[-12.5%] max-sm:left-4">
            {user.photoURL ? (
              <img
                src={user?.photoURL}
                referrerPolicy="no-referrer"
                alt="img-profile"
                className="w-full h-full rounded-lg object-cover"
              />
            ) : (
              <img
                src="https://images.unsplash.com/photo-1581646064576-6bc5a216f02c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fHdvcmslMjBkZXNrfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
                referrerPolicy="no-referrer"
                alt="cover-profile"
                className="w-full h-full rounded-lg object-cover"
              />
            )}
          </div>
        </div>
        <div className="user_name pl-64 pt-4 pb-2 pr-4 max-sm:pl-4 max-sm:pt-12 flex items-center justify-between max-sm:items-start max-sm:flex-col max-sm:gap-y-4">
          <div>
            <h3 className="name text-white text-2xl font-bold">
              {user?.displayName}
            </h3>
            <p className="description text-gray-500">
              React Fron-End Developer
            </p>
          </div>
          <div className="max-sm:flex-1 max-sm:mx-auto max-sm:mt-4">
            <Link
              to="/profile/settings"
              className="px-4 py-1 bg-sky-500 rounded-md transition-colors hover:bg-sky-500/75 text-white max-sm:w-64"
            >
              Setting Profile
            </Link>
          </div>
        </div>
        <div className="sidebar_profile bg-slate-900 w-full h-16 px-4 flex items-center mt-12 gap-x-4">
          <div
            className={`show_grid bg-slate-800 px-4 text-white flex items-center gap-x-2 rounded-md cursor-pointer py-1 ${
              showBlogs === "grid" &&
              "bg-sky-500 rounded-md transition-colors hover:bg-sky-500/75"
            }`}
            onClick={() => handleShowBlogs("grid")}
          >
            <i className="ri-grid-fill text-2xl max-sm:text-xl"></i>
            <span className="text-xl max-sm:text-base">Grid</span>
          </div>
          <div
            className={`show_list bg-slate-800 px-4 text-white flex items-center gap-x-2 rounded-md cursor-pointer py-1 ${
              showBlogs === "list" &&
              "bg-sky-500 rounded-md transition-colors hover:bg-sky-500/75"
            }`}
            onClick={() => handleShowBlogs("list")}
          >
            <i className="ri-list-check text-2xl max-sm:text-xl"></i>
            <span className="text-xl max-sm:text-base">List</span>
          </div>
        </div>
        <div
          className={`${
            showBlogs === "grid"
              ? "grid grid-cols-4 gap-1"
              : "flex flex-col gap-y-8"
          } min-w-full mt-8 pb-12 px-4`}
        >
          {blogs.map(({ id, blogs }) =>
            showBlogs === "grid" ? (
              <Link
                to={`/${id}`}
                key={id}
                className={`col-span-1 h-64 w-full overflow-hidden`}
              >
                {blogs.imgUrl && (
                  <img
                    src={blogs?.imgUrl}
                    referrerPolicy="no-referrer"
                    alt="img-blogs"
                    className="w-full h-full object-fill hover:scale-110 transition-transform"
                  />
                )}
              </Link>
            ) : (
              <div
                key={id}
                className={`flex items-start gap-x-4 bg-slate-900 w-full`}
              >
                <div className="img w-48 h-48 rounded-lg overflow-hidden">
                  {blogs.imgUrl && (
                    <img
                      src={blogs?.imgUrl}
                      referrerPolicy="no-referrer"
                      alt="img-blogs"
                      className="w-full h-full object-fill hover:scale-110 transition-transform"
                    />
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;
