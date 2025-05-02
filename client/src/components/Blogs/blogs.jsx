import clsx from 'clsx';
import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';

const Blogs = ({ blogData, className }) => {
    // console.log(blogData);
    const navigate = useNavigate();
    return (
        <div className={clsx('w-full px-[10px] text-base mb-4', className)}>
            <div
                className="w-full overflow-hidden transition duration-300 bg-white rounded-md shadow-md cursor-pointer hover:shadow-lg"
                onClick={() => navigate(`/${blogData?.title}/${blogData?._id}`)}
            >
                <div className="w-full h-[180px] bg-white flex items-center justify-center">
                    <img
                        src={blogData?.image}
                        alt="ảnh Blog"
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="p-3 bg-main">
                    <span className="text-sm font-medium text-white line-clamp-2">
                        {blogData?.title}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default memo(Blogs);
