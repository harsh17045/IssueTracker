import { useState } from 'react';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import LoginVector from '../assets/LoginVector.png';

export default function AuthPage1() {
  const [isLoginActive, setIsLoginActive] = useState(false);
  
  const handleToggleForm = () => {
    setIsLoginActive(!isLoginActive);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-sky-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-5xl">
        <div className="flex flex-col md:flex-row h-full relative">
          {/* Left Panel */}
          <div className={`w-full md:w-1/2 transition-transform duration-700 ease-in-out transform ${
            isLoginActive ? 'translate-x-full' : 'translate-x-0'
          }`}>
            {/* Register Form */}
            <div className={`w-full transition-opacity duration-300 ${
              isLoginActive ? 'hidden' : 'block'
            }`}>
              <RegistrationForm onLoginClick={handleToggleForm} />
            </div>

            {/* Login Form */}
            <div className={`w-full transition-opacity duration-300 ${
              !isLoginActive ? 'hidden' : 'block'
            }`}>
              <LoginForm onRegisterClick={handleToggleForm} />
            </div>
          </div>

          {/* Right Panel */}
          <div className={`w-full md:w-1/2 transition-transform duration-700 ease-in-out transform bg-sky-200 ${
            isLoginActive ? '-translate-x-full' : 'translate-x-0'
          }`}>
            <div className="p-8 flex flex-col justify-center items-center text-center h-full">
              <div className="flex justify-center">
                <img 
                
                  src={LoginVector} 
                  alt="" 
                  className="w-64 h-64 object-contain mb-6" 
                />
              </div>
              
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                "Hear Every Department, Solve Every Concern"
              </h3>
              
              <p className="text-gray-600 mb-8">
                {isLoginActive 
                  ? "Sign in to track your project issues and improve team coordination." 
                  : "Join us to streamline your project management and issue tracking."}
              </p>
              
              <div className="flex justify-center space-x-2 mt-4">
                <div className={`h-2 w-2 rounded-full ${!isLoginActive ? 'bg-blue-800' : 'bg-blue-300'}`}></div>
                <div className={`h-2 w-2 rounded-full ${isLoginActive ? 'bg-blue-800' : 'bg-blue-300'}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}