export const formatDateRange = (fromDate, toDate) => {
  const formatSingleDate = (dateStr) => {
    if (!dateStr || isNaN(new Date(dateStr).getTime())) return "TBA";
    return new Date(dateStr)
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "-");
  };

  const formattedFromDate = formatSingleDate(fromDate);
  const formattedToDate = formatSingleDate(toDate);

  return `${formattedFromDate} to ${formattedToDate}`;
};
