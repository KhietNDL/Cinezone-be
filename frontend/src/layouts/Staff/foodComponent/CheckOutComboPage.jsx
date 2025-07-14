import React, { useState, useMemo } from 'react';
import { Button, Table, Input, Select, Image } from 'antd';
import { useNavigate } from 'react-router-dom';
// import { createCashPaymentForProduct, createProductHold, createMomoPaymentForProducts } from '../../../services/APIForStaff/API';
import { createProductHold } from '../../../services/APIForStaff/API';
import { useAuth } from '../../../context/AuthContext';
import { toast } from 'react-toastify';
import { FaCheck, FaTimes } from "react-icons/fa";
import { FaArrowLeft, FaMoneyBillWave } from "react-icons/fa6";
import './ComboPage.css';
import { useSelector, useDispatch } from "react-redux";
import { clearComboCart, clearOrderInfo, setOrderInfo } from "../../../redux/features/comboSlice";
import PaymentMethod from '../component/PaymentMethod';
import { processPayment } from '../../../hooks/useProcessPayment';

const { Option } = Select;

export default function CheckOutComboPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const cart = useSelector(state => state.combo.cart);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const dispatch = useDispatch();

  const formatPrice = (price) => price?.toLocaleString('vi-VN');

  const totalPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const handlePayment = async () => {
    if (!Array.isArray(cart) || cart.length === 0) {
      toast.warning("Cart is empty or missing order number.");
      return;
    }

    try {
      setLoading(true);

      const userId = user?.userId || user?.id;
      if (!userId) {
        toast.error("User information not found.");
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

      await processPayment({
        paymentMethod,
        orderId: holdResponse.OrderProductId,
        amount: totalPrice,
        type: "combo",
        navigate,
        setIsRedirecting: null,
        successUrl: `${paymentMethod === "Cash" ? "/staff/combo-selling/combo-information" :`${window.location.origin}/staff/combo-selling/combo-information`}`,
      });

    } catch (error) {
      toast.error("Payment failed.");
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

      <div className="mx-6 my-3">
        <label className="block mb-2 font-medium text-lg">Payment method:</label>

        <PaymentMethod
          value={paymentMethod}
          onChange={setPaymentMethod}
        />

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
