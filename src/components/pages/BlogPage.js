import { deleteDoc, doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { database } from "../../firebase";
import { toast } from "react-toastify";

function BlogPage({
  loading,
  setLoading,
  user,
  edit,
  setEdit,
  editBlog,
  setEditBlog,
}) {
  const [blog, setBlog] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const blogCol = doc(database, "blogs", id);
    const getBlog = async () => {
      const getData = await getDoc(blogCol);
      setBlog(getData.data());
      setLoading(false);
    };

    id && getBlog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (edit) {
      setTimeout(() => {
        navigate("/editblog");
      }, 400);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edit]);

  const handleDelete = async () => {
    const theDelete = window.confirm("You Need Delete Blog");
    if (theDelete) {
      const blogCol = doc(database, "blogs", id);
      await deleteDoc(blogCol)
        .then(() => {
          toast.success("Deleted Blog Done...");
          navigate("/");
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  };

  const handleEdit = () => {
    setEdit(true);
    setEditBlog({ id, blog });
  };

  return (
    <>
      {loading ? (
        <div className="fixed top-16 left-0 flex items-center justify-center min-w-full h-screen bg-slate-800 text-white text-2xl">
          <div className="animate-spin h-12 w-12 border-l-2 border-b-2 border- border-t-8 border-r-2 border-white rounded-full mr-6 text-white"></div>
          Loading...
        </div>
      ) : (
        <div className="min-w-full min-h-full px-4 py-8 text-white bg-slate-900">
          written by:{" "}
          <div className="auther flex items-center gap-4 mt-4">
            {blog.photo && (
              <img
                referrerPolicy="no-referrer"
                src={blog?.photo}
                alt={blog.auther}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <Link to="/profile" className="flex items-center gap-4">
              <span className="text-xl font-bold">{blog.auther}</span>
            </Link>
          </div>
          <div className="blog my-8">
            <h4 className="title text-xl font-semibold">{blog.title}</h4>
            <div className="flex items-center justify-between my-4">
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
              <p className="category bg-sky-500 px-1 rounded-md">
                {blog.category}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <span className="trending text-gray-500">
                Trending: {blog?.trending}
              </span>
              <span className="time text-gray-500">
                {blog.timeStamp
                  ? new Date(blog.timeStamp.toDate()).toString().slice(0, 21)
                  : ""}
              </span>
            </div>
            {blog.imgUrl !== "" && (
              <div className="w-full h-[70vh] mb-8 mt-2 bg-slate-800">
                <img
                  referrerPolicy="no-referrer"
                  src={blog?.imgUrl}
                  alt={blog.auther}
                  className="w-full h-full object-contain"
                />
              </div>
            )}
            <div className="description my-8 tracking-wider leading-6">
              {blog.description}
            </div>
          </div>
          {blog.uid === user.uid && (
            <div className="w-fit flex gap-4 ml-auto ,t-2 mb-8">
              <button
                className="px-4 py-2 rounded-md flex items-center gap-2 bg-red-700 transition-colors hover:bg-red-700/75"
                onClick={handleDelete}
              >
                Delete <i className="ri-delete-bin-7-fill text-xl"></i>
              </button>
              <button
                className="px-4 py-2 rounded-md flex items-center gap-2 bg-sky-500 transition-colors hover:bg-sky-500/75"
                onClick={handleEdit}
              >
                Edit <i className="ri-edit-box-fill text-xl"></i>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default BlogPage;
