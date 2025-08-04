import React from "react";
import { Card, Badge, Switch } from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { FaUser, FaIdCard, FaPhone, FaEnvelope, FaStar, FaExchangeAlt } from "react-icons/fa";
import { FaFire } from "react-icons/fa6";
import { BiSolidDiscount } from "react-icons/bi";
import { IoSearch, IoAddOutline } from "react-icons/io5";
import { FiLoader } from "react-icons/fi";
import { MdCancel } from "react-icons/md";
import { Field } from "formik";
import { toast } from "react-toastify";
import MemberRank from "../../component/MemberRank";

const MemberInformationCard = ({
  memberChecked,
  member,
  isSearching,
  handleMemberSearch,
  handleAddPromotion,
  values,
  setFieldValue,
  discount,
  setDiscount,
  discountTicket
}) => {
  return (
    <Card className="shadow-lg border-0 rounded-xl overflow-hidden">
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
            <FaUser className="text-white text-sm" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Member Information
            </h2>
            <p className="text-gray-600 text-sm">
              Search and verify member
            </p>
          </div>
          {memberChecked && (
            <Badge
              count={<CheckOutlined style={{ color: "#52c41a" }} />}
              className="ml-auto"
            />
          )}
        </div>
      </div>

      <div className="p-3">
        <div className="flex gap-3 items-center justify-center mb-4">
          <Field
            name="memberSearch"
            type="text"
            placeholder="Email / Phone / ID"
            className="w-full flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => handleMemberSearch(values.memberSearch)}
            disabled={isSearching}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-full hover:from-purple-700 hover:to-purple-800 disabled:bg-gray-400 flex items-center gap-2 cursor-pointer transition-all duration-300"
          >
            {isSearching ? (
              <>
                <FiLoader className="animate-spin h-4 w-4 text-white" /> Checking...
              </>
            ) : (
              <>
                <IoSearch className="text-xl" /> Check
              </>
            )}
          </button>
        </div>
        {memberChecked && member && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 flex items-center gap-2">
                    <FaIdCard /> Identity card:
                  </p>
                  <p className="font-medium">{member.identityCard}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 flex items-center gap-2">
                    <FaUser /> Full Name:
                  </p>
                  <p className="font-medium">{member.fullName}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 flex items-center gap-2">
                    <FaPhone /> Phone:
                  </p>
                  <p className="font-medium">{member.phone}</p>
                </div>
                <div className="flex items-start justify-between">
                  <p className="text-gray-600 flex items-center gap-2 min-w-[80px]">
                    <FaEnvelope /> Email:
                  </p>
                  <p className="font-medium text-right break-all">{member.email}</p>
                </div>
                <div>
                  <MemberRank
                    rank={member.rank}
                    pointsMemberShip={member.pointsMemberShip}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600 flex items-center gap-2">
                    <FaStar /> Points:
                  </p>
                  <p className={`font-medium flex items-center gap-1 ${member.score ? "text-green-600" : "text-red-600"}`}>
                    <FaFire /> {member.score ? member.score : 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between">
              <label className="text-gray-700 flex items-center gap-2 sm:w-[80%] w-full">
                <FaExchangeAlt /> Convert points to tickets:
                <span className="text-red-500">*</span>
              </label>
              <Field name="convertToTicket">
                {({ field }) => (
                  <Switch
                    style={{ width: "100px" }}
                    checked={field.value === "Agree"}
                    onChange={(checked) => {
                      setFieldValue("convertToTicket", checked ? "Agree" : "Disagree");
                    }}
                    checkedChildren="Agree"
                    unCheckedChildren="Disagree"
                  />
                )}
              </Field>
            </div>
            <div>
              <label className="text-gray-700 mb-2 text-lg font-semibold flex items-center gap-2">
                <BiSolidDiscount /> Promotion code:
              </label>
              <div className="flex gap-3 items-center justify-center">
                <div className="relative w-full flex-1">
                  <Field
                    name="promotionCode"
                    type="text"
                    disabled={values.convertToTicket === "Agree"}
                    placeholder="Enter promotion code"
                    className="w-full border border-gray-300 rounded-full px-4 py-2 pr-10 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                  />
                  {discount && values.convertToTicket === "Disagree" && values.promotionCode && (
                    <button
                      type="button"
                      onClick={() => {
                        setDiscount(null);
                        setFieldValue("promotionCode", "");
                        toast.success("Promotion code removed");
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                    >
                      <MdCancel className="text-xl" />
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleAddPromotion(values.promotionCode, setFieldValue)}
                  disabled={values.convertToTicket === "Agree" || !values.promotionCode}
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-full hover:from-purple-700 hover:to-purple-800 disabled:bg-gray-400 cursor-pointer flex items-center gap-1 transition-all duration-300"
                >
                  <IoAddOutline className="text-xl" /> Add
                </button>
              </div>
              {discountTicket > 0 && (
                <p className="mt-2 text-blue-600">Membership discount applied: {discountTicket}%</p>
              )}
              {discount && values.convertToTicket === "Disagree" && (
                <p className="mt-2 text-green-600">Promotion code discount applied: {discount}%</p>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default MemberInformationCard; 