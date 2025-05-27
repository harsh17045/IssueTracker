// import { useState } from "react";
// import { User, Mail, Lock, AlertCircle, ChevronDown } from "lucide-react";
// import { registerNewUser } from "../services/authService";
// import { useNavigate } from "react-router-dom";

// const RegistrationForm = ({ onLoginClick }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     department: "",
//     termsAgreed: false
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const navigate = useNavigate();

//   const departments = ["HR", "Admin", "Finance", "Marketing", "IT"];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });

//     if (errors[name]) {
//       setErrors({
//         ...errors,
//         [name]: null,
//       });
//     }
//   };

//   const selectDepartment = (dept) => {
//     setFormData({
//       ...formData,
//       department: dept,
//     });
//     setShowDropdown(false);
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!formData.name) newErrors.name = "Name is required";
//     if (!formData.email) {
//       newErrors.email = "Email is required";
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = "Email is invalid";
//     }
//     if (!formData.password) {
//       newErrors.password = "Password is required";
//     } else if (formData.password.length < 6) {
//       newErrors.password = "Password must be at least 6 characters";
//     }
//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = "Please confirm your password";
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }
//     if (!formData.department) newErrors.department = "Department is required";
//     if (!formData.termsAgreed) newErrors.termsAgreed = "You must agree to the terms";
//     return newErrors;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const response = await registerNewUser(formData);
//       if (response.message === "Registered successfully") {
//         setFormData({
//           name: "",
//           email: "",
//           password: "",
//           confirmPassword: "",
//           department: "",
//         });
//         alert("Please Login");
//         navigate("/login");
//       } else {
//         setFormData({
//           name: "",
//           email: "",
//           password: "",
//           confirmPassword: "",
//           department: "",
//         });
//         alert(response.error);
//         navigate("/register");
//       }

//       const data = response;

//       if (!response.ok) {
//         setErrors({ form: data.message || "Registration failed" });
//       } else {
//         console.log("Registration successful:", data);
//         if (typeof onLoginClick === "function") {
//           onLoginClick();
//         }
//       }
//     } catch (error) {
//       console.error("Error during registration:", error);
//       setErrors({ form: "Something went wrong. Please try again." });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="p-8 flex flex-col h-[550px]">
//       <div className="overflow-y-auto pr-2">
//         <div className="pb-4">
//           <h2 className="text-2xl font-bold mb-2 text-[#4B2D87]">
//             Create Account
//           </h2>
//           <p className="mb-6 text-gray-600">
//             Join us to start tracking your tasks
//           </p>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Name field */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Full Name
//               </label>
//               <div className="relative">
//                 <User
//                   className="absolute top-3 left-3 text-gray-400"
//                   size={18}
//                 />
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className={`w-full py-3 pl-5 pr-3 border rounded-full focus:outline-none focus:ring-2 ${
//                     errors.name
//                       ? "border-red-500 focus:ring-red-200"
//                       : "border-gray-300 focus:ring-[#4B2D87]"
//                   }`}
//                   placeholder="Full Name"
//                 />
//               </div>
//               {errors.name && (
//                 <p className="flex items-center mt-1 text-sm text-red-600">
//                   <AlertCircle size={14} className="mr-1" /> {errors.name}
//                 </p>
//               )}
//             </div>

//             {/* Email field */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail
//                   className="absolute top-3 left-3 text-gray-400"
//                   size={18}
//                 />
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className={`w-full py-3 pl-5 pr-3 border rounded-full focus:outline-none focus:ring-2 ${
//                     errors.email
//                       ? "border-red-500 focus:ring-red-200"
//                       : "border-gray-300 focus:ring-[#4B2D87]"
//                   }`}
//                   placeholder="your@email.com"
//                 />
//               </div>
//               {errors.email && (
//                 <p className="flex items-center mt-1 text-sm text-red-600">
//                   <AlertCircle size={14} className="mr-1" /> {errors.email}
//                 </p>
//               )}
//             </div>

