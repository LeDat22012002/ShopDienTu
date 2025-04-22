import clsx from 'clsx';
import React, { memo } from 'react';
import Select from 'react-select';

const CustomSelect = ({
    label,
    placeholder,
    onChange,
    options = [],
    value,
    classname,
    wrapClassname,
}) => {
    return (
        <div className={clsx(wrapClassname)}>
            {label && <h3 className="font-medium">{label}</h3>}
            <Select
                placeholder={placeholder}
                isClearable
                options={options}
                value={value}
                isSearchable
                onChange={(val) => onChange(val)}
                formatOptionLabel={(option) => (
                    <div className="flex items-center gap-2 text-black">
                        <span>{option.label}</span>
                    </div>
                )}
                className={{
                    control: () => clsx('border-2 py-[2px]', classname),
                }}
            />
        </div>
    );
};

export default memo(CustomSelect);
