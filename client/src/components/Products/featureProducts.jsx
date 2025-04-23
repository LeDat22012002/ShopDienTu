import React, { memo } from 'react';
import { useState, useEffect } from 'react';
import { ProductCard } from '..';
import { apiGetProduct } from '../../apis';
import Banner4 from '../../assets/Banner4.png';
import Banner5 from '../../assets/Banner5.png';
import Banner6 from '../../assets/Banner6.png';
import Banner7 from '../../assets/Banner7.png';
const FeatureProducts = () => {
    const [products, setProducts] = useState(null);
    const fetchProducts = async () => {
        const response = await apiGetProduct();
        if (response.success) {
            setProducts(response?.products);
        }
        // console.log(response);
    };

    useEffect(() => {
        fetchProducts();
    }, []);
    return (
        <div className="w-full">
            <h3 className="py-[15px] text-[20px] font-semibold border-b-3 border-main">
                FEATURED PRODUCTS
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-[15px] mb-[15px]">
                {products?.map((el) => (
                    <ProductCard
                        key={el?._id}
                        pid={el?._id}
                        image={el?.thumb}
                        title={el?.title}
                        totalRatings={el?.totalRatings}
                        price={el?.price}
                        category={el?.category}
                        style
                    />
                ))}
            </div>
            <div className="grid grid-cols-4 grid-rows-2 gap-4">
                <img
                    src={Banner4}
                    alt="banner4"
                    className="object-cover w-full h-full col-span-2 row-span-2"
                ></img>
                <img
                    src={Banner5}
                    alt="banner5"
                    className="object-cover w-full h-full col-span-1 row-span-1"
                ></img>
                <img
                    src={Banner7}
                    alt="banner7"
                    className="object-cover w-full h-full col-span-1 row-span-2"
                ></img>
                <img
                    src={Banner6}
                    alt="banner6"
                    className="object-cover w-full h-full col-span-1 row-span-1"
                ></img>
            </div>
        </div>
    );
};

export default memo(FeatureProducts);
