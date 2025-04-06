import React, { memo } from 'react';

const InputSelect = ({ value, changeValue, options }) => {
    return (
        <select
            className="p-2 text-sm bg-white border border-gray-800 shadow-sm focus:outline-none"
            value={value}
            onChange={(e) => changeValue(e.target.value)}
        >
            <option value="" disabled hidden>
                --Choose--
            </option>
            {options?.map((el) => (
                <option key={el.id} value={el.value}>
                    {el.text}
                </option>
            ))}
        </select>
    );
};

export default memo(InputSelect);
