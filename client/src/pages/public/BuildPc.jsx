import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Breadcrumb } from '../../components';
import { apiGetCategories } from '../../apis';
import path from '../../ultils/path';
import { useSelector, useDispatch } from 'react-redux';
import { removePartFromBuild } from '../../store/buildPc/buidlPcSlice';

const BuildPc = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const selectedParts = useSelector((state) => state.buildPC.selectedParts);
    const [categorys, setCategorys] = useState(null);

    const fetchApicategory = async () => {
        const response = await apiGetCategories();
        if (response.success) {
            const filtered = response.dataCategory.filter(
                (item) =>
                    item.title !== 'Laptop' &&
                    item.title !== 'PC Gaming' &&
                    item.title !== 'Loa' &&
                    item.title !== 'Tay cầm' &&
                    item.title !== 'Bàn ghế'
            );
            setCategorys(filtered);
        }
    };

    useEffect(() => {
        fetchApicategory();
    }, []);

    const handleCategory = (title) => {
        navigate(`/${path.PRODUCTS__CATEGORY.replace(':category', title)}`);
    };

    const getSelectedProduct = (categoryTitle) => {
        return selectedParts.find((item) => item.category === categoryTitle);
    };

    const totalPrice = selectedParts.reduce(
        (sum, item) => sum + Number(item.product.price || 0),
        0
    );

    return (
        <div className="w-full">
            <div className="h-[81px] flex justify-center items-center bg-gray-100">
                <div className="w-main">
                    <h3 className="font-semibold uppercase">{category}</h3>
                    <Breadcrumb category={category} />
                </div>
            </div>

            <div className="flex gap-4 mx-auto mt-5 w-main">
                {/* Left - Danh sách linh kiện */}
                <div className="flex flex-col gap-4 p-4 rounded-md flex-2/3">
                    {categorys?.length > 0 &&
                        categorys.map((el) => {
                            const selected = getSelectedProduct(el.title);
                            return (
                                <div
                                    key={el._id}
                                    className="flex justify-between w-full p-3 transition-shadow border border-gray-200 rounded-md hover:shadow-sm"
                                >
                                    {selected ? (
                                        <div className="flex items-center flex-1 gap-3">
                                            <img
                                                src={selected.product.thumb}
                                                alt="thumb"
                                                className="object-cover w-16 h-16 border border-gray-200"
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-800">
                                                    {selected.product.title}
                                                </span>
                                                <span className="font-semibold text-red-500">
                                                    {Number(
                                                        selected.product.price
                                                    ).toLocaleString()}
                                                    VNĐ
                                                </span>
                                                <div className="flex items-center gap-3 mt-1 text-sm">
                                                    <button
                                                        onClick={() =>
                                                            handleCategory(
                                                                el.title
                                                            )
                                                        }
                                                        className="text-blue-500 hover:underline"
                                                    >
                                                        Thay đổi
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            dispatch(
                                                                removePartFromBuild(
                                                                    {
                                                                        category:
                                                                            el.title,
                                                                    }
                                                                )
                                                            )
                                                        }
                                                        className="text-red-500 hover:underline"
                                                    >
                                                        Xoá
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={el.image}
                                                    alt="thumb"
                                                    className="object-cover w-10 h-10 rounded-md"
                                                />
                                                <h4 className="font-medium text-gray-800">
                                                    {el.title}
                                                </h4>
                                            </div>
                                            <button
                                                onClick={() =>
                                                    handleCategory(el.title)
                                                }
                                                className="px-4 py-1 text-white transition bg-blue-500 rounded-md hover:bg-blue-600"
                                            >
                                                Chọn
                                            </button>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                </div>

                {/* Right - Tổng giá trị */}
                <div className="p-4 bg-white shadow-md flex-1/3 rounded-xl">
                    <h3 className="mb-3 text-lg font-semibold">Tổng quan</h3>
                    {selectedParts.length > 0 ? (
                        <>
                            <ul className="mb-4 space-y-2">
                                {selectedParts.map((item, idx) => (
                                    <li
                                        key={idx}
                                        className="flex justify-between text-sm"
                                    >
                                        <span className="text-gray-700">
                                            {item.product.title}
                                        </span>
                                        <span className="text-red-500">
                                            {Number(
                                                item.product.price
                                            ).toLocaleString()}
                                            ₫
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex justify-between pt-2 text-base font-bold border-t">
                                <span>Tổng:</span>
                                <span className="text-red-600">
                                    {totalPrice.toLocaleString()}₫
                                </span>
                            </div>
                        </>
                    ) : (
                        <p className="text-sm text-gray-500">
                            Chưa có linh kiện nào được chọn.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BuildPc;