//             <div className="relative">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Department
//               </label>
//               <button
//                 type="button"
//                 onClick={() => setShowDropdown(!showDropdown)}
//                 className={`w-full py-3 pl-4 pr-10 text-left border rounded-full bg-white relative focus:outline-none focus:ring-2 ${
//                   errors.department
//                     ? "border-red-500 focus:ring-red-200"
//                     : "border-gray-300 focus:ring-[#4B2D87]"
//                 }`}
//               >
//                 <span
//                   className={
//                     formData.department ? "text-gray-900" : "text-gray-400"
//                   }
//                 >
//                   {formData.department || "Select department"}
//                 </span>
//                 <ChevronDown
//                   className="absolute top-3 right-3 text-gray-400"
//                   size={18}
//                 />
//               </button>

//               {showDropdown && (
//                 <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto transition duration-150 ease-in-out">
//                   {departments.map((dept) => (
//                     <button
//                       type="button"
//                       key={dept}
//                       onClick={() => selectDepartment(dept)}
//                       className={`w-full text-left px-4 py-2 text-sm ${
//                         formData.department === dept
//                           ? "bg-[#EDE9FE] text-[#4B2D87]"
//                           : "hover:bg-gray-100"
//                       }`}
//                     >
//                       {dept}
//                     </button>
//                   ))}
//                 </div>
//               )}

//               {errors.department && (
//                 <p className="flex items-center mt-1 text-sm text-red-600">
//                   <AlertCircle size={14} className="mr-1" /> {errors.department}
//                 </p>
//               )}
//             </div>

//             {/* Password field */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock
//                   className="absolute top-3 left-3 text-gray-400"
//                   size={18}
//                 />
//                 <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className={`w-full py-3 pl-5 pr-3 border rounded-full focus:outline-none focus:ring-2 ${
//                     errors.password
//                       ? "border-red-500 focus:ring-red-200"
//                       : "border-gray-300 focus:ring-[#4B2D87]"
//                   }`}
//                   placeholder="Password"
//                 />
//               </div>
//               {errors.password && (
//                 <p className="flex items-center mt-1 text-sm text-red-600">
//                   <AlertCircle size={14} className="mr-1" /> {errors.password}
//                 </p>
//               )}
//             </div>

//             {/* Confirm Password field */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Confirm Password
//               </label>
//               <div className="relative">
//                 <Lock
//                   className="absolute top-3 left-3 text-gray-400"
//                   size={18}
//                 />
//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   className={`w-full py-3 pl-5 pr-3 border rounded-full focus:outline-none focus:ring-2 ${
//                     errors.confirmPassword
//                       ? "border-red-500 focus:ring-red-200"
//                       : "border-gray-300 focus:ring-[#4B2D87]"
//                   }`}
//                   placeholder="••••••••"
//                 />
//               </div>
//               {errors.confirmPassword && (
//                 <p className="flex items-center mt-1 text-sm text-red-600">
//                   <AlertCircle size={14} className="mr-1" />{" "}
//                   {errors.confirmPassword}
//                 </p>
//               )}
//             </div>

//             {/* Terms checkbox */}
//             <div className="flex items-center">
//               <input
//                 id="terms"
//                 name="terms"
//                 type="checkbox"
//                 className="h-4 w-4 text-[#4B2D87] focus:ring-[#4B2D87] border-gray-300 rounded"
//                 onChange={(e) =>
//                   setFormData({ ...formData, termsAgreed: e.target.checked })
//                 }
//               />
//               <label
//                 htmlFor="terms"
//                 className="ml-2 block text-sm text-gray-700"
//               >
//                 I agree to the{" "}
//                 <a href="#" className="text-[#4B2D87] hover:underline">
//                   Terms of Service
//                 </a>{" "}
//                 and{" "}
//                 <a href="#" className="text-[#4B2D87] hover:underline">
//                   Privacy Policy
//                 </a>
//               </label>
//             </div>

//             {/* Submit button */}
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className={`w-full py-3 rounded-full font-medium transition-all ${
//                 isSubmitting
//                   ? "bg-gray-400 cursor-not-allowed text-white"
//                   : "bg-[#4B2D87] text-white hover:bg-[#5E3A9F]"
//               }`}
//             >
//               {isSubmitting ? "Creating account..." : "Register"}
//             </button>
//           </form>
//         </div>
//       </div>
//       {/* Sign in link */}
//       <div className="text-center mt-4 pt-2 border-t border-gray-100">
//         <p className="text-sm text-gray-600">
//           Already have an account?{" "}
//           <button
//             type="button"
//             onClick={onLoginClick}
//             className="text-[#4B2D87] hover:underline font-medium"
//           >
//             Login
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default RegistrationForm;
import { useState } from "react";
import { User, Mail, Lock, AlertCircle, ChevronDown, Building, Hash, Phone } from "lucide-react";

