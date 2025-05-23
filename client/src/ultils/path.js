const path = {
    PUBLIC: '/',
    HOME: '',
    ALL: '*',
    LOGIN: 'login',
    PRODUCTS__CATEGORY: ':category',
    BLOGS: 'blogs',
    OUR_SERVICES: 'services',
    BUILD_PC: 'buildPc',
    FAQ: 'faqs',
    DETAIL_PRODUCT__CATEGORY__PID__TITLE: ':category/:pid/:title',
    DETAIL_BLOG__TITLE__BID: ':title/:bid',
    FINAL_REGISTER: 'finalregister/:status',
    RESET_PASSWORD: 'reset-password/:token',
    PROFILE: 'profile/:token',
    PROFILE_FB: 'profile_fb/:token',
    CART: 'my-cart',
    PAYMENT: 'payment',
    PAYMENT_SUCCESS: 'payment-success',
    ORDER_SUCCESS: 'order-success',
    PRODUCTS: 'products',

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
    CREATE_PROMOTION: 'create-promotion',
    MANAGE_PROMOTION: 'manage-promotion',
    CREATE_FLASHSALE: 'create-flashsale',
    MANAGE_FLASHSALE: 'manage-flashsale',
    CREATE_BLOGS: 'create-blogs',
    MANAGE_BLOGS: 'manage-blogs',

    //MEMBER
    MEMBER: 'member',
    PERSONAL: 'personal',
    WISHLIST: 'wishlist',
    HISTORY_ORDER: 'history-order',
};

export default path;
