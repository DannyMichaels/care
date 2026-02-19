import styled from 'styled-components';

const Form = styled.form`
  .input-container {
    display: flex;
    justify-self: center;
    align-items: center;
    justify-content: flex-start;
  }
  .input-field {
    width: 300px;
  }
  .icon {
    margin-top: 10px;
    margin-right: 10px;
  }
  .gender-container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
  }
  .user-image {
    height: 40px;
    width: 40px;
    border-radius: 40px;
    margin-top: 10px;
    margin-right: 10px;
  }
  .user-image-container {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .big-user-image {
    height: 100px;
    width: 100px;
    align-self: center;
    margin-bottom: 5px;
    border: 1px solid ${({ theme }) => theme.palette.text.primary};
    border-radius: 50%;
    object-fit: cover;
  }
  .big-icon {
    height: 100px;
    width: 100px;
    align-self: center;
    margin-bottom: 5px;
  }
  .icon-button {
    color: ${({ theme }) => theme.palette.text.primary};
  }
  .icon-button.clear {
    display: ${({ image }) => (!image ? 'none' : 'auto')};
  }
  .visibility {
    color: ${({ theme }) => theme.palette.text.primary};
  }
  .alert {
    color: red;
    text-align: center;
  }
`;

export default Form;
