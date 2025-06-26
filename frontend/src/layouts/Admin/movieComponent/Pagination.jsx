import React from "react";

const Pagination = ({ currentPage, totalPages, handlePageChange }) => {
  const renderPaginationButtons = () => {
    const maxVisibleButtons = 5;
    const halfVisible = Math.floor(maxVisibleButtons / 2);
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    if (currentPage <= halfVisible)
      endPage = Math.min(maxVisibleButtons, totalPages);
    if (currentPage + halfVisible >= totalPages)
      startPage = Math.max(1, totalPages - maxVisibleButtons + 1);

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={`page-${i}`}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 rounded cursor-pointer ${
            currentPage === i
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
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
        <button
          key="ellipsis-start"
          className="px-4 py-2 bg-gray-200 rounded cursor-default"
          disabled
        >
          ...
        </button>
      );
      pages.unshift(
        <button
          key="page-1"
          onClick={() => handlePageChange(1)}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          aria-label="Page 1"
        >
          1
        </button>
      );
    }
    if (endPage < totalPages) {
      pages.push(
        <button
          key="ellipsis-end"
          className="px-4 py-2 bg-gray-200 rounded cursor-default"
          disabled
        >
          ...
        </button>
      );
      pages.push(
        <button
          key={`page-${totalPages}`}
          onClick={() => handlePageChange(totalPages)}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
          aria-label={`Page ${totalPages}`}
        >
          {totalPages}
        </button>
      );
    }

    return pages.length > 0 ? pages : <span>No pages to display</span>;
  };

  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-200 cursor-pointer rounded disabled:opacity-50 hover:bg-gray-300"
        aria-label="Previous page"
      >
        Previous
      </button>
      {renderPaginationButtons()}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-200 cursor-pointer rounded disabled:opacity-50 hover:bg-gray-300"
        aria-label="Next page"
      >
        Next
      </button>
      <span className="ml-4 text-gray-500 text-sm">
        Page {currentPage} of {totalPages}
      </span>
    </div>
  );
};

export default Pagination;
