import React, { memo } from 'react';

const selectOptions = ({ icon }) => {
    return (
        <div className="flex items-center justify-center w-10 h-10 bg-white border rounded-full shadow-md cursor-pointer border-amber-50 hover:bg-gray-800 hover:text-white hover:border-gray-800 ">
            {icon}
        </div>
    );
};

export default memo(selectOptions);
