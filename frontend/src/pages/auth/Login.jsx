import { InputFiled, InputPassword, Loader, Logo, PrimaryButton } from "../../router";
import { FaGithub } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { validateEmail } from "../../redux/services/authService";
import { login, RESET, sendLoginCode } from "../../redux/slices/authSlice";

const initialSate = {
  password: "",
  email: "",
};
export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialSate);

  const { isLoading, isSuccess, isError, isLoggedIn, twoFactor } = useSelector((state) => state.auth);
  const { password, email } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const loginUser = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("All fields are required");
    }
    if (!validateEmail(email)) {
      return toast.error("Email is not valid");
    }
    const userData = {
      email,
      password,
    };
    await dispatch(login(userData));
  };

  useEffect(() => {
    if (isSuccess && isLoggedIn) {
      navigate("/");
    }
    // login with otp
    if (isError && twoFactor) {
      dispatch(sendLoginCode(email));
      navigate(`/logi-with-otp/${email}`);
    }
    // ---end here
    dispatch(RESET());
  }, [dispatch, isLoggedIn, isSuccess, navigate, isError, twoFactor, email]);

  // login with google
  /*  const googleLoginhandle = async (credentialResponse) => {
    console.log(credentialResponse);
    await dispatch(loginWithGoogle({ userToken: credentialResponse.credential }));
  }; */
  return (
    <>
      {/* <div className=" absolute top-0 left-0 w-full h-full">
        <div className="flexC">
          <AuthVideo className="w-[500px] h-[500px]" />
        </div>
      </div> */}
      <section className="auth-section">
        {isLoading && <Loader />}
        <div className="auth-section_container">
          <div className="auth-section_container_content">
            <div className="auth-section_container_content_line"></div>
            <div className="flexC pb-4">
              <Logo />
            </div>
            <h1 className="text-3xl font-semibold xl:text-2xl text-black dark:text-white">Sign in to Bento</h1>
            <form className="inputs flex flex-col mt-6" onSubmit={loginUser}>
              <InputFiled fieldNameType={false} type="email" value={email} name="email" onChange={handleInputChange} placeholder="example@gmail.com" />
              <InputPassword fieldNameType={false} name="password" value={password} onChange={handleInputChange} placeholder="*******" />
              <PrimaryButton text="log in" />
            </form>
            <div className="flexC my-3 gap-3">
              <div className="auth-line line1 w-full h-[1px] rounded-full"></div>
              <span className="text-textcolor dark:text-white">OR</span>
              <div className="auth-line line2 w-full h-[1px] rounded-full"></div>
            </div>

            <div className="flex flex-col gap-1">
              <button className="button flex items-center gap-2">
                <FcGoogle size={20} />
                <span className="font-normal xl:text-xs">Sign in with Google</span>
              </button>
              <button className="button flex items-center gap-2">
                <FaGithub size={20} />
                <span className="font-normal xl:text-xs">Sign in with Github</span>
              </button>
            </div>
            <p className="text-gray-400 text-xs text-center pt-3">
              Don&apos;t have an account?
              <NavLink to="/signup" className="text-black dark:text-white px-0.5">
                Sign up
              </NavLink>
            </p>
            <p className="text-gray-400 text-xs text-center">
              <NavLink to="/forgot-password" className="text-gray-400 px-0.5 hover:text-black dark:hover:text-white transition-colors ease-out">
                Forgot Password
              </NavLink>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export const AuthVideo = ({ className }) => {
  return (
    <section className="loading">
      <div className={`rounded-full overflow-hidden w-40 h-40 ${className}`}>
        <video autoPlay muted loop playsInline className="w-full h-full object-cover">
          <source src="/image/loading.webm" type="video/webm" />
          {/* Optional fallback text */}
          Your browser does not support the video tag.
        </video>
      </div>
    </section>
  );
};
