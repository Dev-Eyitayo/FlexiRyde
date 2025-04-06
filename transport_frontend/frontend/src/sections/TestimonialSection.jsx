import { motion } from "framer-motion";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const testimonials = [
  {
    name: "Sarah Johnson",
    rating: 5,
    review:
      "FlexiRyde made my travel experience so seamless! Booking was easy, and I loved choosing my seat ahead of time. Highly recommended!",
    location: "Lagos, Nigeria",
  },
  {
    name: "David Oluwole",
    rating: 4.5,
    review:
      "Great platform for bus booking. The real-time updates were helpful. Would love to see more operators onboard!",
    location: "Abuja, Nigeria",
  },
  {
    name: "Amara Ezeji",
    rating: 4,
    review:
      "Very convenient! No need to queue at bus stations anymore. Just wish there were more payment options!",
    location: "Enugu, Nigeria",
  },
  {
    name: "Michael Brown",
    rating: 5,
    review:
      "FlexiRyde is the best thing that happened to intercity travel in Nigeria. The platform is smooth and reliable!",
    location: "Port Harcourt, Nigeria",
  },
  {
    name: "Fatima Bello",
    rating: 4.5,
    review:
      "Booking was fast and easy. Customer support was also responsive. Definitely can refer people to use it!",
    location: "Kano, Nigeria",
  },
  {
    name: "Paul Justin",
    rating: 4.5,
    review:
      "Booking was just so seamless and quick. Customer support was also nice and great. Will definitely use it again!",
    location: "Ibadan, Nigeria",
  },
];

const TestimonialSection = () => {
  return (
    <div className='max-w-6xl mx-auto pt-24 px-6 py-12'>
      <h2 className='md:text-2xl text-xl font-bold text-center mb-8'>
        What Our Users Say
      </h2>
      <motion.div
        className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            className='p-6 bg-white shadow-lg rounded-xl'
            whileHover={{ scale: 1.05 }}
          >
            <p className='text-gray-700 text-sm'>"{testimonial.review}"</p>
            <div className='flex items-center mt-4'>
              {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                <FaStar key={i} className='text-yellow-500' />
              ))}
              {testimonial.rating % 1 !== 0 && (
                <FaStarHalfAlt className='text-yellow-500' />
              )}
            </div>
            <p className='mt-2 text-sm font-semibold'>
              - {testimonial.name}, {testimonial.location}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default TestimonialSection;
