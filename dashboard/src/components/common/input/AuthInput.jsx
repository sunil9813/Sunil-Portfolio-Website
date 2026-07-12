import PropTypes from "prop-types";
import { useId, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const AuthInputStructure = ({ id, type, value, name, onChange, onPaste, placeholder, autoComplete, ariaLabel, disabled, required, error, leadingIcon, trailingContent }) => {
  const inputClassName = ["auth-input", error ? "auth-input--error" : "", disabled ? "auth-input--disabled" : ""].filter(Boolean).join(" ");

  const handlePointerMove = (event) => {
    if (disabled) {
      return;
    }

    const input = event.currentTarget;
    const inputBounds = input.getBoundingClientRect();

    input.style.setProperty("--auth-input-x", `${event.clientX - inputBounds.left}px`);

    input.style.setProperty("--auth-input-y", `${event.clientY - inputBounds.top}px`);
  };

  const handlePointerLeave = (event) => {
    event.currentTarget.style.setProperty("--auth-input-x", "50%");
    event.currentTarget.style.setProperty("--auth-input-y", "50%");
  };

  return (
    <div className="auth-input-field">
      <div className={inputClassName} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
        <span className="auth-input__border-light" aria-hidden="true" />
        <span className="auth-input__pointer-aura" aria-hidden="true" />

        <span className="auth-input__surface" aria-hidden="true">
          <span className="auth-input__surface-light" />
          <span className="auth-input__surface-texture" />
          <span className="auth-input__surface-reflection" />
        </span>

        <span className="auth-input__top-highlight" aria-hidden="true" />
        <span className="auth-input__moving-shine" aria-hidden="true" />

        <div className="auth-input__content">
          {leadingIcon && (
            <span className="auth-input__leading-icon" aria-hidden="true">
              {leadingIcon}
            </span>
          )}

          <input
            id={id}
            type={type}
            value={value}
            name={name}
            onChange={onChange}
            onPaste={onPaste}
            placeholder={placeholder}
            autoComplete={autoComplete}
            aria-label={ariaLabel}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
            disabled={disabled}
            required={required}
            className={`auth-input__control${leadingIcon ? " auth-input__control--with-icon" : ""}`}
          />

          {trailingContent}
        </div>
      </div>

      {error && (
        <p id={`${id}-error`} className="auth-input-field__error">
          {error}
        </p>
      )}
    </div>
  );
};

export const AuthInputField = ({ type = "text", value = "", name, onChange, onPaste, placeholder = "", autoComplete, ariaLabel, disabled = false, required = false, error = "", leadingIcon }) => {
  const generatedId = useId();
  const inputId = `${name}-${generatedId}`;

  return (
    <AuthInputStructure
      id={inputId}
      type={type}
      value={value}
      name={name}
      onChange={onChange}
      onPaste={onPaste}
      placeholder={placeholder}
      autoComplete={autoComplete}
      ariaLabel={ariaLabel || placeholder || name}
      disabled={disabled}
      required={required}
      error={error}
      leadingIcon={leadingIcon}
    />
  );
};

export const AuthInputPassword = ({
  value = "",
  name,
  onChange,
  onPaste,
  placeholder = "",
  autoComplete = "current-password",
  ariaLabel = "Password",
  disabled = false,
  required = false,
  error = "",
  leadingIcon,
}) => {
  const generatedId = useId();
  const inputId = `${name}-${generatedId}`;

  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthInputStructure
      id={inputId}
      type={showPassword ? "text" : "password"}
      value={value}
      name={name}
      onChange={onChange}
      onPaste={onPaste}
      placeholder={placeholder}
      autoComplete={autoComplete}
      ariaLabel={ariaLabel}
      disabled={disabled}
      required={required}
      error={error}
      leadingIcon={leadingIcon}
      trailingContent={
        <button
          type="button"
          className="auth-input__password-toggle"
          onClick={() => {
            setShowPassword((currentValue) => !currentValue);
          }}
          disabled={disabled}
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
        >
          <span className="auth-input__password-toggle-aura" aria-hidden="true" />

          {showPassword ? <FiEyeOff size={17} strokeWidth={1.8} aria-hidden="true" /> : <FiEye size={17} strokeWidth={1.8} aria-hidden="true" />}
        </button>
      }
    />
  );
};

AuthInputStructure.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onPaste: PropTypes.func,
  placeholder: PropTypes.string,
  autoComplete: PropTypes.string,
  ariaLabel: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.string,
  leadingIcon: PropTypes.node,
  trailingContent: PropTypes.node,
};

AuthInputField.propTypes = {
  type: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onPaste: PropTypes.func,
  placeholder: PropTypes.string,
  autoComplete: PropTypes.string,
  ariaLabel: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.string,
  leadingIcon: PropTypes.node,
};

AuthInputPassword.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onPaste: PropTypes.func,
  placeholder: PropTypes.string,
  autoComplete: PropTypes.string,
  ariaLabel: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.string,
  leadingIcon: PropTypes.node,
};
