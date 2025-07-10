import React from "react";

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
  const renderPaginationButtons = () => {
    const maxVisibleButtons = window.innerWidth < 640 ? 3 : 5; // 3 buttons on mobile, 5 on larger screens
    const halfVisible = Math.floor(maxVisibleButtons / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    if (currentPage <= halfVisible) {
      endPage = Math.min(maxVisibleButtons, totalPages);
    }
    if (currentPage + halfVisible >= totalPages) {
      startPage = Math.max(1, totalPages - maxVisibleButtons + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={`page-${i}`}
          onClick={() => handlePageChange(i)}
          className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
            currentPage === i
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm"
          }`}
          aria-label={`Page ${i}`}
          aria-current={currentPage === i ? "true" : undefined}
        >
          {i}
        </button>
      );
    }

    if (startPage > 1) {
      pages.unshift(
        <span
          key="ellipsis-start"
          className="px-2 sm:px-3 py-1 sm:py-2 text-gray-500 text-sm sm:text-base"
        >
          ...
        </span>
      );
      pages.unshift(
        <button
          key="page-1"
          onClick={() => handlePageChange(1)}
          className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
            currentPage === 1
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm"
          }`}
          aria-label="Page 1"
        >
          1
        </button>
      );
    }
    if (endPage < totalPages) {
      pages.push(
        <span
          key="ellipsis-end"
          className="px-2 sm:px-3 py-1 sm:py-2 text-gray-500 text-sm sm:text-base"
        >
          ...
        </span>
      );
      pages.push(
        <button
          key={`page-${totalPages}`}
          onClick={() => handlePageChange(totalPages)}
          className={`px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-colors ${
            currentPage === totalPages
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm"
          }`}
          aria-label={`Page ${totalPages}`}
        >
          {totalPages}
        </button>
      );
    }

    return pages.length > 0 ? (
      pages
    ) : (
      <span className="text-gray-500 text-sm">No pages to display</span>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-2 py-4">
      <div className="flex items-center space-x-1 sm:space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base font-medium bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          Previous
        </button>
        {renderPaginationButtons()}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 sm:px-4 py-1 sm:py-2 rounded-lg text-sm sm:text-base font-medium bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          Next
        </button>
      </div>
      <span className="text-gray-500 text-sm sm:text-base">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};

export default Pagination;
