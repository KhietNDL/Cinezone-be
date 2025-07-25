import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import StripeCheckoutForm from '../../User/component/StripeCheckoutForm'
import { setVisaResponse } from '../../../redux/features/sellingSlice';
import { setComboVisaResponse } from '../../../redux/features/comboSlice';
import { toast } from 'react-toastify';
import logo from '../../../assets/logoWeb.svg';
import BackButton from '../component/BackButton';
import { cancelBookingById, cancelProductsById } from '../../../services/APIForStaff/API';
import { IoMdArrowRoundBack } from 'react-icons/io';

export default function WaitingPaymentStaff() {
    const location = useLocation();
    const isCombo = location.pathname.includes('combo-selling');
    const stripeClientSecret = useSelector(state => isCombo
        ? state.combo.stripeClientSecret
        : state.selling.stripeClientSecret);

    const cancelId = useSelector(state => isCombo
        ? state.combo.orderProductId
        : state.selling.bookingId);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleCancel = async () => {
        try {
            if (isCombo) {
                await cancelProductsById(cancelId);
                toast.success("Order cancelled successfully.");
            } else {
                await cancelBookingById(cancelId);
                toast.success("Booking cancelled successfully.");
            }
           
            navigate(-1);
        } catch (error) {
            toast.error("Failed to cancel the booking.");
            console.log("Error cancelling booking:", error);
        }
    };

    return (
        <div className="p-4 mx-auto w-full bg-[#fafbfc]">
            <div className="flex flex-col items-start justify-center gap-4 mb-6">
                <div>
                    <button
                        onClick={handleCancel}
                        className='text-white bg-[#9810FA] hover:bg-[#9810fa9d] px-3 py-2 flex items-center gap-1 rounded-xl cursor-pointer'>
                        <IoMdArrowRoundBack className="text-xl flex-shrink-0" />
                        <p className='font-semibold text-lg'>
                            Back
                        </p>
                    </button>
                </div>
                <h1 className="text-3xl font-bold text-[#9810FA] flex lg:items-start items-center lg:justify-start justify-center flex-col">
                    Pay with Stripe
                </h1>
            </div>
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
                    />
                )}
            </div>
        </div>
    )
}
