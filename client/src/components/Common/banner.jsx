import React, { memo, useState, useEffect } from 'react';
import Banner1 from '../../assets/Bground2.png';
import Banner3 from '../../assets/Bground3.png';
import Banner4 from '../../assets/Bground6.png';
import Banner5 from '../../assets/Bground7.png';

const images = [Banner1, Banner4, Banner5];

const Banner = () => {
    const [index, setIndex] = useState(0);

    // Tự động đổi ảnh sau 5s
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    return (
        <div className="relative w-[98%] h-[200px] md:w-[98%] md:h-[360px] lg:w-[720px] lg:h-[360px] xl:w-[720px] xl:h-[360px] mx-auto">
            <img
                src={images[index]}
                alt="banner"
                className="object-cover w-full h-full transition-all duration-500 rounded-md"
            />

            <div className="absolute flex gap-2 transform -translate-x-1/2 bottom-2 left-1/2">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => handleSelect(i)}
                        className={`w-5 h-1 transition-all duration-300 cursor-pointer ${
                            index === i ? 'bg-main scale-125' : 'bg-gray-200'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default memo(Banner);
