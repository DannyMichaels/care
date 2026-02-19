import styled from 'styled-components';

const Form = styled.form`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &::placeholder {
    color: ${({ theme }) =>
      theme.palette.type === 'dark' ? '#fff' : 'inherit'};
  }

  .vl {
    border-left: 1px solid ${({ theme }) => theme.palette.primary.main};
    height: 40px;
    margin-right: 10px;
  }

  .icon {
    position: absolute;
    right: 10px;
    background: ${({ theme }) => theme.palette.background.paper};
    height: 100%;
  }

  input {
    width: 68vw;
    font-size: 18px;
    letter-spacing: 0.1px;
    padding: 12px;
    border: 1px solid ${({ theme }) => theme.palette.primary.main};
    text-align: left;
    box-shadow: 5px 5px ${({ theme }) => theme.palette.primary.main};
    background: ${({ theme }) =>
      theme.palette.type === 'light' ? '#fff' : undefined};
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
export default Form;
