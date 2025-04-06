import React from 'react';
import { memo } from 'react';
import icons from '../../ultils/icons';

const { MdEmail } = icons;
const Footer = () => {
    return (
        <div className="w-full ">
            <div className="h-[103px] w-full bg-main flex items-center justify-center">
                <div className="flex items-center justify-between w-main ">
                    <div className="flex flex-col flex-1">
                        <span className="text-[20px] text-gray-200">
                            Sign up to Newsletter
                        </span>
                        <small className="text-[13px] text-gray-300">
                            Subscribe now and receive weekly newsletter
                        </small>
                    </div>
                    <div className="flex items-center flex-1">
                        <input
                            className="w-full p-4 pr-0 rounded-l-full  bg-[#F04640] outline-none text-gray-100 placeholder:text-sm placeholder:text-gray-100"
                            type="text"
                            placeholder="Email address"
                            name=""
                            id=""
                        />
                        <div className="h-[56px] w-[56px] bg-[#F04640] rounded-r-full flex items-center justify-center">
                            <MdEmail size={18} color="white" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-[407px] bg-gray-900 flex items-center justify-center text-white text-[14px]">
                <div className="flex w-main">
                    <div className="flex flex-col flex-2">
                        <h3 className="mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]">
                            ABOUT US
                        </h3>
                        <span>
                            <span>Address: </span>
                            <span className="opacity-50">
                                474 Ontario St Toronto, ON M4X 1M7 Canada
                            </span>
                        </span>
                        <span>
                            <span>Phone: </span>
                            <span className="opacity-50">(+1234)56789xxx</span>
                        </span>
                        <span>
                            <span>Mail:</span>
                            <span className="opacity-50">
                                tadathemes@gmail.com
                            </span>
                        </span>
                    </div>
                    <div className="flex flex-col flex-1">
                        <h3 className="mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]">
                            INFORMATION
                        </h3>

                        <span className="opacity-80 mb-[5px]">Typography</span>

                        <span className="opacity-80 mb-[5px]">Gallery</span>

                        <span className="opacity-80 mb-[5px]">
                            Store Location
                        </span>
                        <span className="opacity-80 mb-[5px]">
                            Today's Deals
                        </span>
                        <span className="opacity-80 mb-[5px]">Contact</span>
                    </div>
                    <div className="flex flex-col flex-1">
                        <h3 className="mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]">
                            WHO WE ARE
                        </h3>

                        <span className="opacity-80 mb-[5px]">Help</span>

                        <span className="opacity-80 mb-[5px]">
                            Free Shipping
                        </span>

                        <span className="opacity-80 mb-[5px]">FAQs</span>
                        <span className="opacity-80 mb-[5px]">
                            Return & Exchange
                        </span>
                        <span className="opacity-80 mb-[5px]">
                            Testimonials
                        </span>
                    </div>
                    <div className="flex flex-col flex-1">
                        <h3 className="mb-[20px] text-[15px] font-medium border-l-2 border-main pl-[15px]">
                            #DIGITALWORLDSTORE
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Footer);
