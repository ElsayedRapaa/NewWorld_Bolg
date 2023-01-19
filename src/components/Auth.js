import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";

function Auth({ setUser }) {
  const navigate = useNavigate();

  const signIn = () => {
    signInWithPopup(auth, provider).then((res) => {
      setUser(res.user);
      navigate("/");
    });
  };

  return (
    <>
      <div className="flex items-center justify-center min-w-full h-[80vh]">
        <button
          className="text center text-xl cursor-pointer flex items-center gap-2 text-white px-6 py-2 rounded-md bg-sky-500 transition-colors hover:bg-sky-500/75"
          onClick={signIn}
        >
          Signin With Google{" "}
          <span className="pt-1">
            <i className="ri-google-fill text-2xl"></i>
          </span>
        </button>
      </div>
    </>
  );
}

export default Auth;
