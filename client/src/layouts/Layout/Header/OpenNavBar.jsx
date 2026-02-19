import styled from 'styled-components';
import CurrentUserContainer from './CurrentUserContainer';
import HeaderSearch from './HeaderSearch';
import Card from '@material-ui/core/Card';

const Ul = styled.ul`
  margin: 0;
  flex-flow: column nowrap;
  background-color: ${({ theme }) => theme.palette.primary.main};
  position: fixed;
  transform: ${({ open }) => (open ? 'translateX(0)' : 'translateX(100%)')};
  top: 0;
  right: 0;
  height: 100vh;
  width: 100vw;
  padding-top: 1.5rem;
  transition: transform 0.3s ease-in-out;
  list-style: none;
  z-index: 998;
  display: flex;
  align-items: center;
  li {
    padding: 40px;
    font-size: large;
    font-weight: 30px;
    text-decoration: none;
  }
  li:hover {
    cursor: default;
  }
  span {
    margin-left: 10px;
  }
  span:hover {
    cursor: pointer;
  }
  a {
    text-decoration: none;
  }
`;

const Dropdown = styled(({ isSearching, ...rest }) => <Card {...rest} />)`
  position: absolute;
  min-width: 250px;
  top: 110px;
  z-index: 999999;

  background: ${({ theme }) => theme.palette.primary.main};
  box-shadow: ${({ isSearching }) =>
    isSearching ? '-3px 5px 17px 1px #000' : ''};
  .dropdown-items {
    display: flex;
    flex-direction: column;
    align-items: start;
  }
`;

function OpenNavBar({ open, search, setSearch, usersJSX }) {
  return (
    <Ul open={open}>
      <li>
        <HeaderSearch
          search={search}
          setSearch={setSearch}
          open={open}
        />
        <Dropdown isSearching={search}>
          <div className="dropdown-items">{search && usersJSX}</div>
        </Dropdown>
      </li>
      <li>
        <CurrentUserContainer isMenuShowing={open} />
      </li>
    </Ul>
  );
}

export default OpenNavBar;
