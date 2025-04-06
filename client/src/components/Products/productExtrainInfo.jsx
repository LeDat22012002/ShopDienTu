import React from 'react';
import { memo } from 'react';
const ProductExtrainInfo = ({ icon, title, sub }) => {
    return (
        <div className="flex items-center gap-4 p-3 mb-[10px] border border-gray-500">
            <span className="flex items-center justify-center p-2 text-white bg-gray-600 rounded-full">
                {icon}
            </span>
            <div className="flex flex-col text-sm text-gray-500">
                <span className="font-medium">{title}</span>
                <span className="text-xs">{sub}</span>
            </div>
        </div>
    );
};

export default memo(ProductExtrainInfo);
