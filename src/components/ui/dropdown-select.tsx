import React from 'react'

const DropdownSelect = ({ options, selectedOption, onOptionChange }) => {
    return (
        <select value={selectedOption} onChange={onOptionChange}>
            {options.map(option => (
                <option key={option.label} value={option.value}>
                    {option.value}
                </option>
            ))}
        </select>
    );
};

export default DropdownSelect;