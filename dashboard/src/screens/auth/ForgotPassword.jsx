import { validateEmail } from "@/redux/services/authService";
import { forgotPassword, RESET } from "@/redux/slices/authSlice";
import { HeadingTwo, InputFiled, Loader, Logo, PrimaryButton } from "@/utils/Router";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

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
      {isLoading && <Loader />}
      <section className="auth">
        {isLoading && <Loader />}
        <div className="auth_card">
          <div className="bg"></div>
          <form className="form" onSubmit={forgot}>
            <Logo size="small" />
            <HeadingTwo className="text-shine mb-5">Forgot Password</HeadingTwo>
            <InputFiled fieldName="Email" type="email" value={email} name="email" onChange={(e) => setEmail(e.target.value)} placeholder="example@gmail.com" />
            <br />
            <PrimaryButton text="Get Reset Email" />
          </form>
        </div>
      </section>
    </>
  );
};
