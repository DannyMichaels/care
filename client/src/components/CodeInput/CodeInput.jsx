import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { makeStyles } from '@material-ui/styles';
import { yellow } from '@material-ui/core/colors';

const useStyles = makeStyles({
  codeRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '8px',
    marginBottom: '24px',
  },
  codeInput: {
    width: '48px',
    height: '56px',
    border: ({ themeState }) =>
      themeState === 'dark' ? '2px solid #888' : '2px solid #ccc',
    borderRadius: '8px',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    outline: 'none',
    backgroundColor: 'transparent',
    color: ({ themeState }) => (themeState === 'dark' ? '#fff' : '#000'),
    '&:focus': {
      borderColor: ({ themeState }) =>
        themeState === 'dark' ? yellow[700] : '#62B5D9',
    },
  },
});

const CodeInput = forwardRef(({ value, onChange, themeState }, ref) => {
  const classes = useStyles({ themeState });
  const inputs = useRef([]);

  useImperativeHandle(ref, () => ({
    focus: () => inputs.current[0]?.focus(),
  }));

  const handleChange = (text, index) => {
    const val = text.replace(/[^0-9]/g, '');
    const newCode = [...value];
    newCode[index] = val;
    onChange(newCode);

    if (val && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pasted) return;
    const newCode = [...value];
    for (let i = 0; i < pasted.length; i++) {
      newCode[i] = pasted[i];
    }
    onChange(newCode);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  return (
    <div className={classes.codeRow}>
      {value.map((digit, i) => (
        <input
          key={i}
          ref={(r) => (inputs.current[i] = r)}
          className={classes.codeInput}
          value={digit}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          onPaste={handlePaste}
          maxLength={1}
        />
      ))}
    </div>
  );
});

export default CodeInput;
