import React, { useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

function DateCarousel() {
  //
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const getDaysInMonth = (year, month) => {
    return 32 - new Date(year, month, 32).getDate();
  };

  const today = new Date();
  const [dateRange, setDateRange] = useState(() => {
    let totalDays = getDaysInMonth(today.getFullYear(), today.getMonth());
    let currentDay = today.getDate();
    let currentDate = today.getDate();
    let difference = totalDays - currentDate;
    if (difference > 2) {
      return [
        // $todo?
        // inifinite scroll backwards, but block furture dates so last date is at the right.
        {
          date: currentDate - 2,
          day: days[new Date(new Date().setDate(currentDate - 2)).getDay()],
        },
        {
          date: currentDate - 1,
          day: days[new Date(new Date().setDate(currentDate - 1)).getDay()],
        },
        {
          date: currentDate,
          day: days[new Date(new Date().setDate(currentDate)).getDay()],
        },
        {
          date: currentDate + 1,
          day: days[new Date(new Date().setDate(currentDate + 1)).getDay()],
        },
        {
          date: currentDate + 2,
          day: days[new Date(new Date().setDate(currentDate + 2)).getDay()],
        },
      ];
    }
  });

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
  };

  return (
    <>
      <Slider {...settings}>
        {dateRange.map((dateInfo) => (
          <div>
            <h2>{dateInfo.day}</h2>
            <h3>{dateInfo.date}</h3>
          </div>
        ))}

        {/* <div>
          <h3>2</h3>
        </div>
        <div>
          <h3>3</h3>
        </div>
        <div>
          <h3>4</h3>
        </div>
        <div>
          <h3>5</h3>
        </div>
        <div>
          <h3>6</h3>
        </div> */}
      </Slider>
    </>
  );
}

export default DateCarousel;
