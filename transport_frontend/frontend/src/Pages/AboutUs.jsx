import { motion } from "framer-motion";
import { FaBus, FaTicketAlt, FaSearch, FaLock } from "react-icons/fa";
import trans from "../assets/trans.png"; // Corrected image import

// Core values data
const coreValues = [
  {
    icon: FaBus,
    title: "Effortless Booking",
    description:
      "Reserve your seat in just a few clicks with real-time availability.",
  },
  {
    icon: FaTicketAlt,
    title: "Instant Tickets",
    description: "Receive a digital ticket instantly for a seamless check-in.",
  },
  {
    icon: FaSearch,
    title: "Smart Search",
    description: "Find the best routes with advanced filters and search.",
  },
  {
    icon: FaLock,
    title: "Secure Payments",
    description: "Fast and safe checkout with multiple payment options.",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const AboutUs = () => {
  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className='bg-gradient-to-r from-sky-100 to-sky-200 text-gray-700 py-20'
      >
        <div className='container mx-auto px-4 text-center'>
          <h1 className='text-2xl md:text-4xl font-bold mb-6'>
            Welcome to FlexiRyde
          </h1>
          <p className='text-lg md:text-xl max-w-2xl mx-auto'>
            Making public transport booking seamless and secure for Nigerians.
          </p>
        </div>
      </motion.section>

      {/* Core Values Section */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <motion.h2
            variants={itemVariants}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            className='md:text-3xl text-xl font-semibold text-center text-gray-800 mb-12'
          >
            Why Choose FlexiRyde
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'
          >
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className='bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow'
              >
                <value.icon className='text-blue-600 mx-auto mb-4' size={40} />
                <h3 className='md:text-xl text-lg font-semibold text-gray-800 mb-2'>
                  {value.title}
                </h3>
                <p className='text-base text-gray-600'>{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Image Section */}
      <section className='py-16 bg-gray-100'>
        <div className='container mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className='max-w-4xl mx-auto'
          >
            {trans ? (
              <img
                src={trans}
                alt='Nigerian public transport'
                className='w-full h-64 md:h-96 object-cover rounded-lg shadow-md'
              />
            ) : (
              <div className='w-full h-64 md:h-96 bg-gray-300 rounded-lg shadow-md flex items-center justify-center'>
                <p className='text-gray-600'>Image not available</p>
              </div>
            )}
            <p className='text-center text-gray-600 mt-4 italic'>
              Connecting Nigerians through reliable transportation
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <motion.h2
            variants={itemVariants}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            className='md:text-3xl text-xl font-semibold text-center text-gray-800 mb-12'
          >
            From Our Team
          </motion.h2>
          <motion.div
            variants={containerVariants}
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true }}
            className='max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md'
          >
            <motion.p
              variants={itemVariants}
              className='text-gray-700 md:text-lg text-base text-center'
            >
              "At FlexiRyde, we're passionate about transforming how Nigerians
              travel. Our team is dedicated to building a platform that’s not
              just a booking tool, but a reliable companion for every journey."
            </motion.p>
            <motion.p
              variants={itemVariants}
              className='text-blue-600 md:text-base text-sm font-semibold text-center mt-6'
            >
              - The FlexiRyde Team
            </motion.p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
