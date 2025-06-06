export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pageNumbers = [];

  // Logic to show first, last, current, neighbors, and ellipsis
  const delta = 2; // neighbors count
  const left = Math.max(2, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);

  let l;

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i <= right)) {
      if (l && i - l > 1) {
        pageNumbers.push("...");
      }
      pageNumbers.push(i);
      l = i;
    }
  }

  return (
    <div className='flex flex-col items-center mt-6 space-y-4'>
      {/* Pagination Controls */}
      <div className='flex justify-center space-x-2'>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md border-1 border-blue-400 text-sm font-medium ${
            currentPage === 1
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Previous
        </button>
        {pageNumbers.map((page, idx) =>
          page === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className='px-3 py-1 text-sm font-medium text-gray-500 select-none'
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md border-1 border-blue-400 text-sm font-medium ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md text-sm border-1 border-blue-400 font-medium ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>
      </div>
      {/* Disclaimer */}
      {/* <p className="text-xs text-gray-600 text-center max-w-md px-4 sm:text-sm">
        Trip can only be cancelled before 12 hours to departure time.
      </p> */}
    </div>
  );
}
