import { Loader, PrimaryButton } from "@/routes";
import { useState } from "react";
import { FiLock, FiMail } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { AuthInputField, AuthInputPassword } from "@/components/common/input/AuthInput";

import { validateEmail } from "@/redux/services/authService";
import { login, sendLoginCode } from "@/redux/slices/authSlice";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { FiShield } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import PropTypes from "prop-types";

export const AuthSocialButtons = ({ onGoogleClick, onGithubClick, googleText = "Google", githubText = "GitHub" }) => {
  return (
    <div className="mono-auth-social">
      <button type="button" className="mono-auth-google" aria-label="Continue with Google" onClick={onGoogleClick}>
        <span className="mono-auth-google__background" />
        <span className="mono-auth-google__top-line" />
        <span className="mono-auth-google__shine" />

        <span className="mono-auth-google__icon">
          <FcGoogle size={16} aria-hidden="true" />
        </span>

        <span className="mono-auth-google__text">{googleText}</span>
      </button>

      <button type="button" className="mono-auth-google" aria-label="Continue with GitHub" onClick={onGithubClick}>
        <span className="mono-auth-google__background" />
        <span className="mono-auth-google__top-line" />
        <span className="mono-auth-google__shine" />

        <span className="mono-auth-google__icon mono-auth-google__icon--github">
          <FaGithub size={16} aria-hidden="true" />
        </span>

        <span className="mono-auth-google__text">{githubText}</span>
      </button>
    </div>
  );
};

