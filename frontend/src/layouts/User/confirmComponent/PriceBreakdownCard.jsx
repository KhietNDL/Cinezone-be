const PriceBreakdownCard = ({ 
  selectedSeats, 
  seatPrice, 
  discountedSeatPrice, 
  discountAmount, 
  userDiscount,
  product, 
  productPrice, 
  finalPrice, 
  discountType,
  formatPrice 
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg md:text-xl font-bold text-white mb-4">Price</h3>
      <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
        <div className="space-y-3">
          {/* Seat Price */}
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Seats ({selectedSeats.join(", ")})</span>
            <div className="text-right">
              {discountAmount > 0 ? (
                <>
                  <span className="text-gray-400 line-through text-sm">{formatPrice(seatPrice)}</span>
                  <br />
                  <span className="text-white font-semibold">{formatPrice(discountedSeatPrice)}</span>
                </>
              ) : (
                <span className="text-white font-semibold">{formatPrice(seatPrice)}</span>
              )}
            </div>
          </div>
          {/* Membership Discount Toggle */}
{/* <div className="flex items-center mb-2">
  <input
    type="checkbox"
    checked={useMembershipDiscount}
    onChange={(e) => setUseMembershipDiscount(e.target.checked)}
    id="membership-discount-toggle"
    className="mr-2"
  />
  <label htmlFor="membership-discount-toggle" className="text-sm">
    Áp dụng giảm giá theo hạng thành viên
  </label>
</div> */}
          <div>
            <p className="flex justify-end text-sm text-green-400">Member Discount {userDiscount}%</p>
          </div>

          {/* Product Price */}
          {product && Array.isArray(product) && product.length > 0 && (
            <>
              <div className="flex justify-between items-center text-gray-300">
                {product.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.ProductName} x{item.Quantity}</span>
                  </div>
                ))}
                <span className="text-white font-semibold">{formatPrice(productPrice)}</span>
              </div>
            </>
          )}

          {/* Discount Display */}
          {discountAmount > 0 && (
            <div className="flex justify-between items-center text-green-400">
              <span>Seat Discount ({discountType})</span>
              <span>-{formatPrice(discountAmount)}</span>
            </div>
          )}

          {/* Final Total */}
          <div className="flex justify-between items-center text-lg font-bold border-t border-white/20 pt-3 mt-3">
            <span className="text-white">Total Amount</span>
            <span className="text-purple-300">{formatPrice(finalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceBreakdownCard;