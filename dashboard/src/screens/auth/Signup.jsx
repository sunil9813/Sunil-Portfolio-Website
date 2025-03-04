import { IconButton } from "@/components/customeUI/Button";
import { HeadingTwo, InputFiled, InputPassword, Logo, PrimaryButton } from "@/utils/Router";
import { FaGithub } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { BsCheckAll } from "react-icons/bs";
import { toast } from "react-toastify";
import { validateEmail } from "@/redux/services/authService";
import { register, RESET, sendVerificationEmail } from "@/redux/slices/authSlice";

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
  const checkIcon = <BsCheckAll size={18} className="text-gray-300" />;

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
      navigate("/ ");
    }

    dispatch(RESET());
  }, [dispatch, isLoggedIn, isSuccess, navigate]);
  return (
    <>
      <section className="auth">
        <div className="auth_card">
          <div className="bg"></div>
          <form className="form" onSubmit={registerUser}>
            <Logo size="small" />
            <HeadingTwo className="text-shine mb-5">Create new account</HeadingTwo>
            <div className="flex gap-3">
              <div className="w-full">
                <InputFiled fieldName="Username" type="text" value={name} name="name" onChange={handleInputChange} placeholder="John Doe" />
              </div>
              <div className="w-full">
                <InputFiled fieldName="Email" type="email" value={email} name="email" onChange={handleInputChange} placeholder="example@gmail.com" />
              </div>
            </div>
            <div className="flex gap-3 mt-3">
              <div className="w-full">
                <InputPassword fieldName="Password" name="password" value={password} onChange={handleInputChange} placeholder="*******" />
              </div>
              <div className="w-full">
                <InputPassword
                  fieldName="Confirm Password"
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

            <ul className="box my-3 border border-gray-300/20 p-3 rounded-lg">
              <li className={`text-[12px] ${upperCase ? "text-gray-300" : "text-gray-500"} flex items-center gap-2`}>
                {switchIcon(upperCase)}
                Lowercase & Uppercase
              </li>
              <li className={`text-[12px] ${number ? "text-gray-300" : "text-gray-500"} flex items-center gap-2`}>
                {switchIcon(number)}
                Number (0-9)
              </li>
              <li className={`text-[12px] ${specialChar ? "text-gray-300" : "text-gray-500"} flex items-center gap-2`}>
                {switchIcon(specialChar)}
                Special Character (!@#$%^&*)
              </li>
              <li className={`text-[12px] ${passwordLength ? "text-gray-300" : "text-gray-500"} flex items-center gap-2`}>
                {switchIcon(passwordLength)}
                At least 8 Character
              </li>
            </ul>
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
          <p className="text-gray-400 text-sm text-center pt-5">
            Already have an account?
            <NavLink to="/login" className="text-white px-0.5">
              Sign in
            </NavLink>
          </p>
        </div>
      </section>
    </>
  );
};