const RegistrationForm = ({ onLoginClick }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    building: "",
    floor: "",
    labNo: "",
    contactNumber: "",
    termsAgreed: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false);
  const [showBuildingDropdown, setShowBuildingDropdown] = useState(false);
  const [showFloorDropdown, setShowFloorDropdown] = useState(false);
  const [showLabDropdown, setShowLabDropdown] = useState(false);

  const departments = ["HR", "Admin", "Finance", "Marketing", "IT"];
  const buildings = ["Academic", "Research", "Management"];
  const floors = Array.from({ length: 10 }, (_, i) => `${i + 1}`);
  const labs = Array.from({ length: 10 }, (_, i) => `${i + 1}`);

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
    setShowDepartmentDropdown(false);
  };

  const selectBuilding = (building) => {
    setFormData({
      ...formData,
      building: building,
    });
    setShowBuildingDropdown(false);
  };

  const selectFloor = (floor) => {
    setFormData({
      ...formData,
      floor: floor,
    });
    setShowFloorDropdown(false);
  };

  const selectLab = (lab) => {
    setFormData({
      ...formData,
      labNo: lab,
    });
    setShowLabDropdown(false);
  };

  const validateContactNumber = (number) => {
    // Indian mobile number validation: 10 digits starting with 6, 7, 8, or 9
    const indianMobileRegex = /^[6-9]\d{9}$/;
    return indianMobileRegex.test(number);
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
    if (!formData.building) newErrors.building = "Building is required";
    if (!formData.floor) newErrors.floor = "Floor is required";
    if (!formData.labNo) newErrors.labNo = "Lab number is required";
    if (!formData.contactNumber) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!validateContactNumber(formData.contactNumber)) {
      newErrors.contactNumber = "Please enter a valid Indian mobile number (10 digits starting with 6, 7, 8, or 9)";
    }
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
      // Simulated API call - replace with actual registerNewUser service
      console.log("Registration data:", formData);
      
      // Simulate API response
      setTimeout(() => {
        alert("Registration successful! Please login.");
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          department: "",
          building: "",
          floor: "",
          labNo: "",
          contactNumber: "",
          termsAgreed: false
        });
        setIsSubmitting(false);
        if (typeof onLoginClick === "function") {
          onLoginClick();
        }
      }, 1000);

    } catch (error) {
      console.error("Error during registration:", error);
      setErrors({ form: "Something went wrong. Please try again." });
      setIsSubmitting(false);
    }
  };

  const DropdownField = ({ 
    label, 
    value, 
    placeholder, 
    options, 
    onSelect, 
    showDropdown, 
    setShowDropdown, 
    error, 
    icon: Icon 
  }) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        className={`w-full py-3 pl-5 pr-10 text-left border rounded-full bg-white relative focus:outline-none focus:ring-2 ${
          error
            ? "border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:ring-[#4B2D87]"
        }`}
      >
        {Icon && (
          <Icon
            className="absolute top-3 left-3 text-gray-400"
            size={18}
          />
        )}
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value || placeholder}
        </span>
        <ChevronDown
          className="absolute top-3 right-3 text-gray-400"
          size={18}
        />
      </button>

      {showDropdown && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto transition duration-150 ease-in-out">
          {options.map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => onSelect(option)}
              className={`w-full text-left px-4 py-2 text-sm ${
                value === option
                  ? "bg-[#EDE9FE] text-[#4B2D87]"
                  : "hover:bg-gray-100"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="flex items-center mt-1 text-sm text-red-600">
          <AlertCircle size={14} className="mr-1" /> {error}
        </p>
      )}
    </div>
  );

  return (
    <div className="p-8 flex flex-col h-[550px]">
      <div className="overflow-y-auto pr-2">
        <div className="pb-4">
          <h2 className="text-2xl font-bold mb-2 text-[#4B2D87]">
            Create Account
          </h2>
          <p className="mb-6 text-gray-600">
            Join us to start tracking your tasks
          </p>

          <div className="space-y-4">
            {/* Name field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                {/* <User
                  className="absolute top-3 left-3 text-gray-400"
                  size={18}
                /> */}
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full py-3 pl-5 pr-3 ml-1 border rounded-full focus:outline-none focus:ring-2 ${
                    errors.name
                      ? "border-red-500 focus:  ring-red-200"
                      : "border-gray-300 focus:ring-[#4B2D87]"
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
                {/* <Mail
                  className="absolute top-3 left-3 text-gray-400"
                  size={18}
                /> */}
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full py-3 pl-5 pr-3 ml-1 border rounded-full focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-[#4B2D87]"
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

            {/* Contact Number field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <div className="relative">
                {/* <Phone
                  className="absolute top-3 left-3 text-gray-400"
                  size={18}
                /> */}
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className={`w-full py-3 pl-5 pr-3 ml-1 border rounded-full focus:outline-none focus:ring-2 ${
                    errors.contactNumber
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-[#4B2D87]"
                  }`}
                  placeholder="+91 0000000000"
                  maxLength="10"
                />
              </div>
              {errors.contactNumber && (
                <p className="flex items-center mt-1 text-sm text-red-600">
                  <AlertCircle size={14} className="mr-1" /> {errors.contactNumber}
                </p>
              )}
            </div>

            {/* Department Dropdown */}
            <DropdownField
              
              label="Department"
              value={formData.department}
              placeholder="Select department"
              options={departments}
              onSelect={selectDepartment}
              showDropdown={showDepartmentDropdown}
              setShowDropdown={setShowDepartmentDropdown}
              error={errors.department}
              
            />

            {/* Building Dropdown */}
            <DropdownField
              label="Building"
              value={formData.building}
              placeholder="Select building"
              options={buildings}
              onSelect={selectBuilding}
              showDropdown={showBuildingDropdown}
              setShowDropdown={setShowBuildingDropdown}
              error={errors.building}
            />

            {/* Floor Dropdown */}
            <DropdownField
              label="Floor"
              value={formData.floor}
              placeholder="Select floor"
              options={floors}
              onSelect={selectFloor}
              showDropdown={showFloorDropdown}
              setShowDropdown={setShowFloorDropdown}
              error={errors.floor}
            />

            {/* Lab Number Dropdown */}
            <DropdownField
              label="Lab Number"
              value={formData.labNo}
              placeholder="Select lab number"
              options={labs}
              onSelect={selectLab}
              showDropdown={showLabDropdown}
              setShowDropdown={setShowLabDropdown}
              error={errors.labNo}
            />

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                {/* <Lock
                  className="absolute top-3 left-3 text-gray-400"
                  size={18}
                /> */}
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full py-3 pl-5 pr-3 border rounded-full focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-[#4B2D87]"
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
                {/* <Lock
                  className="absolute top-3 left-3 text-gray-400"
                  size={18}
                /> */}
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full py-3 pl-5 pr-3 border rounded-full focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:ring-[#4B2D87]"
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
                className="h-4 w-4 text-[#4B2D87] focus:ring-[#4B2D87] border-gray-300 rounded"
                onChange={(e) =>
                  setFormData({ ...formData, termsAgreed: e.target.checked })
                }
              />
              <label
                htmlFor="terms"
                className="ml-2 block text-sm text-gray-700"
              >
                I agree to the{" "}
                <a href="#" className="text-[#4B2D87] hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#4B2D87] hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.termsAgreed && (
              <p className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle size={14} className="mr-1" /> {errors.termsAgreed}
              </p>
            )}

            {errors.form && (
              <p className="flex items-center mt-1 text-sm text-red-600">
                <AlertCircle size={14} className="mr-1" /> {errors.form}
              </p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-3 rounded-full font-medium transition-all ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-[#4B2D87] text-white hover:bg-[#5E3A9F]"
              }`}
            >
              {isSubmitting ? "Creating account..." : "Register"}
            </button>
          </div>
        </div>
      </div>
      {/* Sign in link */}
      <div className="text-center mt-4 pt-2 border-t border-gray-100">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onLoginClick}
            className="text-[#4B2D87] hover:underline font-medium"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegistrationForm;