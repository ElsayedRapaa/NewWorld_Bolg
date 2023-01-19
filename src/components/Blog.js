import { trancate } from "./utilities/trancate";
import { Link } from "react-router-dom";

function Blog({ loading, blogs }) {
  if (loading) {
    <div className="fixed top-16 left-0 flex items-center justify-center min-w-full h-screen bg-slate-800 text-white text-2xl">
      <div className="animate-spin h-12 w-12 border-l-2 border-b-2 border- border-t-8 border-r-2 border-white rounded-full mr-6 text-white"></div>
      Loading...
    </div>;
  }

  return (
    <>
      {blogs?.map(({ id, blog }) => (
        <div
          className="flex items-start gap-4 p-4 rounded-lg overflow-hidden text-white h-fit max-md:flex-col max-md:h-fit bg-slate-900"
          key={id}
        >
          {blog.imgUrl && (
            <div className="img w-48 h-48 rounded-md max-md:w-full max-md:h-[400px] bg-slate-800">
              <img
                referrerPolicy="no-referrer"
                src={blog?.imgUrl}
                className="w-full h-full object-fill rounded-lg"
                alt="blog"
              />
            </div>
          )}
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
              <div className="flex gap-2 text-gray-500 text-xs mt-2 lg:hidden">
                <span className="trending">Trending: {blog?.trending}</span>
                <span className="time">
                  {blog.timeStamp
                    ? new Date(blog.timeStamp.toDate()).toString().slice(0, 21)
                    : ""}
                </span>
              </div>
              <div className="auther max-sm:w-full flex items-center justify-end max-sm:justify-start gap-2 lg:flex-1">
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
                    See More <i className="ri-arrow-right-s-line text-xl"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export default Blog;
