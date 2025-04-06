import React, { memo } from 'react';
import clsx from 'clsx';
const InputField = ({
    value,
    setValue,
    nameKey,
    type,
    invalidFields,
    setInvalidFields,
    style,
    fullWith,
    placeholder,
    isShowLable,
}) => {
    return (
        <div
            className={clsx(
                'relative flex flex-col  mb-2 ',
                fullWith && 'w-full'
            )}
        >
            {!isShowLable && value?.trim() !== '' && (
                <label
                    className="text-[10px] absolute animate-slide-up-sm top-0 left-[12px] block bg-white px-1"
                    htmlFor={nameKey}
                >
                    {nameKey?.slice(0, 1)?.toUpperCase() + nameKey?.slice(1)}
                </label>
            )}
            <input
                type={type || 'text'}
                className={clsx(
                    'w-full px-4 py-2 mt-2 border rounded-sm outline-none placeholder:text-sm placeholder:italic',
                    style
                )}
                placeholder={
                    placeholder ||
                    nameKey?.slice(0, 1)?.toUpperCase() + nameKey?.slice(1)
                }
                value={value}
                onChange={(e) =>
                    setValue((prev) => ({
                        ...prev,
                        [nameKey]: e.target.value,
                    }))
                }
                onFocus={() => setInvalidFields && setInvalidFields([])}
            ></input>
            {invalidFields?.some((el) => el.name === nameKey) && (
                <small className="text-main text-[10px] italic">
                    {invalidFields?.find((el) => el.name === nameKey)?.mess}
                </small>
            )}
        </div>
    );
};

export default memo(InputField);
