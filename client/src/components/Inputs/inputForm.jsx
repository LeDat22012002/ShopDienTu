import React, { memo } from 'react';
import clsx from 'clsx';
const InputForm = ({
    label,
    disabled,
    register,
    errors,
    id,
    validate,
    type = 'text',
    placeholder,
    fullWith,
    defaultValue,
    style,
    readOnly,
}) => {
    return (
        <div className={clsx('flex flex-col h-[78px] gap-2', style)}>
            {label && <label htmlFor={id}>{label}</label>}
            <input
                type={type}
                id={id}
                {...register(id, validate)}
                disabled={disabled}
                placeholder={placeholder}
                defaultValue={defaultValue}
                className={clsx(
                    ' px-4 py-2 border bg-white border-gray-500 focus:outline-none cursor-pointer my-auto',
                    fullWith && 'w-full',
                    style,
                    type === 'number' && 'input-no-spinner '
                )}
                readOnly={readOnly}
            />
            {errors[id] && (
                <small className="text-xs italic text-main">
                    {errors[id]?.message}
                </small>
            )}
        </div>
    );
};

export default memo(InputForm);
