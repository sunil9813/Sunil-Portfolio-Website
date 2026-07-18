import PropTypes from "prop-types";
import { useId, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const createInputId = (name, generatedId) => `${name}-${generatedId.replace(/:/g, "")}`;

const AuthInputStructure = ({
  id,
  type,
  value,
  name,
  onChange,
  onPaste,
  onBlur,
  onFocus,
  placeholder,
  autoComplete,
  ariaLabel,
  disabled,
  readOnly,
  required,
  error,
  helperText,
  label,
  inputMode,
  maxLength,
  minLength,
  leadingIcon,
  trailingContent,
  className,
}) => {
  const hasValue = value !== "" && value !== null && value !== undefined;

  const inputClassName = [
    "auth-input",
    hasValue ? "auth-input--filled" : "",
    error ? "auth-input--error" : "",
    disabled ? "auth-input--disabled" : "",
    readOnly ? "auth-input--readonly" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const describedBy = [error ? `${id}-error` : "", !error && helperText ? `${id}-hint` : ""].filter(Boolean).join(" ") || undefined;

  const handlePointerMove = (event) => {
    if (disabled) return;

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
    <div className={`auth-input-field${error ? " auth-input-field--error" : ""}`}>
      {label && (
        <div className="auth-input-field__header">
          <label htmlFor={id} className="auth-input-field__label">
            {label}
            {required && (
              <span className="auth-input-field__required" aria-hidden="true">
                *
              </span>
            )}
          </label>
        </div>
      )}

      <div className={inputClassName} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
        <span className="auth-input__border" aria-hidden="true" />
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
              <span className="auth-input__leading-icon-aura" />
              <span className="auth-input__leading-icon-content">{leadingIcon}</span>
            </span>
          )}

          <input
            id={id}
            type={type}
            value={value}
            name={name}
            onChange={onChange}
            onPaste={onPaste}
            onBlur={onBlur}
            onFocus={onFocus}
            placeholder={placeholder}
            autoComplete={autoComplete}
            inputMode={inputMode}
            maxLength={maxLength}
            minLength={minLength}
            aria-label={ariaLabel}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            disabled={disabled}
            readOnly={readOnly}
            required={required}
            className={`auth-input__control${leadingIcon ? " auth-input__control--with-icon" : ""}${trailingContent ? " auth-input__control--with-trailing" : ""}`}
          />

          {trailingContent && <span className="auth-input__trailing-content">{trailingContent}</span>}
        </div>
      </div>

      {error ? (
        <p id={`${id}-error`} className="auth-input-field__message auth-input-field__message--error" role="alert">
          <span className="auth-input-field__message-dot" aria-hidden="true" />
          {error}
        </p>
      ) : (
        helperText && (
          <p id={`${id}-hint`} className="auth-input-field__message auth-input-field__message--hint">
            {helperText}
          </p>
        )
      )}
    </div>
  );
};

export const AuthInputField = ({
  id,
  type = "text",
  value = "",
  name,
  onChange,
  onPaste,
  onBlur,
  onFocus,
  placeholder = "",
  autoComplete,
  ariaLabel,
  disabled = false,
  readOnly = false,
  required = false,
  error = "",
  helperText = "",
  label = "",
  inputMode,
  maxLength,
  minLength,
  leadingIcon,
  className = "",
}) => {
  const generatedId = useId();
  const inputId = id || createInputId(name, generatedId);

  return (
    <AuthInputStructure
      id={inputId}
      type={type}
      value={value}
      name={name}
      onChange={onChange}
      onPaste={onPaste}
      onBlur={onBlur}
      onFocus={onFocus}
      placeholder={placeholder}
      autoComplete={autoComplete}
      ariaLabel={ariaLabel || placeholder || label || name}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      error={error}
      helperText={helperText}
      label={label}
      inputMode={inputMode}
      maxLength={maxLength}
      minLength={minLength}
      leadingIcon={leadingIcon}
      className={className}
    />
  );
};

export const AuthInputPassword = ({
  id,
  value = "",
  name,
  onChange,
  onPaste,
  onBlur,
  onFocus,
  placeholder = "",
  autoComplete = "current-password",
  ariaLabel = "Password",
  disabled = false,
  readOnly = false,
  required = false,
  error = "",
  helperText = "",
  label = "",
  maxLength,
  minLength,
  leadingIcon,
  className = "",
}) => {
  const generatedId = useId();
  const inputId = id || createInputId(name, generatedId);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <AuthInputStructure
      id={inputId}
      type={showPassword ? "text" : "password"}
      value={value}
      name={name}
      onChange={onChange}
      onPaste={onPaste}
      onBlur={onBlur}
      onFocus={onFocus}
      placeholder={placeholder}
      autoComplete={autoComplete}
      ariaLabel={ariaLabel || placeholder || label || name}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      error={error}
      helperText={helperText}
      label={label}
      maxLength={maxLength}
      minLength={minLength}
      leadingIcon={leadingIcon}
      className={className}
      trailingContent={
        <button
          type="button"
          className="auth-input__password-toggle"
          onPointerDown={(event) => event.preventDefault()}
          onClick={() => setShowPassword((currentValue) => !currentValue)}
          disabled={disabled}
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
          title={showPassword ? "Hide password" : "Show password"}
        >
          <span className="auth-input__password-toggle-aura" aria-hidden="true" />
          <span className="auth-input__password-toggle-surface" aria-hidden="true" />
          <span className="auth-input__password-toggle-icon">
            {showPassword ? <FiEyeOff size={17} strokeWidth={1.8} aria-hidden="true" /> : <FiEye size={17} strokeWidth={1.8} aria-hidden="true" />}
          </span>
        </button>
      }
    />
  );
};

const sharedPropTypes = {
  id: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onPaste: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  placeholder: PropTypes.string,
  autoComplete: PropTypes.string,
  ariaLabel: PropTypes.string,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.string,
  helperText: PropTypes.string,
  label: PropTypes.string,
  maxLength: PropTypes.number,
  minLength: PropTypes.number,
  leadingIcon: PropTypes.node,
  className: PropTypes.string,
};

AuthInputStructure.propTypes = {
  ...sharedPropTypes,
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  inputMode: PropTypes.string,
  trailingContent: PropTypes.node,
};

AuthInputField.propTypes = {
  ...sharedPropTypes,
  type: PropTypes.string,
  inputMode: PropTypes.string,
};

AuthInputPassword.propTypes = sharedPropTypes;
