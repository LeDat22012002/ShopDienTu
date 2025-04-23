import React from 'react';
import {
    Banner,
    Sidebar,
    BestSeller,
    DealDaily,
    FeatureProducts,
    CustomSlider,
} from '../../components';
import { useSelector } from 'react-redux';
import icons from '../../ultils/icons';
import { createSearchParams, useNavigate } from 'react-router-dom';

const Home = () => {
    const { IoIosArrowForward } = icons;
    const navigate = useNavigate();
    const { newProducts } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.app);
    // console.log(categories);
    return (
        <div className="w-full">
            <div className="flex m-auto mt-8 w-main">
                <div className="flex flex-col gap-5 w-[25%] flex-auto ">
                    <Sidebar />
                    <DealDaily />
                </div>
                <div className="flex flex-col gap-5 pl-5  w-[75%] flex-auto ">
                    <Banner />
                    <BestSeller />
                </div>
            </div>
            <div className="m-auto my-8 w-main">
                <FeatureProducts />
            </div>
            <div className="m-auto my-8 w-main">
                <h3 className="py-[15px] text-[20px] font-semibold border-b-3 border-main">
                    NEW ARRIVALS
                </h3>
                <div className="mt-4 mx-[-10px]">
                    <CustomSlider products={newProducts} />
                </div>
            </div>
            <div className="m-auto my-8 w-main">
                <h3 className="py-[15px] text-[20px] font-semibold border-b-3 border-main">
                    HOT COLLECTIONS
                </h3>
                <div className="flex flex-wrap gap-4 mt-4 ">
                    {categories
                        ?.filter((el) => el.brand.length > 0)
                        ?.map((el) => (
                            <div key={el._id} className=" w-[396px] ">
                                <div className="flex gap-4 p-4 border min-h-[190px]">
                                    <img
                                        src={el?.image}
                                        alt="categories"
                                        className=" object-cover flex 1 w-[144px] h-[129px]"
                                    ></img>
                                    <div className="flex flex-col text-gray-700">
                                        <h4 className="font-semibold uppercase">
                                            {el?.title}
                                        </h4>
                                        <ul className="text-sm mt-[5px]">
                                            {el?.brand?.map((item) => (
                                                <span
                                                    key={item._id}
                                                    className="flex items-center gap-1 text-gray-600 cursor-pointer hover:underline hover:text-main"
                                                    onClick={() =>
                                                        navigate({
                                                            pathname: `/${el?.title}`,
                                                            search: createSearchParams(
                                                                {
                                                                    brand: item?.title,
                                                                }
                                                            ).toString(),
                                                        })
                                                    }
                                                >
                                                    <IoIosArrowForward
                                                        size={14}
                                                    />
                                                    <li>{item?.title}</li>
                                                </span>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <div className="m-auto my-8 w-main">
                <h3 className="py-[15px] text-[20px] font-semibold border-b-3 border-main">
                    BLOGS
                </h3>
            </div>
        </div>
    );
};

export default Home;
