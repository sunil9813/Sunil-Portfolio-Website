import { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import PropTypes from "prop-types";
import { InputLabel } from "../customeUI/Title";

export const InputPassword = ({ fieldNameType, fieldName, value, name, onChange, onPaste, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };
  return (
    <>
      {fieldNameType && <InputLabel text={fieldName} className="label-shine text-xs" />}
      <div className="input_glow mt-2" onMouseMove={handleMouseMove}>
        <div className="input_glow_background">
          <div className="input_glow_background-glow"></div>
        </div>

        <div className="input_glow_background_filed">
          <div onMouseMove={handleMouseMove} className="input-box">
            <input type={showPassword ? "text" : "password"} value={value} name={name} onChange={onChange} onPaste={onPaste} placeholder={placeholder} className="px-5" />
            <div className="icon text-gray-500 absolute 3xl:top-4 top-3 right-3 cursor-pointer z-20" onClick={togglePassword}>
              {showPassword ? <AiFillEyeInvisible size={20} /> : <AiFillEye size={20} />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const InputFiled = ({ fieldNameType, fieldName, type, value, name, onChange, placeholder }) => {
  // Mouse move event handler
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  };
  return (
    <>
      {fieldNameType && <InputLabel text={fieldName} className="label-shine text-md" />}
      <div className="input_glow mt-2" onMouseMove={handleMouseMove}>
        <div className="input_glow_background">
          <div className="input_glow_background-glow"></div>
        </div>

        <div className="input_glow_background_filed">
          <div onMouseMove={handleMouseMove} className="input-box">
            <input type={type} value={value} name={name} onChange={onChange} placeholder={placeholder} className="px-5" />
          </div>
        </div>
      </div>
    </>
  );
};

InputPassword.propTypes = {
  fieldNameType: PropTypes.bool,
  fieldName: PropTypes.any,
  value: PropTypes.any,
  name: PropTypes.any,
  onChange: PropTypes.any,
  onPaste: PropTypes.any,
  placeholder: PropTypes.any,
};
InputFiled.propTypes = {
  fieldNameType: PropTypes.bool,
  fieldName: PropTypes.any,
  type: PropTypes.any,
  value: PropTypes.any,
  name: PropTypes.any,
  onChange: PropTypes.any,
  placeholder: PropTypes.any,
};