export const AuthLayout = ({
  title = "Welcome back",
  subtitle = "Enter your account details to continue securely.",
  badgeText = "Secure access",
  children,
  footer,
  showTrust = true,
  trustItems = ["Encrypted", "Private", "Protected"],
  LogoIcon = HiSparkles,
  BadgeIcon = FiShield,
  shellClassName = "",
  cardClassName = "",
  contentClassName = "",
}) => {
  const handleCardPointerMove = (event) => {
    const card = event.currentTarget;
    const cardBounds = card.getBoundingClientRect();

    card.style.setProperty("--card-pointer-x", `${event.clientX - cardBounds.left}px`);
    card.style.setProperty("--card-pointer-y", `${event.clientY - cardBounds.top}px`);
  };

  const handleCardPointerLeave = (event) => {
    event.currentTarget.style.setProperty("--card-pointer-x", "50%");
    event.currentTarget.style.setProperty("--card-pointer-y", "14%");
  };

  return (
    <main className="mono-auth">
      <div className="mono-auth__background" aria-hidden="true">
        <span className="mono-auth__spotlight" />
        <span className="mono-auth__aurora mono-auth__aurora--left" />
        <span className="mono-auth__aurora mono-auth__aurora--right" />
        <span className="mono-auth__aurora mono-auth__aurora--bottom" />
        <span className="mono-auth__grid" />
        <span className="mono-auth__stars mono-auth__stars--one" />
        <span className="mono-auth__stars mono-auth__stars--two" />
        <span className="mono-auth__noise" />
        <span className="mono-auth__vignette" />
      </div>

      <div className="mono-auth__layout">
        <div className={`mono-auth-shell ${shellClassName}`.trim()}>
          <span className="mono-auth-shell__top-light" aria-hidden="true" />
          <span className="mono-auth-shell__floor-glow" aria-hidden="true" />
          <span className="mono-auth-shell__horizontal-line" aria-hidden="true" />

          <article className={`mono-auth-card ${cardClassName}`.trim()} onPointerMove={handleCardPointerMove} onPointerLeave={handleCardPointerLeave}>
            <div className="mono-auth-card__effects" aria-hidden="true">
              <span className="mono-auth-card__pointer-light" />
              <span className="mono-auth-card__top-haze" />
              <span className="mono-auth-card__side-light" />
              <span className="mono-auth-card__reflection" />
              <span className="mono-auth-card__texture" />
            </div>

            <div className={`mono-auth-card__content ${contentClassName}`.trim()}>
              <header className="mono-auth-brand">
                {badgeText && (
                  <div className="mono-auth-brand__badge">
                    <BadgeIcon size={12} aria-hidden="true" />
                    <span>{badgeText}</span>
                  </div>
                )}

                <div className="mono-auth-brand__logo">
                  <span className="mono-auth-brand__logo-aura" aria-hidden="true" />
                  <span className="mono-auth-brand__logo-surface" aria-hidden="true" />
                  <span className="mono-auth-brand__logo-highlight" aria-hidden="true" />

                  <LogoIcon size={27} className="mono-auth-brand__logo-icon" aria-hidden="true" />
                </div>

                <h1>{title}</h1>
                {subtitle && <p>{subtitle}</p>}
              </header>

              {children}

              {footer}

              {showTrust && (
                <div className="mono-auth-trust" aria-label="Security information">
                  {trustItems.map((item) => (
                    <span key={item}>
                      <i aria-hidden="true" />
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    </main>
  );
};

const INITIAL_STATE = {
  email: "",
  password: "",
};

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState(INITIAL_STATE);

  const { isLoading } = useSelector((state) => state.auth);

  const { email, password } = formData;

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const loginUser = async (event) => {
    event.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      toast.error("All fields are required");
      return;
    }

    if (!validateEmail(normalizedEmail)) {
      toast.error("Email is not valid");
      return;
    }

    try {
      await dispatch(
        login({
          email: normalizedEmail,
          password,
        }),
      ).unwrap();

      navigate("/", { replace: true });
    } catch (errorMessage) {
      const message = errorMessage || "Login failed. Please try again.";

      const requiresOtp = message.includes("A new or unrecognized browser/device has been detected");

      if (requiresOtp) {
        try {
          await dispatch(sendLoginCode(normalizedEmail)).unwrap();

          navigate(`/logi-with-otp/${encodeURIComponent(normalizedEmail)}`, {
            replace: true,
          });
        } catch (otpErrorMessage) {
          toast.error(otpErrorMessage || "Unable to send OTP code.");
        }

        return;
      }

      toast.error(message);
    }
  };

  return (
    <>
      {isLoading && <Loader />}

      <AuthLayout
        title="Welcome back"
        subtitle="Enter your account details to continue securely."
        badgeText="Secure access"
        footer={
          <>
            <p className="mono-auth-signup">
              Don&apos;t have an account? <NavLink to="/signup">Create one</NavLink>
            </p>
          </>
        }
      >
        <form className="mono-auth-form" onSubmit={loginUser} noValidate>
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

          <AuthInputPassword
            value={password}
            name="password"
            onChange={handleInputChange}
            placeholder="Password"
            autoComplete="current-password"
            ariaLabel="Password"
            leadingIcon={<FiLock size={17} aria-hidden="true" />}
            required
          />

          <div className="mono-auth-form__options">
            <label className="mono-auth-remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <NavLink to="/forgot-password" className="mono-auth-forgot">
              Forgot password?
            </NavLink>
          </div>

          <div className="auth-submit">
            <PrimaryButton text={isLoading ? "Signing in..." : "Log in"} />
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
AuthSocialButtons.propTypes = {
  onGoogleClick: PropTypes.func,
  onGithubClick: PropTypes.func,
  googleText: PropTypes.string,
  githubText: PropTypes.string,
};

AuthLayout.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  badgeText: PropTypes.string,
  children: PropTypes.node,
  footer: PropTypes.node,
  showTrust: PropTypes.bool,
  trustItems: PropTypes.arrayOf(PropTypes.string),
  LogoIcon: PropTypes.elementType,
  BadgeIcon: PropTypes.elementType,
  shellClassName: PropTypes.string,
  cardClassName: PropTypes.string,
  contentClassName: PropTypes.string,
};
