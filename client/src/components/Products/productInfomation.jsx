import React, { memo, useState } from 'react';
import { productInfoTabs } from '../../ultils/contains';
import { Votebar, Button, VoteOptions, Comment } from '..';
import { renderStar } from '../../ultils/renderStar';
import { apiRatings } from '../../apis';
import { useDispatch, useSelector } from 'react-redux';
import { showModal } from '../../store/app/appSlice';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import path from '../../ultils/path';
import { useNavigate } from 'react-router-dom';

const ProductInfomation = ({
    totalRatings,
    ratings,
    nameProduct,
    pid,
    rerender,
}) => {
    const [activeTab, setActiveTab] = useState(1);
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector((state) => state.user);

    const navigate = useNavigate();
    const handleSubmitVoteOption = async ({ comment, score }) => {
        if (!comment || !score || !pid) {
            toast.error('Please vote when click submit');
            return;
        }
        await apiRatings({ star: score, comment, pid, updatedAt: Date.now() });
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
                    navigate(`/${path.LOGIN}`);
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
                        />
                    ),
                })
            );
        }
    };
    return (
        <div>
            <div className="flex items-center gap-2 relative bottom-[-1px]">
                {productInfoTabs?.map((el) => (
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
                ))}
            </div>
            <div className="w-full p-3 border border-gray-200">
                {productInfoTabs.some((el) => el.id === activeTab) &&
                    productInfoTabs.find((el) => el.id === activeTab)?.content}
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
                            name={`${el.postedBy?.lastname} ${el.postedBy?.firstname}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default memo(ProductInfomation);
