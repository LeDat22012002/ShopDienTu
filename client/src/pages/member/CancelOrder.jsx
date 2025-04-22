import React, { memo } from 'react';

const CancelOrder = ({ editStatus, render, setEditStatus }) => {
    console.log(editStatus);
    return <div>CancelOrder</div>;
};

export default memo(CancelOrder);
