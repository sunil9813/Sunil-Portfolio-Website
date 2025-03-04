import { IconButton } from "@/components/customeUI/Button";
import { HeadingTwo, InputFiled, InputPassword, Loader, Logo, PrimaryButton } from "@/utils/Router";
import { FaGithub } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { validateEmail } from "@/redux/services/authService";
import { login, RESET, sendLoginCode } from "@/redux/slices/authSlice";

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
      <section className="auth">
        {isLoading && <Loader />}
        <div className="auth_card">
          <div className="bg"></div>
          <form id="inputcards" className="form inputcards" onSubmit={loginUser}>
            <Logo size="small" />
            <HeadingTwo className="text-shine mb-5">Sign in to Huly</HeadingTwo>
            <InputFiled fieldName="Email" type="email" value={email} name="email" onChange={handleInputChange} placeholder="example@gmail.com" />
            <br />
            <InputPassword fieldName="Password" name="password" value={password} onChange={handleInputChange} placeholder="*******" />
            <PrimaryButton text="log in" />
            <div className="flex justify-between items-center my-5 gap-3">
              <div className="auth-line line1 w-full h-[1px] rounded-full"></div>
              <span className="text-white">OR</span>
              <div className="auth-line line2 w-full h-[1px] rounded-full"></div>
            </div>

            <div className="other-login flex justify-center items-center gap-3">
              <IconButton icon={<FaGoogle size={18} />} text="Sign up with Google" className="w-full" />
              <IconButton icon={<FaGithub size={18} />} text="Sign up with GitHub" className="w-full" />
            </div>
          </form>
          <p className="text-gray-400 text-sm text-center pt-3">
            Don&apos;t have an account?
            <NavLink to="/signup" className="text-white px-0.5">
              Sign up
            </NavLink>
          </p>
          <p className="text-gray-400 text-sm text-center">
            <NavLink to="/forgot-password" className="text-gray-400 px-0.5 hover:text-white transition-colors ease-out">
              Forgot Password
            </NavLink>
          </p>
        </div>
      </section>
    </>
  );
};
