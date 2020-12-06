import { useContext, useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import { LightModeContext } from "../../components/Context/LightModeContext";
import { yellow, grey, blue } from "@material-ui/core/colors";
import { NavLink, Redirect } from "react-router-dom";
import { CurrentUserContext } from "../../components/Context/CurrentUserContext";

const MaintenanceWrapper = styled.div`
  min-height: 100vh;
  background: ${({ lightMode }) =>
    lightMode === "light" ? grey[250] : grey[800]};

  .button {
    padding: 10px;
    margin-top: 50px;
    width: 25vw;
  }

  a {
    text-decoration: none;
  }

  .text-container {
    display: flex;
    align-items: center;
    flex-direction: column;
    color: ${({ lightMode }) => (lightMode === "light" ? "#000" : "#fff")};
    padding: 20px;
    overflow-wrap: break-word;
  }

  .title {
    margin-top: 10%;
    font-size: 2rem;
    font-family: "montserrat", sans-serif;
    color: ${({ lightMode }) => (lightMode === "light" ? "red" : yellow[700])};
  }

  .paragraph {
    font-size: 1.5rem;
    padding: "10px";
    margin-bottom: "20px";
    text-align: center;
    color: ${({ lightMode }) => (lightMode === "light" ? blue[600] : "#fff")};
  }

  @media screen and (min-width: 1000px) {
    .title {
      margin-top: 7%;
      font-size: 4rem;
    }
    .button {
      width: 20vw;
    }
    .paragraph {
      font-size: 2.5rem;
    }

    @media screen and (min-width: 1600px) {
      .title {
        margin-top: 5%;
        font-size: 5rem;
      }

      .paragraph {
        font-size: 3.5rem;
      }
    }
  }
`;

function Maintenance() {
  const [lightMode] = useContext(LightModeContext);
  const [currentUser] = useContext(CurrentUserContext);
  const [render, setRender] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setRender(false);
      window.history.back();
    }
    return <Redirect to="/" />;
  }, [currentUser]);

  return (
    <>
      {render && (
        <MaintenanceWrapper lightMode={lightMode}>
          <div className="text-container">
            <Typography className="title">
              Sorry, We're under a maintenance,
            </Typography>
            <Typography className="paragraph">
              Please try again later!
            </Typography>
            <Button
              className="button"
              variant="contained"
              color="secondary"
              component={NavLink}
              to="/"
            >
              Try again
            </Button>
          </div>
        </MaintenanceWrapper>
      )}
    </>
  );
}

export default Maintenance;
