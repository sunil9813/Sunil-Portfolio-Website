import { validateEmail } from "@/redux/services/authService";
import { forgotPassword, RESET } from "@/redux/slices/authSlice";
import { InputFiled, Loader, Logo, PrimaryButton } from "@/utils/Router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AuthUserInfo } from "./Login";
import { NavLink } from "react-router-dom";

export const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const [email, setEmail] = useState();

  const forgot = async (e) => {
    e.preventDefault();
    if (!email) {
      return toast.error("Email field is required");
    }
    if (!validateEmail(email)) {
      return toast.error("Email is not valid");
    }

    const userData = {
      email,
    };

    await dispatch(forgotPassword(userData));
    await dispatch(RESET());
  };
  return (
    <>
      <section className="auth-section">
        {isLoading && <Loader />}
        <div className="auth-section_container 3xl:-mt-16">
          <div className="auth-section_container_content">
            <div className="auth-section_container_content_line"></div>
            <div className="flexC pb-2">
              <Logo />
            </div>
            <h1 className="text-3xl my-5 mb-10 font-semibold xl:text-2xl text-black dark:text-white">Forgot Password</h1>
            <form className="inputs flex flex-col mt-6 xl:mt-3" onSubmit={forgot}>
              <InputFiled fieldName="Email" type="email" value={email} name="email" onChange={(e) => setEmail(e.target.value)} placeholder="example@gmail.com" />
              <PrimaryButton text="Get Reset Email" />
            </form>
            <NavLink to="/login" className="text-black mt-5 block dark:text-white px-0.5">
              Go back
            </NavLink>
          </div>
        </div>
        <div className="absolute bottom-5 flex flex-col items-center gap-5">
          <AuthUserInfo />
        </div>
      </section>
    </>
  );
};
