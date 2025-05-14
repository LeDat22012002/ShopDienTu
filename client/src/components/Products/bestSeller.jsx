import React, { memo } from 'react';
import { useState, useEffect } from 'react';
import { apiGetProduct } from '../../apis/product';
import { Product, CustomSlider } from '..';

import { getNewProduct } from '../../store/products/asyncActions';
import { useDispatch } from 'react-redux';

const BestSeller = () => {
    const [bestSeller, setBestSeller] = useState(null);

    const [products, setProducts] = useState(null);
    const [activeTab, setActiveTab] = useState(1);

    const dispatch = useDispatch();

    // console.log(newProducts);
    const fetchProducts = async () => {
        const response = await apiGetProduct({ sort: '-sold' });
        if (response?.success) {
            setBestSeller(response?.products);
            setProducts(response?.products);
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
            <div className=" mt-4 mx-[-10px]">
                <CustomSlider products={products} activeTab={activeTab} />
            </div>
        </div>
    );
};

export default memo(BestSeller);
