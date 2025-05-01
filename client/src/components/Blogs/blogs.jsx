import clsx from 'clsx';
import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';

const Blogs = ({ blogData, className }) => {
    // console.log(blogData);
    const navigate = useNavigate();
    return (
        <div
            className={clsx(
                'w-full px-[10px] text-base mb-4 bg-white',
                className
            )}
        >
            <div
                className="w-full border border-gray-400 p-[10px] flex flex-col items-center"
                onClick={() => navigate(`/${blogData?.title}/${blogData?._id}`)}
            >
                <div className="relative w-full">
                    <div className="flex items-center justify-center w-full h-[150px]">
                        <img
                            src={blogData?.image}
                            alt="ảnh Product"
                            className="object-contain w-[240px] h-[240px]"
                        />
                    </div>
                </div>
                <div className="flex mt-[10px] items-start w-full">
                    <span className="line-clamp-2">{blogData?.title}</span>
                </div>
            </div>
        </div>
    );
};

export default memo(Blogs);
