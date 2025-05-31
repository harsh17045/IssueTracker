import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import DepartmentalLogin from '../pages/DepartmentalLogin';
import AdminLogin from '../pages/AdminLogin';
import LoginVector from '../assets/login.png';

const AnimatedText = ({ text }) => {
  // Split text into words, keeping spaces
  const words = text.split(' ').map((word, i, arr) =>
    i < arr.length - 1 ? word + ' ' : word // keep spaces except last word
  );

  return (
    <motion.div className="overflow-hidden w-full">
      {words.map((word, wordIdx) => (
        <span
          key={wordIdx}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {word.split('').map((char, charIdx) => (
            <motion.span
              key={charIdx}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: wordIdx * 0.2 + charIdx * 0.05, // animate words in sequence, then letters
                ease: [0.2, 0.65, 0.3, 0.9]
              }}
              style={{ display: "inline" }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.div>
  );
};

const SequentialText = () => {
  const phrases = [
    "Welcome back, let's make solutions happen.",
    "Let's address what matters most",
    "Departmental access granted—time to take charge."
  ];

  // Get last index from localStorage, default to 0
  const getNextIndex = () => {
    const lastIndex = parseInt(localStorage.getItem('deptPhraseIndex') || '0', 10);
    const nextIndex = (lastIndex + 1) % phrases.length;
    localStorage.setItem('deptPhraseIndex', nextIndex);
    return lastIndex;
  };

  const [currentIndex] = useState(getNextIndex);

  return (
    <motion.div
      key={currentIndex}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-full overflow-hidden"
    >
      <AnimatedText text={phrases[currentIndex]} />
    </motion.div>
  );
};

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAdminActive, setIsAdminActive] = useState(location.pathname === '/admin-login');
  
  useEffect(() => {
    setIsAdminActive(location.pathname === '/admin-login');
  }, [location.pathname]);

  const handleToggleForm = () => {
    if (isAdminActive) {
      navigate('/dept-login');
    } else {
      navigate('/admin-login');
    }
  };

  return (
    <div className="min-h-screen">
      <div className="flex items-center justify-center bg-[#E8F5E9] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden w-full max-w-5xl">
          <div className="flex flex-col md:flex-row h-full relative">
            {/* Left Panel (Form) */}
            <div className={`w-full md:w-1/2 transition-transform duration-700 ease-in-out transform ${
              isAdminActive ? 'translate-x-full' : 'translate-x-0'
            }`}>
              {/* Department Login */}
              <div className={`w-full transition-opacity duration-300 ${
                isAdminActive ? 'hidden' : 'block'
              }`}>
                <DepartmentalLogin onAdminClick={handleToggleForm} />
              </div>

              {/* Admin Login */}
              <div className={`w-full transition-opacity duration-300 ${
                !isAdminActive ? 'hidden' : 'block'
              }`}>
                <AdminLogin onDeptClick={handleToggleForm} />
              </div>
            </div>

            {/* Right Panel (Info/Welcome) */}
            <div className={`w-full md:w-1/2 transition-transform duration-700 ease-in-out transform bg-[#C8E6C9] ${
              isAdminActive ? '-translate-x-full' : 'translate-x-0'
            }`}>
              <div className="p-8 flex flex-col justify-center items-center text-center h-full">
                <div className="flex justify-center">
                  <img 
                    src={LoginVector} 
                    alt="Illustration" 
                    className="w-64 h-64 object-contain mb-6" 
                  />
                </div>
                
                <h3 className="text-2xl font-semibold mb-4 text-[#1B5E20] w-full max-w-full overflow-hidden break-words whitespace-pre-line">
                  {isAdminActive ? (
                    <AnimatedText text="Hey Chief, Welcome Back!" />
                  ) : (
                    <SequentialText />
                  )}
                </h3>
                
                <p className="text-gray-600 mb-8">
                  {isAdminActive 
                    ? "Sign in to manage departments and oversee all operations." 
                    : "Access your department portal to manage issues efficiently."}
                </p>
                
                <div className="flex justify-center space-x-2 mt-4">
                  <div className={`h-2 w-2 rounded-full ${!isAdminActive ? 'bg-[#1B5E20]' : 'bg-gray-300'}`}></div>
                  <div className={`h-2 w-2 rounded-full ${isAdminActive ? 'bg-[#1B5E20]' : 'bg-gray-300'}`}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}