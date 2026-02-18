export const compareDateWithCurrentTime = (date) => {
  const currentTime = new Date().getTime();
  const selectedTime = new Date(date).getTime();

  if (currentTime < selectedTime) {
    return -1;
  } else if (currentTime > selectedTime) {
    return 1;
  } else {
    return 0;
  }
};

export const compareTakenWithSelectedTime = (takenDate, selectedDate) => {
  const takenTime = new Date(takenDate).getTime();
  const selectedTime = new Date(selectedDate).getTime();

  if (takenTime < selectedTime) {
    return -1;
  } else if (takenTime > selectedTime) {
    return 1;
  } else {
    return 0;
  }
};
