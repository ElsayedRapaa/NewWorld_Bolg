import React, { useEffect, useState } from "react";
import "remixicon/fonts/remixicon.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./components/pages/Home";
import AddPost from "./components/pages/AddPost";
import Trending from "./components/pages/Trending";
import Profile from "./components/pages/Profile";
import BlogPage from "./components/pages/BlogPage";
import Error from "./components/pages/Error";
import Navbar from "./components/Navbar";
import ASide from "./components/ASide";
import Auth from "./components/Auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "./firebase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { collection, getDocs, query, where } from "firebase/firestore";
import TrendPage from "./components/TrendPage";
import Settings from "./components/pages/Settings";

function App() {
  const [showSide, setShowSide] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [editBlog, setEditBlog] = useState(null);
  const [trending, setTrending] = useState([]);
  const [uTrend, setUTrend] = useState([]);
  const [tagTrend, setTagTrend] = useState([]);
  const [desArr, setDesArr] = useState([]);
  const [desText, setDesText] = useState("");
  const [desID, setDesID] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    } else {
      navigate("/signin");
    }

    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        setUser(userAuth);
        setLoading(true);
      } else {
        setUser(null);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    getData();
    setUTrend(
      trending.map(({ id, trend }) => trend).map((tags) => tags.tags[0])
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trending.length > 0]);

  useEffect(() => {
    newSetFunc();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uTrend.length > 0]);

  // console.log(uTrend);
  // console.log(tagTrend);

  const closeSide = () => {
    setShowSide(false);
  };

  const getData = async () => {
    const trendCol = collection(database, "blogs");
    const queryRef = query(trendCol, where("trending", "==", "yes"));
    await getDocs(queryRef).then((res) => {
      setTrending(res.docs.map((doc) => ({ id: doc.id, trend: doc.data() })));
    });
  };

  const newSetFunc = () => {
    let newSet = [...new Set(uTrend)];
    setTagTrend(newSet);
  };

  return (
    <div className="container min-w-full min-h-screen bg-slate-800 relative">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        theme="dark"
      />
      <Navbar showSide={showSide} setShowSide={setShowSide} user={user} />
      {showSide && (
        <>
          <ASide showSide={showSide} setShowSide={setShowSide} user={user} />
          <div
            className="fixed top-0 right-0 w-full z-0 min-h-screen bg-slate-900/50"
            onClick={closeSide}
          ></div>
        </>
      )}
      <Routes>
        {user ? (
          <>
            <Route
              path="/"
              element={<Home loading={loading} setLoading={setLoading} />}
            />
            <Route
              path={`${!edit ? "/addblog" : "/editblog"}`}
              element={
                <AddPost
                  user={user}
                  edit={edit}
                  setEdit={setEdit}
                  editBlog={editBlog}
                  setEditBlog={setEditBlog}
                />
              }
            />
            <Route
              path="/trending"
              element={<Trending tagTrend={tagTrend} />}
            />
            <Route path={`/trending/:trend`} element={<TrendPage />} />
            <Route
              path="/profile"
              element={
                <Profile
                  user={user}
                  desArr={desArr}
                  setDesArr={setDesArr}
                  desText={desText}
                  setDesText={setDesText}
                  setDesID={setDesID}
                />
              }
            />
            <Route
              path="/profile/settings"
              element={
                <Settings
                  user={user}
                  desText={desText}
                  setDesText={setDesText}
                  desID={desID}
                />
              }
            />
            <Route path="/:id">
              <Route
                index
                element={
                  <BlogPage
                    loading={loading}
                    setLoading={setLoading}
                    user={user}
                    edit={edit}
                    setEdit={setEdit}
                    editBlog={editBlog}
                    setEditBlog={setEditBlog}
                  />
                }
              />
            </Route>
            <Route path="*" element={<Error />} />
          </>
        ) : (
          <Route path="/signin" element={<Auth setUser={setUser} />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
