import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { database, storage } from "../../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const initialState = {
  title: "",
  tags: [],
  trending: "no",
  category: "",
  description: "",
};

const categoryOptions = [
  "Fashion",
  "Technology",
  "Food",
  "Politics",
  "Sports",
  "Business",
];

function AddPost({ user, edit, setEdit, editBlog, setEditBlog }) {
  const [form, setForm] = useState(initialState);
  const [newTags, setNewTags] = useState([]);
  const [tagName, setTagName] = useState("");
  const [file, setFile] = useState(null);
  const [imgURL, setImgURL] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [progress, setProgress] = useState("");
  const navigate = useNavigate();

  const { title, tags, trending, category, description } = form;

  useEffect(() => {
    setNewTags(tags);
  }, [tags]);

  const storageRef = ref(storage, `${file?.name}`);

  useEffect(() => {
    const uploadTask = uploadBytesResumable(storageRef, file);
    const uploadFile = () => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log("Upload Is " + progress + " % done");
          setProgress(progress);

          switch (snapshot.state) {
            case "paused":
              console.log("Upload Is Pused");
              break;
            case "running":
              console.log("Upolad is Running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            toast.info("Added The File");
            setImgURL(downloadURL);
          });
        }
      );
    };

    file && uploadFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  useEffect(() => {
    if (edit) {
      setForm({
        ...form,
        title: editBlog.blog.title,
        tags: editBlog.blog.tags,
        trending: editBlog.blog.trending,
        category: editBlog.blog.category,
        description: editBlog.blog.description,
      });
      // setFile(editBlog.blog.imgUrl);
      setImgURL(editBlog.blog.imgUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [edit]);

  const handleTitle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTags = (e) => {
    // setForm({ ...form, [e.target.name]: e.target.value });
    if (e.key === ",") {
      tags.push(tagName);
      setTimeout(() => {
        setTagName("");
      }, 10);
    }
  };

  const removeItem = (id) => {
    tags.splice(id, 1);
    setTagName("/");
    setTimeout(() => {
      setTagName("");
    }, 10);
  };

  const handleTrending = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCategory = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDescription = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSnumbit = async (e) => {
    e.preventDefault();

    if (!edit) {
      if (title && category && description) {
        const blogsCol = collection(database, "blogs");
        await addDoc(blogsCol, {
          ...form,
          timeStamp: serverTimestamp(),
          imgUrl: imgURL !== "" ? imgURL : "",
          auther: user.displayName,
          photo: user.photoURL ? user.photoURL : null,
          uid: user.uid,
        })
          .then(() => {
            toast.success("The Blog is Published");
            tags.splice(0);
            setFile(null);
            navigate("/");
          })
          .catch((error) => {
            toast.error(`${error.message}`);
          });
      } else {
        toast.error("Please Type Title & Category & Description For Blog");
      }
    } else if (title && category && description) {
      const blogCol = doc(database, "blogs", editBlog.id);
      await updateDoc(blogCol, {
        ...form,
        timeStamp: serverTimestamp(),
        imgUrl: imgURL !== "" ? imgURL : "",
        update: true,
      })
        .then(() => {
          toast.success("Edit The Blog Done...");
          tags.splice(0);
          setEdit(false);
          setEditBlog(null);
          navigate("/");
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }
  };

  return (
    <div className="min-w-full min-h-full px-4 py-8">
      <form
        onSubmit={handleSnumbit}
        className="w-full h-full bg-slate-900 px-4 py-8 rounded-lg flex flex-col"
      >
        <label htmlFor="title" className="text-white text-xl mb-2">
          Ttitle
        </label>
        <input
          type="text"
          placeholder="Title Blog..."
          id="title"
          name="title"
          className="border border-gray-600 text-white outline-none w-full px-4 py-2 rounded-md bg-slate-800 mb-6"
          value={title}
          onChange={handleTitle}
        />
        <div className="flex flex-col">
          <label htmlFor="tags" className="text-white text-xl mb-2">
            Tags Dis Coma (,)
          </label>
          <div className="border border-gray-600 flex gap-2 flex-wrap w-full px-4 py-2 bg-slate-800 mb-6">
            <div className="flex gap-2">
              {tags.length > 0 &&
                newTags?.map((tag, index) => (
                  <span
                    className="bg-slate-900 flex gap-2 rounded-md overflow-hidden"
                    key={index}
                  >
                    <span className="text-white pl-1">{tag}</span>
                    <span
                      className="flex items-center justify-center cursor-pointer hover:bg-slate-700"
                      onClick={() => removeItem(index)}
                    >
                      <i className="ri-close-line text-white"></i>
                    </span>
                  </span>
                ))}
            </div>
            <input
              type="text"
              placeholder="Dis Coma (,) Add Tag Blog..."
              id="tags"
              name="tags"
              className="border-none text-white outline-none bg-transparent flex-1"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              onKeyDown={handleTags}
            />
          </div>
        </div>
        <div className="flex w-full mb-4">
          <h3 className="mr-4 text-xl text-white">Trending:</h3>
          <label htmlFor="yes" className="text-white text-xl mb-1 mr-2">
            YES
          </label>
          <input
            type="radio"
            name="trending"
            id="yes"
            className="mr-2"
            value="yes"
            checked={trending === "yes"}
            onChange={handleTrending}
          />
          <label htmlFor="no" className="text-white text-xl mb-1 mr-2">
            No
          </label>
          <input
            type="radio"
            name="trending"
            id="no"
            className="mr-2"
            value="no"
            checked={trending === "no"}
            onChange={handleTrending}
          />
        </div>
        <label htmlFor="category" className="text-white text-xl mb-2">
          Category
        </label>
        <select
          name="category"
          id="category"
          value={category}
          className="mb-6 bg-slate-800 rounded-md text-white px-4 py-2 border border-gray-600 outline-none"
          onChange={handleCategory}
        >
          {categoryOptions.map((item, index) => (
            <option key={index} value={item || ""}>
              {item}
            </option>
          ))}
        </select>
        <label htmlFor="description" className="text-white text-xl mb-2">
          Ttitle
        </label>
        <textarea
          type="text"
          placeholder="Title Blog..."
          id="description"
          rows={15}
          name="description"
          className="border border-gray-600 text-white outline-none w-full px-4 py-2 rounded-md bg-slate-800 mb-6"
          value={description}
          onChange={handleDescription}
        />
        <div className="file flex items-center gap-12">
          <div className="file w-48 bg-sky-500 flex justify-center items-center rounded-md transition-colors hover:bg-sky-500/75 relative overflow-hidden my-6">
            <i className="ri-image-add-fill text-2xl text-white select-none pointer-events-none absolute top-50 left-50 translate-[-50%, -50%]"></i>
            <input
              type="file"
              name="file"
              className="opacity-0 w-full h-full py-2"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          {imgURL && (
            <img
              src={imgURL}
              className="w-32 h-32 rounded-md object-cover"
              alt="file-blog"
            />
          )}
        </div>
        {/* {!edit && (
        )} */}
        <button
          className="bg-sky-500 transition-colors hover:bg-sky-500/75 text-white cursor-pointer py-2 px-4 block ml-auto rounded-md my-4"
          // disabled={!edit && progress !== null && progress > 100}
        >
          {edit ? "Update Blog" : "Publish Blog"}
        </button>
      </form>
    </div>
  );
}

export default AddPost;
