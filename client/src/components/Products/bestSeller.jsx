import React, { memo } from 'react';
import { useState, useEffect } from 'react';
import { apiGetProduct } from '../../apis/product';
import { Product, CustomSlider } from '..';

import { getNewProduct } from '../../store/products/asyncActions';
import { useDispatch, useSelector } from 'react-redux';

const tabs = [
    { id: 1, name: 'best sellers' },
    // { id: 2, name: 'new arrivals' },
];

const BestSeller = () => {
    const [bestSeller, setBestSeller] = useState(null);

    const [products, setProducts] = useState(null);
    const [activeTab, setActiveTab] = useState(1);

    const dispatch = useDispatch();
    const { newProducts } = useSelector((state) => state.products);
    // console.log(newProducts);
    const fetchProducts = async () => {
        const response = await apiGetProduct({ sort: '-sold' });
        if (response?.success) {
            setBestSeller(response?.products);
            // setProducts(response?.products);
        }
    };

    useEffect(() => {
        fetchProducts();
        dispatch(getNewProduct());
    }, []);

    useEffect(() => {
        if (activeTab === 1) setProducts(bestSeller);
        // if (activeTab === 2) setProducts(newProducts);
    }, [activeTab]);
    return (
        <div>
            <div className="flex text-[20px] ml-[-32px]">
                {tabs.map((el) => (
                    <span
                        key={el.id}
                        className={`font-semibold uppercase px-8  cursor-pointer ${
                            activeTab === el.id ? 'text-black' : 'text-gray-400'
                        }`}
                        onClick={() => setActiveTab(el.id)}
                    >
                        {el.name}
                    </span>
                ))}
            </div>
            <div className="mt-4 mx-[-10px]  pt-4">
                <CustomSlider products={products} activeTab={activeTab} />
            </div>
        </div>
    );
};

export default memo(BestSeller);
