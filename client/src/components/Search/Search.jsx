import React from "react";
import styled from "styled-components";
import { useLocation } from "react-router-dom";

const Form = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  input {
    width: 68vw;
    font-size: 18px;
    letter-spacing: 0.1px;
    padding: 12px;
    border: 1px solid pink;
    margin: 40px;
    text-align: center;
    box-shadow: 5px 5px peachpuff;
  }
  @media screen and (min-width: 1200px) {
    input {
      width: 50vw;
    }
  }
  input:focus {
    outline: none;
  }
`;

function Search({ search, setSearch }) {
  let location = useLocation();

  const checkPath = () => {
    if (
      location.pathname === "/insights" ||
      location.pathname === "/insights/"
    ) {
      return "Search by insight title or user";
    }
    if (location.pathname === "/users" || location.pathname === "/users/")
      return "Search by user's name";
  };

  return (
    <Form>
      <input
        type="text"
        name="search"
        id="search"
        placeholder={checkPath()}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </Form>
  );
}

export default Search;