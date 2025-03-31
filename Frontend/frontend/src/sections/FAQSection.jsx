import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus } from "react-icons/fa";

const faqData = {
  General: [
    { question: "Why book bus tickets online on Travyule??", answer: "Booking bus tickets on Travyule is the smarter way to travel. Skip long queues and book from anywhere with just a few clicks. Compare bus schedules, choose your preferred seats, and enjoy exclusive discounts. Secure payments ensure your transactions are safe, while real-time updates keep you informed about any schedule changes. Plus, check onboard amenities before booking for a more comfortable journey. Travel smarter with Travyule!" },
    { question: "What are the advantages of purchasing a bus ticket with Travyule?", answer: "You get seamless booking, digital tickets, and easy rescheduling." },
    {question: "Do I need to create an account on Travyule to book my bus ticket?", answer: "No, you don’t have to create an account on Travyule to book your bus ticket. But it is advisable to make one to accelerate the process next time you want to book bus tickets and help you modify your booking."},
    {question: "Does bus booking online cost me more?", answer: "Not at all! The bus ticket price is the same as you would get from the park by going there physically. Travyule reduces the travel budget by comparing the bus ticket prices among various operators, making it a more cost-effective choice. Therefore, online bus booking is increasingly recognized as a more convenient, efficient, and economical mode of securing travel arrangements."},
  ],
  "Ticket-related": [
    {question: "How can I book bus tickets on Travyule?", answer: "Bus ticket Booking is effortless on Travyule. To book the bus tickets, go to the main page and enter your source city and destination city in the “From” and “To” fields, respectively. Enter the travel date and hit the check availability button. "},
    { question: "How can I cancel my ticket?", answer: "You can't cancel your ticket but you can reschedule it for another travel." },
    { question: "Can I transfer my ticket to someone else?", answer: "No, tickets are non-transferable for security reasons." },
    {question: "Is it mandatory to take a printout of the ticket?", answer: "It is advisable you have a print out but you can easily get one by entering some details on the website."},
  ],
  Payment: [
    { question: "What payment methods are available?", answer: "We accept debit cards, mobile payments, and bank transfers via Paystack and Opay." },
    { question: "Is my payment secure on Travyule?", answer: "Yes, all payments are processed through secure gateways like Paystack and Opay, ensuring data encryption and fraud protection." },
    { question: "Does Travyule charge any extra fees for online payments??", answer: "Travyule does not charge additional booking fees. However, your payment provider may apply standard transaction fees." },
    { question: "What happens if my payment fails?", answer: "If your payment fails, check your internet connection, confirm sufficient funds, or try another payment method. If the issue persists, contact our support team." },
    { question: "Do I get a receipt after making a payment?", answer: "Yes, after a successful transaction, you will receive an email confirmation with your e-receipt and booking details. You can also access your booking history in your Travyule account." },
  ],

  "Rescheduling": [
    { 
      question: "Can I reschedule my bus ticket after booking?", 
      answer: "Yes, you can reschedule your trip to a later date or time, subject to seat availability and the operator's policy." 
    },
    { 
      question: "How do I reschedule my ticket?", 
      answer: "Log into your Travyule account, go to 'Change Travel Date,' select the trip you want to reschedule, and choose a new date and time." 
    },
    { 
      question: "Is there a fee for rescheduling my ticket?", 
      answer: "Rescheduling fees vary depending on the bus operator. Some may allow free changes, while others may charge a small fee." 
    },
    { 
      question: "Can I reschedule my ticket multiple times?", 
      answer: "Rescheduling is allowed only once per booking. If you need further changes, you need to contact our support." 
    },
    { 
      question: "What happens if there are no available seats for my new travel date?", 
      answer: "If there are no available seats, you can choose another date or time. If none are suitable, you can contact our support to look into it." 
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
    <div className="max-w-4xl mx-auto px-4 py-12 pb-20 pt-18">
      <h2 className="md:text-3xl text-2xl font-bold text-center mb-6 mt-6">FAQs related to Bus Tickets Booking</h2>
      
      {/* Tabs */}
      <div className="flex justify-center space-x-6 border-b border-gray-400 pb-3">
        {Object.keys(faqData).map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`pb-2 font-semibold ${activeTab === category ? "border-b-2 border-red-500 text-red-500" : "text-gray-600"}`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* FAQ Items */}
      <div className="mt-1">
        {faqData[activeTab].map((item, index) => (
          <div key={index} className="border-b border-gray-400 py-3">
            <button className="w-full flex justify-between items-center text-left text-lg font-medium" onClick={() => toggleFAQ(index)}>
              {item.question}
              {openIndex === index ? <FaMinus /> : <FaPlus />}
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2 text-gray-600"
                >
                  {item.answer}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
