import { validateEmail } from "@/redux/services/authService";
import { forgotPassword, RESET } from "@/redux/slices/authSlice";
import { Loader, PrimaryButton } from "@/routes";

import { useState } from "react";
import { FiMail } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthLayout } from "./Login";
import { AuthInputField } from "@/components/common/input/AuthInput";

export const ForgotPassword = () => {
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");

  const forgot = async (event) => {
    event.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      toast.error("Email field is required");
      return;
    }

    if (!validateEmail(normalizedEmail)) {
      toast.error("Email is not valid");
      return;
    }

    await dispatch(
      forgotPassword({
        email: normalizedEmail,
      }),
    );

    await dispatch(RESET());
  };

  return (
    <>
      {isLoading && <Loader />}

      <AuthLayout
        title="Forgot password?"
        subtitle="Enter your email address and we’ll send you a secure reset link."
        badgeText="Account recovery"
        footer={
          <p className="mono-auth-signup">
            Remember your password? <NavLink to="/login">Back to login</NavLink>
          </p>
        }
      >
        <form className="mono-auth-form" onSubmit={forgot} noValidate>
          <AuthInputField
            type="email"
            value={email}
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            autoComplete="email"
            ariaLabel="Email address"
            leadingIcon={<FiMail size={17} aria-hidden="true" />}
            required
          />

          <div className="auth-submit">
            <PrimaryButton text={isLoading ? "Sending..." : "Get Reset Email"} />
          </div>
        </form>
      </AuthLayout>
    </>
  );
};
