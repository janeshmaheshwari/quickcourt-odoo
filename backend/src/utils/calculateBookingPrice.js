import moment from "moment";

const calculateBookingPrice = (startTime, endTime, pricePerHour) => {
  const start = moment(startTime, "HH:mm");
  const end = moment(endTime, "HH:mm");
  const duration = moment.duration(end.diff(start)).asHours();
  return duration * pricePerHour;
};

export default calculateBookingPrice;
