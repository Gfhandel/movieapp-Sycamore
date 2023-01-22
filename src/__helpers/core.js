export const getFormattedDate = (date) => {
  var options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const theDate = new Date(date);

  var formattedDate = theDate.toLocaleDateString("en-US", options);

  return formattedDate;
};
