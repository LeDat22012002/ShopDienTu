import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import path from '../../ultils/path';
import Swal from 'sweetalert2';
const FinalRegister = () => {
    const { status } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        if (status === 'failed')
            Swal.fire('Oop!', 'Đăng kí thất bại !', 'error').then(() => {
                navigate(`/${path.LOGIN}`);
            });
        if (status === 'success')
            Swal.fire(
                'Congratudition!',
                'Đăng kí thành công.Hãy đăng nhập !',
                'success'
            ).then(() => {
                navigate(`/${path.LOGIN}`);
            });
    }, []);
    return <div className="w-screen h-screen bg-gray-100"></div>;
};

export default FinalRegister;
