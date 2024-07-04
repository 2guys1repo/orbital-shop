import React from 'react'

const DropdownSelect = ({ id, name, options, selectedOption, onOptionChange }) => {
    return (
        <select id={id} name={name} value={selectedOption} onChange={onOptionChange}>
            {options.map(option => (
                <option key={option.label} value={option.value}>
                    {option.value}
                </option>
            ))}
        </select>
    );
};

export default DropdownSelect;