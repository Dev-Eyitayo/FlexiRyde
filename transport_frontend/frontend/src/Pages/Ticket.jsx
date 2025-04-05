const Ticket = () => {
  const ticket = {
    id: "TRN-2023-4567",
    passengerName: "Alamu Eden",
    from: "Lagos",
    to: "Abuja",
    departureTime: "Dec 15, 2023 · 08:00 AM",
    seatNumber: "A12, A11, A10, A12, A13, A14, A26",
    busCompany: "ABC Transport",
    fare: "₦15,000",
    paymentStatus: "Paid",
    qrCodeUrl:
      "https://api.qrserver.com/v1/create-qr-code/?data=TicketID-TRN-2023-4567",
  };

  return (
    <div className='max-w-md mx-auto my-8 p-4' id='ticket-content'>
      <div className='border-2 border-gray-800 rounded-lg overflow-hidden shadow-lg'>
        {/* Header */}
        <div className='bg-blue-600 text-white p-4 text-center'>
          <h1 className='text-xl font-bold'>Travel Ticket Pass</h1>
          <p className='text-xs'>FlexiRyde Ticket</p>
        </div>

        {/* Body */}
        <div className='p-4 bg-white'>
          <div className='flex justify-between mb-4'>
            <div>
              <p className='text-xs text-gray-500'>PASSENGER</p>
              <p className='font-bold'>{ticket.passengerName}</p>
            </div>
            <div>
              <p className='text-xs text-gray-500'>TICKET NO</p>
              <p className='font-bold'>{ticket.id}</p>
            </div>
          </div>

          <div className='border-t-2 border-b-2 border-dashed border-gray-300 py-3 my-3'>
            <div className='flex justify-between'>
              <div>
                <p className='text-xs text-gray-500'>FROM</p>
                <p className='font-bold text-lg'>{ticket.from}</p>
              </div>
              <div>
                <p className='text-xs text-gray-500'>TO</p>
                <p className='font-bold text-lg'>{ticket.to}</p>
              </div>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4 mb-4'>
            <div>
              <p className='text-xs text-gray-500'>DEPARTURE</p>
              <p className='font-bold'>{ticket.departureTime}</p>
            </div>
            <div>
              <p className='text-xs text-gray-500'>SEAT</p>
              <p className='font-bold'>{ticket.seatNumber}</p>
            </div>
          </div>

          <div className='flex justify-between items-center mb-4'>
            <div>
              <p className='text-xs text-gray-500'>BUS COMPANY</p>
              <p className='font-bold'>{ticket.busCompany}</p>
            </div>
            <div className='px-2 py-1 rounded bg-green-100 text-green-800 text-sm'>
              {ticket.paymentStatus}
            </div>
          </div>

          {/* QR Code Section */}
          <div className='text-center mt-6'>
            <img
              src={ticket.qrCodeUrl}
              alt='QR Code'
              className='w-24 h-24 mx-auto mb-2'
            />
            <p className='text-xs text-gray-500 mb-3'>SCAN TO VERIFY</p>
            <button
              onClick={() => {
                const originalContent = document.body.innerHTML;
                const printContent =
                  document.getElementById("ticket-content").outerHTML;
                document.body.innerHTML = `
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <style>
                        @media print {
                          @page { size: auto; margin: 0mm; }
                          body { margin: 1.6cm; }
                        }
                      </style>
                    </head>
                    <body>${printContent}</body>
                  </html>
                `;
                window.print();
                document.body.innerHTML = originalContent;
              }}
              className='bg-blue-600 text-white px-4 py-2 rounded text-sm'
            >
              Print Ticket
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className='bg-gray-100 p-2 text-center text-xs text-gray-600'>
          <p>Please arrive 30 minutes before departure</p>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
