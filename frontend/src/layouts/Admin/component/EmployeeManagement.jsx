import React, { useState } from "react";
import { GoPlus } from "react-icons/go";
import { IoCloseSharp, IoTime, IoSearchOutline } from "react-icons/io5";
import { IoMdPersonAdd, IoMdRefresh } from "react-icons/io";
import { MdPeopleAlt } from "react-icons/md";
const EmployeeManagement = () => {
  const employeeData = [
    {
      username: "john.doe",
      fullName: "Lê Thị Minh",
      dateOfBirth: "1990-05-19",
      gender: "Male",
      email: "john.doe@email.com",
      idCard: "ID123456789",
      phone: "0215206154",
      address: "123 Main St, NY",
      registerDate: "2022-04-15",
    },
    {
      username: "sara.connor",
      fullName: "Vũ Văn An",
      dateOfBirth: "1987-11-30",
      gender: "Female",
      email: "sara.connor@email.com",
      idCard: "ID876543210",
      phone: "0551026066",
      address: "456 Oak Ave, LA",
      registerDate: "2023-01-12",
    },
    {
      username: "alex.lee",
      fullName: "Nguyễn Văn Bình",
      dateOfBirth: "1995-03-21",
      gender: "Male",
      email: "alex.lee@email.com",
      idCard: "ID321654987",
      phone: "0510005051",
      address: "789 Pine Rd, SF",
      registerDate: "2024-05-01",
    },
    {
      username: "emma.watson",
      fullName: "Phạm Thị Hương",
      dateOfBirth: "1992-08-15",
      gender: "Female",
      email: "emma.watson@email.com",
      idCard: "ID987123654",
      phone: "0510050051",
      address: "321 Cedar St, TX",
      registerDate: "2021-10-22",
    },
    {
      username: "emma.watson",
      fullName: "Vũ Quân",
      dateOfBirth: "1992-08-15",
      gender: "Female",
      email: "emma.watson@email.com",
      idCard: "ID987123654",
      phone: "0511239456",
      address: "321 Cedar St, TX",
      registerDate: "2021-10-22",
    },
    {
      username: "sara.connor",
      fullName: "Akira Phan",
      dateOfBirth: "1987-11-30",
      gender: "Female",
      email: "sara.connor@email.com",
      idCard: "ID876543210",
      phone: "0145789456",
      address: "456 Oak Ave, LA",
      registerDate: "2023-01-12",
    },
  ];
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(employeeData.length / itemsPerPage);
  return (
    <div className="p-[20px] flex items-center justify-between w-[80%]">
      <div className="w-[70%] space-y-4">
        <div className="flex items-center justify-between w-full">
          <div className="bg-white rounded-md p-3  w-[23%] shadow-sm ">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">Total Employees</p>

              <div className="p-2 bg-sky-100 rounded-full">
                <MdPeopleAlt size={20} color="blue" />
              </div>
            </div>
            <div className="font-bold text-[19px]">25,340</div>
          </div>
          <div className="bg-white rounded-md p-3  w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">On Leave</p>

              <div className="p-2 bg-rose-50 rounded-full">
                <IoTime size={20} color="red" />
              </div>
            </div>
            <div className="font-bold text-[19px]">25,340</div>
          </div>
          <div className="bg-white rounded-md p-3  w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">New Hires</p>

              <div className="p-2 bg-sky-100 rounded-full">
                <IoMdPersonAdd size={20} color="blue" />
              </div>
            </div>
            <div className="font-bold text-[19px]">25,340</div>
          </div>
          <div className="bg-white rounded-md p-3  w-[23%] shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-slate-500">Resigned</p>

              <div className="p-2 bg-rose-50 rounded-full">
                <IoCloseSharp size={20} color="red" />
              </div>
            </div>
            <div className="font-bold text-[19px]">25,340</div>
          </div>
        </div>
        <div className="w-full py-3 space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-full">
              <div className="flex items-center p-1 px-2 w-2/4 rounded-xl bg-white shadow-sm">
                <div className="shrink-0">
                  <IoSearchOutline size={20} />
                </div>
                <input
                  type="text"
                  className="p-2 focus:outline-none w-full"
                  placeholder="Search by name or email"
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div
                role="button"
                className="flex items-center text-[#6051F3] hover:bg-slate-50 p-2 rounded-md active:bg-slate-100 bg-white shadow-sm"
              >
                <GoPlus size={20} className="mr-2" />
                Employee
              </div>
              <div
                role="button"
                className="flex items-center hover:bg-slate-50 p-2 text-slate-500 rounded-md active:bg-slate-100 bg-white shadow-sm"
              >
                <IoMdRefresh size={20} className="mr-2" /> Refresh
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-md shadow-sm">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="text-left text-slate-500 text-sm border-b">
                  <th className="py-2">User Name</th>
                  <th className="py-2">Full Name</th>
                  <th className="py-2">Date of Birth</th>
                  <th className="py-2">Gender</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">ID Card</th>
                  <th className="py-2">Phone</th>
                  <th className="py-2">Address</th>
                  <th className="py-2">Register Date</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {employeeData
                  .slice((page - 1) * itemsPerPage, page * itemsPerPage)
                  .map((emp, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-slate-50 text-sm"
                    >
                      <td className="py-2">{emp.username}</td>
                      <td className="py-2">{emp.fullName}</td>
                      <td className="py-2">{emp.dateOfBirth}</td>
                      <td className="py-2">{emp.gender}</td>
                      <td className="py-2">{emp.email}</td>
                      <td className="py-2">{emp.idCard}</td>
                      <td className="py-2">{emp.phone}</td>
                      <td className="py-2">{emp.address}</td>
                      <td className="py-2">{emp.registerDate}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* pagination */}
          <div className="flex items-center justify-end space-x-2 pt-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1 bg-white shadow-sm rounded hover:bg-slate-100"
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
                    : "bg-white hover:bg-slate-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              className="px-3 py-1 bg-white shadow-sm rounded hover:bg-slate-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center w-[30%]">
        <div className="bg-white p-5 px-10 rounded-[20px] space-y-4 shadow-sm">
          <p className="font-bold">Attendance Overview</p>
          <div className="w-full space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-slate-500 text-[14px]">Poster title</p>
              <p className="text-slate-500 text-[14px]">Tickets</p>
            </div>
            <div className="flex items-center justify-between text-[14px] font-bold ">
              <div className="flex items-center w-[75%]">
                <img
                  src="https://www.w3schools.com/howto/img_avatar.png"
                  alt="avatar"
                  loading="lazy"
                  className="w-[50px] h-[50px] object-cover rounded-md mr-2"
                />
                <p>Phim hay</p>
              </div>
              <p>3,210</p>
            </div>
            <div className="flex items-center justify-between text-[14px] font-bold ">
              <div className="flex items-center w-[75%]">
                <img
                  src="https://www.w3schools.com/howto/img_avatar.png"
                  alt="avatar"
                  loading="lazy"
                  className="w-[50px] h-[50px] object-cover rounded-md mr-2"
                />
                <p>Phim hay</p>
              </div>
              <p>3,210</p>
            </div>
            <div className="flex items-center justify-between text-[14px] font-bold ">
              <div className="flex items-center w-[75%]">
                <img
                  src="https://www.w3schools.com/howto/img_avatar.png"
                  alt="avatar"
                  loading="lazy"
                  className="w-[50px] h-[50px] object-cover rounded-md mr-2"
                />
                <p>Phim hay</p>
              </div>
              <p>3,210</p>
            </div>
            <div className="flex items-center justify-between text-[14px] font-bold ">
              <div className="flex items-center w-[75%]">
                <img
                  src="https://www.w3schools.com/howto/img_avatar.png"
                  alt="avatar"
                  loading="lazy"
                  className="w-[50px] h-[50px] object-cover rounded-md mr-2"
                />
                <p>Phim hay</p>
              </div>
              <p>3,210</p>
            </div>
            <div className="flex items-center justify-between text-[14px] font-bold ">
              <div className="flex items-center w-[75%]">
                <img
                  src="https://www.w3schools.com/howto/img_avatar.png"
                  alt="avatar"
                  loading="lazy"
                  className="w-[50px] h-[50px] object-cover rounded-md mr-2"
                />
                <p>Phim hay quá...</p>
              </div>
              <p>3,210</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeManagement;
