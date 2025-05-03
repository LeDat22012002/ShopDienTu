import React, { memo, useEffect, useRef, useState } from 'react';
// import { productInfoTabs } from '../../ultils/contains';
import DOMPurify from 'dompurify';
import { Votebar, Button, VoteOptions, Comment } from '..';
import { renderStar } from '../../ultils/renderStar';
import { apiRatings } from '../../apis';
import { useDispatch, useSelector } from 'react-redux';
import { showModal } from '../../store/app/appSlice';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import path from '../../ultils/path';
import { createSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
const ProductInfomation = ({
    totalRatings,
    ratings,
    nameProduct,
    pid,
    description,
    rerender,
}) => {
    // console.log(ratings);
    // const [activeTab, setActiveTab] = useState(1);
    const dispatch = useDispatch();
    const location = useLocation();
    const { isLoggedIn } = useSelector((state) => state.user);

    const navigate = useNavigate();
    // Description
    const [expanded, setExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const descriptionRef = useRef(null);
    const titleRef = useRef(null);

    useEffect(() => {
        if (descriptionRef.current) {
            const lineHeight = parseFloat(
                getComputedStyle(descriptionRef.current).lineHeight || '24'
            );
            const lines = descriptionRef.current.scrollHeight / lineHeight;
            if (lines > 10) setIsOverflowing(true);
        }
    }, [description]);
    useEffect(() => {
        if (!expanded && titleRef.current) {
            titleRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [expanded]);

    const handleSubmitVoteOption = async ({ comment, score }) => {
        if (!comment || !score || !pid) {
            toast.error('Please vote when click submit');
            return;
        }
        const response = await apiRatings({
            star: score,
            comment,
            pid,
            updatedAt: Date.now(),
        });
        if (response.succsess) {
            toast.success(response.mess);
        } else {
            toast.error(response.mess);
        }
        dispatch(showModal({ isShowModal: false, modalChildren: null }));
        rerender();
    };
    const handleCancelSubmit = () => {
        dispatch(showModal({ isShowModal: false, modalChildren: null }));
        rerender();
    };
    const handleVoteNow = () => {
        if (!isLoggedIn) {
            Swal.fire({
                text: 'Login to vote',
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Go login',
                title: 'Oops !',
                showCancelButton: true,
            }).then((rs) => {
                if (rs.isConfirmed) {
                    navigate({
                        pathname: `/${path.LOGIN}`,
                        search: createSearchParams({
                            redirect: location?.pathname,
                        }).toString(),
                    });
                }
            });
        } else {
            dispatch(
                showModal({
                    isShowModal: true,
                    modalChildren: (
                        <VoteOptions
                            nameProduct={nameProduct}
                            handleSubmitVoteOption={handleSubmitVoteOption}
                            handleCancelSubmitVoteOption={handleCancelSubmit}
                        />
                    ),
                })
            );
        }
    };

    const handleToggleExpand = () => {
        setExpanded((prev) => !prev);
    };

    return (
        <div>
            <div className="flex items-center gap-2 relative bottom-[-1px]">
                {/* {productInfoTabs?.map((el) => (
                    <span
                        className={`p-2 px-4 bg-gray-200 cursor-pointer ${
                            activeTab === el.id &&
                            'bg-white border border-b-0 border-gray-200'
                        }  `}
                        onClick={() => setActiveTab(el.id)}
                        key={el.id}
                    >
                        {el.name}
                    </span>
                ))} */}
                <span
                    className="p-2 px-4 bg-gray-200 cursor-pointer"
                    ref={titleRef}
                    // onClick={() => setActiveTab(el.id)}
                    // key={el.id}
                >
                    DESCRIPTION
                </span>
            </div>
            <div className="w-full p-3 border border-gray-200">
                {description && (
                    <>
                        <div
                            ref={descriptionRef}
                            className={`text-sm transition-all overflow-hidden ${
                                !expanded ? 'max-h-[240px]' : 'max-h-full'
                            }`}
                            style={{ lineHeight: '24px' }}
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(description),
                            }}
                        />
                        {isOverflowing && (
                            <div className="flex justify-center w-full mt-2">
                                <button
                                    className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                                    onClick={handleToggleExpand}
                                >
                                    {expanded ? 'Collapse' : 'Read more'}
                                    {expanded ? (
                                        <AiOutlineUp />
                                    ) : (
                                        <AiOutlineDown />
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="flex flex-col py-8 w-main">
                <div className="flex border border-gray-300 ">
                    <div className="flex flex-col items-center justify-center gap-1.5  flex-4/12">
                        <span className="text-3xl font-semi">{`${totalRatings}/5`}</span>
                        <span className="flex items-center gap-1">
                            {renderStar(totalRatings)?.map((el, index) => (
                                <span key={index}>{el}</span>
                            ))}
                        </span>
                        <span className="text-sm">{`${ratings?.length} reviewers and commentors`}</span>
                    </div>
                    <div className="flex flex-col gap-3 p-4 flex-6/12">
                        {Array.from(Array(5).keys())
                            .reverse()
                            .map((el) => (
                                <Votebar
                                    key={el}
                                    number={el + 1}
                                    ratingTotal={ratings?.length}
                                    ratingCount={
                                        ratings?.filter(
                                            (item) => item.star === el + 1
                                        )?.length
                                    }
                                />
                            ))}
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 p-4 text-sm">
                    <span>Would you like to review this product ?</span>
                    <Button handleOnclick={handleVoteNow}>Vote now !</Button>
                </div>
                <div className="flex flex-col gap-4">
                    {ratings?.map((el) => (
                        <Comment
                            key={el._id}
                            star={el?.star}
                            updatedAt={el?.updatedAt}
                            comment={el?.comment}
                            name={`${el.postedBy?.name}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default memo(ProductInfomation);
