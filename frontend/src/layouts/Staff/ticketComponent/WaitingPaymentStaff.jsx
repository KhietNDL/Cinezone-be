import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import StripeCheckoutForm from '../../User/component/StripeCheckoutForm'
import { setVisaResponse } from '../../../redux/features/sellingSlice';
import { setComboVisaResponse } from '../../../redux/features/comboSlice';
import { toast } from 'react-toastify';
import logo from '../../../assets/logoWeb.svg';

export default function WaitingPaymentStaff() {
    const location = useLocation();
    const isCombo = location.pathname.includes('combo-selling');
    const stripeClientSecret = useSelector(state => isCombo
        ? state.combo.stripeClientSecret
        : state.selling.stripeClientSecret);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    return (
        <div className="p-4 mx-auto w-full bg-[#fafbfc]">
            <h1 className="text-3xl font-bold mb-4 text-[#9810FA] justify-between items-center flex flex-col sm:flex-row">
                Pay with Stripe
            </h1>
            <div className="mt-6 text-center w-full lg:w-[50%] mx-auto bg-[#201A3E] p-8 rounded-2xl">
                 <img src={logo} alt="Logo" className="w-50 h-auto mx-auto" />
                {stripeClientSecret && (
                    <StripeCheckoutForm
                        clientSecret={stripeClientSecret.clientSecret}
                        onSuccess={(paymentIntent) => {
                            if (isCombo) {

                                dispatch(setComboVisaResponse(paymentIntent));
                                toast.success("Payment successful!");
                                setTimeout(() => {
                                    navigate("/staff/combo-selling/combo-information");
                                }, 1000);
                            } else {
                                dispatch(setVisaResponse(paymentIntent));
                                toast.success("Payment successful!");
                                setTimeout(() => {
                                    navigate("/staff/ticket-selling/ticket-information");
                                }, 1000);
                            }
                        }}
                        // theme='stripe'
                    />
                )}
            </div>
        </div>
    )
}