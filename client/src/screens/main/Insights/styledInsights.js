import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 800px;
  max-height: 100%;

  .insights-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .sentence-container {
    margin: 20px auto;
  }
  .sentence {
    font-size: 1.3rem;
    margin: 0 auto;
  }
  a {
    text-decoration: none;
  }
  .span {
    color: ${({ theme }) => theme.palette.primary.main};
  }

  @media screen and (min-width: 600px) {
    .sentence {
      font-size: 1.5rem;
      margin: 0 auto;
    }
    @media screen and (min-width: 1280px) {
      .sentence {
        font-size: 2rem;
        margin: 0 auto;
      }
      .sentence-container {
        margin-bottom: 40px;
      }
    }
  }
`;

export default Wrapper;
