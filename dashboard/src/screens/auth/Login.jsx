import { InputFiled, InputPassword, Loader, Logo, PrimaryButton } from "@/utils/Router";
import { FaGithub } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { validateEmail } from "@/redux/services/authService";
import { login, RESET, sendLoginCode } from "@/redux/slices/authSlice";
import { FcGoogle } from "react-icons/fc";
import { Avatar } from "@material-tailwind/react";

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
      <section className="auth-section">
        {isLoading && <Loader />}
        <div className="auth-section_container 3xl:-mt-16">
          <div className="auth-section_container_content">
            <div className="auth-section_container_content_line"></div>
            <div className="flexC pb-2">
              <Logo />
            </div>
            <h1 className="text-3xl font-semibold xl:text-2xl text-black dark:text-white">Sign in to Bento</h1>
            <form className="inputs flex flex-col mt-6 xl:mt-3" onSubmit={loginUser}>
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
        <div className="absolute bottom-5 flex flex-col items-center gap-5">
          <AuthUserInfo />
        </div>
      </section>
    </>
  );
};

export const AuthUserInfo = () => {
  return (
    <>
      <p className=" text-textcolor">
        Join over <span className="textColor font-semibold">2M</span> global social media users
      </p>
      <div className="flex items-center -space-x-4">
        <Avatar
          variant="circular"
          alt="user 1"
          size="sm"
          className="border border-gray-800 hover:z-10 focus:z-10"
          src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
        />
        <Avatar
          variant="circular"
          alt="user 2"
          size="sm"
          className="border border-gray-800 hover:z-10 focus:z-10"
          src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1061&q=80"
        />
        <Avatar
          variant="circular"
          alt="user 3"
          size="sm"
          className="border border-gray-800 hover:z-10 focus:z-10"
          src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1288&q=80"
        />
        <Avatar
          variant="circular"
          alt="user 4"
          size="sm"
          className="border border-gray-800 hover:z-10 focus:z-10"
          src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80"
        />
        <Avatar
          variant="circular"
          alt="user 5"
          size="sm"
          className="border border-gray-800 hover:z-10 focus:z-10"
          src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80"
        />
      </div>
    </>
  );
};
