import { useState } from "react";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DepartmentalLogin = ({ onAdminClick }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
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
      // Simulate successful login
      console.log("Login data:", formData);
      toast.success("Login successful!");
      navigate("/dept-dashboard");
    } catch (error) {
      console.error("Error during login:", error);
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 flex flex-col justify-center h-[500px]">
      <h2 className="text-2xl font-bold text-[#1B5E20] mb-2">Department Login</h2>
      <p className="text-gray-600 mb-6">Sign in to access department dashboard</p>

      {errors.form && (
        <p className="text-red-600 mb-3 flex items-center text-sm">
          <AlertCircle size={14} className="mr-1" /> {errors.form}
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute top-3 left-3 text-gray-400" size={18} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full py-3 pl-10 pr-3 border rounded-full focus:outline-none focus:ring-2 ${
                errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-[#1B5E20]'
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

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full py-3 pl-10 pr-3 border rounded-full focus:outline-none focus:ring-2 ${
                errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-[#1B5E20]'
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

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded-full text-white font-medium transition-all ${
            isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#1B5E20] hover:bg-[#2E7D32]'
          }`}
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="text-center mt-6 pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-600">
          Are you an admin?{' '}
          <button onClick={onAdminClick} className="text-[#1B5E20] hover:underline font-medium">
            Login here
          </button>
        </p>
      </div>
    </div>
  );
};

export default DepartmentalLogin;