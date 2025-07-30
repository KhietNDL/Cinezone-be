import { useState } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch } from "react-redux";
import { cancelBooking } from "../../../services/API";

const stripePromise = loadStripe("pk_test_51RihUMQ1nvt86rfmgAyf52c8e3iUK1gd3PuGxth8Cgng0hxm1dhdvj1B5fCK3zZnXXPVAdc2Qyaq6H9NgxD1Pwdt006VPZkX34");

function CheckoutForm({ clientSecret, onSuccess, totalAmount }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError("");
    
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {},
      redirect: "if_required",
    });
    console.log("Payment result:", result);
    if (result.error) {
      setError(result.error.message);
    } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
      
      console.log("PAYMENT SUCCESS !", result.paymentIntent);
      console.log("PAYMENT BY VISA SUCCESS !")
      onSuccess(result.paymentIntent);
    }
    setProcessing(false);
  };

 

  return (
    <div className="relative mb-10">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-500/10 to-blue-600/20 rounded-3xl blur-xl"></div>
      
      <div className="relative  rounded-2xl  border border-white/5 shadow-2xl p-8">
        {/* Header */}
        
        {/* Payment Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <PaymentElement 
              options={{
                layout: {
                  type: 'tabs',
                  defaultCollapsed: false,
                  radios: false,
                  spacedAccordionItems: true
                },
                fields: {
                  billingDetails: {
                    name: 'auto',
                    email: 'auto'
                  }
                }
              }}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-2xl backdrop-blur-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L5.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-red-200 text-sm font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!stripe || processing}
            className="group relative w-full overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-purple-500/80
               to-purple-600/10 hover:from-purple-600/30 hover:via-purple-600 hover:to-purple-800/30 rounded-2xl transition-all duration-300 group-hover:scale-105 group-disabled:opacity-50"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-purple-500/80
               to-purple-600/10 hover:from-purple-600/30 hover:via-purple-600 hover:to-purple-800/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative flex items-center justify-center py-4 px-8 text-white font-bold text-lg">
              {processing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Payment...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Complete Secure Payment
                </>
              )}
            </div>

            {/* Shimmer effect */}
            <div className="absolute inset-0 -top-1 -bottom-1 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 group-hover:animate-pulse"></div>
          </button>

          {/* Security badges */}
          <div className="flex items-center justify-center space-x-6 pt-4">
            <div className="flex items-center text-white/60 text-xs">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              256-bit SSL Encryption
            </div>
            <div className="flex items-center text-white/60 text-xs">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              PCI DSS Compliant
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function StripeCheckoutForm({ clientSecret, onSuccess, totalAmount }) {
  if (!clientSecret) return null;

  // Enhanced appearance configuration
  const appearance = {
    theme: 'night',
    variables: {
      colorPrimary: '#a855f7',
      colorPrimaryText: '#ffffff',
      colorBackground: '#1e1b4b',
      colorText: '#f8fafc',
      colorTextSecondary: '#cbd5e1',
      colorTextPlaceholder: '#94a3b8',
      colorDanger: '#ef4444',
      colorDangerText: '#ffffff',
      colorSuccess: '#22c55e',
      colorWarning: '#f59e0b',
      
      // Font styling
      fontFamily: '"Inter", system-ui, sans-serif',
      fontSizeBase: '16px',
      fontSizeLg: '18px',
      fontSizeSm: '14px',
      fontSizeXs: '12px',
      fontWeightNormal: '400',
      fontWeightMedium: '500',
      fontWeightBold: '600',
      
      // Border and spacing
      borderRadius: '12px',
      borderRadiusLg: '16px',
      borderRadiusSm: '8px',
      spacingUnit: '4px',
      spacingGridRow: '20px',
      spacingGridColumn: '20px',
      
      // Box shadows
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      boxShadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    rules: {
      '.Tab': {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        padding: '16px',
        transition: 'all 0.2s ease',
      },
      '.Tab:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderColor: 'rgba(168, 85, 247, 0.5)',
        transform: 'translateY(-1px)',
      },
      '.Tab--selected': {
        backgroundColor: 'rgba(168, 85, 247, 0.15)',
        borderColor: '#a855f7',
        boxShadow: '0 0 0 1px rgba(168, 85, 247, 0.3), 0 8px 25px -5px rgba(168, 85, 247, 0.3)',
      },
      '.Input': {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(168, 85, 247, 0.3)',
        borderRadius: '12px',
        padding: '14px 16px',
        fontSize: '16px',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      '.Input:focus': {
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderColor: '#a855f7',
        boxShadow: '0 0 0 3px rgba(168, 85, 247, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        outline: 'none',
      },
      '.Input::placeholder': {
        color: '#94a3b8',
        opacity: '0.8',
      },
      '.Label': {
        color: '#f1f5f9',
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      },
      '.Error': {
        color: '#fca5a5',
        fontSize: '14px',
        fontWeight: '500',
        marginTop: '8px',
      },
      '.Block': {
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
      },
      '.BlockDivider': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        height: '1px',
        margin: '20px 0',
      },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto">
      
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance,
          locale: "en",
          loader: "auto",
        }}
      >
        <CheckoutForm 
          clientSecret={clientSecret} 
          onSuccess={onSuccess} 
          totalAmount={totalAmount}
        />
      </Elements>
    </div>
  );
}