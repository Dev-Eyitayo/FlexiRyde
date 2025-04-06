import { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { AnimatePresence, motion } from "framer-motion";
import { FaPlus, FaMinus } from "react-icons/fa";

const faqData = {
  General: [
    {
      question: "Why book bus tickets online on FlexiRyde??",
      answer:
        "Booking bus tickets on FlexiRyde is the smarter way to travel. Skip long queues and book from anywhere with just a few clicks. Compare bus schedules, book your seats, and enjoy easy your trip. Secure payments ensure your transactions are safe. Travel smarter with FlexiRyde!",
    },
    {
      question:
        "What are the advantages of purchasing a bus ticket with FlexiRyde?",
      answer:
        "You get seamless booking, digital tickets, and easy rescheduling.",
    },
    {
      question:
        "Do I need to create an account on FlexiRyde to book my bus ticket?",
      answer:
        "No, you don’t have to create an account on FlexiRyde to book your bus ticket. But it is advisable to make one to accelerate the process next time you want to book bus tickets and help you modify your booking.",
    },
    {
      question: "Does bus booking online cost me more?",
      answer:
        "Not at all! The bus ticket price is the same as you would get from the park by going there physically. FlexiRyde reduces the travel budget by comparing the bus ticket prices among various operators, making it a more cost-effective choice.",
    },
  ],
  Ticket: [
    {
      question: "How can I book bus tickets on FlexiRyde?",
      answer:
        "Bus ticket Booking is effortless on FlexiRyde. To book the bus tickets, go to the main page and enter your source city and destination city in the “From” and “To” fields, respectively. Enter the travel date and hit the check availability button. ",
    },
    {
      question: "How can I cancel my ticket?",
      answer:
        "You can cancel your ticket by going to the travel history page so far it meets the required criteria and you can reschedule as well.",
    },
    {
      question: "Can I transfer my ticket to someone else?",
      answer: "No, tickets are non-transferable for security reasons.",
    },
    {
      question: "Is it mandatory to take a printout of the ticket?",
      answer:
        "It is advisable you have a print out but you can easily get one by entering some details on the website.",
    },
  ],
  Payment: [
    {
      question: "What payment methods are available?",
      answer:
        "We accept debit cards, mobile payments, and bank transfers via Paystack and Opay.",
    },
    {
      question: "Is my payment secure on FlexiRyde?",
      answer:
        "Yes, all payments are processed through secure gateways like Paystack and Opay, ensuring data encryption and fraud protection.",
    },
    {
      question: "Does FlexiRyde charge any extra fees for online payments??",
      answer:
        "FlexiRyde does not charge additional booking fees. However, your payment provider may apply standard transaction fees.",
    },
    {
      question: "What happens if my payment fails?",
      answer:
        "If your payment fails, check your internet connection, confirm sufficient funds, or try another payment method. If the issue persists, contact our support team.",
    },
    {
      question: "Do I get a receipt after making a payment?",
      answer:
        "Yes, after a successful transaction, you will receive an email confirmation with your e-receipt and booking details. You can also access your booking history in your FlexiRyde account.",
    },
  ],

  Rescheduling: [
    {
      question: "Can I reschedule my bus ticket after booking?",
      answer:
        "Yes, you can reschedule your trip to a later date or time, subject to seat availability and the operator's policy.",
    },
    {
      question: "How do I reschedule my ticket?",
      answer:
        "Log into your FlexiRyde account, go to 'Change Travel Date,' select the trip you want to reschedule, and choose a new date and time.",
    },
    {
      question: "Is there a fee for rescheduling my ticket?",
      answer:
        "Rescheduling fees vary depending on the bus operator. Some may allow free changes, while others may charge a small fee.",
    },
    {
      question: "Can I reschedule my ticket multiple times?",
      answer:
        "Rescheduling is allowed only once per booking. If you need further changes, you need to contact our support.",
    },
    {
      question:
        "What happens if there are no available seats for my new travel date?",
      answer:
        "If there are no available seats, you can choose another date or time. If none are suitable, you can contact our support to look into it.",
    },
  ],
};

export default function FAQSection() {
  const [activeTab, setActiveTab] = useState("General");
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className='max-w-5xl md:mx-auto mx-1 px-4 py-12 pb-20 pt-18'>
      <h2 className='md:text-2xl text-xl font-bold text-center mb-6 mt-6'>
        Frequently Asked Questions
      </h2>

      {/* Tabs */}
      <div className='flex justify-center space-x-4 border-b border-gray-400 pb-3 mx-2 relative'>
        {Object.keys(faqData).map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`pb-2 px-1 font-semibold relative z-10 ${activeTab === category ? "text-red-500" : "text-gray-600 text-sm"}`}
          >
            {category}
            {activeTab === category && (
              <motion.div
                layoutId='activeTab'
                className='absolute bottom-0 left-0 right-0 h-0.5 bg-red-500'
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* FAQ Items */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className='mt-1'
        >
          {faqData[activeTab].map((item, index) => (
            <motion.div
              key={index}
              className='border-b border-gray-400 py-3'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                className='w-full flex justify-between items-center text-left font-semibold text-base'
                onClick={() => toggleFAQ(index)}
              >
                {item.question}
                <span className='font-semibold text-base ml-0.5'>
                  {openIndex === index ? <FaMinus /> : <FaPlus />}
                </span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className='mt-2 text-gray-600'
                  >
                    {item.answer}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
