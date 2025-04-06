import React, { memo } from 'react';
import avatar from '../../assets/avt1.png';
import moment from 'moment';
import { renderStar } from '../../ultils/renderStar';
const Comment = ({
    image = avatar,
    name = 'anonymous',
    updatedAt,
    comment,
    star,
}) => {
    return (
        <div className="flex gap-4 ">
            <div className="flex-none ">
                <img
                    src={image}
                    alt="avt"
                    className="w-[30px] h-[30px] object-cover rounded-full"
                ></img>
            </div>
            <div className="flex flex-col flex-auto">
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold">{name}</h3>
                    <span className="text-xs italic">
                        {moment().diff(moment(updatedAt), 'days') >= 1
                            ? moment(updatedAt).format('DD/MM/YYYY') // Nếu quá 1 ngày, hiển thị ngày
                            : moment().diff(moment(updatedAt), 'minutes') < 60
                            ? `${moment().diff(
                                  moment(updatedAt),
                                  'minutes'
                              )} minutes ago`
                            : `${moment().diff(
                                  moment(updatedAt),
                                  'hours'
                              )} hours ago`}
                    </span>
                </div>
                <div className="flex flex-col gap-2 py-2 pl-4 mt-4 text-sm bg-gray-100 border border-gray-300">
                    <span className="flex items-center gap-1">
                        <span className="font-semibold">Voting: </span>
                        <span className="flex items-center gap-1">
                            {renderStar(star)?.map((el, index) => (
                                <span key={index}>{el}</span>
                            ))}
                        </span>
                    </span>
                    <span className="flex gap-1">
                        <span className="font-semibold">Comment: </span>
                        <span className="flex items-center gap-1">
                            {comment}
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default memo(Comment);
