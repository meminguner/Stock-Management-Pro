import React, { useState, useRef, useEffect } from 'react';
import { useStockStore } from '../store/stockStore';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  value,
  onChange,
  placeholder = "Tag'ları boşlukla ayırın...",
  className = ""
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const { getAvailableTags, filterTagSuggestions, addTag } = useStockStore();
  const availableTags = getAvailableTags();
  const suggestions = filterTagSuggestions(inputValue);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setShowSuggestions(newValue.trim().length > 0);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        selectSuggestion(suggestions[selectedIndex]);
      } else {
        addNewTag();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const addNewTag = () => {
    const tag = inputValue.trim().toUpperCase();
    if (tag && !value.includes(tag)) {
      const newTags = [...value, tag];
      onChange(newTags);
      addTag(tag);
    }
    setInputValue('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const selectSuggestion = (tag: string) => {
    if (!value.includes(tag)) {
      const newTags = [...value, tag];
      onChange(newTags);
      addTag(tag);
    }
    setInputValue('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = value.filter(tag => tag !== tagToRemove);
    onChange(newTags);
  };

  return (
    <div className={`relative ${className}`}>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        padding: '0.5rem',
        border: '1px solid #d1d5db',
        borderRadius: '0.5rem',
        transition: 'border-color 0.2s, box-shadow 0.2s'
      }}>
        {value.map((tag, index) => (
          <span
            key={index}
            className="tag"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="tag-remove"
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(inputValue.trim().length > 0)}
          placeholder={value.length === 0 ? placeholder : ''}
          style={{
            flex: 1,
            minWidth: 0,
            outline: 'none',
            background: 'transparent',
            border: 'none',
            fontSize: '0.875rem'
          }}
          autoComplete="off"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          style={{
            position: 'absolute',
            zIndex: 50,
            width: '100%',
            marginTop: '0.25rem',
            background: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            maxHeight: '12rem',
            overflowY: 'auto'
          }}
        >
          {suggestions.map((tag, index) => (
            <button
              key={tag}
              type="button"
              onClick={() => selectSuggestion(tag)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                textAlign: 'left',
                background: index === selectedIndex ? '#eff6ff' : 'transparent',
                color: index === selectedIndex ? '#1e40af' : '#111827',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem'
              }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}; 