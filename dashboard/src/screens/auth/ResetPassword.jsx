import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RESET, resetPassword } from "@/redux/slices/authSlice";
import { InputPassword, Loader, Logo, PrimaryButton } from "@/utils/Router";
import { BsCheckAll } from "react-icons/bs";
import { AuthUserInfo } from "./Login";

const initialState = {
  password: "",
  confirmPassword: "",
};

export const ResetPassword = () => {
  const [formData, setFormData] = useState(initialState);
  const { password, confirmPassword } = formData;
  const { resetToken } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isSuccess, message } = useSelector((state) => state.auth);

  // Password validation states
  const [upperCase, setUpperCase] = useState(false);
  const [number, setNumber] = useState(false);
  const [specialChar, setSpecialChar] = useState(false);
  const [passwordLength, setPasswordLength] = useState(false);

  const wrongIcon = <BsCheckAll size={18} />;
  const checkIcon = <BsCheckAll size={18} className="text-green-500" />;

  const switchIcon = (condition) => {
    if (condition) {
      return checkIcon;
    }
    return wrongIcon;
  };

  // Validate password conditions
  useEffect(() => {
    // Check for uppercase and lowercase
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
      setUpperCase(true);
    } else {
      setUpperCase(false);
    }
    // Check for numbers
    if (password.match(/([0-9])/)) {
      setNumber(true);
    } else {
      setNumber(false);
    }
    // Check for special characters
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
      setSpecialChar(true);
    } else {
      setSpecialChar(false);
    }
    // Check password length
    if (password.length >= 8) {
      setPasswordLength(true);
    } else {
      setPasswordLength(false);
    }
  }, [password]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const reset = async (e) => {
    e.preventDefault();
    if (!confirmPassword || !password) {
      return toast.error("All fields are required");
    }
    if (password.length < 8) {
      return toast.error("Password length should be 8 or more");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    const userData = {
      password,
    };

    await dispatch(resetPassword({ userData, resetToken }));
    await dispatch(RESET());
  };

  useEffect(() => {
    if (isSuccess && message.includes("Password Reset Successful")) {
      navigate("/login");
    }
  }, [dispatch, navigate, message, isSuccess]);

  return (
    <div>
      {isLoading && <Loader />}

      <section className="auth-section">
        {isLoading && <Loader />}
        <div className="auth-section_container 3xl:-mt-16">
          <div className="auth-section_container_content">
            <div className="auth-section_container_content_line"></div>
            <div className="flexC pb-2">
              <Logo />
            </div>
            <h1 className="text-3xl font-semibold xl:text-2xl text-black dark:text-white">Reset Password</h1>
            <form className="inputs flex flex-col mt-6 xl:mt-3" onSubmit={reset}>
              <InputPassword fieldName="Password" name="password" value={password} onChange={handleInputChange} placeholder="*******" />
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
              <PrimaryButton text="Reset Password" />
            </form>
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
          </div>
        </div>
        <div className="absolute bottom-5 flex flex-col items-center gap-5">
          <AuthUserInfo />
        </div>
      </section>

      {/*    <section className="auth">
        <div className="auth_card">
          <div className="bg"></div>
          <form className="form" onSubmit={reset}>
            <Logo size="small" />
            <HeadingTwo className="text-shine mb-5">Reset Password</HeadingTwo>

            <InputPassword fieldName="Password" name="password" value={password} onChange={handleInputChange} placeholder="*******" />
            <br />
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

            <PrimaryButton text="Reset Password" />

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
          </form>
        </div>
      </section> */}
    </div>
  );
};
