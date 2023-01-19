import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { database } from "../firebase";
import { Link } from "react-router-dom";
import { trancate } from "./utilities/trancate";

function TagTrend({ trend }) {
  const [trending, setTrending] = useState([]);
  const [trendYes, setTrendYes] = useState([]);
  const [blogTrend, setBlogTrend] = useState([]);

  useEffect(() => {
    getTrends();

    setTrendYes(trending.map(({ id, blog }) => ({ id: id, blog: blog })));

    blogTrendFunc();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trend && trend]);
  // console.log(trend);

  const getTrends = async () => {
    const trendCol = collection(database, "blogs");
    await getDocs(trendCol).then((res) => {
      setTrending(res.docs.map((doc) => ({ id: doc.id, blog: doc.data() })));
    });
  };

  const blogTrendFunc = () => {
    setBlogTrend(
      trendYes.map(
        ({ id, blog }) => blog?.tags.includes(trend) && { id: id, blog: blog }
      )
    );
  };

  return (
    <div className="text-white rounded-lg h-fit flex flex-col gap-y-8">
      {trend && (
        <>
          <h1 className="text-xl mb-4">Trend Name: {trend}</h1>
          {blogTrend &&
            blogTrend.map(
              ({ id, blog }) =>
                blog && (
                  <div
                    key={id}
                    className="w-full p-4 rounded-md bg-slate-900 flex items-start gap-x-4 max-md:flex-col"
                  >
                    {blog.imgUrl && (
                      <div className="img w-48 h-48">
                        <img
                          src={blog.imgUrl}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-fill rounded-lg"
                          alt="img-blog"
                        />
                      </div>
                    )}
                    <div className="flex-1 flex flex-col">
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
        </>
      )}
      {/* : ({" "}
      <div className="flex justify-center items-center h-[89vh] ">
        {" "}
        <h1 className="text-white flex justify-center items-center text-xl">
           Open Trend From List //{" "}
        </h1>
        {" "}
      </div>
       )} */}
    </div>
  );
}

export default TagTrend;
