import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { database } from "../../firebase";
import { useEffect } from "react";
import { trancate } from "../utilities/trancate";

function Profile({ user, desArr, setDesArr, desText, setDesText, setDesID }) {
  const [showBlogs, setShowBlogs] = useState("grid");
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    getData();
    getDescription();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    for (let text of desArr) {
      setDesText(text.desc?.description);
      setDesID(text.id);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desArr]);

  const getData = async () => {
    const blogCol = collection(database, "blogs");
    const queryRef = query(blogCol, where("auther", "==", user.displayName));
    await getDocs(queryRef).then((res) => {
      setBlogs(res.docs.map((doc) => ({ id: doc.id, blog: doc.data() })));
    });
  };

  const getDescription = async () => {
    const descriptionCol = collection(database, "description");
    const queryRef = query(descriptionCol, where("uid", "==", user.uid));
    await getDocs(queryRef).then((res) => {
      setDesArr(res.docs.map((doc) => ({ id: doc.id, desc: doc.data() })));
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
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src="https://images.unsplash.com/photo-1581646064576-6bc5a216f02c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTd8fHdvcmslMjBkZXNrfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
                referrerPolicy="no-referrer"
                alt="cover-profile"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
        <div className="user_name pl-64 pt-4 pb-2 pr-4 max-sm:pl-4 max-sm:pt-12 flex items-center justify-between max-sm:items-start max-sm:flex-col max-sm:gap-y-4">
          <div>
            <h3 className="name text-white text-2xl font-bold">
              {user?.displayName}
            </h3>
            <p className="description text-gray-500 text-sm mt-2 w-[300px]">
              {desText && trancate(desText, 200)}
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
        {blogs.length > 0 ? (
          <div
            className={`${
              showBlogs === "grid"
                ? "grid grid-cols-4 gap-1 max-md:grid-cols-3"
                : "flex flex-col gap-y-8"
            } min-w-full mt-8 pb-12 px-4`}
          >
            {blogs.map(({ id, blog }) =>
              showBlogs === "grid" ? (
                <Link
                  to={`/${id}`}
                  key={id}
                  className={`col-span-1 h-64 w-full overflow-hidden max-md:h-32`}
                >
                  {blog.imgUrl && (
                    <img
                      src={blog?.imgUrl}
                      referrerPolicy="no-referrer"
                      alt="img-blogs"
                      className="w-full h-full object-fill hover:scale-110 transition-transform"
                    />
                  )}
                </Link>
              ) : (
                <div
                  key={id}
                  className={`flex items-start gap-x-4 bg-slate-900 w-full text-white p-4 rounded-lg max-md:flex-col max-md:gap-y-4`}
                >
                  <div className="img w-48 h-48 rounded-lg overflow-hidden max-md:w-full max-md:h-[400px]">
                    {blog.imgUrl && (
                      <img
                        src={blog?.imgUrl}
                        referrerPolicy="no-referrer"
                        alt="img-blogs"
                        className="w-full h-full object-fill hover:scale-110 transition-transform"
                      />
                    )}
                  </div>
                  <div className="flex-1 w-full flex flex-col justify-between">
                    <div className="info flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="title text-2xl font-semibold">
                          {trancate(blog.title, 30)}
                        </h3>
                        <p className="category bg-sky-500 px-1 rounded-md">
                          {blog.category}
                        </p>
                      </div>
                      {blog.tags && (
                        <div className="tags flex items-center gap-x-2 mt-2 mb-4">
                          {blog?.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-yellow-400 text-slate-900 font-bold px-1 rounded-md"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <p
                        className={`description mb-10 max-lg:mb-6 max-xl:h-[80px]  ${
                          blog.description.length > 250
                            ? "max-sm:h-[80px]"
                            : "max-sm:h-fit"
                        }`}
                      >
                        {trancate(blog.description, 250)}
                      </p>
                    </div>
                    <div className="flex justify-between items-center max-sm:flex-col max-sm:items-start w-full">
                      <div className="flex gap-2 text-gray-500 text-xs mt-2 max-lg:hidden">
                        <span className="trending">
                          Trending: {blog?.trending}
                        </span>
                        <span className="time">
                          {blog.timeStamp
                            ? new Date(blog.timeStamp.toDate())
                                .toString()
                                .slice(0, 21)
                            : ""}
                        </span>
                      </div>
                      <div className="auther max-sm:w-full flex items-center justify-end max-sm:justify-start gap-2 max-lg:flex-1">
                        written by:
                        <div className="flex-1 flex  items-center gap-2">
                          <Link
                            to="/profile"
                            className="name text-sm font-bold mt-1 flex items-center gap-4 max-sm:flex-1"
                          >
                            {trancate(blog.auther, 15)}
                          </Link>
                          <Link
                            to={`/${id}`}
                            className="flex items-center bg-white text-slate-900 px-1 rounded-md ml-auto"
                          >
                            See More{" "}
                            <i className="ri-arrow-right-s-line text-xl"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className="min-w-full mt-20 flex items-center justify-center">
            <h2 className="text-white text-2xl">No Data To Show</h2>
          </div>
        )}
      </div>
    </>
  );
}

export default Profile;
