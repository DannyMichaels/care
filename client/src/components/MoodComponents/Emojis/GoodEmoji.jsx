import React from "react";
import SentimentSatisfiedSharpIcon from "@material-ui/icons/SentimentSatisfiedSharp";

function GoodEmoji({ lightMode }) {
  return (
    <>
      <SentimentSatisfiedSharpIcon
        style={
          !lightMode
            ? {
                border: "1px solid black",
                background: "#228B22",
                fontSize: "36px",
              }
            : {
                border: "1px solid black",
                background: "#228B22",
                fontSize: "36px",
                color: "black",
              }
        }
      />
    </>
  );
}

export default GoodEmoji;
