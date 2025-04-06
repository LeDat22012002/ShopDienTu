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
            <div className="flex flex-wrap mt-[15px] mx-[-10px]">
                {products?.map((el) => (
                    <ProductCard
                        key={el._id}
                        image={el.images[0]}
                        title={el.title}
                        totalRatings={el.totalRatings}
                        price={el.price}
                    />
                ))}
            </div>
            <div className="flex justify-between mt-[20px]">
                <img
                    src={Banner4}
                    alt="banner4"
                    className="w-[50%] object-contain"
                ></img>
                <div className="flex flex-col justify-between gap-4 w-[24%]">
                    <img src={Banner5} alt="banner5"></img>
                    <img src={Banner6} alt="banner6"></img>
                </div>
                <img
                    src={Banner7}
                    alt="banner7"
                    className="w-[24%] object-contain "
                ></img>
            </div>
        </div>
    );
};

export default memo(FeatureProducts);
