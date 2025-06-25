import React from "react";
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
  formatDate,
}) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm">
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="text-left text-slate-500 text-sm border-b border-slate-200">
            <th className="py-2 text-center pr-4 w-[100px] shrink-0">Poster</th>
            <th
              className="py-2 cursor-pointer w-[200px] shrink-0 items-center gap-1"
              onClick={() => handleSort("NameOfEnglish")}
            >
              Name Movie (ENG)
              {sortBy === "NameOfEnglish" ? (
                sortOrder === "asc" ? (
                  <MdOutlineArrowDropDown size={25} className="inline ml-1" />
                ) : (
                  <MdArrowDropUp size={25} className="inline ml-1" />
                )
              ) : (
                <MdOutlineArrowDropDown
                  size={25}
                  className="inline ml-1 text-gray-300"
                />
              )}
            </th>
            <th
              className="py-2 cursor-pointer w-[200px] shrink-0 items-center gap-1"
              onClick={() => handleSort("NameOfVietnamese")}
            >
              Name Movie (VN)
              {sortBy === "NameOfVietnamese" ? (
                sortOrder === "asc" ? (
                  <MdOutlineArrowDropDown size={25} className="inline ml-1" />
                ) : (
                  <MdArrowDropUp size={25} className="inline ml-1" />
                )
              ) : (
                <MdOutlineArrowDropDown
                  size={25}
                  className="inline ml-1 text-gray-300"
                />
              )}
            </th>
            <th
              className="py-2 text-center cursor-pointer w-[100px] shrink-0"
              onClick={() => handleSort("FromDate")}
            >
              From Date
              {sortBy === "FromDate" ? (
                sortOrder === "asc" ? (
                  <MdOutlineArrowDropDown size={25} className="inline ml-1" />
                ) : (
                  <MdArrowDropUp size={25} className="inline ml-1" />
                )
              ) : (
                <MdOutlineArrowDropDown
                  size={25}
                  className="inline ml-1 text-gray-300"
                />
              )}
            </th>
            <th
              className="py-2 pl-4 text-center cursor-pointer w-[100px] shrink-0"
              onClick={() => handleSort("ToDate")}
            >
              To Date
              {sortBy === "ToDate" ? (
                sortOrder === "asc" ? (
                  <MdOutlineArrowDropDown size={25} className="inline ml-1" />
                ) : (
                  <MdArrowDropUp size={25} className="inline ml-1" />
                )
              ) : (
                <MdOutlineArrowDropDown
                  size={25}
                  className="inline ml-1 text-gray-300"
                />
              )}
            </th>
            <th className="py-2 text-center w-[100px] shrink-0 gap-1">
              Duration
            </th>
            <th className="py-2 text-center w-[100px] shrink-0">Version</th>
            <th className="py-2 text-center w-[80px] shrink-0">Action</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((mov) => (
            <tr
              key={mov.MovieId}
              onClick={(e) => handleRowClick(mov, e)}
              className="border-b cursor-pointer border-slate-200 hover:bg-slate-100 text-sm"
            >
              <td className="py-2 text-center w-[100px] shrink-0">
                <img
                  src={mov.PosterImage}
                  alt=""
                  className="w-[80px] h-[100px] rounded-lg"
                />
              </td>
              {mov.NameOfEnglish?.length > 40 ? (
                <td className="py-2 w-[200px] shrink-0">
                  {mov.NameOfEnglish.slice(0, 40) + "..."}
                </td>
              ) : (
                <td className="py-2 w-[200px] shrink-0">{mov.NameOfEnglish}</td>
              )}
              {mov.NameOfVietnamese?.length > 25 ? (
                <td className="py-2 w-[200px] shrink-0">
                  {mov.NameOfVietnamese.slice(0, 25) + "..."}
                </td>
              ) : (
                <td className="py-2 w-[200px] shrink-0">
                  {mov.NameOfVietnamese}
                </td>
              )}
              <td className="py-2 text-center pr-4 w-[100px] shrink-0">
                {formatDate(mov.FromDate)}
              </td>
              <td className="py-2 text-center w-[100px] shrink-0">
                {formatDate(mov.ToDate)}
              </td>
              <td className="py-2 text-center w-[100px] shrink-0">
                {mov.RunningTime} mins
              </td>
              <td className="p-2 text-center break-words w-[120px] shrink-0">
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
              <td className="py-2 w-[80px] shrink-0">
                <div className="flex items-center justify-between">
                  <div
                    role="button"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <IoEyeOutline size={20} />
                  </div>
                  <div
                    role="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(mov);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit"
                  >
                    <FaRegEdit size={20} />
                  </div>
                  <div
                    role="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(mov);
                    }}
                    className="text-red-400 hover:text-red-600"
                    title="Delete"
                  >
                    <RiDeleteBin5Line size={20} />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MovieTable;
