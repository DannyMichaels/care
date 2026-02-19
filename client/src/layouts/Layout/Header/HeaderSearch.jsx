import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import styled from 'styled-components';
import Card from '@material-ui/core/Card';
import ClearIcon from '@material-ui/icons/Clear';
import { useEffect, useState } from 'react';

let Search = styled.div`
  position: relative;
  z-index: 9999999999;
  input {
    font-family: 'Montserrat', sans-serif;
    color: ${({ theme }) =>
      theme.palette.type === 'dark' ? 'black' : 'white'};
    padding-left: 5px;
  }

  .icon {
    color: ${({ theme }) =>
      theme.palette.type === 'dark' ? 'black' : 'white'};
  }

  .icon.clear {
    cursor: pointer;
  }

  .dropdown-items {
    display: flex;
    flex-direction: column;
    align-items: start;
  }
`;

// https://stackoverflow.com/questions/57602072/how-to-customize-material-ui-textfield-input-underlineafter
const StyledTextField = styled(TextField)`
  /* default */
  .MuiInput-underline:before {
    border-bottom: ${({ theme }) =>
      theme.palette.type === 'dark' ? '1px solid black' : '1px solid white'};
  }
  /* hover (double-ampersand needed for specificity reasons. */
  && .MuiInput-underline:hover:before {
    border-bottom: ${({ theme }) =>
      theme.palette.type === 'dark' ? '1px solid black' : '1px solid white'};
  }
  /* focused */
  .MuiInput-underline:after {
    border-bottom: ${({ theme }) =>
      theme.palette.type === 'dark' ? '1px solid black' : '1px solid white'};
  }
`;

const Dropdown = styled(Card)`
  position: absolute;
  min-width: 250px;
  top: 45px;
  z-index: 999999;

  background: ${({ theme }) => theme.palette.primary.main};
  box-shadow: -3px 5px 17px 1px #000;
`;

function HeaderSearch({ search, setSearch, usersJSX, open }) {
  const [placeholder, setPlaceholder] = useState('Search Care');

  useEffect(() => {
    const handleSearchResize = () => {
      const width = window?.innerWidth;
      if (width <= 468) {
        setPlaceholder('Search');
      } else {
        setPlaceholder('Search Care');
      }
    };
    handleSearchResize();
    window.addEventListener('resize', handleSearchResize);
    return () => {
      window.removeEventListener('resize', handleSearchResize);
    };
  }, []);

  return (
    <>
      <Search open={open}>
        <StyledTextField
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: !search ? (
              <SearchIcon className="icon" />
            ) : (
              <ClearIcon onClick={() => setSearch('')} className="icon clear" />
            ),
          }}
        />
        {/* the other dropdown when it's open is moved to OpenNavBar.jsx */}
        {!open && (
          <Dropdown>
            <div className="dropdown-items">{search && usersJSX}</div>
          </Dropdown>
        )}
      </Search>
    </>
  );
}

export default HeaderSearch;
