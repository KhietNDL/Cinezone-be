import React, { useState } from 'react';
import { Button, Row, Col, Typography } from 'antd';
import MovieCard from '../components/MovieCard';
import ShowtimeSelector from '../components/ShowtimeButton';
import ComboCard from '../components/ComboCard';
import CartTable from '../components/ComboTable';
import { Armchair, Popcorn, X } from 'lucide-react';

const SellTicketPage = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [cart, setCart] = useState([]);

  const movies = [/* mock movie data */];
  const combos = [/* mock combo data */];

  const handleAddCombo = (combo) => {
    const exist = cart.find(item => item.key === combo.id);
    if (exist) {
      setCart(cart.map(item => item.key === combo.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...combo, key: combo.id, quantity: 1 }]);
    }
  };

  const handleUpdateQty = (key, qty) => {
    setCart(cart.map(item => item.key === key ? { ...item, quantity: qty } : item));
  };

  const handleRemoveItem = (key) => {
    setCart(cart.filter(item => item.key !== key));
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 className='text-3xl font-bold'>Sell Movie Ticket</h1>

      <Typography.Title level={5}> <i className="fa-solid fa-film"></i> Select Movie</Typography.Title>
      <Row gutter={[16, 16]}>
        {movies.map((movie) => (
          <Col key={movie.id}>
            <MovieCard
              movie={movie}
              onSelect={setSelectedMovie}
              selected={selectedMovie?.id === movie.id}
            />
          </Col>
        ))}
      </Row>

      <Typography.Title level={5} style={{ marginTop: 20 }}><i className="fa-solid fa-clock"></i> Select Showtime</Typography.Title>
      <ShowtimeSelector selectedTime={selectedTime} onSelectTime={setSelectedTime} />

      <Typography.Title level={5} style={{ marginTop: 20 }}><Popcorn /> Combo</Typography.Title>
      <Row gutter={[16, 16]}>
        {combos.map(combo => (
          <Col key={combo.id}>
            <ComboCard combo={combo} onAdd={handleAddCombo} />
          </Col>
        ))}
      </Row>
    

      <Typography.Title level={5} style={{ marginTop: 20 }}>Food Cart</Typography.Title>
      <CartTable cart={cart} onUpdateQty={handleUpdateQty} onRemove={handleRemoveItem} />

      <div style={{ marginTop: 20 , textAlign: 'center' }}>
        <Button style={{backgroundColor: '#4F46E5', color: 'white'}}><i className="fa-solid fa-couch"></i>Select seats</Button>
        <Button style={{ marginLeft: 10 }} danger><i className="fa-solid fa-xmark"></i>Cancel</Button>
      </div>
    </div>
  );
};

export default SellTicketPage;
