import React, { useState } from 'react';
import { Input, Button, Table, Image, Space } from 'antd';
import { LeftOutlined, RightOutlined, DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import ComboCard from './ComboCard';
import { BsTrash3Fill } from "react-icons/bs";
import { FaCheck, FaX, FaXmark } from "react-icons/fa6";
import './ComboPage.css'; // Assuming you have some styles for the ComboPage
import { PiPopcornDuotone } from "react-icons/pi";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import './SwiperButton.css'; // Custom styles for Swiper buttons
const comboList = [
    {
        id: 1,
        name: "Combo 1 Popcorn + 2 Pepsi",
        price: 15.00,
        image: "https://tse3.mm.bing.net/th/id/OIP.-Pm8-_EoWY5FHhgFjJJvoQHaHa?rs=1&pid=ImgDetMain"
    },
    {
        id: 2,
        name: "Combo 2 Popcorn + 1 Pepsi",
        price: 20.00,
        image: "https://www.kindpng.com/picc/m/330-3302356_transparent-popcorn-clipart-coca-cola-pop-corn-hd.png"
    },
    {
        id: 3,
        name: "Combo 1 Popcorn + 1 Soda",
        price: 15.00,
        image: "https://media.istockphoto.com/id/172425485/photo/popcorn-and-soda.jpg?s=612x612&w=0&k=20&c=xZDmio0pas_xprnrx4Irh1qyQ4kMSoawFjZ6aiRZwKA="
    },
    {
        id: 4,
        name: "Combo 2 Popcorn",
        price: 18.00,
        image: "https://m.media-amazon.com/images/S/aplus-seller-content-images-us-east-1/ATVPDKIKX0DER/A2UNF69AMHQDMV/91183c18-0286-4566-a5d3-475bf46fa7f8._CR0,0,970,600_PT0_SX970__.jpg"
    },
    {
        id: 5,
        name: "Combo 1 mix Popcorn + 1 Pepsi",
        price: 17.00,
        image: "https://down-vn.img.susercontent.com/file/4980f121807444b753f2e9299fc43b42"
    },
    {
        id: 6,
        name: "Combo 1 mix Popcorn + 1 Pepsi + 1 Aquafina",
        price: 18.00,
        image: "https://down-vn.img.susercontent.com/file/19b7bd0612f4c5c0293c5f07f5e2bb58"
    },
    {
        id: 7,
        name: "Pepsi",
        price: 22.00,
        image: "https://down-vn.img.susercontent.com/file/5178202fa8a147917d01aedc379736d0"
    },
    {
        id: 8,
        name: "Combo 1 Popcorn + 1 Pepsi",
        price: 19.00,
        image: "https://ticketgo.vn/photos/70/hinhanh-tintuc/5f98ed98cc7bb.jpeg"
    }
];

export default function ComboPage() {
    const [cart, setCart] = useState([]);
    const [search, setSearch] = useState('');
    const [carouselIndex, setCarouselIndex] = useState(0);
    // const [loading, setLoading] = useState(false);

    const filteredCombos = comboList.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    const visibleCombos = filteredCombos.slice(carouselIndex, carouselIndex + 4);

    const handleAddCombo = (combo) => {
        setCart(prev => {
            const found = prev.find(item => item.id === combo.id);
            if (found) {
                return prev.map(item =>
                    item.id === combo.id ? { ...item, quantity: item.quantity + 1 } : item
                );
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
            render: img => <Image src={img} width={100} />,
        },
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
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
            render: price => `$${price}`,
        },
        {
            title: 'Total',
            render: (_, record) => `$${record.price * record.quantity}`,
        },
        {
            title: 'Action',
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
            <div className="w-full">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-fuchsia-700">Sell Combo</h1>
                    <Input.Search
                        placeholder="Search combo..."
                        style={{ width: 250 }}
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                {/* Combo Carousel */}
                <div className="mt-8">
                    <b className="text-lg flex items-center gap-2">
                        <span className="text-xl"><PiPopcornDuotone /></span> Select Combo
                    </b>
                    <div className="flex items-center gap-4 mt-6 w-full justify-center">
                        <Button
                            icon={<LeftOutlined />}
                            disabled={carouselIndex === 0}
                            onClick={() => setCarouselIndex(i => Math.max(0, i - 1))}
                            style={{ borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center',
                                 border: "none",justifyContent: 'center', color: '#7254EF', backgroundColor: "#FAFBFC" }}
                        />
                        <div className="flex gap-6 overflow-x-auto w-full pb-2">
                            {visibleCombos.map(combo => (
                                <ComboCard
                                    key={combo.id}
                                    combo={combo}
                                    onAdd={handleAddCombo}
                                    selected={cart.some(item => item.id === combo.id)}
                                />
                            ))}
                        </div>
                        <Button
                            icon={<RightOutlined />}
                            disabled={carouselIndex + 4 >= filteredCombos.length}
                            onClick={() => setCarouselIndex(i => Math.min(filteredCombos.length - 4, i + 1))}
                            style={{ borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center',
                                 border: "none",justifyContent: 'center', color: '#7254EF', backgroundColor: "#FAFBFC" }}
                        />
                    </div>
                </div>
                {/* ----------------------------- */}
                {/* <div className="staff-swiper">
                    {loading ? (
                        <div className="text-center my-8">
                            <Spin size="large" />
                        </div>
                    ) : (
                        <Swiper
                            modules={[Navigation]}
                            navigation
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
                            {visibleCombos.map((combo) => (
                                <SwiperSlide key={combo.id}>
                                    <div className="flex justify-center p-2 w-[230px]">
                                        <ComboCard
                                            key={combo.id}
                                            combo={combo}
                                            onAdd={handleAddCombo}
                                            selected={cart.some(item => item.id === combo.id)}
                                        />
                                    </div>

                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div> */}
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
                    <div className="flex justify-center gap-4 mt-8">
                        <Button style={{ width: 180, fontWeight: 600, fontSize: 16, backgroundColor: '#7254EF', color: 'white' }} icon={<FaCheck />}> Check out</Button>
                        <Button danger style={{ width: 120, fontWeight: 600, fontSize: 16 }} icon={<FaXmark />}>Cancel</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}