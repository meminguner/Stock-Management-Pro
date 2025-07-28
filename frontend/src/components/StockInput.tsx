import React, { useState, useEffect } from 'react';
import { isValidStockCharacter, validateStockInput, parseStockValue, formatStockValue } from '../utils/stockUtils';

interface StockInputProps {
  value: number | '?';
  onChange: (value: number | '?') => void;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const StockInput: React.FC<StockInputProps> = ({
  value,
  onChange,
  className = "",
  placeholder = "Sayı girin veya ? bırakın",
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState(formatStockValue(value));
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setInputValue(formatStockValue(value));
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;
    
    // Engellenen karakterler: e, E, +, -, ., virgül
    if (['e', 'E', '+', '-', '.', ','].includes(key)) {
      e.preventDefault();
      return;
    }
    
    // Sadece rakam ve ? karakterine izin ver
    if (!isValidStockCharacter(key) && key !== 'Backspace' && key !== 'Delete' && key !== 'Tab' && key !== 'Enter') {
      e.preventDefault();
      return;
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const cleanedText = validateStockInput(pastedText);
    setInputValue(cleanedText);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    const cleanedValue = validateStockInput(newValue);
    setInputValue(cleanedValue);
  };

  const handleBlur = () => {
    setIsEditing(false);
    const parsedValue = parseStockValue(inputValue);
    onChange(parsedValue);
    setInputValue(formatStockValue(parsedValue));
  };

  const handleFocus = () => {
    setIsEditing(true);
  };

  const handleIncrement = () => {
    if (value === '?') {
      onChange(1);
    } else {
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value === '?') {
      onChange(0);
    } else {
      onChange(Math.max(0, value - 1));
    }
  };

  return (
    <div className={`stock-input ${className}`}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled}
        title="Azalt"
      >
        -
      </button>
      
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
      />
      
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled}
        title="Artır"
      >
        +
      </button>
    </div>
  );
}; 