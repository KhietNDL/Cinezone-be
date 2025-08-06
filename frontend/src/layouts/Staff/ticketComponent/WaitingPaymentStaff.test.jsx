/* eslint-disable no-undef */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import WaitingPaymentStaff from './WaitingPaymentStaff';
import StripeCheckoutForm from '../../User/component/StripeCheckoutForm';
import BackButton from '../component/BackButton';
import { cancelBookingById, cancelProductsById } from '../../../services/APIForStaff/API';
// import { setVisaResponse, setComboVisaResponse } from '../../../redux/features/sellingSlice';
import configureStore from 'redux-mock-store';

// Mock các dependencies
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));
jest.mock('../../../services/APIForStaff/API', () => ({
  cancelBookingById: jest.fn(),
  cancelProductsById: jest.fn(),
}));
jest.mock('../../User/component/StripeCheckoutForm', () => ({ clientSecret, onSuccess }) => (
  <div data-testid="stripe-checkout-form">
    Stripe Form - Client Secret: {clientSecret}
    <button onClick={() => onSuccess({ id: 'pi_123' })}>Complete Payment</button>
  </div>
));
jest.mock('../component/BackButton', () => () => <button data-testid="back-button">Back</button>);
jest.mock('../../../assets/logoWeb.svg', () => 'logo.svg');

// Mock Redux store
const mockStore = configureStore([]);
const initialState = {
  selling: {
    stripeClientSecret: null,
    bookingId: 'booking_123',
  },
  combo: {
    stripeClientSecret: null,
    orderProductId: 'order_123',
  },
};
let store;

