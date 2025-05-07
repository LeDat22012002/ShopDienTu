import React from 'react';
import { useSelector } from 'react-redux';
import { Button, Product } from '../../components';

const Wishlist = () => {
    const { current } = useSelector((state) => state.user);

    return (
        <div className="relative w-full max-w-screen-xl px-2 mx-auto overflow-hidden">
            <header className="w-full py-4 text-3xl font-semibold border-b border-gray-200">
                My Wishlist
            </header>

            <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {current?.wishlist?.map((el) => (
                    <div
                        className="flex flex-col gap-3 mx-1 duration-300 bg-white rounded-md shadow -transition-shadow hover:shadow-lg"
                        key={el?._id}
                    >
                        <Product
                            pid={el?._id}
                            productData={el}
                            className="bg-white "
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
