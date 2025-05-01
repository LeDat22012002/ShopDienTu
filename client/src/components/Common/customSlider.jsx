import React from 'react';
import Slider from 'react-slick';
import { Blogs, Product } from '..';
import { memo } from 'react';

const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
};

const CustomSlider = ({ products, activeTab, normal, blogs }) => {
    return (
        <>
            {products && (
                <Slider className="customSlider" {...settings}>
                    {products?.map((el) => (
                        <Product
                            key={el._id}
                            pid={el._id}
                            productData={el}
                            isNew={activeTab === 1 ? false : true}
                            normal={normal}
                        />
                    ))}
                </Slider>
            )}
            {blogs && (
                <Slider className="customSlider" {...settings}>
                    {blogs.map((blog) => (
                        <Blogs key={blog._id} bid={blog?._id} blogData={blog} />
                    ))}
                </Slider>
            )}
        </>
    );
};

export default memo(CustomSlider);
