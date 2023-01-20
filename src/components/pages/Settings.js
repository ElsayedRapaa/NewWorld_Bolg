import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { database, storage } from "../../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";

function Settings({ user, desText, setDesText, desID }) {
  const [fileProfile, setFileProfile] = useState(null);
  const [imgURLProfile, setImgURLProfile] = useState("");
  // eslint-disable-next-line react-hooks/exhaustive-deps, no-unused-vars
  const [progressProfile, setProgressProfile] = useState("");
  const [userName, setUserName] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const storageRefProfile = ref(storage, `${fileProfile?.name}`);

  useEffect(() => {
    const uploadTask = uploadBytesResumable(storageRefProfile, fileProfile);
    const uploadFile = () => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          // console.log("Upload Is " + progress + " % done");
          setProgressProfile(progress);

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
            setImgURLProfile(downloadURL);
          });
        }
      );
    };

    fileProfile && uploadFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileProfile]);

  const handleCansle = () => {
    navigate("/profile");
  };

  const handleSave = async () => {
    if (userName !== "") {
      await updateProfile(user, {
        displayName: userName,
      });
    }

    if (imgURLProfile !== "") {
      await updateProfile(user, {
        photoURL: imgURLProfile,
      });
    }

    if (desText !== "") {
      await updateDoc(doc(database, "description", desID), {
        auther: user.displayName,
        description: description,
        uid: user.uid,
      })
        .then(() => {
          toast.success("Done Updated Your Data");
        })
        .catch((error) => {
          toast.error(error.message);
        });
    } else {
      const descriptionCol = collection(database, "description");
      await addDoc(descriptionCol, {
        auther: user.displayName,
        description: description,
        uid: user.uid,
      })
        .then(() => {
          toast.success("Done Updated Your Data");
        })
        .catch((error) => {
          toast.error(error.message);
        });
    }

    navigate(`/profile/${user.displayName.split(" ").join("")}`);
  };

  return (
    <div className="settings text-white pt-4 pb-8">
      <h1 className="text-xl mb-4 px-4">Settings</h1>
      <div className="w-full flex items-center justify-center pb-16">
        <div
          className={`change_img_user w-48 h-48 rounded-full border-8 overflow-hidden border-slate-800 relative max-sm:left-20 max-sm:w-32 max-sm:h-32 max-sm:border-4 max-sm:-top-16 mas-sm:translate-x-[0%]`}
        >
          {user.photoURL ? (
            <img
              src={imgURLProfile !== "" ? imgURLProfile : user?.photoURL}
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
          <div className="absolute bottom-0 left-0 w-full h-20 bg-black/50 flex items-center justify-center flex-col max-sm:h-16">
            <i className="ri-upload-cloud-fill text-2xl select-none user-event-none max-sm:text-base"></i>
            <span className="select-none user-event-none max-sm:text-xs">
              Upload Img
            </span>
            <input
              type="file"
              name="file"
              className="w-full h-full opacity-0 absolute"
              onChange={(e) => setFileProfile(e.target.files[0])}
            />
          </div>
        </div>
      </div>
      <form className="flex items-center justify-center flex-col gap-y-4">
        <div className="flex items-start flex-col gap-y-2">
          <label htmlFor="username">User Name</label>
          <input
            type="text"
            name="userName"
            id="username"
            placeholder="Your Name"
            className="w-[350px] px-2 py-2 bg-transparent outline-none focus:shadow-md focus:shadow-sky-300 border border-gray-400 rounded-md mb-4"
            value={userName !== "" ? userName : user.displayName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="flex items-start flex-col gap-y-2">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Your Email"
            disabled
            className="w-[350px] px-2 py-2 bg-transparent outline-none focus:shadow-md focus:shadow-sky-300 border border-gray-400 rounded-md mb-4"
            value={user.email}
            onChange={() => null}
          />
        </div>
        <div className="flex items-start flex-col gap-y-2">
          <label htmlFor="description">Description</label>
          <textarea
            type="text"
            name="description"
            id="description"
            placeholder="Your Description"
            className="resize-none w-[350px] px-2 py-2 bg-transparent outline-none focus:shadow-sm focus:shadow-sky-200 border border-gray-400 rounded-md mb-4"
            rows={3}
            value={description !== "" ? description : desText}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="buttons flex items-center justify-center gap-x-4">
          <button
            type="button"
            className="px-8 py-1 bg-gray-500 rounded-md transition-colors hover:bg-gray-500/75"
            onClick={handleCansle}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-8 py-1 bg-sky-500 rounded-md transition-colors hover:bg-sky-500/75"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings;
