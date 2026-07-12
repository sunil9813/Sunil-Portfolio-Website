import { loginWithCode, RESET, sendLoginCode } from "@/redux/slices/authSlice";
import { Loader, PrimaryButton } from "@/routes";

import { useEffect, useRef, useState } from "react";
import { FiKey, FiMail } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthLayout } from "./Login";

export const LoginWithOTP = () => {
  const [loginCode, setLoginCode] = useState(Array(6).fill(""));
  const inputRefs = useRef([]);

  const { email } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isSuccess, isLoggedIn } = useSelector((state) => state.auth);

  const codeString = loginCode.join("");

  const senduserLoginCode = async () => {
    if (!email) {
      toast.error("Email address is missing");
      return;
    }

    await dispatch(sendLoginCode(email));
    await dispatch(RESET());

    toast.success("OTP code sent again");
  };

  const loginUserWithCode = async (event) => {
    event.preventDefault();

    if (codeString.length !== 6) {
      toast.error("OTP code must be 6 characters");
      return;
    }

    await dispatch(
      loginWithCode({
        code: codeString,
        email,
      }),
    );
  };

  useEffect(() => {
    if (isSuccess && isLoggedIn) {
      window.location.replace("/");
    }
  }, [isSuccess, isLoggedIn, navigate]);

  useEffect(() => {
    return () => {
      dispatch(RESET());
    };
  }, [dispatch]);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const newCode = [...loginCode];
    newCode[index] = value;
    setLoginCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === "Backspace" && !loginCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();

    const pastedCode = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);

    if (!pastedCode) return;

    const newCode = Array(6).fill("");

    pastedCode.split("").forEach((digit, index) => {
      newCode[index] = digit;
    });

    setLoginCode(newCode);

    const nextIndex = Math.min(pastedCode.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  return (
    <>
      {isLoading && <Loader />}

      <AuthLayout
        title="Enter OTP Code"
        subtitle="Enter the 6-digit verification code sent to your email."
        badgeText="Two-step verification"
        shellClassName="mono-auth-shell--otp"
        cardClassName="mono-auth-card--otp"
        contentClassName="mono-auth-card__content--otp"
        footer={
          <p className="mono-auth-signup">
            Wrong account? <NavLink to="/login">Back to login</NavLink>
          </p>
        }
      >
        <div className="mono-auth-otp-mail">
          <FiMail size={14} aria-hidden="true" />
          <span>{email}</span>
        </div>

        <form className="mono-auth-form mono-auth-form--otp" onSubmit={loginUserWithCode} noValidate>
          <div className="mono-auth-otp-grid" onPaste={handlePaste}>
            {loginCode.map((digit, index) => (
              <input
                key={index}
                ref={(element) => {
                  inputRefs.current[index] = element;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(event) => handleChange(index, event.target.value)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                className="mono-auth-otp-input"
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </div>

          <div className="mono-auth-otp-help">
            <FiKey size={13} aria-hidden="true" />
            <span>Keep this code private. It expires shortly for your security.</span>
          </div>

          <div className="auth-submit">
            <PrimaryButton text={isLoading ? "Verifying..." : "Verify & log in"} />
          </div>
        </form>

        <div className="mono-auth-resend">
          <p>Didn&apos;t receive the OTP?</p>
          <button type="button" onClick={senduserLoginCode}>
            Resend Code
          </button>
        </div>
      </AuthLayout>
    </>
  );
};
