import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiGetDetailsBlog } from '../../apis';
import { Breadcrumb } from '../../components';
import DOMPurify from 'dompurify';
import moment from 'moment';
import icons from '../../ultils/icons';

const { FaUserEdit } = icons;
const DetailsBlogs = () => {
    const { bid } = useParams();
    const [blog, setBlog] = useState(null);
    console.log(blog);
    const fetchBlogData = async () => {
        const response = await apiGetDetailsBlog(bid);

        if (response.success) {
            setBlog(response?.rs);
        }
    };
    useEffect(() => {
        if (bid) {
            fetchBlogData();
        }
    }, [bid]);
    return (
        <div className="w-full">
            <div className="h-[81px] flex justify-center items-center bg-gray-100">
                <div className="w-full ml-[10px] lg:w-main lg:ml-0">
                    <h3 className="text-[12px] lg:text-[16px] font-semibold">
                        {blog?.title}
                    </h3>
                    <Breadcrumb title={blog?.title} category={blog?.category} />
                </div>
            </div>
            <div className="flex flex-col w-full gap-4 m-auto mt-4 mb-4 lg:w-main ">
                <h3 className=" w-full px-2 lg:px-0 m-auto lg:w-[700px] font-semibold">
                    {blog?.title}
                </h3>
                <div className="w-full px-2 lg:px-0 flex gap-2 lg:w-[700px] m-auto ">
                    <span className="flex gap-1">
                        <span className="font-semibold">Ngày tạo: </span>
                        {moment(blog?.createdAt).format('DD/MM/YYYY')}
                    </span>
                    <span className="flex gap-1 ml-2">
                        <FaUserEdit size={20} />
                        <span className="text-main">{blog?.author}</span>
                    </span>
                </div>
                <span className="w-full px-2 lg:px-0 flex gap-1 m-auto lg:w-[700px]">
                    <span className="font-semibold">Views:</span>
                    <span className="text-main">{blog?.numberViews}</span>
                </span>
                <img
                    src={blog?.image}
                    alt="image"
                    className=" w-full px-2 lg:px-0 h-[200px]object-center lg:w-[700px] lg:h-[300px] m-auto rounded-md"
                ></img>
                <div className="w-full px-2 lg:px-0 m-auto lg:w-[700px] ">
                    {blog?.description && (
                        <div
                            className="text-sm"
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(blog?.description),
                            }}
                        ></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailsBlogs;
