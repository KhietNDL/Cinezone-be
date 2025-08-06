import { LayoutSelectSeat } from "../../../component/LayoutSelectSeat";
import { toast } from "react-toastify";
import { LayoutSelectSeat1 } from "../../../component/LayoutSelectSeat1";

const DNALoader = () => (
  <div className="relative w-12 h-12 mx-auto">
    <div
      className="absolute inset-0 animate-spin"
      style={{ animation: "spin 2s linear infinite" }}
    >
      <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full absolute left-1 top-0 animate-pulse"></div>
      <div
        className="w-1 h-6 bg-gradient-to-b from-pink-400 to-purple-600 rounded-full absolute right-1 bottom-0 animate-pulse"
        style={{ animationDelay: "0.5s" }}
      ></div>
    </div>
    <div
      className="absolute inset-0 animate-spin"
      style={{ animation: "spin 2s linear infinite reverse" }}
    >
      <div
        className="w-1 h-4 bg-gradient-to-b from-green-400 to-emerald-600 rounded-full absolute left-2 top-1 animate-pulse"
        style={{ animationDelay: "0.25s" }}
      ></div>
      <div
        className="w-1 h-4 bg-gradient-to-b from-yellow-400 to-orange-600 rounded-full absolute right-2 bottom-1 animate-pulse"
        style={{ animationDelay: "0.75s" }}
      ></div>
    </div>
  </div>
);

const SeatMap = ({
  seatsData,
  selectedSeats,
  seatQuantity,
  selectedShowtimeId,
  lastRefreshTime,
  isRefreshing,
  user,
  onRefresh,
  dispatch,
  navigate,
}) => {
  return (
    <div className="flex-1 flex flex-col">
      {selectedShowtimeId && (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h3 className="text-lg md:text-xl font-bold text-white">
            Select Your Seats
          </h3>
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gradient-to-r from-purple-600/20 via-purple-500/60 to-purple-600/20 rounded-xl text-purple-300 hover:text-purple-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-xs md:text-sm font-medium">
              {isRefreshing ? "Refreshing..." : "Refresh Seats"}
            </span>
          </button>
        </div>
      )}
      <div className="flex-1 flex flex-col justify-center">
        {seatsData.length > 0 ? (
          <div className="flex justify-center bg-white/2 rounded-2xl p-3 md:p-6 border border-white/10 overflow-x-auto">
            <LayoutSelectSeat
              key={`${selectedShowtimeId}-${lastRefreshTime}`}
              initialSelectedSeats={selectedSeats}

              seatDataFromAPI={seatsData}
              totalSeats={seatQuantity}
              onSeatSelect={({ seats, totalPrice, seatIds }) => {
                if (!user) {
                  toast.error("Please sign in to select seats", {
                    duration: 4000,
                    position: "top-center",
                  });
                  setTimeout(() => navigate("/login"), 1000);
                  return;
                }
                dispatch({
                  type: "booking/setSelectedSeats",
                  payload: seats.map((s) => s.seatNumber),
                });
                dispatch({
                  type: "booking/setCalculatedTotalPrice",
                  payload: totalPrice,
                });
                dispatch({ type: "booking/setSeatIds", payload: seatIds });
              }}
              width={24}
              height={24}
              widthDouble={65}
              heightDouble={40}
              gapX={3}
              textColor="text-blue-300/70"
              seatColors={{
                available: "text-gray-500",
                selected: "text-[#5341DB]",
                taken: "text-[#6A7282]",
                holding: "text-gray-200",
                vip: "text-[#FFE3B3]/70",
                normal: "text-[#752090]",
                couple: "text-[#C957BC]/90",
              }}
            />
          </div>
        ) : (
          <div className="text-center h-full w-full py-8 md:py-12 bg-white/5 rounded-2xl text-gray-400">
            <DNALoader />
            <p className="font-semibold mt-2 text-sm md:text-base">
              {isRefreshing ? "Refreshing seats..." : "Please select showtimes ..."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatMap;
