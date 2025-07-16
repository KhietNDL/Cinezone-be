import { Listbox } from "@headlessui/react";
import { FaChevronDown } from "react-icons/fa";
import { Fragment } from "react";

const TimeDropdown = ({
  timeOptions,
  selectedShowtimeId,
  dispatch,
}) => {
  const flatShowtimes = timeOptions.flatMap((ver) =>
    ver.showtimes.map((s) => ({
      ...s,
      version: ver.version,
    }))
  );

  const selected = flatShowtimes.find((s) => s.showtimeId === selectedShowtimeId);

  const handleSelect = (selectedItem) => {
    if (!selectedItem) {
      dispatch({ type: "booking/setSelectedTime", payload: "" });
      dispatch({ type: "booking/setSelectedRoom", payload: "" });
      dispatch({ type: "booking/setSelectedShowtimeId", payload: null });
    } else {
      dispatch({ type: "booking/setSelectedTime", payload: selectedItem.time });
      dispatch({
        type: "booking/setSelectedRoom",
        payload: `Room ${selectedItem.roomName} — ${selectedItem.version}`,
      });
      dispatch({
        type: "booking/setSelectedShowtimeId",
        payload: selectedItem.showtimeId,
      });
    }
  };

  return (
    <div className="w-full md:w-64 lg:w-80">
      <label className="block mb-4 text-white font-bold text-lg md:text-xl text-center md:text-left">
        Time
      </label>
      <Listbox value={selected} onChange={handleSelect}>
        <div className="relative">
          <Listbox.Button className="w-full py-3 pl-4 pr-10 text-sm font-semibold text-white text-left
            bg-gradient-to-r from-[#2b2a4c] to-[#3e3a6f]
            border border-purple-500/30 hover:border-purple-400/50
            focus:outline-none focus:ring-2 focus:ring-purple-500
            rounded-2xl shadow-md">
            {selected ? `${selected.time} - (${selected.version})` : "Choose Time"}
            <FaChevronDown className="absolute top-1/2 right-4 -translate-y-1/2 text-purple-300 text-sm pointer-events-none" />
          </Listbox.Button>
          <Listbox.Options className="absolute mt-2 w-full bg-white rounded-2xl shadow-lg z-10 max-h-60 overflow-auto">
            {flatShowtimes.map((s) => (
              <Listbox.Option
                key={s.showtimeId}
                value={s}
                className={({ active }) =>
                  `cursor-pointer select-none py-2 px-4 text-sm ${
                    active ? "bg-purple-100 text-purple-900" : "text-gray-900"
                  }`
                }
              >
                {s.time} - ({s.version})
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
};

export default TimeDropdown;
