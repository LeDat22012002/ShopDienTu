import React, { memo, useEffect, useRef } from 'react';

const PayPalButton = ({ amount, onSuccess }) => {
    const paypalRef = useRef();

    useEffect(() => {
        window.paypal
            .Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [
                            {
                                amount: {
                                    value: amount.toString(),
                                },
                            },
                        ],
                    });
                },
                onApprove: async (data, actions) => {
                    const details = await actions.order.capture();
                    console.log('Payment Approved: ', details);
                    onSuccess(details); // gọi callback sau khi thanh toán thành công
                },
                onError: (err) => {
                    console.error('PayPal Error: ', err);
                },
            })
            .render(paypalRef.current);
    }, [amount, onSuccess]);

    return <div ref={paypalRef}></div>;
};

export default memo(PayPalButton);
