import React, { useState, useEffect, useMemo } from "react";
import { Input, Button, Table, Image, Space } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import ItemCard from "../component/ItemCard";
import { BsTrash3Fill } from "react-icons/bs";
import { FaCheck, FaXmark } from "react-icons/fa6";
import "./ComboPage.css";
import { PiPopcornDuotone } from "react-icons/pi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { getAllProduct } from "../../../services/APIForStaff/API";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setComboCart,
  clearComboCart,
  clearOrderInfo,
} from "../../../redux/features/comboSlice";
import BackButton from "../component/BackButton";
import { IoSearchOutline } from "react-icons/io5";

export default function ComboPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.combo.cart) || [];
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatPrice = (price) => {
    return price?.toLocaleString("vi-VN");
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getAllProduct();
      if (response && response.products) {
        const transformedProducts = response.products.map((product) => ({
          id: product.ProductId,
          name: product.ProductName,
          description: product.Description,
          price: parseFloat(product.Price),
          image: product.ImageUrl,
          quantity: product.Quantity,
        }));
        setProducts(transformedProducts);
      }
    } catch (error) {
      toast.error("Failed to fetch products");
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Thêm combo vào cart
  const handleAddCombo = (combo) => {
    if (combo.quantity <= 0) {
      toast.warning("This product is currently unavailable");
      return;
    }
    const found = cart.find((item) => item.id === combo.id);
    let newCart;
    if (found) {
      newCart = cart.filter((item) => item.id !== combo.id);
    } else {
      newCart = [...cart, { ...combo, quantity: 1 }];
    }
    dispatch(setComboCart(newCart));
  };

  // Xóa combo khỏi cart
  const handleRemove = (id) => {
    const newCart = cart.filter((item) => item.id !== id);
    dispatch(setComboCart(newCart));
  };

  // Thay đổi số lượng combo
  const handleQuantity = (id, delta) => {
    const newCart = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    dispatch(setComboCart(newCart));
  };

  // Xóa toàn bộ cart
  const handleCancel = () => {
    dispatch(clearComboCart());
    dispatch(clearOrderInfo());
  };

  const filteredCombos = products.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.warning("Your cart is empty");
      return;
    }
    // toast.success("Proceeding to checkout");
    navigate("/staff/combo-selling/checkout");
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      width: 242,
      render: (img) => <Image src={img} width={100} height={130} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 373,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      width: 190,
      render: (qty, record) => (
        <Space>
          <Button
            className="bg-purple-600 hover:bg-purple-700 border-purple-600 hover:border-purple-700 text-white"
            icon={<MinusOutlined />}
            size="small"
            onClick={() => handleQuantity(record.id, -1)}
            data-testid={`decrease-${record.id}`}
          />
          <span className="mx-2 font-semibold">{qty}</span>
          <Button
            className="bg-purple-600 hover:bg-purple-700 border-purple-600 hover:border-purple-700 text-white"
            icon={<PlusOutlined />}
            size="small"
            onClick={() => handleQuantity(record.id, 1)}
            data-testid={`increase-${record.id}`}
          />
        </Space>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      width: 116,
      render: (price) => `${formatPrice(price)} VNĐ`,
    },
    {
      title: "Total",
      width: 115,
      render: (_, record) =>
        `${formatPrice(record.price * record.quantity)} VNĐ`,
    },
    {
      title: "Action",
      width: 135,
      render: (_, record) => (
        <Button
          icon={<BsTrash3Fill />}
          danger
          type="text"
          onClick={() => handleRemove(record.id)}
          data-testid={`remove-${record.id}`}
        />
      ),
    },
  ];

  const swiperBreakpoints = useMemo(
    () => ({
      320: {
        slidesPerView: 1,
        spaceBetween: 20,
        slidesPerGroup: 1,
      },
      640: {
        slidesPerView: 2,
        spaceBetween: 30,
        slidesPerGroup: 1,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 50,
        slidesPerGroup: 2,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 60,
        slidesPerGroup: 2,
      },
      1280: {
        slidesPerView: 4,
        spaceBetween: 60,
        slidesPerGroup: 2,
      },
    }),
    []
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4 bg-white shadow-md rounded-lg mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 lg:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <PiPopcornDuotone className="text-white text-lg sm:text-xl" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                Combo Sales
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Staff Portal - Cinema Management
              </p>
            </div>
          </div>
          {/* Right: Search */}
          <div className="w-full md:w-[30%] flex items-center justify-center gap-3">
            <div className="flex items-center p-1 px-2 w-full max-w-[400px]  rounded-xl bg-white shadow-sm">
              <IoSearchOutline size={20} />
              <input
                placeholder="Search movies"
                size="large"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="p-1 sm:p-2 focus:outline-none w-full text-sm sm:text-base"
                style={{
                  fontSize: "14px",
                  backgroundColor: "#ffffff",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto ">
        {/* Combo Products Section */}
        <div className="bg-white rounded-xl shadow-lg border-0 overflow-hidden mb-6">
          <div className="p-6">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                <PiPopcornDuotone className="text-white text-lg" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800">
                  Available Combo Products
                </h2>
                <p className="text-sm text-gray-500">
                  Select your favorite combo items
                </p>
              </div>
              <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                {filteredCombos.length}{" "}
                {filteredCombos.length === 1 ? "product" : "products"}
              </div>
            </div>

            {/* Content */}
            {loading ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <PiPopcornDuotone className="text-3xl text-purple-500" />
                </div>
                <div className="text-lg font-medium text-gray-700 mb-2">
                  Loading Products
                </div>
                <div className="text-sm text-gray-500">
                  Please wait while we fetch the combo products...
                </div>
              </div>
            ) : filteredCombos.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <PiPopcornDuotone className="text-3xl text-gray-400" />
                </div>
                <div className="text-lg font-medium text-gray-700 mb-2">
                  No Products Found
                </div>
                <div className="text-sm text-gray-500">
                  Try adjusting your search terms
                </div>
              </div>
            ) : (
              <div className="staff-swiper">
                <Swiper
                  modules={[Navigation, Pagination]}
                  breakpoints={swiperBreakpoints}
                  navigation
                  pagination={{ clickable: true }}
                  slidesPerView={4}
                  spaceBetween={20}
                >
                  {filteredCombos.map((combo) => (
                    <SwiperSlide key={combo.id}>
                      <div className="flex justify-center p-2">
                        <ItemCard
                          item={combo}
                          type="combo"
                          onSelect={handleAddCombo}
                          selected={cart.some((item) => item.id === combo.id)}
                          disabled={combo.quantity === 0}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>
        </div>
        {/* Shopping Cart */}
        <div className="bg-white rounded-xl shadow-lg border-0 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                <BsTrash3Fill className="text-white text-sm" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800">
                  Shopping Cart
                </h2>
                <p className="text-sm text-gray-500">
                  Review your selected items
                </p>
              </div>
              <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                {cart.length} {cart.length === 1 ? "item" : "items"}
              </div>
            </div>

            <Table
              className="table-cart-staff"
              dataSource={cart}
              columns={columns}
              rowKey="id"
              pagination={false}
              scroll={{ x: true }}
              locale={{
                emptyText: (
                  <div className="text-center py-12">
                    <PiPopcornDuotone className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Your cart is empty</p>
                    <p className="text-sm text-gray-400">
                      Add some combo products to get started
                    </p>
                  </div>
                ),
              }}
            />

            {cart.length > 0 && (
              <>
                <div className="flex justify-center mt-6 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-purple-700 mb-1">
                      Total Amount
                    </p>
                    <p className="text-2xl font-bold text-purple-800">
                      {formatPrice(
                        cart.reduce(
                          (sum, item) => sum + item.price * item.quantity,
                          0
                        )
                      )}{" "}
                      VNĐ
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                  <Button
                    type="primary"
                    icon={<FaCheck />}
                    onClick={handleCheckout}
                    disabled={cart.length === 0}
                    className="h-12 px-8 bg-gradient-to-r from-purple-600 to-purple-700 border-0 hover:from-purple-700 hover:to-purple-800 font-semibold text-white rounded-lg"
                    size="large"
                  >
                    Proceed to Checkout
                  </Button>
                  <Button
                    danger
                    icon={<FaXmark />}
                    onClick={handleCancel}
                    className="h-12 px-8 font-semibold rounded-lg border-red-300 text-red-600 hover:bg-red-50"
                    size="large"
                  >
                    Clear Cart
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
