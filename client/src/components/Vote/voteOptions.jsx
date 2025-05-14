import React, { memo, useRef, useEffect, useState } from 'react';
import logo from '../../assets/logo.png';
import { voteOptions } from '../../ultils/contains';
import icons from '../../ultils/icons';
import { Button } from '..';
const { BsStarFill } = icons;

const VoteOptions = ({
    nameProduct,
    handleSubmitVoteOption,
    handleCancelSubmitVoteOption,
}) => {
    const modalRef = useRef();
    const [chosenScore, setChosenScore] = useState(null);
    const [comment, setComment] = useState('');

    useEffect(() => {
        modalRef.current.scrollIntoView({
            block: 'center',
            behavior: 'smooth',
        });
    }, []);
    return (
        <div
            onClick={(e) => e.stopPropagation()}
            ref={modalRef}
            className=" w-full bg-white lg:w-[700px]  p-4 flex items-center flex-col gap-4 justify-center"
        >
            <img
                src={logo}
                alt="logo"
                className="w-[200px] lg:w-[300px] object-contain my-8"
            ></img>
            <h2 className=" text-[14px] lg:text-lg text-center text-medium">{`Voting product ${nameProduct}`}</h2>
            <textarea
                placeholder="Type something"
                className="w-full p-2 text-sm border form-textarea focus:outline-none placeholder:italic placeholder:text-sm placeholder:text-gray-500"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <div className="flex flex-col w-full gap-4">
                <p className="flex items-center justify-center">
                    How do you like this product ?
                </p>
                <div className="flex items-center justify-center w-full gap-2 lg:gap-4">
                    {voteOptions.map((el) => (
                        <div
                            onClick={() => setChosenScore(el.id)}
                            className=" w-[60px] lg:w-[80px] lg:h-[80px] bg-gray-200 hover:bg-gray-300 cursor-pointer rounded-md p-4 flex items-center justify-center flex-col gap-2"
                            key={el.id}
                        >
                            {Number(chosenScore) && chosenScore >= el.id ? (
                                <BsStarFill color="orange"></BsStarFill>
                            ) : (
                                <BsStarFill color="gray"></BsStarFill>
                            )}
                            <span className="text-[10px]">{el.text}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex w-full gap-2 ">
                <Button
                    handleOnclick={() =>
                        handleSubmitVoteOption({ comment, score: chosenScore })
                    }
                    fw
                >
                    Submit
                </Button>
                <Button
                    style={
                        'bg-gray-500 w-full px-4 py-2 rounded-md text-white  text-semibold my-2'
                    }
                    handleOnclick={handleCancelSubmitVoteOption}
                >
                    Back
                </Button>
            </div>
        </div>
    );
};

export default memo(VoteOptions);
