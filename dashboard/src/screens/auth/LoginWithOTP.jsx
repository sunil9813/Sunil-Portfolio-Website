import { loginWithCode, RESET, sendLoginCode } from "@/redux/slices/authSlice";
import { HeadingTwo, Loader, Logo, PrimaryButton } from "@/utils/Router";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export const LoginWithOTP = () => {
  const [loginCode, setLoginCode] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);

  const { email } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isSuccess, isLoggedIn } = useSelector((state) => state.auth);

  const senduserLoginCode = async (e) => {
    e.preventDefault();
    await dispatch(sendLoginCode(email));
    await dispatch(RESET());
  };

  const loginUserWithCode = async (e) => {
    e.preventDefault();
    const codeString = loginCode.join("");

    if (codeString.length !== 6) {
      return toast.error("OTP code must be 6 characters");
    }

    await dispatch(loginWithCode({ code: codeString, email }));
  };

  useEffect(() => {
    if (isSuccess && isLoggedIn) {
      navigate("/");
    }
    dispatch(RESET());
  }, [dispatch, isLoggedIn, isSuccess, navigate]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // Allow only numbers

    const newCode = [...loginCode];
    newCode[index] = value;
    setLoginCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus(); // Move to next input
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !loginCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus(); // Move to previous input
    }
  };

  return (
    <>
      <section className="auth">
        {isLoading && <Loader />}
        <div className="auth_card">
          <div className="bg"></div>
          <form className="form logincode" onSubmit={loginUserWithCode}>
            <Logo size="small" />
            <HeadingTwo className="text-shine mb-5">Enter OTP Code</HeadingTwo>
            <div className="inputs flex justify-center items-center gap-5">
              {loginCode.map((digit, index) => (
                <div className="input" key={index}>
                  <input
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="text-center"
                  />
                </div>
              ))}
            </div>
            <PrimaryButton text="log in" />
            <p className="text-gray-400 text-sm text-center pt-4">
              Didn&apos;t get OTP? Please click here
              <button type="button" onClick={senduserLoginCode} className="text-white px-1">
                Resend Code
              </button>
            </p>
          </form>
        </div>
      </section>
    </>
  );
};
