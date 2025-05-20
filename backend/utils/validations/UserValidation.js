const yup = require("yup");

const CreateUser = yup.object().shape({
  name: yup.string().trim().required("Please provide your full name.").min(3, "Name must be at least 3 characters long."),
  email: yup.string().trim().required("Please provide your email address.").email("Invalid email address."),
  password: yup
    .string()
    .trim()
    .required("Please set a password to secure your account.")
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password is too long, it should be less than 20 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)"),
});
const UserPassword = yup.object().shape({
  password: yup
    .string()
    .trim()
    .required("Please set a password to secure your account.")
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password is too long, it should be less than 20 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)"),
});
const changePasswordVld = yup.object().shape({
  newPassword: yup
    .string()
    .trim()
    .required("Please set a password to secure your account.")
    .min(8, "Password must be at least 8 characters")
    .max(20, "Password is too long, it should be less than 20 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/, "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (!@#$%^&*)"),
});

module.exports = { CreateUser, UserPassword, changePasswordVld };
