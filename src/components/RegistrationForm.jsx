import { useState } from "react";
import { User, Mail, Lock, AlertCircle, ChevronDown } from "lucide-react";
import { registerNewUser } from "../services/authService";
import { useNavigate } from "react-router-dom";

const RegistrationForm = ({ onLoginClick }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "", // Added department field
    termsAgreed:false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const departments = ["HR", "Admin", "Finance", "Marketing", "IT"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const selectDepartment = (dept) => {
    setFormData({
      ...formData,
      department: dept,
    });
    setShowDropdown(false);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.department) newErrors.department = "Department is required";
    if (!formData.termsAgreed) newErrors.termsAgreed = "You must agree to the terms";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await registerNewUser(formData);
      if (response.message === "Registered successfully") {
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          department: "",
        });
        alert("Please Login");
        navigate("/login");
      } else {
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          department: "",
        });
        alert(response.error);
        navigate("/Register");
      }

      const data = response;

      if (!response.ok) {
        setErrors({ form: data.message || "Registration failed" });
      } else {
        console.log("Registration successful:", data);
        if (typeof onLoginClick === "function") {
          onLoginClick();
        }
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 flex flex-col h-[550px]">
      {" "}
      {/* Increased height */}
      <div className="overflow-y-auto pr-2">
        <div className="pb-4">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            Create Account
          </h2>
          <p className="mb-6 text-gray-600">
            Join us to start tracking your tasks
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute top-3 left-3 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full py-3 pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.name
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200"
                  }`}
                  placeholder="Full Name"
                />
              </div>
              {errors.name && (
                <p className="flex items-center mt-1 text-sm text-red-600">
                  <AlertCircle size={14} className="mr-1" /> {errors.name}
                </p>
              )}
            </div>

            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute top-3 left-3 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full py-3 pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200"
                  }`}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && (
                <p className="flex items-center mt-1 text-sm text-red-600">
                  <AlertCircle size={14} className="mr-1" /> {errors.email}
                </p>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className={`w-full py-3 pl-4 pr-10 text-left border rounded-lg bg-white relative focus:outline-none focus:ring-2 ${
                  errors.department
                    ? "border-red-500 focus:ring-red-200"
                    : "border-gray-300 focus:ring-blue-200"
                }`}
              >
                <span
                  className={
                    formData.department ? "text-gray-900" : "text-gray-400"
                  }
                >
                  {formData.department || "Select department"}
                </span>
                <ChevronDown
                  className="absolute top-3 right-3 text-gray-400"
                  size={18}
                />
              </button>

              {showDropdown && (
                <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto transition duration-150 ease-in-out">
                  {departments.map((dept) => (
                    <button
                      type="button"
                      key={dept}
                      onClick={() => selectDepartment(dept)}
                      className={`w-full text-left px-4 py-2 text-sm ${
                        formData.department === dept
                          ? "bg-blue-100 text-blue-700"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              )}

              {errors.department && (
                <p className="flex items-center mt-1 text-sm text-red-600">
                  <AlertCircle size={14} className="mr-1" /> {errors.department}
                </p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute top-3 left-3 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full py-3 pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200"
                  }`}
                  placeholder="Password"
                />
              </div>
              {errors.password && (
                <p className="flex items-center mt-1 text-sm text-red-600">
                  <AlertCircle size={14} className="mr-1" /> {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute top-3 left-3 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full py-3 pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200"
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.confirmPassword && (
                <p className="flex items-center mt-1 text-sm text-red-600">
                  <AlertCircle size={14} className="mr-1" />{" "}
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                onChange={(e) =>
                  setFormData({ ...formData, termsAgreed: e.target.checked })
                }
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-700"
              >
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-medium transition-all ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Creating account..." : "Register"}
            </button>
          </form>
        </div>
      </div>
      {/* Sign in link */}
      <div className="text-center mt-4 pt-2 border-t border-gray-100">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onLoginClick}
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;
