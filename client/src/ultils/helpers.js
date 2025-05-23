// import icons from './icons';

// const { BsStar, BsStarFill } = icons;

export const createSlug = (string) =>
    string
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .split(' ')
        .join('-');

export const formatMoney = (number) =>
    Number(number?.toFixed(1)).toLocaleString();

// export const renderStar = (number) => {
//     if (!Number(number)) return;
//     // 4 => [1,1,1,1 ,0]
//     const stars = [];
//     for (let i = 0; i < +number; i++) stars.push(<BsStarFill />);
//     for (let i = 5; i > +number; i--) stars.push(<BsStar />);

//     return stars;
// };

export function secondsToHms(d) {
    d = Number(d) / 1000;
    const h = Math.floor(d / 3600);
    const m = Math.floor((d % 3600) / 60);
    const s = Math.floor((d % 3600) % 60);
    return { h, m, s };
}

export const validate = (payload, setInvalidFields) => {
    let invalids = 0;
    const formatPayload = Object.entries(payload);
    for (let arr of formatPayload) {
        if (arr[1].trim() === '') {
            invalids++;
            setInvalidFields((prev) => [
                ...prev,
                { name: arr[0], mess: 'Require this field' },
            ]);
        }
    }

    for (let arr of formatPayload) {
        switch (arr[0]) {
            case 'email':
                const regex =
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!arr[1].match(regex)) {
                    invalids++;
                    setInvalidFields((prev) => [
                        ...prev,
                        { name: arr[0], mess: 'Email invalid !' },
                    ]);
                }
                break;
            case 'password':
                if (arr[1].length < 6) {
                    invalids++;
                    setInvalidFields((prev) => [
                        ...prev,
                        {
                            name: arr[0],
                            mess: 'Password minimum 6 characters !',
                        },
                    ]);
                }
                break;

            case 'phone':
                const phoneRegex = /^(0|\+84)[3-9][0-9]{8}$/;
                if (!arr[1].match(phoneRegex)) {
                    invalids++;
                    setInvalidFields((prev) => [
                        ...prev,
                        { name: arr[0], mess: 'Must be a phone number !' },
                    ]);
                }
                break;

            default:
                break;
        }
    }

    return invalids;
};

export const formatPrice = (number) => Math.round(number / 1000) * 1000;

export const generateRange = (start, end) => {
    const length = end + 1 - start;
    return Array.from({ length }, (_, index) => start + index);
};

export const convertToBase64 = (file) => {
    if (!file) return '';
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};
