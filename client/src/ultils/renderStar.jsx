import icons from './icons';

const { BsStar, BsStarFill } = icons;

export const renderStar = (number, size) => {
    if (!Number(number)) return;
    // 4 => [1,1,1,1 ,0]
    const stars = [];
    number = Math.round(number);
    for (let i = 0; i < +number; i++)
        stars.push(<BsStarFill color="orange" size={size || 16} />);
    for (let i = 5; i > +number; i--)
        stars.push(<BsStar color="orange" size={size || 16} />);

    return stars;
};
