import { motion } from "framer-motion";

export const About = () => {
  return (
    <section className='bg-gray-100 py-16 px-6 md:px-12 lg:px-24' id='about'>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className='max-w-5xl mx-auto text-center'
      >
        <h2 className='md:text-4xl text-2xl font-bold mt-16 text-gray-800 mb-4'>
          Seamless Travel, Simplified
        </h2>
        <p className='text-lg text-gray-600'>
          At{" "}
          <span className='font-semibold md:text-base text-sm '>FlexiRyde</span>
          , we are redefining public transport booking in Nigeria. Whether
          you're traveling within the city or across states, our platform
          ensures a smooth, hassle-free booking experience for passengers and
          transport operators alike.
        </p>
      </motion.div>

      <div className='grid md:grid-cols-2 gap-8 mt-12'>
        {/* Feature Box */}
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className='bg-white p-6 shadow-lg rounded-xl flex items-center gap-4'
          >
            <div className='text-blue-600 text-3xl'>{feature.icon}</div>
            <div>
              <h3 className='text-base font-semibold text-gray-800'>
                {feature.title}
              </h3>
              <p className='text-gray-600 text-sm'>{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className='mt-12 text-center'
      >
        <a
          className='bg-blue-600 text-white px-6 py-4 rounded-lg text-base font-semibold hover:bg-blue-700 transition'
          href='#bookhero'
        >
          Book Your Ride Now
        </a>
      </motion.div>
    </section>
  );
};

const features = [
  {
    icon: "🚌",
    title: "Effortless Booking",
    description:
      "Reserve your seat in just a few clicks with real-time availability.",
  },
  {
    icon: "🎟️",
    title: "Instant Ticket Generation",
    description:
      "Receive a digital ticket upon booking for a seamless check-in process.",
  },
  {
    icon: "🔍",
    title: "Smart Search & Filters",
    description:
      "Easily find the best available routes based on your departure and destination points.",
  },
  {
    icon: "💳",
    title: "Secure Payments",
    description:
      "Multiple payment options to ensure a fast and secure checkout experience.",
  },
];
