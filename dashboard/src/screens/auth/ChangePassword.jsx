import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { FiAlertCircle, FiArrowLeft, FiCheck, FiCheckCircle, FiEye, FiEyeOff, FiInfo, FiLock, FiLogOut, FiShield } from "react-icons/fi";

import { changePassword, logout } from "@/redux/slices/authSlice";
import { Wrapper } from "@/routes";

const INITIAL_FORM = {
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;

const getErrorMessage = (error) => {
  if (typeof error === "string") {
    return error;
  }

  return error?.response?.data?.error || error?.response?.data?.message || error?.message || "Unable to change your password.";
};

const getStrengthMeta = (strength) => {
  if (strength <= 25) {
    return {
      label: "Weak",
      textClass: "text-rose-400",
      barClass: "bg-gradient-to-r from-rose-500 to-red-400",
      glow: "shadow-[0_0_14px_rgba(244,63,94,0.18)]",
    };
  }

  if (strength <= 50) {
    return {
      label: "Fair",
      textClass: "text-amber-400",
      barClass: "bg-gradient-to-r from-amber-500 to-orange-400",
      glow: "shadow-[0_0_14px_rgba(245,158,11,0.16)]",
    };
  }

  if (strength <= 75) {
    return {
      label: "Good",
      textClass: "text-cyan-300",
      barClass: "bg-gradient-to-r from-cyan-500 to-teal-400",
      glow: "shadow-[0_0_14px_rgba(34,211,238,0.15)]",
    };
  }

  return {
    label: "Strong",
    textClass: "text-emerald-400",
    barClass: "bg-gradient-to-r from-emerald-500 to-teal-400",
    glow: "shadow-[0_0_14px_rgba(52,211,153,0.16)]",
  };
};

export const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading } = useSelector((state) => state.auth);

  const [form, setForm] = useState(INITIAL_FORM);

  const [error, setError] = useState("");

  const [visibleFields, setVisibleFields] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const requirements = useMemo(
    () => [
      {
        label: "8–20 characters",
        valid: form.newPassword.length >= 8 && form.newPassword.length <= 20,
      },
      {
        label: "Uppercase and lowercase letters",
        valid: /[A-Z]/.test(form.newPassword) && /[a-z]/.test(form.newPassword),
      },
      {
        label: "At least one number",
        valid: /\d/.test(form.newPassword),
      },
      {
        label: "Special character: ! @ # $ % ^ & *",
        valid: /[!@#$%^&*]/.test(form.newPassword),
      },
    ],
    [form.newPassword],
  );

  const completedRequirements = requirements.filter((item) => item.valid).length;

  const passwordStrength = completedRequirements * 25;

  const strengthMeta = getStrengthMeta(passwordStrength);

  const passwordsMatch = Boolean(form.confirmPassword) && form.confirmPassword === form.newPassword;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  };

  const toggleVisibility = (field) => {
    setVisibleFields((current) => ({
      ...current,
      [field]: !current[field],
    }));
  };

  const validate = () => {
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      return "All password fields are required.";
    }

    if (form.oldPassword === form.newPassword) {
      return "Your new password must be different from the current password.";
    }

    if (!PASSWORD_PATTERN.test(form.newPassword)) {
      return "Your new password does not meet the security requirements.";
    }

    if (form.newPassword !== form.confirmPassword) {
      return "The new password and confirmation do not match.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setError("");

      await dispatch(
        changePassword({
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
        }),
      ).unwrap();

      setForm(INITIAL_FORM);

      try {
        await dispatch(logout()).unwrap();
      } finally {
        navigate("/login", {
          replace: true,
        });
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  return (
    <div className="mx-auto w-full  pb-10">
      {/* Top controls */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="group inline-flex h-9 items-center gap-2 rounded-xl border border-white/[0.07] bg-[#111317] px-3.5 text-[11px] font-semibold text-white/45 shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.12] hover:bg-[#181B20] hover:text-white/80"
        >
          <FiArrowLeft size={13} className="transition-transform duration-300 group-hover:-translate-x-0.5" />
          Go back
        </button>

        <div className="hidden items-center gap-2 rounded-full border border-emerald-400/[0.12] bg-emerald-400/[0.045] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-emerald-300/80 sm:inline-flex">
          <span className="relative flex size-2 items-center justify-center">
            <span className="absolute size-2 animate-ping rounded-full bg-emerald-400/25" />
            <span className="relative size-1.5 rounded-full bg-emerald-400" />
          </span>
          Security settings
        </div>
      </div>

      <Wrapper className="overflow-hidden p-0">
        <div className="relative overflow-hidden rounded-[24px] border border-white/[0.07] bg-[#0D0F12] shadow-[0_28px_80px_rgba(0,0,0,0.44)]">
          {/* Subtle table-style top shine */}
          <span className="pointer-events-none absolute inset-x-20 top-0 z-30 h-px bg-gradient-to-r from-transparent via-white/[0.14] to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-[0.86fr_1.14fr]">
            {/* =====================================================
                LEFT SECURITY PANEL
            ====================================================== */}
            <aside className="relative overflow-hidden border-b border-white/[0.07] bg-[#111317] p-6 sm:p-7 lg:border-b-0 lg:border-r">
              {/* Neutral background decoration */}
              <span className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full border-[42px] border-white/[0.016]" />

              <span className="pointer-events-none absolute -left-24 bottom-0 size-64 rounded-full bg-white/[0.012] blur-[90px]" />

              <span className="pointer-events-none absolute right-10 top-10 size-2 rounded-full bg-white/15 shadow-[0_0_12px_rgba(255,255,255,0.12)]" />

              <div className="relative z-10">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex size-14 items-center justify-center rounded-2xl border border-white/[0.09] bg-[#181B20] text-xl text-white/75 shadow-[0_14px_32px_rgba(0,0,0,0.3)]">
                    <FiShield />
                  </span>

                  <span className="rounded-full border border-white/[0.07] bg-[#15171B] px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.14em] text-white/40">Protected account</span>
                </div>

                <div className="mt-6">
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">Account security</p>

                  <h1 className="mt-2 text-2xl font-black tracking-[-0.025em] text-white/90">Update password</h1>

                  <p className="mt-3 max-w-md text-[11px] leading-6 text-white/45">Create a strong and unique password to keep your account protected. Avoid reusing passwords from other accounts.</p>
                </div>

                {/* Checklist */}
                <div className="mt-6 overflow-hidden rounded-[18px] border border-white/[0.07] bg-[#15171B]">
                  <div className="flex items-center gap-3 border-b border-white/[0.07] px-4 py-3.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-[#1A1D22] text-white/55">
                      <FiCheckCircle size={15} />
                    </span>

                    <div>
                      <h3 className="text-[11px] font-bold text-white/80">Password checklist</h3>

                      <p className="mt-0.5 text-[8px] text-white/30">Complete all security requirements.</p>
                    </div>

                    <span className="ml-auto rounded-full border border-white/[0.07] bg-[#0D0F12] px-2.5 py-1 text-[8px] font-bold tabular-nums text-white/45">
                      {completedRequirements}/{requirements.length}
                    </span>
                  </div>

                  <div className="space-y-1.5 p-2.5">
                    {requirements.map((requirement) => (
                      <div
                        key={requirement.label}
                        className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-all duration-300 ${
                          requirement.valid ? "border-emerald-400/[0.1] bg-emerald-400/[0.03]" : "border-transparent bg-[#0D0F12]"
                        }`}
                      >
                        <span
                          className={`flex size-6 shrink-0 items-center justify-center rounded-lg border transition-all duration-300 ${
                            requirement.valid ? "border-emerald-400/[0.15] bg-emerald-400/[0.08] text-emerald-300" : "border-white/[0.07] bg-[#181B20] text-white/25"
                          }`}
                        >
                          <FiCheck size={12} />
                        </span>

                        <span className={`text-[9px] font-medium ${requirement.valid ? "text-white/70" : "text-white/38"}`}>{requirement.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status summary */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/[0.07] bg-[#15171B] p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[8px] font-bold uppercase tracking-[0.13em] text-white/28">Strength</span>

                      <FiShield size={12} className={strengthMeta.textClass} />
                    </div>

                    <p className={`mt-3 text-base font-black ${strengthMeta.textClass}`}>{strengthMeta.label}</p>

                    <p className="mt-1 text-[8px] text-white/32">{passwordStrength}% completed</p>
                  </div>

                  <div className="rounded-2xl border border-white/[0.07] bg-[#15171B] p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[8px] font-bold uppercase tracking-[0.13em] text-white/28">Status</span>

                      <FiCheckCircle size={12} className={passwordsMatch ? "text-emerald-400" : "text-white/25"} />
                    </div>

                    <p className={`mt-3 text-base font-black ${passwordsMatch ? "text-emerald-400" : "text-white/80"}`}>{passwordsMatch ? "Matched" : "Pending"}</p>

                    <p className="mt-1 text-[8px] text-white/32">Confirmation state</p>
                  </div>
                </div>
              </div>
            </aside>

            {/* =====================================================
                RIGHT FORM PANEL
            ====================================================== */}
            <section className="relative bg-[#0D0F12] p-5 sm:p-7">
              <span className="pointer-events-none absolute right-0 top-0 size-64 rounded-full bg-white/[0.01] blur-[90px]" />

              <form onSubmit={handleSubmit} className="relative mx-auto max-w-2xl">
                {/* Form header */}
                <div className="flex flex-col gap-4 border-b border-white/[0.07] pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/40">Change password</p>

                    <h2 className="mt-2 text-xl font-black tracking-[-0.025em] text-white/90">Secure your account</h2>

                    <p className="mt-2 max-w-md text-[10px] leading-5 text-white/32">Enter your current password before choosing a new secure password.</p>
                  </div>

                  <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/[0.07] bg-[#15171B] px-3 py-2 text-[8px] font-semibold text-white/42">
                    <FiLogOut size={12} className="text-white/30" />
                    Signed out after update
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div role="alert" className="mt-5 flex items-start gap-3 rounded-2xl border border-rose-400/[0.15] bg-rose-400/[0.05] px-4 py-3 text-[10px] leading-5 text-rose-300">
                    <FiAlertCircle size={14} className="mt-0.5 shrink-0" />

                    <span>{error}</span>
                  </div>
                )}

                {/* Fields */}
                <div className="mt-5 space-y-4">
                  <PasswordField
                    label="Current password"
                    name="oldPassword"
                    value={form.oldPassword}
                    visible={visibleFields.oldPassword}
                    autoComplete="current-password"
                    disabled={isLoading}
                    onChange={handleChange}
                    onToggle={toggleVisibility}
                  />

                  <PasswordField
                    label="New password"
                    name="newPassword"
                    value={form.newPassword}
                    visible={visibleFields.newPassword}
                    autoComplete="new-password"
                    disabled={isLoading}
                    onChange={handleChange}
                    onToggle={toggleVisibility}
                  />

                  <div>
                    <PasswordField
                      label="Confirm new password"
                      name="confirmPassword"
                      value={form.confirmPassword}
                      visible={visibleFields.confirmPassword}
                      autoComplete="new-password"
                      disabled={isLoading}
                      onChange={handleChange}
                      onToggle={toggleVisibility}
                    />

                    {form.confirmPassword && (
                      <div
                        className={`mt-2.5 inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[8px] font-semibold ${
                          passwordsMatch ? "border-emerald-400/[0.12] bg-emerald-400/[0.04] text-emerald-300" : "border-rose-400/[0.12] bg-rose-400/[0.04] text-rose-300"
                        }`}
                      >
                        {passwordsMatch ? <FiCheckCircle size={11} /> : <FiAlertCircle size={11} />}

                        {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Strength */}
                <div className="mt-5 rounded-2xl border border-white/[0.07] bg-[#15171B] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[9px] font-semibold text-white/65">Password strength</p>

                      <p className="mt-1 text-[7px] text-white/28">Complete all four requirements.</p>
                    </div>

                    <span className={`text-[9px] font-bold tabular-nums ${strengthMeta.textClass}`}>
                      {passwordStrength}% · {strengthMeta.label}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-4 gap-1.5">
                    {requirements.map((requirement, index) => (
                      <span
                        key={requirement.label}
                        className={`h-1.5 rounded-full transition-all duration-300 ${index < completedRequirements ? `${strengthMeta.barClass} ${strengthMeta.glow}` : "bg-[#24272D]"}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Security note */}
                <div className="mt-4 flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-[#111317] p-4">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-[#181B20] text-white/45">
                    <FiInfo size={14} />
                  </span>

                  <div>
                    <p className="text-[9px] font-bold text-white/80">Security note</p>

                    <p className="mt-1.5 text-[8px] leading-5 text-white/32">After updating your password, your current session will end and you will be redirected to the login page.</p>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative mt-5 flex h-11 w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-white/[0.11] bg-[linear-gradient(180deg,#24272C_0%,#1A1D21_100%)] px-4 text-[10px] font-black text-white/90 shadow-[0_14px_30px_rgba(0,0,0,0.32)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.18] hover:bg-[linear-gradient(180deg,#2B2F35_0%,#202328_100%)] hover:text-white hover:shadow-[0_18px_38px_rgba(0,0,0,0.42)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  <span className="pointer-events-none absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                  <FiLock size={13} className="relative transition-transform duration-300 group-hover:scale-110" />

                  <span className="relative">{isLoading ? "Updating password..." : "Update password"}</span>
                </button>
              </form>
            </section>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

const PasswordField = ({ label, name, value, visible = false, autoComplete, disabled = false, onChange, onToggle }) => {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-[10px] font-semibold text-white/72">
        {label}
      </label>

      <div className="group relative">
        <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-white/25 transition-colors duration-300 group-focus-within:text-white/60">
          <FiLock size={14} />
        </span>

        <input
          id={name}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          disabled={disabled}
          className="h-11 w-full rounded-xl border border-white/[0.07] bg-[#15171B] pl-11 pr-12 text-[10px] text-white/80 caret-white/70 outline-none transition-all duration-300 placeholder:text-white/18 hover:border-white/[0.11] focus:border-white/[0.18] focus:bg-[#181B20] focus:ring-4 focus:ring-white/[0.025] disabled:cursor-not-allowed disabled:opacity-50"
        />

        <button
          type="button"
          onClick={() => onToggle(name)}
          disabled={disabled}
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
          className="absolute right-2.5 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-white/25 transition-all duration-300 hover:bg-white/[0.04] hover:text-white/65 disabled:cursor-not-allowed"
        >
          {visible ? <FiEyeOff size={14} /> : <FiEye size={14} />}
        </button>
      </div>
    </div>
  );
};

PasswordField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  visible: PropTypes.bool,
  autoComplete: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
};
