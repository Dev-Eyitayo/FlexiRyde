import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

const ModalWrapper = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50'>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
        className='bg-white w-full max-w-4xl m-4 flex flex-col md:flex-row rounded-lg shadow-lg overflow-hidden'
      >
        <div className='w-full md:w-1/2 p-8 relative'>
          <div className='flex justify-end'>
            <button
              onClick={onClose}
              className='text-gray-500 hover:text-gray-700'
              aria-label='Close authentication modal'
            >
              <FaTimes size={24} />
            </button>
          </div>
          {children}
        </div>
        <div className='hidden w-1/2 bg-blue-900 text-white md:flex flex-col items-center justify-center gap-3 p-8'>
          <h2 className='text-3xl self-center font-extrabold leading-tight'>
            Welcome to your{" "}
            <span className='text-blue-300'>one-stop travel mate</span>
          </h2>
          <p className='mt-3 text-xl self-start max-w-xs'>
            Book your ride with ease and enjoy seamless travel experiences.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ModalWrapper;
