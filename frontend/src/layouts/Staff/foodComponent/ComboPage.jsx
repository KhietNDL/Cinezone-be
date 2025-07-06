import React, { useState, useEffect } from 'react';
import { Input, Button, Table, Image, Space, message, Modal } from 'antd';
import { LeftOutlined, RightOutlined, DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import ItemCard from '../component/ItemCard';
import { BsTrash3Fill } from "react-icons/bs";
import { FaCheck, FaX, FaXmark } from "react-icons/fa6";
import './ComboPage.css';
import { PiPopcornDuotone } from "react-icons/pi";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { getAllProduct, createProductHold } from '../../../services/APIForStaff/API';
import { useAuth } from '../../../context/AuthContext';
import { toast, ToastContainer } from "react-toastify";

export default function ComboPage() {
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [notes, setNotes] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { user } = useAuth();


    const formatPrice = (price) => {
        return price?.toLocaleString('vi-VN');
    };

    const fetchProducts = async () => {
        try {
            const response = await getAllProduct();
            if (response && response.Products) {
                // Transform the API data to match our expected format
                const transformedProducts = response.Products.map(product => ({
                    id: product.ProductId,
                    name: product.ProductName,
                    description: product.Description,
                    price: parseFloat(product.Price), // Convert string to number
                    image: product.ImageUrl, // Fallback image
                    quantity: product.Quantity
                }));
                setProducts(transformedProducts);
            }
        } catch (error) {
            toast.error('Failed to fetch products');
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredCombos = products.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.description && c.description.toLowerCase().includes(search.toLowerCase()))
    );

    const handleCheckout = async () => {
        if (cart.length === 0) {
            toast.warning('Your cart is empty');
            return;
        }

        setIsModalVisible(true);
    };

    const handleConfirmCheckout = async () => {
        try {
            
            setCheckoutLoading(true);
            const userId = user?.userId || user?.id;
            console.log("User id: ", userId)
            if (!userId) {
                toast.error('User ID not found');
                return;
            }

            // Prepare products for API
            const productsForApi = cart.map(item => ({
                ProductId: item.id,
                Quantity: item.quantity
            }));



            // Call the product hold API
            const response = await createProductHold(
                userId, // You need to set this memberId (from your auth system)
                productsForApi,
                notes
            );

            toast.success('Products held successfully!');
            setCart([]); // Clear cart after successful hold
            setNotes(''); // Reset notes
            setIsModalVisible(false);
        } catch (error) {
            toast.error('Failed to hold products');
            console.error('Error holding products:', error);
        } finally {
            setCheckoutLoading(false);
        }
    };

    const handleAddCombo = (combo) => {
        setCart(prev => {
            const found = prev.find(item => item.id === combo.id);
            if (found) {
                return prev.filter(item => item.id !== combo.id);
            }
            return [...prev, { ...combo, quantity: 1 }];
        });
    };

    const handleRemove = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const handleQuantity = (id, delta) => {
        setCart(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            width: 242,
            render: img => <Image src={img} width={100} />,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            width: 373,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            width: 190,
            render: (qty, record) => (
                <Space>
                    <Button style={{ backgroundColor: '#7254EF', color: "white" }} icon={<MinusOutlined />} size="small" onClick={() => handleQuantity(record.id, -1)} />
                    <span>{qty}</span>
                    <Button style={{ backgroundColor: '#7254EF', color: "white" }} icon={<PlusOutlined />} size="small" onClick={() => handleQuantity(record.id, 1)} />
                </Space>
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            width: 116,
            render: price => `${formatPrice(price)} VNĐ`,
        },
        {
            title: 'Total',
            width: 115,
            render: (_, record) => `${formatPrice(record.price * record.quantity)} VNĐ`,
        },
        {
            title: 'Action',
            width: 135,
            render: (_, record) => (
                <Button
                    icon={<BsTrash3Fill />}
                    danger
                    type="text"
                    onClick={() => handleRemove(record.id)}
                />
            ),
        },
    ];

    return (
        <div className="w-full bg-[#fafbfc] p-[20px]">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="w-full">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-[#9810FA]">Sell Combo Food</h1>
                    <Input.Search
                        placeholder="Search combo..."
                        style={{ width: 250 }}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        loading={loading}
                    />
                </div>

                {/* Combo Carousel */}
                <div className="mt-8">
                    <p className="text-lg flex items-center gap-2">
                        <span className="text-xl"><PiPopcornDuotone /></span> Select Combo
                    </p>
                    {loading ? (
                        <div className="text-center py-8">Loading products...</div>
                    ) : (
                        <div className="staff-swiper">
                            <Swiper
                                modules={[Navigation, Pagination]}
                                navigation
                                pagination={{ clickable: true }}
                                spaceBetween={50}
                                slidesPerView={4}
                                slidesPerGroup={2}
                                loop={true}
                                breakpoints={{
                                    320: { slidesPerView: 1 },
                                    640: { slidesPerView: 2 },
                                    1024: { slidesPerView: 4 },
                                }}
                            >
                                {filteredCombos.map((combo) => (
                                    <SwiperSlide key={combo.id}>
                                        <div className="flex justify-center p-2 w-[260px]">
                                            <ItemCard
                                                item={combo}
                                                type="combo"
                                                onSelect={handleAddCombo}
                                                selected={cart.some(item => item.id === combo.id)}
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    )}
                </div>

                {/* Cart Table */}
                <div className="bg-white rounded-2xl shadow-md p-8 mt-8 w-full border border-gray-200">
                    <Table
                        className='table-cart-staff'
                        dataSource={cart}
                        columns={columns}
                        rowKey="id"
                        pagination={false}
                        style={{ width: '100%', border: '1px solid gray', borderRadius: '20px' }}
                    />
                    <div className='flex justify-center mt-4 gap-3 text-2xl'>
                        <strong>Total Price: </strong>
                        <p className='text-green-700'>
                            {formatPrice(cart.reduce((sum, item) => sum + item.price * item.quantity, 0))} VNĐ
                        </p>
                    </div>
                    <div className="flex justify-center gap-4 mt-8">
                        <Button
                            style={{ width: 180, fontWeight: 600, fontSize: 16, backgroundColor: '#7254EF', color: 'white' }}
                            icon={<FaCheck />}
                            onClick={handleCheckout}
                            loading={checkoutLoading}
                        >
                            Check out
                        </Button>
                        <Button
                            danger
                            style={{ width: 120, fontWeight: 600, fontSize: 16 }}
                            icon={<FaXmark />}
                            onClick={() => setCart([])}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
            {/* Checkout Confirmation Modal */}
            <Modal
                title="Confirm Product Hold"
                visible={isModalVisible}
                onOk={handleConfirmCheckout}
                onCancel={() => setIsModalVisible(false)}
                confirmLoading={checkoutLoading}
                okText="Confirm Hold"
                cancelText="Cancel"
            >
                <div className="mb-4">
                    <p>You are about to hold {cart.length} product(s).</p>
                    <p>Total: {formatPrice(cart.reduce((sum, item) => sum + item.price * item.quantity, 0))} VNĐ</p>
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Notes (Optional):</label>
                    <Input.TextArea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Enter any notes for this order..."
                        rows={3}
                    />
                </div>
            </Modal>
        </div>
    );
}