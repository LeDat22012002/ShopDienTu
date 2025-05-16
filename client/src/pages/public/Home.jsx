import React, { useEffect, useState } from 'react';
import {
    Banner,
    Sidebar,
    BestSeller,
    CustomSlider,
    ChatWidget,
} from '../../components';
import { useSelector } from 'react-redux';
import icons from '../../ultils/icons';
import { createSearchParams, Link, useNavigate } from 'react-router-dom';
import {
    apiCreateVisit,
    apiGetActiveFlashSales,
    apiGetBlogs,
    apiGetProduct,
} from '../../apis';
import Countdown from 'react-countdown';
import bannerBuildPC from '../../assets/BuildPC.png';
import bannerBanghe from '../../assets/banghe.png';
import path from '../../ultils/path';
const Home = () => {
    const { IoIosArrowForward } = icons;
    const navigate = useNavigate();
    const { newProducts } = useSelector((state) => state.products);
    const { categories } = useSelector((state) => state.app);
    const [flashSales, setFlashSales] = useState(null);
    const [BLOGS, setBLOGS] = useState(null);
    const [products, setProducts] = useState(null);
    const [tainghes, setProductsTainghe] = useState(null);
    const [pc, setPc] = useState(null);
    const midIndex = Math.ceil(categories?.length / 2);
    const firstRow = categories?.slice(0, midIndex);
    const secondRow = categories?.slice(midIndex);
    const fetchApiCreateVisit = async () => {
        const visit = await apiCreateVisit();
    };
    const fetchApiBlogs = async () => {
        const response = await apiGetBlogs();
        if (response.success) {
            setBLOGS(response?.blogs);
        }
    };
    const fetchProducts = async () => {
        const response = await apiGetProduct({
            sort: '-sold',
            category: 'Laptop',
        });
        if (response?.success) {
            setProducts(response?.products);
        }
    };
    const fetchTaiNgheProducts = async () => {
        const response = await apiGetProduct({
            sort: '-sold',
            category: 'Tai nghe',
        });
        if (response?.success) {
            setProductsTainghe(response?.products);
        }
    };
    const fetchPCGaming = async () => {
        const response = await apiGetProduct({
            sort: '-sold',
            category: 'PC Gaming',
        });
        if (response?.success) {
            setPc(response?.products);
        }
    };

    useEffect(() => {
        fetchApiBlogs();
        fetchTaiNgheProducts();
        fetchPCGaming();
        fetchProducts();
        fetchApiCreateVisit();
    }, []);

    const fetchFlashSale = async () => {
        const response = await apiGetActiveFlashSales();

        if (response.success) {
            setFlashSales(response?.flashSales);
        }
    };
    const flashSaleProducts =
        flashSales?.[0]?.products?.map((item) => ({
            ...item.product,
            salePrice: item.salePrice,
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
                    <div className="flex items-center justify-center w-10 h-10 text-lg font-semibold bg-gray-200 rounded-md text-main">
                        {String(hours).padStart(2, '0')}
                    </div>
                    <span className="text-xl font-bol text-main">:</span>

                    <div className="flex items-center justify-center w-10 h-10 text-lg font-semibold bg-gray-200 rounded-md text-main">
                        {String(minutes).padStart(2, '0')}
                    </div>
                    <span className="text-xl font-bold text-main">:</span>

                    <div className="flex items-center justify-center w-10 h-10 text-lg font-semibold bg-gray-200 rounded-md text-main">
                        {String(seconds).padStart(2, '0')}
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="w-full bg-gray-50">
            <div className="flex w-full m-auto mt-4 lg:w-main">
                <div className="hidden lg:flex flex-col gap-5 w-[20%] flex-auto ">
                    <Sidebar />
                    {/* <DealDaily /> */}
                </div>
                <div className="w-full lg:w-[80%] pl-2 lg:pl-4 flex flex-col gap-2">
                    <div className="flex gap-2">
                        <div className="flex mx-auto w-full lg:w-[80%]">
                            <Banner />
                        </div>

                        <div className="w-[25%] flex-col gap-2 hidden lg:flex">
                            {categories
                                ?.filter((el) => el.brand.length > 0)
                                ?.slice(0, 3)
                                .map((el) => (
                                    <div
                                        key={el._id}
                                        className="transition-all duration-300 bg-white border-gray-100 rounded-md shadow-md hover:shadow-lg"
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

                    <div className="hidden grid-cols-1 gap-2 lg:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {categories
                            ?.filter((el) => el.brand.length > 0)
                            ?.slice(3)
                            .map((el) => (
                                <div
                                    key={el._id}
                                    className="transition-all duration-300 bg-white border-gray-100 rounded-md shadow-md hover:shadow-lg"
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
                <div className="w-[92%] ml-4 lg:ml-0 md:w-[96%] m-auto my-4 text-white rounded-md shadow-lg lg:w-main bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/30">
                        <div className="flex items-center gap-2 text-[18px] font-semibold">
                            <span>⚡</span>
                            <span className="text-[20px] tracking-wide uppercase ">
                                {flashSales[0]?.title}
                            </span>
                        </div>
                        <Countdown
                            date={new Date(flashSales[0].endTime)}
                            renderer={renderer}
                        />
                    </div>

                    {/* Slider sản phẩm */}
                    <div className="relative py-3 bg-white">
                        <CustomSlider products={flashSaleProducts} normal />
                    </div>
                </div>
            )}

            <div className="w-full px-4 mx-auto mt-4 lg:w-main">
                <h3 className="py-[15px] text-[20px] font-semibold border-b-3 border-main">
                    BEST SELLERS
                </h3>
                <BestSeller />
            </div>

            <div className="w-full px-4 mx-auto mt-4 lg:w-main">
                <h3 className="py-[15px] text-[20px] font-semibold border-b-3 border-main">
                    NEW ARRIVALS
                </h3>
                <div className="mt-4 mx-[-10px]">
                    <CustomSlider products={newProducts} />
                </div>
                <div className="flex flex-col mt-1 lg:mt-5 lg:flex-row">
                    <div
                        className="flex cursor-pointer flex-1/2"
                        onClick={() => navigate(`/${path.BUILD_PC}`)}
                    >
                        <img
                            src={bannerBuildPC}
                            alt="PC"
                            className="object-cover w-full h-full"
                        ></img>
                    </div>
                    <div
                        className="flex cursor-pointer flex-1/2"
                        onClick={() =>
                            navigate(
                                `/${path.PRODUCTS__CATEGORY.replace(
                                    ':category',
                                    'Bàn ghế'
                                )}`
                            )
                        }
                    >
                        <img
                            src={bannerBanghe}
                            alt="PC"
                            className="object-cover w-full h-full"
                        ></img>
                    </div>
                </div>
            </div>
            {pc?.length > 0 && (
                <div className="w-full px-4 mx-auto mt-4 lg:w-main">
                    <h3 className="py-[15px] text-[20px] font-semibold border-b-3 border-main">
                        PC BÁN CHẠY
                    </h3>
                    <div className="mt-4 mx-[-10px]">
                        <CustomSlider products={pc} normal />
                    </div>
                </div>
            )}

            {products?.length > 0 && (
                <div className="w-full px-4 mx-auto mt-4 lg:w-main">
                    <h3 className="py-[15px] text-[20px] font-semibold border-b-3 border-main">
                        LAPTOP BÁN CHẠY
                    </h3>
                    <div className="mt-4 mx-[-10px]">
                        <CustomSlider products={products} normal />
                    </div>
                </div>
            )}
            <div className="block w-full px-4 mx-auto mt-4 lg:hidden">
                <h3 className="py-[15px] text-[20px] font-semibold border-b-3 border-main">
                    DANH MỤC SẢN PHẨM
                </h3>

                <div className="flex items-center w-full gap-4 mt-4 overflow-x-auto overflow-y-hidden scrollbar-hide">
                    {firstRow?.map((el) => (
                        <Link
                            key={el._id}
                            to={el?.title}
                            className="flex flex-col items-center justify-center gap-2 mx-[10px] md:mx-[20px] shrink-0"
                        >
                            <img
                                src={el.image}
                                alt="category"
                                className="object-cover w-12 h-12 md:w-20 md:h-20"
                            />
                            <div className="text-[8px] md:text-sm font-semibold text-center">
                                {el.title}
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="flex items-center w-full gap-4 mt-2 overflow-x-auto overflow-y-hidden scrollbar-hide">
                    {secondRow?.map((el) => (
                        <Link
                            to={el?.title}
                            key={el._id}
                            className="flex flex-col items-center justify-center gap-2 mx-[10px] md:mx-[20px] shrink-0"
                        >
                            <img
                                src={el.image}
                                alt="category"
                                className="object-cover w-12 h-12 md:w-20 md:h-20"
                            />
                            <div className="text-[8px] md:text-sm font-semibold text-center">
                                {el.title}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {tainghes?.length > 0 && (
                <div className="w-full px-4 mx-auto mt-4 lg:w-main">
                    <h3 className="py-[15px] text-[20px] font-semibold border-b-3 border-main">
                        TAI NGHE BÁN CHẠY
                    </h3>
                    <div className="mt-4 mx-[-10px]">
                        <CustomSlider products={tainghes} normal />
                    </div>
                </div>
            )}

            <div className="w-full px-4 mx-auto mt-4 lg:w-main">
                <h3 className="py-[15px] text-[20px] font-semibold border-b-3 border-main">
                    BLOGS
                </h3>
                <div className="mt-4 mx-[-10px]">
                    <CustomSlider blogs={BLOGS} />
                </div>
            </div>

            <ChatWidget />
        </div>
    );
};

export default Home;
