import { IoEyeOutline } from "react-icons/io5";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdOutlineArrowDropDown, MdArrowDropUp } from "react-icons/md";

const MovieTable = ({
  movies,
  handleSort,
  sortBy,
  sortOrder,
  handleEdit,
  handleDelete,
  handleRowClick,
  openAddShowtimePopup,
}) => {
  return (
    <div className="hidden sm:block">
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left text-slate-600 text-xs sm:text-sm border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-purple-50/30">
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 w-[100px] shrink-0">
                Poster
              </th>
              <th
                className="py-3 px-4 cursor-pointer text-left text-sm font-semibold text-gray-600 md:w-[150px] lg:w-[160px] xl:w-[200px] shrink-0 hover:text-purple-600 transition-colors duration-200 select-none"
                onClick={() => handleSort("NameOfEnglish")}
              >
                <div className="flex items-center">
                  Full Name
                  <span className="ml-1 inline-block align-middle">
                    {sortBy === "NameOfEnglish" ? (
                      sortOrder === "asc" ? (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="inline text-purple-600"
                        >
                          <path d="M10 6l-4 4h8l-4-4z" />
                        </svg>
                      ) : (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="inline text-purple-600"
                        >
                          <path d="M10 14l4-4H6l4 4z" />
                        </svg>
                      )
                    ) : (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="inline opacity-30"
                      >
                        <path d="M10 6l-4 4h8l-4-4z" />
                      </svg>
                    )}
                  </span>
                </div>
              </th>
              <th
                className="py-3 px-4 hidden xl:table-cell cursor-pointer text-left text-sm font-semibold text-gray-600 w-[200px] shrink-0 hover:text-purple-600 transition-colors duration-200 select-none"
                onClick={() => handleSort("NameOfVietnamese")}
              >
                <div className="flex items-center">
                  Name Movie (VN)
                  <span className="ml-1 inline-block align-middle">
                    {sortBy === "NameOfVietnamese" ? (
                      sortOrder === "asc" ? (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="inline text-purple-600"
                        >
                          <path d="M10 6l-4 4h8l-4-4z" />
                        </svg>
                      ) : (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="inline text-purple-600"
                        >
                          <path d="M10 14l4-4H6l4 4z" />
                        </svg>
                      )
                    ) : (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="inline opacity-30"
                      >
                        <path d="M10 6l-4 4h8l-4-4z" />
                      </svg>
                    )}
                  </span>
                </div>
              </th>
              <th
                className="py-3 px-4 text-left cursor-pointer text-sm font-semibold text-gray-600 lg:w-[120px] w-[140px] shrink-0 hover:text-purple-600 transition-colors duration-200 select-none"
                onClick={() => handleSort("FromDate")}
              >
                <div className="flex items-center">
                  From Date
                  <span className="ml-1 inline-block align-middle">
                    {sortBy === "FromDate" ? (
                      sortOrder === "asc" ? (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="inline text-purple-600"
                        >
                          <path d="M10 6l-4 4h8l-4-4z" />
                        </svg>
                      ) : (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="inline text-purple-600"
                        >
                          <path d="M10 14l4-4H6l4 4z" />
                        </svg>
                      )
                    ) : (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="inline opacity-30"
                      >
                        <path d="M10 6l-4 4h8l-4-4z" />
                      </svg>
                    )}
                  </span>
                </div>
              </th>
              <th
                className="py-3 px-4 text-left cursor-pointer text-sm font-semibold text-gray-600 lg:w-[120px] w-[140px] shrink-0 hover:text-purple-600 transition-colors duration-200 select-none"
                onClick={() => handleSort("ToDate")}
              >
                <div className="flex items-center">
                  To Date
                  <span className="ml-1 inline-block align-middle">
                    {sortBy === "ToDate" ? (
                      sortOrder === "asc" ? (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="inline text-purple-600"
                        >
                          <path d="M10 6l-4 4h8l-4-4z" />
                        </svg>
                      ) : (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="inline text-purple-600"
                        >
                          <path d="M10 14l4-4H6l4 4z" />
                        </svg>
                      )
                    ) : (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="inline opacity-30"
                      >
                        <path d="M10 6l-4 4h8l-4-4z" />
                      </svg>
                    )}
                  </span>
                </div>
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 w-[100px] lg:w-[80px] xl:w-[100px] shrink-0">
                Duration
              </th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 w-[120px] shrink-0 hidden xl:table-cell">
                Version
              </th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 w-[140px] shrink-0">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {movies.map((mov) => (
              <tr
                key={mov.MovieId}
                onClick={(e) => handleRowClick(mov, e)}
                className="border-b cursor-pointer border-gray-200 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 text-xs sm:text-sm transition-all duration-200 group"
              >
                <td className="py-3 px-4 w-[100px] shrink-0">
                  <div className="flex justify-start">
                    <img
                      src={mov.PosterImage}
                      alt=""
                      className="w-[70px] h-[90px] rounded-lg shadow-md object-cover border border-gray-200"
                    />
                  </div>
                </td>
                {mov.NameOfEnglish?.length > 30 ? (
                  <td className="py-3 px-4 lg:w-[160px] xl:w-[200px] shrink-0 md:w-[150px]">
                    <span className="block font-medium text-gray-800 group-hover:text-purple-700 transition-colors duration-200">
                      <span title={mov.NameOfEnglish}>
                        {mov.NameOfEnglish.slice(0, 30) + "..."}
                      </span>
                    </span>
                  </td>
                ) : (
                  <td className="py-3 px-4 lg:w-[160px] xl:w-[200px] shrink-0 md:w-[150px]">
                    <span className="block font-medium text-gray-800 group-hover:text-purple-700 transition-colors duration-200">
                      {mov.NameOfEnglish}
                    </span>
                  </td>
                )}
                {mov.NameOfVietnamese?.length > 25 ? (
                  <td className="py-3 px-4 hidden xl:table-cell w-[200px] shrink-0">
                    <span className="block text-gray-600">
                      <span title={mov.NameOfVietnamese}>
                        {mov.NameOfVietnamese.slice(0, 25) + "..."}
                      </span>
                    </span>
                  </td>
                ) : (
                  <td className="py-3 px-4 w-[200px] hidden xl:table-cell shrink-0">
                    <span className="block text-gray-600">
                      {mov.NameOfVietnamese}
                    </span>
                  </td>
                )}
                <td className="py-3 px-4 w-[140px] shrink-0 text-gray-600">
                  {mov.FromDate ? mov.FromDate.split(" ")[0] : ""}
                </td>
                <td className="py-3 px-4 w-[140px] shrink-0 text-gray-600">
                  {mov.ToDate ? mov.ToDate.split(" ")[0] : ""}
                </td>
                <td className="py-3 px-4 w-[100px] lg:w-[80px] xl:w-[100px] shrink-0 text-gray-600">
                  {mov.RunningTime} mins
                </td>
                <td className="py-3 px-4 hidden xl:table-cell w-[120px] shrink-0">
                  {Array.isArray(mov.versions) && mov.versions?.length > 0
                    ? mov.versions.map((v, idx) => (
                        <span key={idx}>
                          {v.VersionType}
                          {v.Language ? ` - ${v.Language}` : ""}
                          {idx < mov.versions?.length - 1 ? ", " : ""}
                        </span>
                      ))
                    : mov.Version
                    ? (() => {
                        try {
                          const arr = JSON.parse(mov.Version);
                          if (Array.isArray(arr) && arr?.length > 0) {
                            return arr.map((v, idx) => (
                              <span key={idx}>
                                {v.VersionType}
                                {v.Language ? ` - ${v.Language}` : ""}
                                {idx < arr?.length - 1 ? ", " : ""}
                              </span>
                            ));
                          }
                          return mov.Version;
                        } catch {
                          return mov.Version;
                        }
                      })()
                    : "N/A"}
                </td>
                <td className="py-3 px-4 w-[140px] shrink-0">
                  <div className="flex justify-center space-x-1 sm:space-x-2">
                    <button
                      className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                      title="View Movie"
                    >
                      <IoEyeOutline size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(mov);
                      }}
                      className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                      title="Edit Movie"
                    >
                      <FaRegEdit size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(mov);
                      }}
                      className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                      title="Delete Movie"
                    >
                      <RiDeleteBin5Line size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openAddShowtimePopup(mov);
                      }}
                      className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-green-500 hover:text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-200 transform hover:scale-110 shadow-sm hover:shadow-md"
                      title="Add Showtime"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MovieTable;
