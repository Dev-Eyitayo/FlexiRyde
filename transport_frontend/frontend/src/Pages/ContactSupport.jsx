import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

export default function ContactSupport() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setFormData({ fullName: "", email: "", subject: "", message: "" });
      toast.success("Message sent successfully!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100/20 py-12 px-4 sm:px-6 lg:px-8'>
      <Toaster position='top-right' />
      <div className='max-w-6xl mx-auto'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-gray-800 mb-3'>Contact Us</h1>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            Have questions or need assistance? Our dedicated support team is
            ready to help you.
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Contact Information */}
          <div className='bg-white rounded-2xl shadow-lg p-8 h-fit'>
            <h2 className='text-2xl font-semibold text-gray-800 mb-6'>
              Contact Information
            </h2>

            <div className='space-y-6'>
              <div className='flex items-start'>
                <div className='bg-blue-100 p-3 rounded-full mr-4'>
                  <FiMail className='text-blue-600 text-xl' />
                </div>
                <div>
                  <h3 className='font-medium text-gray-700'>Email</h3>
                  <p className='text-gray-600'>support@transportapp.com</p>
                </div>
              </div>

              <div className='flex items-start'>
                <div className='bg-blue-100 p-3 rounded-full mr-4'>
                  <FiPhone className='text-blue-600 text-xl' />
                </div>
                <div>
                  <h3 className='font-medium text-gray-700'>Phone</h3>
                  <p className='text-gray-600'>+1 (555) 123-4567</p>
                </div>
              </div>

              <div className='flex items-start'>
                <div className='bg-blue-100 p-3 rounded-full mr-4'>
                  <FiMapPin className='text-blue-600 text-xl' />
                </div>
                <div>
                  <h3 className='font-medium text-gray-700'>Office</h3>
                  <p className='text-gray-600'>
                    123 Transport St, Lagos, Nigeria
                  </p>
                </div>
              </div>
            </div>

            <div className='mt-8 pt-6 border-t border-gray-200'>
              <h3 className='font-medium text-gray-700 mb-3'>Business Hours</h3>
              <p className='text-gray-600'>Monday - Friday: 8am - 6pm</p>
              <p className='text-gray-600'>Saturday: 9am - 2pm</p>
              <p className='text-gray-600'>Sunday: Closed</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className='lg:col-span-2 bg-white rounded-2xl shadow-lg p-8'>
            <form onSubmit={handleSubmit} className='grid grid-cols-1 gap-6'>
              <div>
                <label
                  htmlFor='fullName'
                  className='block text-sm font-medium text-gray-700'
                >
                  Full Name
                </label>
                <input
                  type='text'
                  name='fullName'
                  id='fullName'
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className='mt-1 block w-full rounded-xl border border-gray-300 shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>

              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  Email Address
                </label>
                <input
                  type='email'
                  name='email'
                  id='email'
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className='mt-1 block w-full rounded-xl border border-gray-300 shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>

              <div>
                <label
                  htmlFor='subject'
                  className='block text-sm font-medium text-gray-700'
                >
                  Subject
                </label>
                <input
                  type='text'
                  name='subject'
                  id='subject'
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className='mt-1 block w-full rounded-xl border border-gray-300 shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500'
                />
              </div>

              <div>
                <label
                  htmlFor='message'
                  className='block text-sm font-medium text-gray-700'
                >
                  Message
                </label>
                <textarea
                  name='message'
                  id='message'
                  rows='5'
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className='mt-1 block w-full rounded-xl border border-gray-300 shadow-sm p-3 focus:ring-blue-500 focus:border-blue-500'
                ></textarea>
              </div>

              <div>
                <button
                  type='submit'
                  disabled={loading}
                  className='w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
