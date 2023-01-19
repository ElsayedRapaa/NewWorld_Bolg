import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { database } from "../../firebase";
import Blog from "../Blog";

function Home({ loading, setLoading }) {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    setLoading(true);
    const blogsCol = collection(database, "blogs");
    const queryRef = query(blogsCol, orderBy("timeStamp", "desc"));
    onSnapshot(queryRef, (snapshot) => {
      setBlogs(snapshot.docs.map((doc) => ({ id: doc.id, blog: doc.data() })));
    });
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {loading ? (
        <div className="fixed top-16 left-0 flex items-center justify-center min-w-full h-screen bg-slate-800 text-white text-2xl">
          <div className="animate-spin h-12 w-12 border-l-2 border-b-2 border- border-t-8 border-r-2 border-white rounded-full mr-6 text-white"></div>
          Loading...
        </div>
      ) : (
        <div className="min-w-full min-h-full px-4 py-8 flex flex-col gap-y-8 lg:grid lg:grid-cols-2 gap-x-4">
          <Blog loading={loading} setLoading={setLoading} blogs={blogs} />
        </div>
      )}
    </>
  );
}

export default Home;
