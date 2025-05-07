import { InputFiled, InputPassword, Logo, PrimaryButton } from "@/utils/Router";
import { FaGithub } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { BsCheckAll } from "react-icons/bs";
import { toast } from "react-toastify";
import { validateEmail } from "@/redux/services/authService";
import { register, RESET, sendVerificationEmail } from "@/redux/slices/authSlice";
import { AuthUserInfo } from "./Login";
import { FcGoogle } from "react-icons/fc";

const initialSate = {
  name: "",
  password: "",
  email: "",
  confirmPassword: "",
};

export const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSuccess, isLoggedIn } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState(initialSate);
  const [upperCase, setUpperCase] = useState(false);
  const [number, setNumber] = useState(false);
  const [specialChar, setSpecialChar] = useState(false);
  const [passwordLength, setPasswordLength] = useState(false);

  const { name, password, email, confirmPassword } = formData;

  const wrongIcon = <BsCheckAll size={18} />;
  const checkIcon = <BsCheckAll size={18} className="text-green-500" />;

  const switchIcon = (condition) => {
    if (condition) {
      return checkIcon;
    }
    return wrongIcon;
  };

  useEffect(() => {
    //check lowercase and uppercase
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
      setUpperCase(true);
    } else {
      setUpperCase(false);
    }
    //check for number
    if (password.match(/([0-9])/)) {
      setNumber(true);
    } else {
      setNumber(false);
    }
    // Check for special character
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
      setSpecialChar(true);
    } else {
      setSpecialChar(false);
    }
    // Check for PASSWORD LENGTH
    if (password.length > 8) {
      setPasswordLength(true);
    } else {
      setPasswordLength(false);
    }
  }, [password]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const registerUser = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return toast.error("All fields are required");
    }
    if (password.length < 8) {
      return toast.error("Password length should be 8 or more");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (!validateEmail(email)) {
      return toast.error("Email is not valid");
    }
    const userData = {
      name,
      email,
      password,
    };
    await dispatch(register(userData));
    // add its in last
    await dispatch(sendVerificationEmail());
  };

  useEffect(() => {
    if (isSuccess && isLoggedIn) {
      navigate("/");
    }

    dispatch(RESET());
  }, [dispatch, isLoggedIn, isSuccess, navigate]);
  return (
    <>
      <section className="auth-section">
        <div className="auth-section_container 3xl:-mt-16 2xl:!w-[450px] 3xl:!w-[500px]">
          <div className="auth-section_container_content">
            <div className="auth-section_container_content_line"></div>
            <div className="flexC pb-2">
              <Logo />
            </div>
            <h1 className="text-3xl font-semibold xl:text-2xl text-black dark:text-white">Sign in to Bento</h1>
            <form className="inputs flex flex-col mt-6 xl:mt-3" onSubmit={registerUser}>
              <div className="flex gap-3">
                <div className="w-full">
                  <InputFiled fieldNameType={false} type="text" value={name} name="name" onChange={handleInputChange} placeholder="John Doe" />
                </div>
                <div className="w-full">
                  <InputFiled fieldNameType={false} type="email" value={email} name="email" onChange={handleInputChange} placeholder="example@gmail.com" />
                </div>
              </div>
              <div className="flex gap-3 mt-3">
                <div className="w-full">
                  <InputPassword fieldNameType={false} name="password" value={password} onChange={handleInputChange} placeholder="*******" />
                </div>
                <div className="w-full">
                  <InputPassword
                    fieldNameType={false}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleInputChange}
                    onPaste={(e) => {
                      e.preventDefault();
                      toast.error("Cannot paste into input field");
                      return false;
                    }}
                    placeholder="*******"
                  />
                </div>
              </div>

              <PrimaryButton text="create account" />

              <ul className="box my-3 border border-gray-200 dark:border-gray-300/20 p-3 rounded-lg">
                <li className={`text-[12px] ${upperCase ? "text-green-500" : "text-gray-700 dark:text-gray-500"} flex items-center gap-2`}>
                  {switchIcon(upperCase)}
                  Lowercase & Uppercase
                </li>
                <li className={`text-[12px] ${number ? "text-green-500" : "text-gray-700 dark:text-gray-500"} flex items-center gap-2`}>
                  {switchIcon(number)}
                  Number (0-9)
                </li>
                <li className={`text-[12px] ${specialChar ? "text-green-500" : "text-gray-700 dark:text-gray-500"} flex items-center gap-2`}>
                  {switchIcon(specialChar)}
                  Special Character (!@#$%^&*)
                </li>
                <li className={`text-[12px] ${passwordLength ? "text-green-500" : "text-gray-700 dark:text-gray-500"} flex items-center gap-2`}>
                  {switchIcon(passwordLength)}
                  At least 8 Character
                </li>
              </ul>
            </form>
            <div className="flexC my-3 gap-3">
              <div className="auth-line line1 w-full h-[1px] rounded-full"></div>
              <span className="text-textcolor dark:text-white">OR</span>
              <div className="auth-line line2 w-full h-[1px] rounded-full"></div>
            </div>

            <div className="flex gap-1">
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
              Already have an account?
              <NavLink to="/login" className="text-black dark:text-white px-0.5">
                Sign in
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
