import React from "react";
import SentimentSatisfiedIcon from "@material-ui/icons/SentimentSatisfied";

function OkayEmoji({ lightMode }) {
  return (
    <>
      <SentimentSatisfiedIcon
        style={
          !lightMode
            ? {
                border: "1px solid black",
                background: "yellow",
                fontSize: "36px",
              }
            : {
                border: "1px solid black",
                background: "yellow",
                fontSize: "36px",
                color: "black",
              }
        }
      />
    </>
  );
}

export default OkayEmoji;
