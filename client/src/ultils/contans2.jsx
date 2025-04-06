import icons from './icons';
import path from './path';
const {
    FaTruck,
    IoGiftSharp,
    FaTty,
    FaReply,
    FaShieldAlt,
    MdDashboardCustomize,
    MdGroups,
    RiProductHuntLine,
    FaCartArrowDown,
} = icons;
export const productExtraInfomation = [
    {
        id: 1,
        title: 'Quarantee',
        sub: 'Quality checked',
        icon: <FaShieldAlt />,
    },
    {
        id: 2,
        title: 'Free Shipping',
        sub: 'Free on all products',
        icon: <FaTruck />,
    },
    {
        id: 3,
        title: 'Special Gift Cards',
        sub: 'Special gift cards',
        icon: <IoGiftSharp />,
    },
    {
        id: 4,
        title: 'Free return',
        sub: 'Within 7 days',
        icon: <FaReply />,
    },
    {
        id: 5,
        title: 'Consultancy',
        sub: 'Lifetime 24/7/356',
        icon: <FaTty />,
    },
];

export const adminSidebar = [
    {
        id: 1,
        type: 'SINGLE',
        text: 'Dashboard',
        path: `/${path.ADMIN}/${path.DASHBOAD}`,
        icon: <MdDashboardCustomize size={20} />,
    },
    {
        id: 2,
        type: 'SINGLE',
        text: 'Manage users',
        path: `/${path.ADMIN}/${path.MANAGE_USER}`,
        icon: <MdGroups size={20} />,
    },
    {
        id: 3,
        type: 'PARENT',
        text: 'Product',
        icon: <RiProductHuntLine size={20} />,
        submenu: [
            {
                text: 'Create product',
                path: `/${path.ADMIN}/${path.CREATE_PRODUCT}`,
            },
            {
                text: 'Manage products',
                path: `/${path.ADMIN}/${path.MANAGE_PRODUCT}`,
            },
        ],
    },
    {
        id: 4,
        type: 'SINGLE',
        text: 'Manage orders',
        path: `/${path.ADMIN}/${path.MANAGE_ORDER}`,
        icon: <FaCartArrowDown size={20} />,
    },
    // {
    //     id: 5,
    //     type: 'PARENT',
    //     text: 'Product',
    //     icon: <RiProductHuntLine />,
    //     submenu: [
    //         {
    //             text: 'Create product',
    //             path: `/${path.ADMIN}/${path.CREATE_PRODUCT}`,
    //         },
    //         {
    //             text: 'Manage products',
    //             path: `/${path.ADMIN}/${path.MANAGE_PRODUCT}`,
    //         },
    //     ],
    // },
];
