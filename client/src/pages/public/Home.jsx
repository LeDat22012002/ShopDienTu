import React, { useEffect, useState } from 'react';
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
import { apiGetActiveFlashSales } from '../../apis';
import Countdown from 'react-countdown';
const Home = () => {
    const { IoIosArrowForward } = icons;
    const navigate = useNavigate();
    const { newProducts } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.app);
    const [flashSales, setFlashSales] = useState(null);
    // console.log(categories);

    const fetchFlashSale = async () => {
        const response = await apiGetActiveFlashSales();
        console.log(response);
        if (response.success) {
            setFlashSales(response?.flashSales);
        }
    };
    const flashSaleProducts =
        flashSales?.[0]?.products?.map((item) => ({
            ...item.product,
            salePrice: item.salePrice, // <-- gán giá khuyến mãi vào salePrice
            quantity: item.quantity,
            sold: item.sold,
        })) || [];
    useEffect(() => {
        fetchFlashSale();
    }, []);

    const renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            return (
                <span className="font-semibold text-red-500">Đã kết thúc</span>
            );
        } else {
            return (
                <div className="flex items-center gap-2">
                    {/* Hour */}
                    <div className="flex items-center justify-center w-10 h-10 text-lg font-semibold bg-gray-200 rounded-md text-main">
                        {String(hours).padStart(2, '0')}
                    </div>
                    <span className="text-xl font-bol text-main">:</span>
                    {/* Minute */}
                    <div className="flex items-center justify-center w-10 h-10 text-lg font-semibold bg-gray-200 rounded-md text-main">
                        {String(minutes).padStart(2, '0')}
                    </div>
                    <span className="text-xl font-bold text-main">:</span>
                    {/* Second */}
                    <div className="flex items-center justify-center w-10 h-10 text-lg font-semibold bg-gray-200 rounded-md text-main">
                        {String(seconds).padStart(2, '0')}
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="w-full">
            <div className="flex m-auto mt-4 w-main">
                <div className="flex flex-col gap-5 w-[20%] flex-auto ">
                    <Sidebar />
                    {/* <DealDaily /> */}
                </div>
                <div className="w-[80%] pl-5 flex flex-col gap-2">
                    {/* Hàng đầu gồm Banner + vài box */}
                    <div className="flex gap-2">
                        {/* Banner chiếm khoảng 60% */}
                        <div className="w-[80%]">
                            <Banner />
                        </div>

                        {/* Một vài box đầu tiên (vd: 2 hoặc 3 cái) */}
                        <div className="w-[25%] flex flex-col gap-2">
                            {categories
                                ?.filter((el) => el.brand.length > 0)
                                ?.slice(0, 3)
                                .map((el) => (
                                    <div
                                        key={el._id}
                                        className="transition-all duration-300 bg-white border shadow-md rounded-xl hover:shadow-lg"
                                    >
                                        <div className="flex items-center p-3">
                                            <img
                                                src={el?.image}
                                                alt={el?.title}
                                                className="object-cover w-[80px] h-[80px] rounded mr-2"
                                            />
                                            <div className="text-sm text-gray-800">
                                                <h4 className="font-bold uppercase text-main">
                                                    {el?.title}
                                                </h4>
                                                <ul className="mt-1 flex flex-col gap-[2px] text-xs">
                                                    {el?.brand
                                                        ?.slice(0, 4)
                                                        .map((item) => (
                                                            <li
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
                                                                {item?.title}
                                                            </li>
                                                        ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Hàng thứ 2: các box còn lại */}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {categories
                            ?.filter((el) => el.brand.length > 0)
                            ?.slice(3) // các box còn lại sau 3 cái đầu
                            .map((el) => (
                                <div
                                    key={el._id}
                                    className="transition-all duration-300 bg-white border shadow-md rounded-xl hover:shadow-lg"
                                >
                                    <div className="flex items-center p-3">
                                        <img
                                            src={el?.image}
                                            alt={el?.title}
                                            className="object-cover w-[80px] h-[80px] rounded mr-2"
                                        />
                                        <div className="text-sm text-gray-800">
                                            <h4 className="font-bold uppercase text-main">
                                                {el?.title}
                                            </h4>
                                            <ul className="mt-1 flex flex-col gap-[2px] text-xs">
                                                {el?.brand
                                                    ?.slice(0, 4)
                                                    .map((item) => (
                                                        <li
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
                                                            {item?.title}
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
            {flashSales?.length > 0 && (
                <div className="m-auto my-4 bg-blue-500 rounded-md w-main">
                    <div className="flex justify-between items-center p-2 border-b-3 border-main py-[15px]">
                        <h3 className="text-[20px] font-semibold">
                            {flashSales[0]?.title || 'FLASH SALES'}
                        </h3>
                        <Countdown
                            date={new Date(flashSales[0].endTime)}
                            renderer={renderer}
                        />
                    </div>
                    <div className="mt-4 mx-[10px] my-[10px] bg-blue-500 ">
                        <CustomSlider products={flashSaleProducts} normal />
                    </div>
                </div>
            )}

            <div className="m-auto mt-4 w-main">
                <BestSeller />
            </div>

            <div className="m-auto mt-4 w-main">
                <h3 className="py-[15px] text-[20px] font-semibold border-b-3 border-main">
                    NEW ARRIVALS
                </h3>
                <div className="mt-4 mx-[-10px]">
                    <CustomSlider products={newProducts} />
                </div>
            </div>
            <div className="m-auto my-4 w-main">
                <h3 className="py-[15px] text-[20px] font-semibold border-b-3 border-main">
                    BLOGS
                </h3>
            </div>
        </div>
    );
};

export default Home;
