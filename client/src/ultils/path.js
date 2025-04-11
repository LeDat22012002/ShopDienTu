const path = {
    PUBLIC: '/',
    HOME: '',
    ALL: '*',
    LOGIN: 'login',
    PRODUCTS: ':category',
    BLOGS: 'blogs',
    OUR_SERVICES: 'services',
    FAQ: 'faqs',
    DETAIL_PRODUCT__CATEGORY__PID__TITLE: ':category/:pid/:title',
    FINAL_REGISTER: 'finalregister/:status',
    RESET_PASSWORD: 'reset-password/:token',
    PROFILE: 'profile/:token',
    PROFILE_FB: 'profile_fb/:token',

    // ADMIN
    ADMIN: 'admin',
    DASHBOAD: 'dashboard',
    MANAGE_USER: 'manage-user',
    MANAGE_PRODUCT: 'manage-product',
    MANAGE_ORDER: 'manage-order',
    CREATE_PRODUCT: 'create-product',
    CREATE_BRAND: 'create-brand',
    MANAGE_BRAND: 'manage-brand',
    CREATE_CATEGORY: 'create-category',
    MANAGE_CATEGORY: 'manage-category',
    CREATE_COLOR: 'create-color',
    MANAGE_COLOR: 'manage-color',

    //MEMBER
    MEMBER: 'member',
    PERSONAL: 'personal',
};

export default path;
