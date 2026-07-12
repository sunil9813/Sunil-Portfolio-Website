import { useEffect, useMemo, useState } from "react";
import { BsCheckAll } from "react-icons/bs";
import { FiLock } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { RESET, resetPassword } from "@/redux/slices/authSlice";
import { AuthInputPassword } from "@/components/common/input/AuthInput";
import { Loader, PrimaryButton } from "@/routes";
import { AuthLayout } from "./Login";

const INITIAL_STATE = {
  password: "",
  confirmPassword: "",
};

export const ResetPassword = () => {
  const [formData, setFormData] = useState(INITIAL_STATE);

  const { password, confirmPassword } = formData;
  const { resetToken } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isSuccess, message } = useSelector((state) => state.auth);

  const [upperCase, setUpperCase] = useState(false);
  const [number, setNumber] = useState(false);
  const [specialChar, setSpecialChar] = useState(false);
  const [passwordLength, setPasswordLength] = useState(false);

  useEffect(() => {
    setUpperCase(!!password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/));
    setNumber(!!password.match(/[0-9]/));
    setSpecialChar(!!password.match(/[!,%,&,@,#,$,^,*,?,_,~]/));
    setPasswordLength(password.length >= 8);
  }, [password]);

  const passwordRules = useMemo(
    () => [
      {
        id: "case",
        label: "Upper & lower case",
        active: upperCase,
      },
      {
        id: "number",
        label: "Number 0-9",
        active: number,
      },
      {
        id: "special",
        label: "Special character",
        active: specialChar,
      },
      {
        id: "length",
        label: "Minimum 8 characters",
        active: passwordLength,
      },
    ],
    [upperCase, number, specialChar, passwordLength],
  );

  const activeRules = passwordRules.filter((rule) => rule.active).length;
  const passwordStrength = (activeRules / passwordRules.length) * 100;

  const strengthLabel = useMemo(() => {
    if (!password) return "Empty";
    if (activeRules <= 1) return "Weak";
    if (activeRules === 2) return "Fair";
    if (activeRules === 3) return "Good";
    return "Strong";
  }, [activeRules, password]);

  const strengthLevel = useMemo(() => {
    if (!password) return "empty";
    if (activeRules <= 1) return "weak";
    if (activeRules === 2) return "fair";
    if (activeRules === 3) return "good";
    return "strong";
  }, [activeRules, password]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const reset = async (event) => {
    event.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (password.length < 8) {
      toast.error("Password length should be 8 or more");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    await dispatch(
      resetPassword({
        userData: {
          password,
        },
        resetToken,
      }),
    );
  };

  useEffect(() => {
    if (isSuccess && message?.includes("Password Reset Successful")) {
      navigate("/login");
      dispatch(RESET());
    }
  }, [dispatch, navigate, message, isSuccess]);

  useEffect(() => {
    return () => {
      dispatch(RESET());
    };
  }, [dispatch]);

  return (
    <>
      {isLoading && <Loader />}

      <AuthLayout
        title="Reset password"
        subtitle="Create a new secure password for your account."
        badgeText="Password recovery"
        shellClassName="mono-auth-shell--reset"
        cardClassName="mono-auth-card--reset"
        contentClassName="mono-auth-card__content--reset"
        footer={
          <p className="mono-auth-signup">
            Remember your password? <NavLink to="/login">Back to login</NavLink>
          </p>
        }
      >
        <form className="mono-auth-form mono-auth-form--reset" onSubmit={reset} noValidate>
          <div className="mono-auth-reset-fields">
            <AuthInputPassword
              value={password}
              name="password"
              onChange={handleInputChange}
              placeholder="New password"
              autoComplete="new-password"
              ariaLabel="New password"
              leadingIcon={<FiLock size={17} aria-hidden="true" />}
              required
            />

            <AuthInputPassword
              value={confirmPassword}
              name="confirmPassword"
              onChange={handleInputChange}
              placeholder="Confirm new password"
              autoComplete="new-password"
              ariaLabel="Confirm new password"
              leadingIcon={<FiLock size={17} aria-hidden="true" />}
              onPaste={(event) => {
                event.preventDefault();
                toast.error("Cannot paste into input field");
              }}
              required
            />
          </div>

          <section className={`mono-auth-password-card mono-auth-password-card--${strengthLevel}`}>
            <div className="mono-auth-password-card__top">
              <div>
                <span className="mono-auth-password-card__eyebrow">Password security</span>
                <h3>Password strength</h3>
                <p>Complete all requirements before resetting your password.</p>
              </div>

              <div className={`mono-auth-password-card__score mono-auth-password-card__score--${strengthLevel}`}>
                <strong>{activeRules}</strong>
                <span>/ 4</span>
                <small>{strengthLabel}</small>
              </div>
            </div>

            <div className="mono-auth-password-card__meter">
              <span style={{ width: `${passwordStrength}%` }} />
            </div>

            <div className="mono-auth-password-card__segments" aria-hidden="true">
              {passwordRules.map((rule) => (
                <span key={rule.id} className={rule.active ? "is-active" : ""} />
              ))}
            </div>

            <ul className="mono-auth-password-checks">
              {passwordRules.map((rule) => (
                <PasswordRule key={rule.id} active={rule.active} text={rule.label} />
              ))}
            </ul>
          </section>

          <div className="auth-submit">
            <PrimaryButton text={isLoading ? "Resetting..." : "Reset Password"} />
          </div>
        </form>
      </AuthLayout>
    </>
  );
};

const PasswordRule = ({ active, text }) => {
  return (
    <li className={active ? "is-valid" : ""}>
      <span className="mono-auth-password-checks__icon">
        <BsCheckAll size={16} aria-hidden="true" />
      </span>
      <span>{text}</span>
    </li>
  );
};
