import css from './SearchBox.module.css';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface SearchBoxProps {
  onChange: (value: string) => void;
}

export default function SearcBox({onChange}:SearchBoxProps){
    const [textValue, setTextValue] = useState ('');

    const debouncedOnChange = useDebouncedCallback((val) => {
    onChange(val);
  }, 500);

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setTextValue(text);
    debouncedOnChange(text);}

    return(
    <input
  className={css.input}
  type="text"
  value={textValue} 
        onChange={handleChange}
  placeholder="Search notes"
 />
    );
}