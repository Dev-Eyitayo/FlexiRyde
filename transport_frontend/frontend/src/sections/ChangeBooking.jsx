import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { BookingInput } from "../components/BookingInput";

export default function ChangeBooking() {
    return (
        <>
            {/* <NavBar />    */}
            <div className="bg-white flex flex-col items-center justify-center mx-auto p-6">
                <h1 className="text-xl text-gray-500">Modify your Bookings with ease...</h1>
                <BookingInput submitType="Modify Booking" />
                
            </div>
            {/* <Footer /> */}
        </>
    );
}