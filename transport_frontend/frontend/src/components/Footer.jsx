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
            <li>
              <a href='#' className='hover:underline'>
                Products & Services
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline'>
                Travel Guide
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline'>
                Destinations
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline'>
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Partners */}
        <div>
          <h3 className='font-semibold mb-3 text-black'>Partners</h3>
          <ul className='space-y-2'>
            <li>
              <a href='#' className='hover:underline'>
                Become an Affiliate
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline'>
                Become a Partner
              </a>
            </li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className='font-semibold mb-3 text-black'>Support</h3>
          <ul className='space-y-2'>
            <li>
              <a href='#' className='hover:underline'>
                Contact Us
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline'>
                FAQ
              </a>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className='font-semibold mb-3 text-black'>Company</h3>
          <ul className='space-y-2'>
            <li>
              <a href='#' className='hover:underline'>
                About Us
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline'>
                Careers
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline'>
                Privacy Policy
              </a>
            </li>
            <li>
              <a href='#' className='hover:underline'>
                Terms & Conditions
              </a>
            </li>
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
