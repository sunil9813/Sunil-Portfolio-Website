import { useEffect, useMemo, useState } from "react";
import { BsCheckAll } from "react-icons/bs";
import { FiLock, FiMail, FiUser } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { AuthInputField, AuthInputPassword } from "@/components/common/input/AuthInput";
import { Loader, PrimaryButton } from "@/routes";

import { validateEmail } from "@/redux/services/authService";
import { register, RESET, sendVerificationEmail } from "@/redux/slices/authSlice";
import { AuthLayout, AuthSocialButtons } from "./Login";

const INITIAL_STATE = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, isSuccess, isLoggedIn } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState(INITIAL_STATE);
  const [upperCase, setUpperCase] = useState(false);
  const [number, setNumber] = useState(false);
  const [specialChar, setSpecialChar] = useState(false);
  const [passwordLength, setPasswordLength] = useState(false);

  const { name, email, password, confirmPassword } = formData;

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

  const registerUser = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await dispatch(
        register({
          name: trimmedName,
          email: trimmedEmail,
          password,
        }),
      ).unwrap();

      await dispatch(sendVerificationEmail()).unwrap();
    } catch (error) {
      toast.error(error?.message || "Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    return () => {
      dispatch(RESET());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess && isLoggedIn) {
      navigate("/");
    }
  }, [isSuccess, isLoggedIn, navigate]);

  return (
    <>
      {isLoading && <Loader />}

      <AuthLayout
        title="Create an account"
        subtitle="Join Bento and start your learning journey securely."
        badgeText="Secure signup"
        shellClassName="mono-auth-shell--signup"
        cardClassName="mono-auth-card--signup"
        contentClassName="mono-auth-card__content--signup"
        footer={
          <p className="mono-auth-signup">
            Already have an account? <NavLink to="/login">Sign in</NavLink>
          </p>
        }
      >
        <form className="mono-auth-form mono-auth-form--signup" onSubmit={registerUser} noValidate>
          <div className="mono-auth-signup-grid">
            <AuthInputField
              type="text"
              value={name}
              name="name"
              onChange={handleInputChange}
              placeholder="Full name"
              autoComplete="name"
              ariaLabel="Full name"
              leadingIcon={<FiUser size={17} aria-hidden="true" />}
              required
            />

            <AuthInputField
              type="email"
              value={email}
              name="email"
              onChange={handleInputChange}
              placeholder="Email address"
              autoComplete="email"
              ariaLabel="Email address"
              leadingIcon={<FiMail size={17} aria-hidden="true" />}
              required
            />
          </div>

          <div className="mono-auth-signup-grid mono-auth-signup-grid--password">
            <AuthInputPassword
              value={password}
              name="password"
              onChange={handleInputChange}
              placeholder="Password"
              autoComplete="new-password"
              ariaLabel="Password"
              leadingIcon={<FiLock size={17} aria-hidden="true" />}
              required
            />

            <AuthInputPassword
              value={confirmPassword}
              name="confirmPassword"
              onChange={handleInputChange}
              placeholder="Confirm password"
              autoComplete="new-password"
              ariaLabel="Confirm password"
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
                <p>Complete all requirements for a safer account.</p>
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
            <PrimaryButton text={isLoading ? "Creating account..." : "Create account"} />
          </div>
        </form>

        <div className="mono-auth-divider" aria-hidden="true">
          <span />
          <p>or</p>
          <span />
        </div>

        <AuthSocialButtons />
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
