import React, { memo, Fragment, useState } from 'react';
import icons from '../../ultils/icons';
import { useSelector } from 'react-redux';
import { RxCross2 } from 'react-icons/rx';
import { useNavigate, createSearchParams } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';

const { FaSortDown, FaCaretRight } = icons;

const ModalMobile = ({ onClose }) => {
    const [actived, setActived] = useState([]);
    const navigate = useNavigate();
    const { categories } = useSelector((state) => state.app);

    const categorySidebar = categories?.map((cat, index) => ({
        id: index,
        type: 'PARENT',
        text: cat?.title,
        submenu: cat?.brand.map((brand) => ({
            text: brand?.title.toString(),
        })),
    }));

    const handleShowTabs = (tabID) => {
        if (actived.some((el) => el === tabID))
            setActived((prev) => prev.filter((el) => el !== tabID));
        else setActived((prev) => [...prev, tabID]);
    };
    // console.log(actived);
    return (
        <div className="z-40 flex flex-col h-screen bg-white border border-gray-100 pb-[70px] ">
            <div className="relative top-0 z-10 flex items-center justify-between gap-2 p-4 border-b border-gray-200 bg-main">
                <span className="text-sm font-semibold md:text-[16px]">
                    DANH MỤC SẢN PHẨM
                </span>
                <button onClick={onClose} className="bg-white hover:bg-main">
                    <RxCross2 size={26} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto">
                <ul className="flex-1 py-4 flex flex-col gap-[2px] text-sm md:text-[16px]">
                    {categorySidebar.map((el) => (
                        <li key={el.id}>
                            {el.type === 'PARENT' && (
                                <>
                                    <div
                                        onClick={() => handleShowTabs(+el.id)}
                                        className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-200"
                                    >
                                        <div className="flex items-center gap-2 text-sm md:text-[16px] font-semibold">
                                            {el.text}
                                        </div>
                                        {actived.includes(el.id) ? (
                                            <FaCaretRight />
                                        ) : (
                                            <FaSortDown />
                                        )}
                                    </div>

                                    {actived.includes(el.id) && (
                                        <ul className="pl-6 flex flex-col gap-[2px]">
                                            {el.submenu.map((item) => (
                                                <li
                                                    key={item.text}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate({
                                                            pathname: `/${el?.text}`,
                                                            search: createSearchParams(
                                                                {
                                                                    brand: item?.text,
                                                                }
                                                            ).toString(),
                                                        });
                                                        onClose();
                                                    }}
                                                    className="flex items-center gap-1 py-1 font-semibold cursor-pointer hover:underline hover:text-main"
                                                >
                                                    <IoIosArrowForward
                                                        size={14}
                                                    />
                                                    {item.text}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default memo(ModalMobile);
