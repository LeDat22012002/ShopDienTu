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
    apiGetVisits30days,
    apiGetVisitsToday,
} from '../../apis';
import { formatMoney } from '../../ultils/helpers';

const Dashboard = () => {
    const [visitsToday, setVisitsToday] = useState(0);
    const [ordersToday, setOrdersToday] = useState(0);
    const [revenueToday, setRevenueToday] = useState(0);
    const [revenue30Days, setRevenue30Days] = useState([]);
    const [visits30Days, setVisits30Days] = useState([]);

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
    const fetchApiGetVisits30Days = async () => {
        const res = await apiGetVisits30days();
        if (res.success) {
            setVisits30Days(res.datas);
        }
    };

    useEffect(() => {
        fetchApiGetOrder30days();
        fetchApiGetOrderToday();
        fetchApiGetRevenueToday();
        fetchApiGetVisitsToday();
        fetchApiGetVisits30Days();
    }, []);

    return (
        <div className="p-2 space-y-6 ">
            <h2 className="font-bold text-md lg:text-xl">Thống kê hôm nay</h2>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                <div className="p-4 bg-white rounded-sm shadow">
                    <p className="text-gray-500">Lượt truy cập hôm nay</p>
                    <h3 className="text-xl font-semibold">{visitsToday}</h3>
                </div>
                <div className="p-4 bg-white rounded-sm shadow">
                    <p className="text-gray-500">Đơn hàng hôm nay</p>
                    <h3 className="text-xl font-semibold">{ordersToday}</h3>
                </div>
                <div className="p-4 bg-white rounded-sm shadow">
                    <p className="text-gray-500">Doanh thu hôm nay</p>
                    <h3 className="text-xl font-semibold">
                        {formatMoney(revenueToday)} VNĐ
                    </h3>
                </div>
            </div>

            <div className="p-2 mt-2 bg-white rounded-sm shadow">
                <h2 className="mb-4 font-bold text-md lg:text-xl">
                    Doanh thu 30 ngày gần nhất
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenue30Days}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="_id" />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="linear"
                            dataKey="total"
                            stroke="#82ca9d"
                            strokeWidth={2}
                            dot={{ r: 3 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="p-2 mt-2 bg-white rounded-sm shadow">
                <h2 className="mb-4 font-bold text-md lg:text-xl">
                    Lượt truy cập 30 ngày gần nhất
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={visits30Days}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="_id" />
                        <YAxis />
                        <Tooltip />
                        <Line
                            type="linear"
                            dataKey="total"
                            stroke="#82ca9d"
                            strokeWidth={2}
                            dot={{ r: 3 }} // hiện các chấm ở từng điểm
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;
