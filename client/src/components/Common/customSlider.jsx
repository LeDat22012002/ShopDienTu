import React from 'react';
import Slider from 'react-slick';
import { Product } from '..';
import { memo } from 'react';

const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
};

const CustomSlider = ({ products, activeTab, normal }) => {
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
        </>
    );
};

export default memo(CustomSlider);
