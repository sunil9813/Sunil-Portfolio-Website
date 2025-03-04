import { useState } from "react";
import { Button, Typography } from "@material-tailwind/react";
import PropTypes from "prop-types";

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [page, setPage] = useState(currentPage || 1);

  // Handle page change and call the onPageChange callback
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
      onPageChange(newPage); // Pass the new page number to the parent component
    }
  };

  // Calculate the start and end page numbers for the pagination
  const getPageRange = () => {
    const start = Math.max(page - 2, 1); // Ensure we start at page 1 or two pages before the current
    const end = Math.min(start + 2, totalPages); // Ensure we only display up to 5 pages

    const range = [];
    for (let i = start; i <= end; i++) {
      range.push(i);
    }

    return range;
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-50/10 p-4">
      <Typography variant="small" className="font-normal text-textcolor">
        Page {page} of {totalPages}
      </Typography>
      <div className="flex gap-2 opacity-75">
        <div className="flex space-x-2">
          {/* Prev Button */}
          <Button variant="outlined" size="sm" color="white" onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
            Prev
          </Button>

          {/* Dynamic page buttons */}
          {getPageRange().map((pageNumber) => (
            <Button key={pageNumber} variant="outlined" size="sm" color="white" onClick={() => handlePageChange(pageNumber)} className={page === pageNumber ? "bg-white text-black" : ""}>
              {pageNumber}
            </Button>
          ))}

          {/* Ellipsis before last page */}
          {page < totalPages - 2 && <span className="text-white">...</span>}

          {/* Last page button */}
          {page < totalPages - 1 && (
            <Button size="sm" color="white" onClick={() => handlePageChange(totalPages)}>
              {totalPages}
            </Button>
          )}

          {/* Next Button */}
          <Button variant="outlined" size="sm" color="white" onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};
