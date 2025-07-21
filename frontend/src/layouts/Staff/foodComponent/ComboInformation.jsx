import React, { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Image, Table } from 'antd';
import { FaPlus, FaRedo, FaTimes } from "react-icons/fa";
import { CheckCircleTwoTone, CloseCircleTwoTone } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { clearComboCart, clearOrderInfo } from "../../../redux/features/comboSlice";
import './ComboPage.css';
import { cancelProductsById } from '../../../services/APIForStaff/API';
import { toast } from 'react-toastify';

export default function ComboInformation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { search } = useLocation();

  const params = new URLSearchParams(search);
  const momoResult = params.get('resultCode');
  const status = momoResult ? momoResult === "0" ? "success" : "error" : "success";

  const cart = useSelector(state => state.combo.cart) || [];
  const orderProductId = useSelector(state => state.combo.orderProductId);
  const formatPrice = (price) => price?.toLocaleString('vi-VN');
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const statusMap = {
    success: {
      icon: <CheckCircleTwoTone twoToneColor="#52c41a" className="text-8xl mb-2" />,
      title: "Payment Successfully",
      color: "text-green-600"
    },
    error: {
      icon: <CloseCircleTwoTone twoToneColor="#ff4d4f" className="text-8xl mb-2" />,
      title: "Payment Failed",
      color: "text-red-600"
    }
  };

  const statusInfo = statusMap[status];

  console.log("Query string:", search);
  console.log("Result code:", momoResult);
  console.log("Combo Information:", cart, "Status:", status);

  const handleNewCombo = () => {
    dispatch(clearComboCart());
    dispatch(clearOrderInfo());
    navigate("/staff/combo-selling");
  };

  const handleCancel = () => {
    dispatch(clearComboCart());
    dispatch(clearOrderInfo());
    navigate("/staff/combo-selling");
  };

  const handleTryAgain = useCallback(async () => {
    try {
      await cancelProductsById(orderProductId);
      toast.info("Previous booking cancelled. Please try again.");
    } catch (err) {
      toast.error("Failed to cancel previous booking");
      console.error(err);
    } finally {
      navigate("/staff/combo-selling/checkout");
    }
  }, [orderProductId, navigate]);

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      width: 120,
      render: img => <Image src={img} width={80} height={100} />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: 220,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      width: 100,
      render: qty => <span>{qty}</span>
    },
    {
      title: 'Unit Price',
      dataIndex: 'price',
      width: 120,
      render: price => <span>{formatPrice(price)} VNĐ</span>
    },
    {
      title: 'Total',
      width: 120,
      render: (_, record) => (
        <span>{formatPrice(record.price * record.quantity)} VNĐ</span>
      )
    }
  ];

  return (
    <div className="p-4 w-full mx-auto bg-white">
      <div className="text-center py-8">
        {statusInfo.icon}
        <h1 className={`text-3xl font-bold mt-4 ${statusInfo.color}`}>{statusInfo.title}</h1>
      </div>
      <div className="flex flex-col gap-6 mt-6 items-center">
        <div className="rounded-xl border border-gray-300 shadow-xl bg-white p-6 w-full">
          <h2 className="text-xl font-bold mb-4">Combo Details</h2>
          <Table
            className='table-cart-staff'
            dataSource={cart}
            columns={columns}
            rowKey="id"
            pagination={false}
            locale={{ emptyText: "No combos in cart." }}
            style={{ width: '100%' }}
          />
          <div className="flex justify-center mt-4 text-2xl font-bold text-purple-700">
            Total Amount: <span className="ml-2 text-green-600">{formatPrice(totalPrice)} VNĐ</span>
          </div>
        </div>
        <div className="flex justify-center gap-4 mt-6">
          {status === "error" ? (
            <Button
              icon={<FaRedo />}
              onClick={handleTryAgain}
              className="w-full"
              type="primary"
            >
              Try Again
            </Button>
          ) : (
            <>
              <Button
                icon={<FaPlus />}
                onClick={handleNewCombo}
                className="w-full"
                type="primary"
              >
                New Combo
              </Button>
              <Button
                icon={<FaTimes />}
                onClick={handleCancel}
                className="w-full"
                danger
                type="default"
              >
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}