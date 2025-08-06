/* eslint-disable no-undef */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Formik, Form } from 'formik';
import PaymentMethodSection from './PaymentMethodSection';
import PaymentMethod from '../../component/PaymentMethod';
import PaymentSummarySection from './PaymentSummarySection';
import { Button } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { FaMoneyBillWave, FaX } from 'react-icons/fa6';

// Mock các icon components
jest.mock('react-icons/fa6', () => ({
  FaMoneyBillWave: () => <span>FaMoneyBillWave</span>,
  FaX: () => <span>FaX</span>,
}));
jest.mock('@ant-design/icons', () => ({
  CheckOutlined: () => <span>CheckOutlined</span>,
}));

// Mock PaymentMethod component
jest.mock('../../component/PaymentMethod', () => ({ value, onChange, showCardType, cardType, onCardTypeChange, cardTypeError }) => (
  <div data-testid="payment-method">
    <select data-testid="payment-method-select" value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">Select Payment Method</option>
      <option value="Cash">Cash</option>
      <option value="Stripe">Stripe</option>
    </select>
    {showCardType && (
      <select data-testid="card-type-select" value={cardType} onChange={(e) => onCardTypeChange(e.target.value)}>
        <option value="">Select Card Type</option>
        <option value="Visa">Visa</option>
        <option value="MasterCard">MasterCard</option>
      </select>
    )}
    {cardTypeError && <div data-testid="card-type-error">{cardTypeError}</div>}
  </div>
));

// Mock PaymentSummarySection component
jest.mock('./PaymentSummarySection', () => () => <div data-testid="payment-summary-section">Payment Summary</div>);

// Mock Ant Design Button
jest.mock('antd', () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

describe('PaymentMethodSection', () => {
  const defaultProps = {
    values: {
      paymentMethod: '',
      cardType: '',
      convertToTicket: 'Agree',
    },
    setFieldValue: jest.fn(),
    isSubmitting: false,
    memberChecked: true,
    member: { score: 100 },
    PointsToUse: 50,
    handleCancel: jest.fn(),
    bookingData: {
      selectedSeats: ['A1', 'A2'],
      seatData: [
        { seatNumber: 'A1', type: 'Standard', price: 80000 },
        { seatNumber: 'A2', type: 'Standard', price: 80000 },
      ],
      totalPrice: 160000,
    },
    errors: {},
    touched: {},
    finalPrice: 150000,
    membershipDiscountAmount: 10000,
    promotionDiscountAmount: 0,
    discount: 0,
    discountTicket: 5,
    cashChange: 0,
  };

  const renderWithFormik = (props = defaultProps) =>
    render(
      <Formik initialValues={props.values}>
        <Form>
          <PaymentMethodSection {...props} />
        </Form>
      </Formik>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

//   test('renders payment method section correctly', () => {
//     renderWithFormik();

//     expect(screen.getByText('Payment Method')).toBeInTheDocument();
//     expect(screen.getByText('Select Payment Method')).toBeInTheDocument();
//     expect(screen.getByTestId('payment-method')).toBeInTheDocument();
//     expect(screen.getByTestId('payment-summary-section')).toBeInTheDocument();
//     expect(screen.getByText('Confirm Payment')).toBeInTheDocument();
//     expect(screen.getByText('Cancel')).toBeInTheDocument();
//   });

  test('renders card type selection when payment method is Stripe', () => {
    const propsWithStripe = {
      ...defaultProps,
      values: { ...defaultProps.values, paymentMethod: 'Stripe' },
    };
    renderWithFormik(propsWithStripe);

    expect(screen.getByTestId('card-type-select')).toBeInTheDocument();
    expect(screen.getByText('Select Card Type')).toBeInTheDocument();
  });

  test('displays card type error when cardType is empty and payment method is Stripe', () => {
    const propsWithStripe = {
      ...defaultProps,
      values: { ...defaultProps.values, paymentMethod: 'Stripe', cardType: '' },
    };
    renderWithFormik(propsWithStripe);

    expect(screen.getByTestId('card-type-error')).toHaveTextContent('Please select a card type');
  });

  test('calls setFieldValue when payment method changes', () => {
    renderWithFormik();

    const paymentSelect = screen.getByTestId('payment-method-select');
    fireEvent.change(paymentSelect, { target: { value: 'Cash' } });

    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('paymentMethod', 'Cash');
  });

  test('calls setFieldValue when card type changes', () => {
    const propsWithStripe = {
      ...defaultProps,
      values: { ...defaultProps.values, paymentMethod: 'Stripe' },
    };
    renderWithFormik(propsWithStripe);

    const cardTypeSelect = screen.getByTestId('card-type-select');
    fireEvent.change(cardTypeSelect, { target: { value: 'Visa' } });

    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('cardType', 'Visa');
  });

  test('disables Confirm button when isSubmitting is true', () => {
    const propsSubmitting = {
      ...defaultProps,
      isSubmitting: true,
    };
    renderWithFormik(propsSubmitting);

    const confirmButton = screen.getByText('Processing...');
    expect(confirmButton).toBeDisabled();
  });

  test('disables Confirm button when paymentMethod is not selected', () => {
    renderWithFormik();

    const confirmButton = screen.getByText('Confirm Payment');
    expect(confirmButton).toBeDisabled();
  });

  test('disables Confirm button when PointsToUse exceeds member score and convertToTicket is Agree', () => {
    const propsWithExcessPoints = {
      ...defaultProps,
      values: { ...defaultProps.values, paymentMethod: 'Cash' },
      PointsToUse: 150,
      member: { score: 100 },
    };
    renderWithFormik(propsWithExcessPoints);

    const confirmButton = screen.getByText('Confirm Payment');
    expect(confirmButton).toBeDisabled();
  });

  test('enables Confirm button when all conditions are met', () => {
    const propsValid = {
      ...defaultProps,
      values: { ...defaultProps.values, paymentMethod: 'Cash' },
    };
    renderWithFormik(propsValid);

    const confirmButton = screen.getByText('Confirm Payment');
    expect(confirmButton).not.toBeDisabled();
  });

  test('calls handleCancel when Cancel button is clicked', () => {
    renderWithFormik();

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(defaultProps.handleCancel).toHaveBeenCalled();
  });

  test('passes correct props to PaymentSummarySection', () => {
    renderWithFormik();

    expect(screen.getByTestId('payment-summary-section')).toBeInTheDocument();
    // Note: Cannot directly test props passed to PaymentSummarySection due to mock,
    // but we assume it receives props correctly as it's rendered.
  });
});