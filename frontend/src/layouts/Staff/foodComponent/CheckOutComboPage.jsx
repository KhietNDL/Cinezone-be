import React, { useState, useMemo } from 'react';
import { Button, Table, Input, Select, Image } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createCashPaymentForProduct, createProductHold, createMomoPaymentForProducts } from '../../../services/APIForStaff/API';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes } from "react-icons/fa";
import { FaArrowLeft, FaMoneyBillWave } from "react-icons/fa6";
import momo from "../../../assets/momo-seeklogo.png";
import vnpay from "../../../assets/vnpay-seeklogo.png";
import zalopay from "../../../assets/zalopay-seeklogo.svg";
import './ComboPage.css';
import { useSelector, useDispatch } from "react-redux";
import { clearComboCart, clearOrderInfo, setOrderInfo } from "../../../redux/features/comboSlice";

const { Option } = Select;

const PAYMENT_METHODS = [
  {
    value: "Cash",
    label: "Cash",
    icon: <FaMoneyBillWave className="text-3xl mx-auto mb-2" />,
    color: "bg-[#F3E8FF] border border-pink-300 ring-4 ring-pink-400 focus:ring-4",
  },
  {
    value: "Momo",
    label: "Momo",
    icon: <img src={momo} alt="Momo" className="h-8 mx-auto mb-2" />,
    color: "bg-[#F3E8FF] border border-pink-300 ring-4 ring-pink-400 focus:ring-4",
  },
  {
    value: "VNPay",
    label: "VNPay",
    icon: <img src={vnpay} alt="VNPay" className="h-8 mx-auto mb-2" />,
    color: "bg-[#F3E8FF] border border-pink-300 ring-4 ring-pink-400 focus:ring-4",
  },
  {
    value: "ZaloPay",
    label: "ZaloPay",
    icon: <img src={zalopay} alt="ZaloPay" className="h-8 mx-auto mb-2" />,
    color: "bg-[#F3E8FF] border border-pink-300 ring-4 ring-pink-400 focus:ring-4",
  },
];

export default function CheckOutComboPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const cart = useSelector(state => state.combo.cart) || [];
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const dispatch = useDispatch();

  const formatPrice = (price) => price?.toLocaleString('vi-VN');

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const handlePayment = async () => {
    if (!Array.isArray(cart) || cart.length === 0) {
      toast.warning("Cart rỗng hoặc thiếu mã đơn hàng.");
      return;
    }

    try {
      setLoading(true);

      const userId = user?.userId || user?.id;
      if (!userId) {
        toast.error("Không tìm thấy thông tin người dùng");
        return;
      }

      const productsForApi = cart.map(item => ({
        ProductId: item.id,
        Quantity: item.quantity
      }));

      const holdResponse = await createProductHold(userId, productsForApi, "Payment for combo");
      dispatch(setOrderInfo({
        orderProductId: holdResponse.OrderProductId,
        totalAmount: totalPrice,
      }));

      if (paymentMethod === "Cash") {
        await Promise.all([
          createCashPaymentForProduct(holdResponse.OrderProductId, totalPrice, "Payment for combo"),
          // confirmProducts(holdResponse.OrderProductId)
        ]);
        toast.success("Thanh toán thành công!");
        // navigate("/staff/combo-selling/combo-information");
        navigate("/staff/combo-selling/combo-information", {
          state: {
            cart, // truyền giỏ hàng sang trang thông tin
            status: "success"
          }
        });
      } else if (paymentMethod === "Momo") {
        const momoResponse = await createMomoPaymentForProducts(
          holdResponse.OrderProductId,
          totalPrice,
          `${window.location.origin}/staff/combo-selling/combo-information`
        );
        if (momoResponse?.data?.payUrl) {
          window.location.href = momoResponse.data.payUrl;
        } else {
          toast.error("Không thể lấy đường dẫn thanh toán Momo.");
        }
      } else {
        toast.info(`Phương thức thanh toán '${paymentMethod}' chưa được tích hợp`);
      }

    } catch (error) {
      toast.error("Thanh toán thất bại.");
      console.error("Checkout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    dispatch(clearComboCart());
    dispatch(clearOrderInfo());
    navigate("/staff/combo-selling");
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      width: 200,
      render: img => <Image src={img} width={100} height={130} />,
    },
    {
      title: 'Product',
      dataIndex: 'name',
      width: 200
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      width: 100
    },
    {
      title: 'Unit Price',
      dataIndex: 'price',
      render: price => `${formatPrice(price)} VNĐ`,
      width: 150
    },
    {
      title: 'Total',
      render: (_, record) => `${formatPrice(record.price * record.quantity)} VNĐ`,
      width: 150
    }
  ];

  return (
    <div className="p-4 mx-auto w-full bg-[#fafbfc]">
      <h1 className="text-3xl font-bold mb-4 text-[#9810FA] justify-between items-center flex flex-col sm:flex-row">
        Confirm Combos
      </h1>
      <div className="mb-4 flex justify-start">
        <Button icon={<FaArrowLeft />} onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
      <div className="px-8 w-full">
        <div className='block mb-2 font-medium text-lg'>
          Combos Details:
        </div>
        <Table
          className='table-cart-staff'
          dataSource={cart}
          columns={columns}
          rowKey="id"
          pagination={false}
          style={{ width: '100%', border: '1px solid gray', borderRadius: '20px' }}
        />
      </div>

      <div className="flex gap-3 items-center my-4 justify-center">
        <span className="text-2xl font-semibold">Total Amount:</span>
        <span className="text-xl font-bold text-green-600">{formatPrice(totalPrice)} VNĐ</span>
      </div>

      {/* <div className="mx-6 my-3">
        <label className="block mb-2 font-medium text-lg">Notes (Optional):</label>
        <Input.TextArea
          style={{ width: '80%', display: 'flex', justifyContent: 'center', margin: '0 auto' }}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Enter notes for order if any... (Note: Notes just for payment method Cash)"

        />
      </div> */}

      <div className="mx-6 my-3">
        <label className="block mb-2 font-medium text-lg">Payment method:</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-[80%] justify-center mx-auto">
          {PAYMENT_METHODS.map((method) => (
            <label
              key={method.value}
              className={`border rounded-lg p-3 cursor-pointer transition-all ${paymentMethod === method.value
                ? "ring-4 ring-purple-500 " + method.color
                : "hover:border-purple-300 hover:ring-4 hover:ring-purple-500"
                }`}
              onClick={() => setPaymentMethod(method.value)}
            >
              {method.icon}
              <div className="text-center font-medium">{method.label}</div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-5">
        <Button
          type="primary"
          icon={<FaCheck />}
          loading={loading}
          onClick={handlePayment}
        >
          Confirm
        </Button>
        <Button
          danger
          onClick={handleCancel}
          icon={<FaTimes />}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
