import React, { memo } from 'react';
import { useState, useEffect } from 'react';
import { apiGetProduct } from '../../apis/product';
import { Product, CustomSlider } from '..';
import banner2 from '../../assets/banner2.png';
import banner3 from '../../assets/banner3.png';
import { getNewProduct } from '../../store/products/asyncActions';
import { useDispatch, useSelector } from 'react-redux';

const tabs = [
    { id: 1, name: 'best sellers' },
    { id: 2, name: 'new arrivals' },
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
            setProducts(response?.products);
        }
    };

    useEffect(() => {
        fetchProducts();
        dispatch(getNewProduct());
    }, []);

    useEffect(() => {
        if (activeTab === 1) setProducts(bestSeller);
        if (activeTab === 2) setProducts(newProducts);
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
            <div className="mt-4 mx-[-10px] border-t-2 border-main pt-4">
                <CustomSlider products={products} activeTab={activeTab} />
            </div>
            <div className="flex w-full gap-4 mt-4">
                <img
                    src={banner2}
                    alt="banner2"
                    className="flex-1 object-contain"
                ></img>
                <img
                    src={banner3}
                    alt="banner3"
                    className="flex-1 object-contain"
                ></img>
            </div>
        </div>
    );
};

export default memo(BestSeller);
