/* eslint-disable no-undef */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Formik, Form } from 'formik';
import MemberSearchSection from './MemberSearchSection';
import MemberRank from '../../component/MemberRank';
import { Button, Switch } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { FaUser, FaIdCard, FaEnvelope, FaPhone, FaStar, FaExchangeAlt, FaFire, FaX } from 'react-icons/fa6';
import { BiSolidDiscount, IoSearch, IoAddOutline, FiLoader } from 'react-icons/io5';

// Mock các icon components
jest.mock('react-icons/fa6', () => ({
  FaUser: () => <span>FaUser</span>,
  FaIdCard: () => <span>FaIdCard</span>,
  FaEnvelope: () => <span>FaEnvelope</span>,
  FaPhone: () => <span>FaPhone</span>,
  FaStar: () => <span>FaStar</span>,
  FaExchangeAlt: () => <span>FaExchangeAlt</span>,
  FaFire: () => <span>FaFire</span>,
  FaX: () => <span>FaX</span>,
}));
jest.mock('react-icons/io5', () => ({
  BiSolidDiscount: () => <span>BiSolidDiscount</span>,
  IoSearch: () => <span>IoSearch</span>,
  IoAddOutline: () => <span>IoAddOutline</span>,
  FiLoader: () => <span>FiLoader</span>,
}));
jest.mock('@ant-design/icons', () => ({
  CheckOutlined: () => <span>CheckOutlined</span>,
}));

// Mock MemberRank component
jest.mock('../../component/MemberRank', () => ({ rank, pointsMemberShip }) => (
  <div data-testid="member-rank">
    {rank} - {pointsMemberShip} points
  </div>
));

