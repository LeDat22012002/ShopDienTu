import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import {
    Home,
    Login,
    Public,
    Services,
    FAQs,
    Products,
    DetailsProduct,
    Blogs,
    FinalRegister,
    ResetPassword,
    Profile,
    ProfileFb,
} from './pages/public';
import {
    AdminLayout,
    CreateProduct,
    ManageProduct,
    ManageUser,
    ManageOrder,
    DashBoard,
    CreateBrand,
    ManageBrand,
    CreateCategory,
    ManageCategory,
    CreateColor,
    ManageColor,
} from './pages/admin';
import { Personal, MemberLayout } from './pages/member';
import path from './ultils/path';
import { getCategories } from './store/app/asyncAction';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { Modal } from './components';

function App() {
    const dispatch = useDispatch();
    const { isShowModal, modalChildren } = useSelector((state) => state.app);
    useEffect(() => {
        dispatch(getCategories());
    }, []);

    return (
        <div className="relative font-main">
            {isShowModal && <Modal>{modalChildren}</Modal>}
            <Routes>
                <Route path={path.PUBLIC} element={<Public />}>
                    <Route path={path.HOME} element={<Home />} />
                    <Route path={path.BLOGS} element={<Blogs />} />
                    <Route
                        path={path.DETAIL_PRODUCT__CATEGORY__PID__TITLE}
                        element={<DetailsProduct />}
                    />
                    <Route path={path.OUR_SERVICES} element={<Services />} />
                    <Route path={path.PRODUCTS} element={<Products />} />
                    <Route path={path.FAQ} element={<FAQs />} />
                    <Route path={path.ALL} element={<Home />} />
                </Route>
                <Route path={path.ADMIN} element={<AdminLayout />}>
                    <Route path={path.CREATE_COLOR} element={<CreateColor />} />
                    <Route path={path.MANAGE_COLOR} element={<ManageColor />} />
                    <Route path={path.CREATE_BRAND} element={<CreateBrand />} />
                    <Route path={path.MANAGE_BRAND} element={<ManageBrand />} />
                    <Route
                        path={path.CREATE_CATEGORY}
                        element={<CreateCategory />}
                    />
                    <Route
                        path={path.MANAGE_CATEGORY}
                        element={<ManageCategory />}
                    />
                    <Route
                        path={path.CREATE_PRODUCT}
                        element={<CreateProduct />}
                    />
                    <Route
                        path={path.MANAGE_PRODUCT}
                        element={<ManageProduct />}
                    />
                    <Route path={path.MANAGE_USER} element={<ManageUser />} />
                    <Route path={path.MANAGE_ORDER} element={<ManageOrder />} />
                    <Route path={path.DASHBOAD} element={<DashBoard />} />
                </Route>
                <Route path={path.MEMBER} element={<MemberLayout />}>
                    <Route path={path.PERSONAL} element={<Personal />} />
                </Route>
                <Route path={path.LOGIN} element={<Login />} />
                <Route path={path.FINAL_REGISTER} element={<FinalRegister />} />
                <Route path={path.RESET_PASSWORD} element={<ResetPassword />} />
                <Route path={path.PROFILE_FB} element={<ProfileFb />} />
                <Route path={path.PROFILE} element={<Profile />} />
            </Routes>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                // transition={Bounce}
            />
        </div>
    );
}

export default App;
