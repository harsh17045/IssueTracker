// import { useState } from 'react';
// import { Mail, Lock, AlertCircle } from 'lucide-react';

// const LoginForm = ({ onRegisterClick }) => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
  
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
    
//     // Clear validation errors when user types
//     if (errors[name]) {
//       setErrors({
//         ...errors,
//         [name]: null
//       });
//     }
//   };

//   const validate = () => {
//     const newErrors = {};
    
//     if (!formData.email) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }
    
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     }
    
//     return newErrors;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }
    
//     setIsSubmitting(true);
    
//     // Simulate API call
//     setTimeout(() => {
//       console.log('Logging in:', formData);
//       setIsSubmitting(false);
//     }, 1500);
//   };

//   return (
//     <div className="p-8 flex flex-col justify-center h-[500px]">
//       <div>
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign In</h2>
//         <p className="text-gray-600 mb-6">Sign in to access your dashboard</p>
        
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email Address
//             </label>
//             <div className="relative">
//               <Mail className="absolute top-3 left-3 text-gray-400" size={18} />
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 className={`w-full py-3 pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 ${
//                   errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
//                 }`}
//                 placeholder="your@email.com"
//               />
//             </div>
//             {errors.email && (
//               <p className="flex items-center mt-1 text-sm text-red-600">
//                 <AlertCircle size={14} className="mr-1" /> {errors.email}
//               </p>
//             )}
//           </div>
          
//           {/* Password field */}
//           <div>
//             <div className="flex justify-between mb-1">
//               <label className="block text-sm font-medium text-gray-700">
//                 Password
//               </label>
//               <a href="#" className="text-sm text-blue-600 hover:underline">
//                 Forgot password?
//               </a>
//             </div>
//             <div className="relative">
//               <Lock className="absolute top-3 left-3 text-gray-400" size={18} />
//               <input
//                 type="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 className={`w-full py-3 pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 ${
//                   errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
//                 }`}
//                 placeholder="••••••••"
//               />
//             </div>
//             {errors.password && (
//               <p className="flex items-center mt-1 text-sm text-red-600">
//                 <AlertCircle size={14} className="mr-1" /> {errors.password}
//               </p>
//             )}
//           </div>
          
//           {/* Remember me checkbox */}
//           <div className="flex items-center">
//             <input
//               id="remember-me"
//               name="remember-me"
//               type="checkbox"
//               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//             />
//             <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
//               Remember me
//             </label>
//           </div>
          
//           {/* Submit button */}
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className={`w-full py-3 rounded-lg text-white font-medium transition-all ${
//               isSubmitting 
//                 ? 'bg-gray-400 cursor-not-allowed' 
//                 : 'bg-blue-600 hover:bg-blue-700'
//             }`}
//           >
//             {isSubmitting ? 'Signing in...' : 'Sign In'}
//           </button>
//         </form>

//         {/* Register link */}
//         <div className="text-center mt-6 pt-4 border-t border-gray-100">
//           <p className="text-sm text-gray-600">
//             Don't have an account?{' '}
//             <button
//               type="button"
//               onClick={onRegisterClick}
//               className="text-blue-600 hover:underline font-medium"
//             >
//               Register
//             </button>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginForm;

import { useState } from 'react';
import { Mail, Lock, AlertCircle, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { loginUser, verifyUser } from '../services/authService'; 
import { useAuth } from '../context/AuthContext'; // Add this import

const LoginForm = ({ onRegisterClick }) => {
  const { setEmployee } = useAuth(); // Add this
  const [formData, setFormData] = useState({ email: '', password: '', otp: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState('login'); // login -> otp
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';

    if (!formData.password) newErrors.password = 'Password is required';

    return newErrors;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLogin();
    if (Object.keys(validationErrors).length) return setErrors(validationErrors);

    setIsSubmitting(true);
    try {
        const response = await loginUser(formData);
        const data = await response.json();
        console.log("Response data:",data)
        console.log("Data:",data);
        if(data.message==="OTP sent to your email" || data.message==="Use the OTP sent to your mail"){
            
            setStep('otp');
            console.log(step);
          } else {
            setErrors({ general: data.message || 'Login failed' });
        }
        // else{
        //   alert(response.error || "Login failed");
        //   navigate("/register")
        // }
      } catch {
      setErrors({ general: 'Server error. Try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    if (!formData.otp) return setErrors({ otp: 'OTP is required' });

    setIsSubmitting(true);
    try {
      const res = await verifyUser({ email: formData.email, otp: formData.otp });
      if (res.message === "Login Successfull") {
        // Set the employee in context
        setEmployee(res.employee);
        // Navigate to dashboard
        navigate('/');
      } else {
        setErrors({ otp: res.message || 'Invalid OTP' });
      }
    } catch {
      setErrors({ otp: 'Server error during OTP verification' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 flex flex-col justify-center h-[500px]">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign In</h2>
      <p className="text-gray-600 mb-6">
        {step === 'login' ? 'Sign in to access your dashboard' : 'Enter the OTP sent to your email'}
      </p>

      {errors.general && (
        <p className="text-red-600 mb-3 flex items-center text-sm">
          <AlertCircle size={14} className="mr-1" /> {errors.general}
        </p>
      )}

      {step === 'login' ? (
        <form onSubmit={handleLoginSubmit} className="space-y-5">
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
                className={`w-full py-3 pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
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
                className={`w-full py-3 pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.password ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
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
            className={`w-full py-3 rounded-lg text-white font-medium transition-all ${
              isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOTPSubmit} className="space-y-5">
          {/* OTP Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">OTP</label>
            <div className="relative">
              <Key className="absolute top-3 left-3 text-gray-400" size={18} />
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                className={`w-full py-3 pl-10 pr-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.otp ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'
                }`}
                placeholder="Enter the OTP"
              />
            </div>
            {errors.otp && (
              <p className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle size={14} className="mr-1" /> {errors.otp}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg text-white font-medium transition-all ${
              isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      )}

      {step === 'login' && (
        <div className="text-center mt-6 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <button onClick={onRegisterClick} className="text-blue-600 hover:underline font-medium">
              Register
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
