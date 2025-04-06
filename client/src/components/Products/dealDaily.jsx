import React from 'react';
import icons from '../../ultils/icons';
import { useState, useEffect, memo } from 'react';
import { apiGetProduct } from '../../apis/product';
import { formatMoney, secondsToHms } from '../../ultils/helpers';
import { renderStar } from '../../ultils/renderStar';
import { Countdown } from '..';
import moment from 'moment';

const { BsStarFill, IoMdMenu } = icons;

const DealDaily = () => {
    const [flashSale, setFlashSale] = useState(null);

    const [hour, setHour] = useState(0);
    const [minute, setMinute] = useState(0);
    const [second, setSecond] = useState(0);
    const [expireTime, setExpireTime] = useState(false);

    const fetchFlashSale = async () => {
        const response = await apiGetProduct({
            limit: 1,
            page: Math.round(Math.random() * 3),
        }); //totalRatings: 5
        if (response.success) {
            setFlashSale(response.products[0]);
            const today = `${moment().format('MM/DD/YYYY')} 5:00:00`;
            const seconds =
                new Date(today).getTime() -
                new Date().getTime() +
                24 * 3600 * 1000;
            const number = secondsToHms(seconds);
            // const h = 24 - new Date().getHours();
            // const m = 60 - new Date().getMinutes();
            // const s = 60 - new Date().getSeconds();
            setHour(number.h);
            setMinute(number.m);
            setSecond(number.s);
        } else {
            setHour(8);
            setMinute(59);
            setSecond(59);
        }
    };

    // useEffect(() => {
    //     fetchFlashSale();
    // }, []);
    let idInterval;
    useEffect(() => {
        idInterval && clearInterval(idInterval);
        fetchFlashSale();
    }, [expireTime]);

    useEffect(() => {
        let idInterval = setInterval(() => {
            if (second > 0) setSecond((prev) => prev - 1);
            else {
                if (minute > 0) {
                    setMinute((prev) => prev - 1);
                    setSecond(59);
                } else {
                    if (hour > 0) {
                        setHour((prev) => prev - 1);
                        setMinute(59);
                        setSecond(59);
                    } else {
                        setExpireTime(!expireTime);
                    }
                }
            }
        }, 1000);
        return () => {
            clearInterval(idInterval);
        };
    }, [second, minute, hour, expireTime]);

    return (
        <div className="flex-auto w-full border ">
            <div className="flex items-center justify-between w-full p-4">
                <span className="flex justify-center flex-2">
                    <BsStarFill size={20} color="#DD1111" />
                    <BsStarFill size={20} color="#DD1111" />
                </span>
                <span className="flex-6 font-bold text-[20px] text-gray-700 flex justify-center">
                    FLASH SALES
                </span>
                <span className="flex justify-center flex-2">
                    <BsStarFill size={20} color="#DD1111" />
                    <BsStarFill size={20} color="#DD1111" />
                </span>
            </div>
            <div className="flex flex-col items-center w-full gap-2 px-4 pt-8">
                <img
                    src={flashSale?.images[0] || ''}
                    alt="ảnh Product"
                    className="object-contain w-full "
                ></img>
                <span className="flex h-4">
                    {renderStar(flashSale?.totalRatings, 20)?.map(
                        (el, index) => (
                            <span key={index}>{el}</span>
                        )
                    )}
                </span>
                <span className="text-center line-clamp-1">
                    {flashSale?.title}
                </span>

                <span>{`${formatMoney(flashSale?.price)} VNĐ`}</span>
            </div>
            <div className="px-4 mt-8">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Countdown unit="Hours" number={hour} />
                    <Countdown unit="Minutes" number={minute} />
                    <Countdown unit="Seconds" number={second} />
                </div>
                <button
                    type="button"
                    className="flex items-center justify-center w-full gap-2 py-2 font-medium text-white bg-main hover:bg-gray-800"
                >
                    <IoMdMenu></IoMdMenu>
                    <span>Options</span>
                </button>
            </div>
        </div>
    );
};

export default memo(DealDaily);
