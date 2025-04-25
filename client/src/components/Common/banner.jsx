import React, { memo } from 'react';
import Banner1 from '../../assets/Bground2.png';
import Banner2 from '../../assets/Bground1.png';
import Banner3 from '../../assets/Bground3.png';
import { useState, useEffect } from 'react';
const images = [Banner1, Banner2, Banner3];
const Banner = () => {
    const [index, setIndex] = useState(0);

    // Tự động đổi ảnh sau 5s
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval); // Cleanup khi component unmount
    }, []);

    return (
        <div className="relative w-[720px]">
            <img
                src={images[index]}
                alt="banner"
                className="h-[360px] w-full object-cover transition-all duration-500 rounded-lg"
            />
        </div>
    );
};

export default memo(Banner);
