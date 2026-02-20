import styled from 'styled-components';

const Div = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.palette.background.paper};

  .title-container {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    margin-top: 70px;
    text-align: center;
  }
  .title {
    font-size: 1.2rem;
    color: ${({ theme }) => theme.palette.text.primary};
  }
  @media screen and (min-width: 1000px) {
    .title {
      font-size: 2rem;
    }
  }
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px auto;

  .input-container {
    margin: 10px;
  }
  .string-input {
    min-width: 235px;
    width: 235px;
  }
  .content {
    margin-top: 20px;
    margin-bottom: 10px;
    width: 235px;
  }
  .buttons {
    margin-top: 20px;
    display: flex;
    justify-content: space-around;
  }
  .cancel {
    margin-left: 20px;
  }

  @media screen and (min-width: 1000px) {
    .string-input {
      min-width: 520px;
    }
    .content {
      width: 520px;
    }
    .cancel {
      margin-left: 50px;
    }
    .input-container {
      margin: 20px;
    }
  }
`;

export { Div, Form };
