import React, { memo } from 'react';
import clsx from 'clsx';
const InputCheckbox = ({
    label,
    name, // Tên field (ví dụ: 'brandIds')
    value, // Giá trị của checkbox (ví dụ: brand._id)
    style,
    register,
    validate,
    errors,
    defaultChecked = false,
}) => {
    return (
        <div className={clsx('flex items-center gap-2 text-[14px] ', style)}>
            <input
                type="checkbox"
                id={`${name}-${value}`}
                value={value}
                defaultChecked={defaultChecked}
                {...register(name, validate)}
                className="w-4 h-4 border-gray-300 text-main"
            />
            {label && (
                <label className="font-semibold" htmlFor={`${name}-${value}`}>
                    {label}
                </label>
            )}
            {errors[name] && (
                <small className="block text-xs italic text-main">
                    {errors[name]?.message}
                </small>
            )}
        </div>
    );
};

export default memo(InputCheckbox);
