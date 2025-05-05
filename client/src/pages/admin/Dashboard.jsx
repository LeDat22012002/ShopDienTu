import React, { useEffect, useState } from 'react';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import {
    apiGetOrder30days,
    apiGetOrderToday,
    apiGetRevenueToday,
    apiGetVisitsToday,
} from '../../apis';
import { formatMoney } from '../../ultils/helpers';

const Dashboard = () => {
    const [visitsToday, setVisitsToday] = useState(0);
    const [ordersToday, setOrdersToday] = useState(0);
    const [revenueToday, setRevenueToday] = useState(0);
    const [revenue30Days, setRevenue30Days] = useState([]);

    const fetchApiGetOrderToday = async () => {
        const orderRes = await apiGetOrderToday();
        if (orderRes.success) {
            setOrdersToday(orderRes?.datas || 0);
        }
    };
    const fetchApiGetOrder30days = async () => {
        const revenue30 = await apiGetOrder30days();
        if (revenue30.success) {
            setRevenue30Days(revenue30?.datas);
        }
    };
    const fetchApiGetRevenueToday = async () => {
        const revenueRes = await apiGetRevenueToday();
        console.log('Revenue Response:', revenueRes);
        if (revenueRes && revenueRes.totalRevenue !== undefined) {
            setRevenueToday(revenueRes.totalRevenue);
        }
    };
    const fetchApiGetVisitsToday = async () => {
        const visitRes = await apiGetVisitsToday();

        if (visitRes.success) {
            setVisitsToday(visitRes?.data);
        }
    };

    useEffect(() => {
        fetchApiGetOrder30days();
        fetchApiGetOrderToday();
        fetchApiGetRevenueToday();
        fetchApiGetVisitsToday();
    }, []);

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold">Thống kê hôm nay</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="p-4 bg-white shadow rounded-xl">
                    <p className="text-gray-500">Lượt truy cập hôm nay</p>
                    <h3 className="text-xl font-semibold">{visitsToday}</h3>
                </div>
                <div className="p-4 bg-white shadow rounded-xl">
                    <p className="text-gray-500">Đơn hàng hôm nay</p>
                    <h3 className="text-xl font-semibold">{ordersToday}</h3>
                </div>
                <div className="p-4 bg-white shadow rounded-xl">
                    <p className="text-gray-500">Doanh thu hôm nay</p>
                    <h3 className="text-xl font-semibold">
                        {formatMoney(revenueToday) + 'VNĐ'}
                    </h3>
                </div>
            </div>

            <div className="p-6 mt-8 bg-white shadow rounded-xl">
                <h2 className="mb-4 text-xl font-bold">
                    Doanh thu 30 ngày gần nhất
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenue30Days}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="_id" />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="total"
                            stroke="#8884d8"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;
