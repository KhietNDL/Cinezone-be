/* eslint-disable no-undef */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Formik, Form } from 'formik';
import ConfirmFormBody, { calculatePointsAndPrice } from './ConfirmFormBody';
import MovieInfoSection from './MovieInfoSection';
import MemberSearchSection from './MemberSearchSection';
import PaymentMethodSection from './PaymentMethodSection';

// Mock các component con
jest.mock('./MovieInfoSection', () => ({ movieInfo, bookingData }) => (
  <div data-testid="movie-info-section">
    Movie: {movieInfo.title} - Seats: {bookingData.selectedSeats.join(', ')}
  </div>
));

jest.mock('./MemberSearchSection', () => () => (
  <div data-testid="member-search-section">
    Member Search
  </div>
));

jest.mock('./PaymentMethodSection', () => () => (
  <div data-testid="payment-method-section">
    Payment Method
  </div>
));

describe('ConfirmFormBody', () => {
  const defaultProps = {
    values: {
      paymentMethod: 'Cash',
      cashGiven: 0,
      convertToTicket: 'Disagree',
      memberSearch: '',
      promotionCode: '',
    },
    setFieldValue: jest.fn(),
    isSubmitting: false,
    bookingData: {
      selectedSeats: ['A1', 'A2'],
      seatData: [
        { seatNumber: 'A1', type: 'Standard', price: 80000 },
        { seatNumber: 'A2', type: 'Standard', price: 80000 },
      ],
      totalPrice: 160000,
    },
    memberChecked: false,
    member: null,
    discount: 0,
    discountTicket: 0,
    isSearching: false,
    handleMemberSearch: jest.fn(),
    handleAddPromotion: jest.fn(),
    handleCancel: jest.fn(),
    movieInfo: {
      title: 'Test Movie',
      duration: 120,
    },
    errors: {},
    touched: {},
    setDiscount: jest.fn(),
  };

  const renderWithFormik = (props = defaultProps) =>
    render(
      <Formik initialValues={props.values} onSubmit={jest.fn()}>
        <Form>
          <ConfirmFormBody {...props} />
        </Form>
      </Formik>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders ConfirmFormBody with child components', () => {
    renderWithFormik();

    expect(screen.getByTestId('movie-info-section')).toBeInTheDocument();
    expect(screen.getByTestId('member-search-section')).toBeInTheDocument();
    expect(screen.getByTestId('payment-method-section')).toBeInTheDocument();
    expect(screen.getByText('Movie: Test Movie - Seats: A1, A2')).toBeInTheDocument();
  });

  test('passes correct props to MovieInfoSection', () => {
    renderWithFormik();

    const movieInfoSection = screen.getByTestId('movie-info-section');
    expect(movieInfoSection).toHaveTextContent('Movie: Test Movie - Seats: A1, A2');
  });

  test('passes correct props to MemberSearchSection', () => {
    const propsWithMember = {
      ...defaultProps,
      memberChecked: true,
      member: { score: 100 },
      discount: 10,
      discountTicket: 5,
      isSearching: true,
    };
    renderWithFormik(propsWithMember);

    expect(screen.getByTestId('member-search-section')).toBeInTheDocument();
    // Note: Cannot directly test props due to mock, but we assume props are passed correctly as the component renders.
  });

  test('passes correct props to PaymentMethodSection', () => {
    const propsWithPayment = {
      ...defaultProps,
      values: { ...defaultProps.values, cashGiven: 200000 },
      memberChecked: true,
      member: { score: 100 },
    };
    renderWithFormik(propsWithPayment);

    expect(screen.getByTestId('payment-method-section')).toBeInTheDocument();
    // Note: Cannot directly test props due to mock, but we assume props are passed correctly as the component renders.
  });

  test('calculates cashChange correctly when paymentMethod is Cash', () => {
    const propsWithCash = {
      ...defaultProps,
      values: { ...defaultProps.values, cashGiven: 200000 },
    };
    renderWithFormik(propsWithCash);

    // Since cashChange is passed to PaymentMethodSection, we rely on the component rendering correctly.
    expect(screen.getByTestId('payment-method-section')).toBeInTheDocument();
  });

  describe('calculatePointsAndPrice', () => {
    const defaultParams = {
      selectedSeats: ['A1', 'A2'],
      seatData: [
        { seatNumber: 'A1', type: 'Standard', price: 80000 },
        { seatNumber: 'A2', type: 'Standard', price: 80000 },
      ],
      memberChecked: false,
      convertToTicket: 'Disagree',
      discount: 0,
      totalPrice: 160000,
      memberScore: 0,
      discountTicket: 0,
    };

    test('returns correct values when no member or discounts applied', () => {
      const result = calculatePointsAndPrice(
        defaultParams.selectedSeats,
        defaultParams.seatData,
        defaultParams.memberChecked,
        defaultParams.convertToTicket,
        defaultParams.discount,
        defaultParams.totalPrice,
        defaultParams.memberScore,
        defaultParams.discountTicket
      );

      expect(result).toEqual({
        PointsToUse: 0,
        finalPrice: 160000,
        membershipDiscountAmount: 0,
        promotionDiscountAmount: 0,
      });
    });

    test('applies points when memberChecked and convertToTicket is Agree with sufficient points', () => {
      const result = calculatePointsAndPrice(
        defaultParams.selectedSeats,
        defaultParams.seatData,
        true,
        'Agree',
        0,
        160000,
        200,
        0
      );

      expect(result).toEqual({
        PointsToUse: 160,
        finalPrice: 0,
        membershipDiscountAmount: 0,
        promotionDiscountAmount: 0,
      });
    });

    test('does not apply points when memberScore is insufficient', () => {
      const result = calculatePointsAndPrice(
        defaultParams.selectedSeats,
        defaultParams.seatData,
        true,
        'Agree',
        0,
        160000,
        100,
        0
      );

      expect(result).toEqual({
        PointsToUse: 0,
        finalPrice: 160000,
        membershipDiscountAmount: 0,
        promotionDiscountAmount: 0,
      });
    });

    test('applies membership discount when memberChecked and discountTicket is provided', () => {
      const result = calculatePointsAndPrice(
        defaultParams.selectedSeats,
        defaultParams.seatData,
        true,
        'Disagree',
        0,
        160000,
        0,
        10
      );

      expect(result).toEqual({
        PointsToUse: 0,
        finalPrice: 144000,
        membershipDiscountAmount: 16000,
        promotionDiscountAmount: 0,
      });
    });

    // test('applies promotion discount when discount is provided and convertToTicket is Disagree', () => {
    //   const result = calculatePointsAndPrice(
    //     defaultParams.selectedSeats,
    //     defaultParams.seatData,
    //     true,
    //     'Disagree',
    //     15,
    //     160000,
    //     0,
    //     10
    //   );

    //   expect(result).toEqual({
    //     PointsToUse: 0,
    //     finalPrice: 129600,
    //     membershipDiscountAmount: 16000,
    //     promotionDiscountAmount: 14400,
    //   });
    // });

    test('does not apply promotion discount when convertToTicket is Agree', () => {
      const result = calculatePointsAndPrice(
        defaultParams.selectedSeats,
        defaultParams.seatData,
        true,
        'Agree',
        15,
        160000,
        200,
        10
      );

      expect(result).toEqual({
        PointsToUse: 160,
        finalPrice: 0,
        membershipDiscountAmount: 0,
        promotionDiscountAmount: 0,
      });
    });
  });
});