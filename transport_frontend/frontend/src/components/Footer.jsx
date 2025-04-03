import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className='bg-sky-100/50 py-10 text-gray-700 text-sm'>
      <div className='max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6'>
        {/* Plan Your Trip */}
        <div>
          <h3 className='font-semibold mb-3 text-black'>Plan Your Trip</h3>
          <ul className='space-y-2'>
            <li>Products & Services</li>
            <li>Travel Guide</li>
            <li>Destinations</li>
            <li>Blog</li>
          </ul>
        </div>

        {/* Partners */}
        <div>
          <h3 className='font-semibold mb-3 text-black'>Partners</h3>
          <ul className='space-y-2'>
            <li>Become an Affiliate</li>
            <li>Become a Partner</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className='font-semibold mb-3 text-black'>Support</h3>
          <ul className='space-y-2'>
            <li>Contact Us</li>
            <li>FAQ</li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className='font-semibold mb-3 text-black'>Company</h3>
          <ul className='space-y-2'>
            <li>About Us</li>
            <li>Careers</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>
      </div>

      {/* Social Media and Copyright */}
      <div className='max-w-6xl mx-auto mt-10 px-6 flex flex-col md:flex-row justify-between items-center border-t pt-6'>
        <p className='text-center md:text-left'>
          &copy; {new Date().getFullYear()} FlexiRyde. All rights reserved.
        </p>
        <div className='flex space-x-4 mt-4 md:mt-0'>
          <FaFacebookF
            className='text-gray-500 hover:text-blue-600 cursor-pointer'
            size={18}
          />
          <FaLinkedinIn
            className='text-gray-500 hover:text-blue-600 cursor-pointer'
            size={18}
          />
          <FaInstagram
            className='text-gray-500 hover:text-pink-500 cursor-pointer'
            size={18}
          />
          <FaYoutube
            className='text-gray-500 hover:text-red-600 cursor-pointer'
            size={18}
          />
        </div>
      </div>
    </footer>
  );
}
