import React from "react";
import { Field } from "formik";
import { Button, Switch } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import {
  FaUser,
  FaIdCard,
  FaEnvelope,
  FaPhone,
  FaStar,
  FaExchangeAlt,
  FaFire,

} from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { BiSolidDiscount } from "react-icons/bi";
import { IoSearch, IoAddOutline } from "react-icons/io5";
import { FiLoader } from "react-icons/fi";
import MemberRank from "../../component/MemberRank";

const MemberSearchSection = ({
  values,
  setFieldValue,
  memberChecked,
  member,
  discount,
  discountTicket,
  isSearching,
  handleMemberSearch,
  handleAddPromotion,
  setDiscount,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-bold flex items-center gap-3 text-gray-800">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <FaUser className="text-purple-600" />
          </div>
          Member Search
        </h2>
      </div>

      <div className="p-6 space-y-4 flex-1">
        {/* Search Input */}
        <div className="flex gap-3 w-full">
          <Field
            name="memberSearch"
            type="text"
            placeholder="Email / Phone / ID "
            className="w-full flex-1 focus:outline-none border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-0 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 hover:border-purple-400"
          />
          <Button
            type="primary"
            onClick={() => handleMemberSearch(values.memberSearch)}
            loading={isSearching}
            icon={<IoSearch />}
            style={{ height: "40px" }}
            className="bg-purple-600 hover:bg-purple-700 border-purple-600 hover:border-purple-700 flex items-center justify-center"
          >
            Search
          </Button>
        </div>

        {/* Member Information Display */}
        {memberChecked && member && (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckOutlined className="text-green-600 text-xs" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">Member Found</h3>
            </div>

            {/* Member Details Grid */}
            <div className="grid grid-cols-1 gap-3 mb-4">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-xs font-medium flex items-center gap-2">
                    <FaIdCard className="text-purple-600" />
                    Identity Card
                  </span>
                  <span className="font-semibold text-gray-800 text-xs">
                    {member.identityCard}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-xs font-medium flex items-center gap-2">
                    <FaUser className="text-purple-600" />
                    Full Name
                  </span>
                  <span className="font-semibold text-gray-800 text-xs">
                    {member.fullName}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-start justify-between">
                  <p className="text-gray-600 text-xs font-medium flex items-center justify-start gap-2 w-[40%]">
                    <FaEnvelope className="text-purple-600" />
                    Email
                  </p>
                  <p className="font-semibold text-gray-800 text-xs text-right break-all">
                    {member.email}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-xs font-medium flex items-center gap-2">
                    <FaPhone className="text-purple-600" />
                    Phone Number
                  </span>
                  <span className="font-semibold text-gray-800 text-xs">
                    {member.phone}
                  </span>
                </div>
              </div>

              {/* Member Rank */}
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <MemberRank
                  rank={member.rank}
                  pointsMemberShip={member.pointsMemberShip}
                />
              </div>

              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-xs font-medium flex items-center gap-2">
                    <FaStar className="text-purple-600" />
                    Available Points
                  </span>
                  <span
                    className={`font-semibold flex items-center gap-1 text-xs ${member.score ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    <FaFire className="text-orange-500" />
                    {member.score || 0} pts
                  </span>
                </div>
              </div>
            </div>

            {/* Convert Points Section */}
            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-3">
              <div className="flex items-center justify-between">
                <label className="text-gray-700 flex items-center gap-2 font-medium text-sm">
                  <FaExchangeAlt className="text-purple-600" />
                  Use Points for Payment
                  <span className="text-red-500">*</span>
                </label>
                <Field name="convertToTicket">
                  {({ field }) => (
                    <Switch
                      checked={field.value === "Agree"}
                      onChange={(checked) => {
                        setFieldValue(
                          "convertToTicket",
                          checked ? "Agree" : "Disagree"
                        );
                      }}
                      checkedChildren="Yes"
                      unCheckedChildren="No"
                      className="bg-gray-300"
                    />
                  )}
                </Field>
              </div>
              {values.convertToTicket === "Agree" && (
                <div className="mt-2 p-2 bg-orange-50 rounded text-orange-700 text-xs">
                  💡 Rate: 1 point = 1,000 VNĐ
                </div>
              )}
            </div>

            {/* Promotion Code Section */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <label className="text-gray-700 mb-3 font-medium flex items-center gap-2 text-sm">
                <BiSolidDiscount className="text-purple-600" />
                Promotion Code
              </label>
              <div className="flex gap-2 w-full">
                <Field
                  name="promotionCode"
                  type="text"
                  disabled={values.convertToTicket === "Agree"}
                  placeholder="Enter promotion code"
                  className="flex-1 focus:outline-none min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-0 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:text-gray-500 transition-all duration-200 hover:border-purple-400"
                />
                {!discount ? (
                  <Button
                    type="primary"
                    style={{ height: "40px" }}
                    onClick={() =>
                      handleAddPromotion(values.promotionCode, setFieldValue)
                    }
                    disabled={
                      values.convertToTicket === "Agree" || !values.promotionCode
                    }
                    icon={<IoAddOutline />}
                    className="bg-purple-600 hover:bg-purple-700 border-purple-600 hover:border-purple-700 px-3 h-10 flex items-center justify-center flex-shrink-0"
                  >
                    Apply
                  </Button>
                ) : (
                  <Button
                    type="default"
                    style={{ height: "40px" }}
                    danger
                    onClick={() => {
                      setDiscount(null);
                      setFieldValue("promotionCode", "");
                    }}
                    icon={<FaX />}
                    className="px-3 h-10 flex items-center justify-center flex-shrink-0"
                  >
                    Remove
                  </Button>
                )}
              </div>

              {/* Discount Information */}
              {discountTicket > 0 && (
                <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <CheckOutlined className="text-white text-xs" />
                    </div>
                    <span className="text-blue-700 text-xs font-medium">
                      Membership discount: {discountTicket}% applied
                    </span>
                  </div>
                </div>
              )}

              {discount && values.convertToTicket === "Disagree" && (
                <div className="mt-3 p-2 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckOutlined className="text-white text-xs" />
                    </div>
                    <span className="text-green-700 text-xs font-medium">
                      Promotion discount: {discount}% applied
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberSearchSection; 