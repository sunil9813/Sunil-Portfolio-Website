// components/common/Pagination.js
import React from "react";

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const maxVisiblePages = 5; // Number of pages to show in the pagination

  // Calculate the range of pages to display
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Adjust if we're at the start or end
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // Base button classes
  const baseButtonClass = "min-w-9 rounded-md py-2 px-3 text-center text-sm transition-all shadow-sm hover:shadow-lg ml-2";
  const normalButtonClass = `${baseButtonClass} border border-indigo-600 text-indigo-600 hover:text-white hover:bg-indigo-800 hover:border-indigo-800 focus:text-white focus:bg-indigo-800 focus:border-indigo-800 active:border-indigo-900 active:text-white active:bg-indigo-900`;
  const activeButtonClass = `${baseButtonClass} bg-indigo-500 border-indigo-500 text-white shadow-md hover:shadow-lg hover:bg-indigo-800 focus:bg-indigo-700 focus:shadow-none active:bg-indigo-900 active:shadow-none`;
  const disabledButtonClass = "pointer-events-none opacity-50 shadow-none";

  return (
    <div className="flex space-x-1">
      {/* First Page Button */}
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className={`${baseButtonClass} border border-indigo-600 text-indigo-600 hover:text-white hover:bg-indigo-800 hover:border-indigo-800 focus:text-white focus:bg-indigo-800 focus:border-indigo-800 active:border-indigo-900 active:text-white active:bg-indigo-900 ${
          currentPage === 1 ? disabledButtonClass : ""
        }`}
      >
        &laquo;
      </button>

      {/* Previous Page Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${baseButtonClass} border border-indigo-600 text-indigo-600 hover:text-white hover:bg-indigo-800 hover:border-indigo-800 focus:text-white focus:bg-indigo-800 focus:border-indigo-800 active:border-indigo-900 active:text-white active:bg-indigo-900 ${
          currentPage === 1 ? disabledButtonClass : ""
        }`}
      >
        Prev
      </button>

      {/* First Page Ellipsis */}
      {startPage > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className={normalButtonClass}>
            1
          </button>
          {startPage > 2 && <span className="px-2 flex items-center text-indigo-600">...</span>}
        </>
      )}

      {/* Page Numbers */}
      {pageNumbers.map((number) => (
        <button key={number} onClick={() => onPageChange(number)} className={number === currentPage ? activeButtonClass : normalButtonClass}>
          {number}
        </button>
      ))}

      {/* Last Page Ellipsis */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2 flex items-center text-indigo-600">...</span>}
          <button onClick={() => onPageChange(totalPages)} className={normalButtonClass}>
            {totalPages}
          </button>
        </>
      )}

      {/* Next Page Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${baseButtonClass} border border-indigo-600 text-indigo-600 hover:text-white hover:bg-indigo-800 hover:border-indigo-800 focus:text-white focus:bg-indigo-800 focus:border-indigo-800 active:border-indigo-900 active:text-white active:bg-indigo-900 ${
          currentPage === totalPages ? disabledButtonClass : ""
        }`}
      >
        Next
      </button>

      {/* Last Page Button */}
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className={`${baseButtonClass} border border-indigo-600 text-indigo-600 hover:text-white hover:bg-indigo-800 hover:border-indigo-800 focus:text-white focus:bg-indigo-800 focus:border-indigo-800 active:border-indigo-900 active:text-white active:bg-indigo-900 ${
          currentPage === totalPages ? disabledButtonClass : ""
        }`}
      >
        &raquo;
      </button>
    </div>
  );
};
