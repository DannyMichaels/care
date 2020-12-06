import React from "react";
import SentimentVeryDissatisfiedIcon from "@material-ui/icons/SentimentVeryDissatisfied";

function PoorEmoji({ lightMode }) {
  return (
    <SentimentVeryDissatisfiedIcon
      style={
        !lightMode
          ? {
              border: "1px solid black",
              background: "red",
              fontSize: "36px",
            }
          : {
              border: "1px solid black",
              background: "red",
              fontSize: "36px",
              color: "black",
            }
      }
    />
  );
}

export default PoorEmoji;