describe('WaitingPaymentStaff', () => {
  let mockNavigate;

  beforeEach(() => {
    store = mockStore(initialState);
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  test('renders loading state when stripeClientSecret is null', () => {
    useLocation.mockReturnValue({ pathname: '/staff/ticket-selling/waiting-payment' });
    render(
      <Provider store={store}>
        <WaitingPaymentStaff />
      </Provider>
    );

    expect(screen.getByText('Payment Processing')).toBeInTheDocument();
    expect(screen.getByText('Secure Payment')).toBeInTheDocument();
    expect(screen.getByText('Loading payment form...')).toBeInTheDocument();
    expect(screen.getByTestId('back-button')).toBeInTheDocument();
    expect(screen.getByText('Cancel Payment')).toBeInTheDocument();
  });

  test('renders StripeCheckoutForm when stripeClientSecret is provided for ticket selling', () => {
    useLocation.mockReturnValue({ pathname: '/staff/ticket-selling/waiting-payment' });
    store = mockStore({
      ...initialState,
      selling: {
        stripeClientSecret: { clientSecret: 'secret_123' },
        bookingId: 'booking_123',
      },
    });

    render(
      <Provider store={store}>
        <WaitingPaymentStaff />
      </Provider>
    );

    expect(screen.getByTestId('stripe-checkout-form')).toBeInTheDocument();
    expect(screen.getByText('Stripe Form - Client Secret: secret_123')).toBeInTheDocument();
    expect(screen.getByText('CineZone Payment')).toBeInTheDocument();
    expect(screen.getByText('SSL Secured')).toBeInTheDocument();
    expect(screen.getByText('Encrypted')).toBeInTheDocument();
  });

  test('renders StripeCheckoutForm when stripeClientSecret is provided for combo selling', () => {
    useLocation.mockReturnValue({ pathname: '/staff/combo-selling/waiting-payment' });
    store = mockStore({
      ...initialState,
      combo: {
        stripeClientSecret: { clientSecret: 'secret_456' },
        orderProductId: 'order_123',
      },
    });

    render(
      <Provider store={store}>
        <WaitingPaymentStaff />
      </Provider>
    );

    expect(screen.getByTestId('stripe-checkout-form')).toBeInTheDocument();
    expect(screen.getByText('Stripe Form - Client Secret: secret_456')).toBeInTheDocument();
    expect(screen.getByText('Complete your combo order payment securely')).toBeInTheDocument();
  });

  test('handles cancel booking for ticket selling', async () => {
    useLocation.mockReturnValue({ pathname: '/staff/ticket-selling/waiting-payment' });
    cancelBookingById.mockResolvedValue({});

    render(
      <Provider store={store}>
        <WaitingPaymentStaff />
      </Provider>
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Cancel Payment'));
    });

    expect(cancelBookingById).toHaveBeenCalledWith('booking_123');
    expect(toast.success).toHaveBeenCalledWith('Booking cancelled successfully.');
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test('handles cancel order for combo selling', async () => {
    useLocation.mockReturnValue({ pathname: '/staff/combo-selling/waiting-payment' });
    cancelProductsById.mockResolvedValue({});

    render(
      <Provider store={store}>
        <WaitingPaymentStaff />
      </Provider>
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Cancel Payment'));
    });

    expect(cancelProductsById).toHaveBeenCalledWith('order_123');
    expect(toast.success).toHaveBeenCalledWith('Order cancelled successfully.');
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  test('handles cancel error for ticket selling', async () => {
    useLocation.mockReturnValue({ pathname: '/staff/ticket-selling/waiting-payment' });
    cancelBookingById.mockRejectedValue(new Error('Cancel failed'));

    render(
      <Provider store={store}>
        <WaitingPaymentStaff />
      </Provider>
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Cancel Payment'));
    });

    expect(cancelBookingById).toHaveBeenCalledWith('booking_123');
    expect(toast.error).toHaveBeenCalledWith('Failed to cancel the booking.');
  });

  test('handles cancel error for combo selling', async () => {
    useLocation.mockReturnValue({ pathname: '/staff/combo-selling/waiting-payment' });
    cancelProductsById.mockRejectedValue(new Error('Cancel failed'));

    render(
      <Provider store={store}>
        <WaitingPaymentStaff />
      </Provider>
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Cancel Payment'));
    });

    expect(cancelProductsById).toHaveBeenCalledWith('order_123');
    expect(toast.error).toHaveBeenCalledWith('Failed to cancel the booking.');
  });

//   test('dispatches setVisaResponse and navigates on payment success for ticket selling', async () => {
//     useLocation.mockReturnValue({ pathname: '/staff/ticket-selling/waiting-payment' });
//     store = mockStore({
//       ...initialState,
//       selling: {
//         stripeClientSecret: { clientSecret: 'secret_123' },
//         bookingId: 'booking_123',
//       },
//     });

//     render(
//       <Provider store={store}>
//         <WaitingPaymentStaff />
//       </Provider>
//     );

//     await act(async () => {
//       fireEvent.click(screen.getByText('Complete Payment'));
//     });

//     const actions = store.getActions();
//     expect(actions).toContainEqual(setVisaResponse({ id: 'pi_123' }));
//     expect(mockNavigate).toHaveBeenCalledWith('/staff/ticket-selling/ticket-information');
//   });

//   test('dispatches setComboVisaResponse and navigates on payment success for combo selling', async () => {
//     useLocation.mockReturnValue({ pathname: '/staff/combo-selling/waiting-payment' });
//     store = mockStore({
//       ...initialState,
//       combo: {
//         stripeClientSecret: { clientSecret: 'secret_456' },
//         orderProductId: 'order_123',
//       },
//     });

//     render(
//       <Provider store={store}>
//         <WaitingPaymentStaff />
//       </Provider>
//     );

//     await act(async () => {
//       fireEvent.click(screen.getByText('Complete Payment'));
//     });

//     const actions = store.getActions();
//     expect(actions).toContainEqual(setComboVisaResponse({ id: 'pi_123' }));
//     expect(mockNavigate).toHaveBeenCalledWith('/staff/combo-selling/combo-information');
//   });
});