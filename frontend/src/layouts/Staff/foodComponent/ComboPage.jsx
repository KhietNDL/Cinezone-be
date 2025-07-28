import React, { useState, useEffect } from 'react';
import { Input, Button, Table, Image, Space } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import ItemCard from '../component/ItemCard';
import { BsTrash3Fill } from "react-icons/bs";
import { FaCheck, FaXmark } from "react-icons/fa6";
import './ComboPage.css';
import { PiPopcornDuotone } from "react-icons/pi";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { getAllProduct } from '../../../services/APIForStaff/API';
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { setComboCart, clearComboCart, clearOrderInfo } from "../../../redux/features/comboSlice";

export default function ComboPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector(state => state.combo.cart) || [];
    const [search, setSearch] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatPrice = (price) => {
        return price?.toLocaleString('vi-VN');
    };

    const fetchProducts = async () => {
        try {
            const response = await getAllProduct();
            if (response && response.products) {
                const transformedProducts = response.products.map(product => ({
                    id: product.ProductId,
                    name: product.ProductName,
                    description: product.Description,
                    price: parseFloat(product.Price),
                    image: product.ImageUrl,
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

    // Thêm combo vào cart
    const handleAddCombo = (combo) => {
        const found = cart.find(item => item.id === combo.id);
        let newCart;
        if (found) {
            newCart = cart.filter(item => item.id !== combo.id);
        } else {
            newCart = [...cart, { ...combo, quantity: 1 }];
        }
        dispatch(setComboCart(newCart));
    };

    // Xóa combo khỏi cart
    const handleRemove = (id) => {
        const newCart = cart.filter(item => item.id !== id);
        dispatch(setComboCart(newCart));
    };

    // Thay đổi số lượng combo
    const handleQuantity = (id, delta) => {
        const newCart = cart.map(item =>
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

    const filteredCombos = products.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleCheckout = async () => {
        if (cart.length === 0) {
            toast.warning('Your cart is empty');
            return;
        }
        navigate("/staff/combo-selling/checkout");
    };

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            width: 242,
            render: img => <Image src={img} width={100} height={130} />,
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
                    <Button style={{ backgroundColor: '#7254EF', color: "white" }} icon={<MinusOutlined />} size="small" onClick={() => handleQuantity(record.id, -1)} data-testid={`decrease-${record.id}`} />
                    <span>{qty}</span>
                    <Button style={{ backgroundColor: '#7254EF', color: "white" }} icon={<PlusOutlined />} size="small" onClick={() => handleQuantity(record.id, 1)} data-testid={`increase-${record.id}`} />
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
                    data-testid={`remove-${record.id}`}
                />
            ),
        },
    ];

    return (
        <div className="w-full bg-[#fafbfc] p-[20px]">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="w-full">
                {/* Header */}
                <div className="flex flex-col gap-4 lg:flex-row justify-between items-center">
                    <div className='w-[250px]'></div>
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
                <div className="mt-5">
                    <div className="text-xl flex items-center gap-1 font-semibold">
                        <PiPopcornDuotone />
                        <p>Select Combo</p>
                    </div>
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
                                slidesPerGroup={1}
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
                                                disabled={combo.quantity === 0}
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
                        <p className='text-green-700 font-bold'>
                            {formatPrice(cart.reduce((sum, item) => sum + item.price * item.quantity, 0))} VNĐ
                        </p>
                    </div>
                    <div className="flex justify-center gap-4 mt-5">
                        <Button
                            type='primary'
                            icon={<FaCheck />}
                            onClick={handleCheckout}
                            disabled={cart.length === 0}
                        >
                            Check out
                        </Button>
                        <Button
                            danger
                            icon={<FaXmark />}
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}