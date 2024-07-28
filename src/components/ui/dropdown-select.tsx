import React from 'react'

type Option = {
    value : string,
    label : string,
}

type DropdownSelectProps = {
    id: string;
    name: string;
    options: Option[];
    selectedOption: string;
    onOptionChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}
const DropdownSelect = ({ id, name, options, selectedOption, onOptionChange }
    : DropdownSelectProps) => {
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