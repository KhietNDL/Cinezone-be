import React from "react";

const Pagination = ({ page, totalPages, setPage }) => {
  return (
    <div className="flex items-center justify-end space-x-2 pt-4">
      <button
        onClick={() => setPage((p) => Math.max(p - 1, 1))}
        disabled={page === 1}
        className="px-3 py-1 bg-white shadow-sm rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i}
          onClick={() => setPage(i + 1)}
          className={`px-3 py-1 rounded shadow-sm ${
            page === i + 1
              ? "bg-[#6051F3] text-white"
              : "bg-white hover:bg-gray-100"
          }`}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
        disabled={page === totalPages}
        className="px-3 py-1 bg-white shadow-sm rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
