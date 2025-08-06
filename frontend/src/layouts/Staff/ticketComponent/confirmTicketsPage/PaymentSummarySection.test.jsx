/* eslint-disable no-undef */
import React from 'react';
// import { render, screen, fireEvent } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import { Formik, Form } from 'formik';
import PaymentSummarySection from './PaymentSummarySection';
import { CheckOutlined } from '@ant-design/icons';

// Mock các icon components
jest.mock('react-icons/fa', () => ({
  FaMoneyBillWave: () => <span>FaMoneyBillWave</span>,
  FaCouch: () => <span>FaCouch</span>,
  FaFire: () => <span>FaFire</span>,
}));

jest.mock('@ant-design/icons', () => ({
  CheckOutlined: () => <span>CheckOutlined</span>,
}));

describe('PaymentSummarySection', () => {
  const defaultProps = {
    bookingData: {
      selectedSeats: ['A1', 'A2', 'B1'],
      seatData: [
        { seatNumber: 'A1', type: 'Standard', price: 80000 },
        { seatNumber: 'A2', type: 'Standard', price: 80000 },
        { seatNumber: 'B1', type: 'VIP', price: 120000 },
      ],
      totalPrice: 280000,
    },
    values: {
      paymentMethod: 'Cash',
      cashGiven: 0,
      convertToTicket: 'Agree',
    },
    setFieldValue: jest.fn(),
    errors: {},
    touched: {},
    PointsToUse: 50,
    finalPrice: 230000,
    membershipDiscountAmount: 30000,
    promotionDiscountAmount: 20000,
    memberChecked: true,
    member: { score: 100 },
    discount: 10,
    discountTicket: 5,
    cashChange: 0,
  };

  const renderWithFormik = (props = defaultProps) =>
    render(
      <Formik initialValues={props.values}>
        <Form>
          <PaymentSummarySection {...props} />
        </Form>
      </Formik>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

//   test('renders payment summary correctly', () => {
//     renderWithFormik();

//     expect(screen.getByText('Payment Summary')).toBeInTheDocument();
//     expect(screen.getByText('Standard Seat × 2')).toBeInTheDocument();
//     expect(screen.getByText('Seats: A1, A2')).toBeInTheDocument();
//     expect(screen.getByText('160,000 VNĐ')).toBeInTheDocument();
//     expect(screen.getByText('80,000 VNĐ each')).toBeInTheDocument();
//     expect(screen.getByText('VIP Seat × 1')).toBeInTheDocument();
//     expect(screen.getByText('Seats: B1')).toBeInTheDocument();
//     expect(screen.getByText('120,000 VNĐ')).toBeInTheDocument();
//     expect(screen.getByText('Total Amount')).toBeInTheDocument();
//     expect(screen.getByText('230,000 VNĐ')).toBeInTheDocument();
//   });

//   test('renders membership and promotion discounts correctly', () => {
//     renderWithFormik();

//     expect(screen.getByText('Membership discount (5%):')).toBeInTheDocument();
//     expect(screen.getByText('-30,000 VNĐ')).toBeInTheDocument();
//     expect(screen.getByText('Promotion code discount (10%):')).toBeInTheDocument();
//     expect(screen.getByText('-20,000 VNĐ')).toBeInTheDocument();
//   });

  test('renders points usage information when memberChecked and convertToTicket is Agree', () => {
    renderWithFormik();

    expect(screen.getByText('Points used:')).toBeInTheDocument();
    expect(screen.getByText('-50')).toBeInTheDocument();
    expect(screen.getByText('Conversion rate:')).toBeInTheDocument();
    expect(screen.getByText('1,000 VNĐ = 1 point')).toBeInTheDocument();
    expect(screen.getByText('Points needed:')).toBeInTheDocument();
    expect(screen.getByText('280 points')).toBeInTheDocument();
  });

  test('shows insufficient points error when PointsToUse exceeds member score', () => {
    const propsWithLowPoints = {
      ...defaultProps,
      PointsToUse: 150, // Hơn điểm thành viên (100)
      member: { score: 100 },
    };
    renderWithFormik(propsWithLowPoints);

    expect(screen.getByText('Not enough points to complete this transaction')).toBeInTheDocument();
  });

  test('shows insufficient points error when PointsToUse is 0', () => {
    const propsWithZeroPoints = {
      ...defaultProps,
      PointsToUse: 0,
    };
    renderWithFormik(propsWithZeroPoints);

    expect(screen.getByText('Not enough points to complete this transaction')).toBeInTheDocument();
  });

//   test('renders cash input field for Cash payment method', () => {
//     renderWithFormik();

//     const cashInput = screen.getByPlaceholderText('Minimum: 230,000 VNĐ');
//     expect(cashInput).toBeInTheDocument();
//     expect(cashInput).toHaveAttribute('type', 'number');
//     expect(cashInput).toHaveAttribute('min', '230000');
//   });

//   test('calls setFieldValue when cash input changes', () => {
//     renderWithFormik();

//     const cashInput = screen.getByPlaceholderText('Minimum: 230,000 VNĐ');
//     fireEvent.change(cashInput, { target: { value: '250000' } });

//     expect(defaultProps.setFieldValue).toHaveBeenCalledWith('cashGiven', 250000);
//   });

//   test('displays cash change when cashGiven is sufficient', () => {
//     const propsWithCash = {
//       ...defaultProps,
//       values: { ...defaultProps.values, cashGiven: 250000 },
//       cashChange: 20000,
//     };
//     renderWithFormik(propsWithCash);

//     expect(screen.getByText('Change:')).toBeInTheDocument();
//     expect(screen.getByText('20,000 VNĐ')).toBeInTheDocument();
//   });

  test('displays error message when cashGiven has errors and is touched', () => {
    const propsWithError = {
      ...defaultProps,
      errors: { cashGiven: 'Insufficient amount' },
      touched: { cashGiven: true },
    };
    renderWithFormik(propsWithError);

    expect(screen.getByText('Insufficient amount')).toBeInTheDocument();
  });

  test('does not render cash input for non-Cash payment method', () => {
    const propsWithCard = {
      ...defaultProps,
      values: { ...defaultProps.values, paymentMethod: 'Card' },
    };
    renderWithFormik(propsWithCard);

    expect(screen.queryByPlaceholderText('Minimum: 230,000 VNĐ')).not.toBeInTheDocument();
  });

  test('does not render discounts when amounts are 0', () => {
    const propsWithoutDiscounts = {
      ...defaultProps,
      membershipDiscountAmount: 0,
      promotionDiscountAmount: 0,
    };
    renderWithFormik(propsWithoutDiscounts);

    expect(screen.queryByText('Membership discount')).not.toBeInTheDocument();
    expect(screen.queryByText('Promotion code discount')).not.toBeInTheDocument();
  });

  test('does not render points section when memberChecked is false', () => {
    const propsWithoutMember = {
      ...defaultProps,
      memberChecked: false,
    };
    renderWithFormik(propsWithoutMember);

    expect(screen.queryByText('Points used:')).not.toBeInTheDocument();
    expect(screen.queryByText('Conversion rate:')).not.toBeInTheDocument();
  });
});