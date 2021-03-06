import { grey, yellow } from "@material-ui/core/colors";
import styled from "styled-components";

const Wrapper = styled.div`
  .content-container {
    margin: 0 auto;
    display: flex;
    flex-direction: column;

    footer {
      display: block;
    }

    .buttons {
      display: flex;
      flex-direction: row;
      align-self: center;
    }
  }

  .title-container {
    align-self: center;
    margin-top: 40px;
    text-align: center;
    color: ${({ themeState }) => (themeState === "dark" ? grey[100] : "#000")};
  }

  .insight-page {
    margin: 0 auto;
    margin-top: 20px;
    color: ${({ themeState }) => (themeState === "dark" ? grey[100] : "#000")};
    text-align: left;
  }

  .insight-comments {
    display: "block";
    margin-top: 20px;
    color: ${({ themeState }) => (themeState === "dark" ? grey[100] : "#000")};
    text-align: left;
  }

  .comment-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 40px 20px;
  }

  .hr-bottom {
    margin-top: 10px;
    margin-bottom: 13px;
  }
  .user-name {
    font-size: 1.3rem;
    font-size: clamp(1rem, 3vw, 1.3rem);
    transition: transform 250ms ease-in-out;
    padding: 2px;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
  }

  .arrow-container {
    position: absolute;
    left: 0;
    padding: 10px;
    top: 0;
  }

  .arrow-icon {
    font-size: clamp(30px, 10vw, 60px);
    padding: 1px;
  }

  .user-icon {
    margin-right: 10px;
    margin-bottom: -2px;
    font-size: 30px;
  }

  .user-name:hover {
    text-decoration: underline;
    text-decoration-color: ${({ themeState }) =>
      themeState === "dark" ? yellow[700] : "#000"};
    cursor: pointer;
    transition: transform 250ms ease-in-out;
    cursor: pointer;
    transform: scale(1.09);
  }

  .user-image {
    height: 40px;
    width: 40px;
    border-radius: 40px;
    margin-right: 8px;
    object-fit: cover;
  }

  .link {
    text-decoration: none;
    color: ${({ themeState }) => (themeState === "dark" ? "#fff" : "#000")};
    cursor: pointer;
  }

  .edit {
    margin-right: 10px;
  }

  hr {
    margin-top: 20px;
  }

  .inner-column {
    width: 98%;
    max-width: 1100px;
    padding: 20px;
    min-height: 600px;
  }

  .inner-column-button {
    width: 98%;
    max-width: 1100px;
    padding-top: 20px;
    padding-bottom: 10px;
    min-height: 20px;
    display: flex;
    justify-content: center;
    align-items: center; 
    margin: 0 auto;
  }

  .insight-text {
    line-height: 1.5rem;
    font-size: clamp(12px, 10vw, 16px);
  }

  .title {
    font-size: 1.6rem;
    font-size: clamp(1rem, 4vw, 4vh);
    padding-top: 20px;
    text-align: center;
  }

  .comments-title {
    font-size: 1.6rem;
    font-size: clamp(1rem, 4vw, 4vh);
    padding: 20px;
    text-align: center;
  }

  .no-comments {
    font-size: 1.6rem;
    font-size: clamp(0.9rem, 4vw, 3.6vh);
    padding: 5px;
    margin-top: 5px;
    text-align: center;
  }

  .create-comment {
    margin: 0 auto;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding: 10px;
  }

  .input-container.content {
    margin-top: 20px;
    padding: 20px;
    .create-comment-input {
      width: 50vw;
    }
    .create-comment-button {
      margin-top: 20px;
    }
  }

  @media screen and (min-width: 600px) {
    .inner-column {
      width: 98%;
      max-width: 1100px;
      padding: 20px 50px;
    }

    .insight-text {
      font-size: 1rem;
      font-size: clamp(1rem, 20vw 1.1rem);
    }

    @media screen and (min-width: 1280px) {
      .insight-text {
        font-size: 1.3rem;
        font-size: clamp(1.3rem, 20vw, 1.4rem);
        line-height: 1.7rem;
      }

      .inner-column {
        width: 98%;
        max-width: 1100px;
        padding: 20px 20px;
      }
    }
  }
`;

export default Wrapper;