// Mock Ant Design components
jest.mock('antd', () => ({
  Button: ({ children, loading, disabled, danger, type, className, ...props }) => (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${className} ${type === 'primary' ? 'ant-btn-primary' : ''} ${danger ? 'ant-btn-dangerous' : ''}`}
    >
      {loading ? <span data-testid="loading">Loading...</span> : children}
    </button>
  ),
  Switch: ({ checked, onChange, checkedChildren, unCheckedChildren, className }) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className={className}
      data-checked={checkedChildren}
      data-unchecked={unCheckedChildren}
      data-testid="switch"
    />
  ),
}));

describe('MemberSearchSection', () => {
  const defaultProps = {
    values: {
      memberSearch: '',
      convertToTicket: 'Disagree',
      promotionCode: '',
    },
    setFieldValue: jest.fn(),
    memberChecked: false,
    member: null,
    discount: 0,
    discountTicket: 0,
    isSearching: false,
    handleMemberSearch: jest.fn(),
    handleAddPromotion: jest.fn(),
    setDiscount: jest.fn(),
  };

  const renderWithFormik = (props = defaultProps) =>
    render(
      <Formik initialValues={props.values} onSubmit={jest.fn()}>
        <Form>
          <MemberSearchSection {...props} />
        </Form>
      </Formik>
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders member search section correctly', () => {
    renderWithFormik();

    expect(screen.getByText('Member Search')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email / Phone / ID')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  test('calls handleMemberSearch when search button is clicked', async () => {
    renderWithFormik({ ...defaultProps, values: { ...defaultProps.values, memberSearch: 'test@example.com' } });

    await act(async () => {
      fireEvent.click(screen.getByText('Search'));
    });

    expect(defaultProps.handleMemberSearch).toHaveBeenCalledWith('test@example.com');
  });

  test('shows loading state on search button when isSearching is true', () => {
    renderWithFormik({ ...defaultProps, isSearching: true });

    const searchButton = screen.getByText('Loading...').closest('button');
    expect(searchButton).toBeDisabled();
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  test('renders member information when memberChecked is true and member exists', () => {
    const propsWithMember = {
      ...defaultProps,
      memberChecked: true,
      member: {
        identityCard: '123456789',
        fullName: 'John Doe',
        email: 'john@example.com',
        phone: '1234567890',
        rank: 'Gold',
        pointsMemberShip: 500,
        score: 100,
      },
    };
    renderWithFormik(propsWithMember);

    expect(screen.getByText('Member Found')).toBeInTheDocument();
    expect(screen.getByText('123456789')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
    expect(screen.getByTestId('member-rank')).toHaveTextContent('Gold - 500 points');
    expect(screen.getByText('100 pts')).toBeInTheDocument();
  });

//   test('toggles convertToTicket when switch is changed', async () => {
//     const propsWithMember = {
//       ...defaultProps,
//       memberChecked: true,
//       member: { score: 100 },
//     };
//     renderWithFormik(propsWithMember);

//     const switchInput = screen.getByTestId('switch');

//     await act(async () => {
//       fireEvent.click(switchInput);
//     });

//     expect(defaultProps.setFieldValue).toHaveBeenCalledWith('convertToTicket', 'Agree');

//     await act(async () => {
//       fireEvent.click(switchInput);
//     });

//     expect(defaultProps.setFieldValue).toHaveBeenCalledWith('convertToTicket', 'Disagree');
//   });

  test('shows conversion rate info when convertToTicket is Agree', () => {
    const propsWithPoints = {
      ...defaultProps,
      values: { ...defaultProps.values, convertToTicket: 'Agree' },
      memberChecked: true,
      member: { score: 100 },
    };
    renderWithFormik(propsWithPoints);

    expect(screen.getByText('💡 Rate: 1 point = 1,000 VNĐ')).toBeInTheDocument();
  });

  test('disables promotion code input when convertToTicket is Agree', () => {
    const propsWithPoints = {
      ...defaultProps,
      values: { ...defaultProps.values, convertToTicket: 'Agree' },
      memberChecked: true,
      member: { score: 100 },
    };
    renderWithFormik(propsWithPoints);

    const promotionInput = screen.getByPlaceholderText('Enter promotion code');
    expect(promotionInput).toBeDisabled();
  });

  test('calls handleAddPromotion when Apply button is clicked', async () => {
    const propsWithPromotion = {
      ...defaultProps,
      values: { ...defaultProps.values, promotionCode: 'PROMO123', convertToTicket: 'Disagree' },
      memberChecked: true,
      member: { score: 100 },
    };
    renderWithFormik(propsWithPromotion);

    await act(async () => {
      fireEvent.click(screen.getByText('Apply'));
    });

    expect(defaultProps.handleAddPromotion).toHaveBeenCalledWith('PROMO123', defaultProps.setFieldValue);
  });

//   test('disables Apply button when promotionCode is empty or convertToTicket is Agree', () => {
//     const propsWithPoints = {
//       ...defaultProps,
//       values: { ...defaultProps.values, convertToTicket: 'Agree' },
//       memberChecked: true,
//       member: { score: 100 },
//     };
//     renderWithFormik(propsWithPoints);

//     expect(screen.getByText('Apply').closest('button')).toBeDisabled();

//     const propsNoCode = {
//       ...defaultProps,
//       values: { ...defaultProps.values, promotionCode: '', convertToTicket: 'Disagree' },
//       memberChecked: true,
//       member: { score: 100 },
//     };
//     renderWithFormik(propsNoCode);

//     expect(screen.getByText('Apply').closest('button')).toBeDisabled();
//   });

  test('calls setDiscount and clears promotionCode when Remove button is clicked', async () => {
    const propsWithDiscount = {
      ...defaultProps,
      discount: 10,
      values: { ...defaultProps.values, promotionCode: 'PROMO123', convertToTicket: 'Disagree' },
      memberChecked: true,
      member: { score: 100 },
    };
    renderWithFormik(propsWithDiscount);

    await act(async () => {
      fireEvent.click(screen.getByText('Remove'));
    });

    expect(defaultProps.setDiscount).toHaveBeenCalledWith(null);
    expect(defaultProps.setFieldValue).toHaveBeenCalledWith('promotionCode', '');
  });

  test('renders discount information when discountTicket or discount is present', () => {
    const propsWithDiscounts = {
      ...defaultProps,
      discount: 10,
      discountTicket: 5,
      values: { ...defaultProps.values, convertToTicket: 'Disagree' },
      memberChecked: true,
      member: { score: 100 },
    };
    renderWithFormik(propsWithDiscounts);

    expect(screen.getByText('Membership discount: 5% applied')).toBeInTheDocument();
    expect(screen.getByText('Promotion discount: 10% applied')).toBeInTheDocument();
  });

  test('does not render promotion discount when convertToTicket is Agree', () => {
    const propsWithDiscount = {
      ...defaultProps,
      discount: 10,
      values: { ...defaultProps.values, convertToTicket: 'Agree' },
      memberChecked: true,
      member: { score: 100 },
    };
    renderWithFormik(propsWithDiscount);

    expect(screen.queryByText('Promotion discount: 10% applied')).not.toBeInTheDocument();
  });
});