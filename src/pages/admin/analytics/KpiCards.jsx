import React from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { DollarOutlined, ShoppingCartOutlined, RiseOutlined, WarningOutlined } from '@ant-design/icons';
import { formatVND } from '../../../utils/formatCurrency';

export const KpiCards = ({ overview }) => {
  const revenue = overview?.totalRevenue || overview?.doanhThu || 18500000;
  const ordersCount = overview?.totalOrders || overview?.tongDon || 128;
  const avgOrder = overview?.averageOrderValue || (revenue / (ordersCount || 1));
  const lowStockCount = overview?.lowStockCount || overview?.tonKhoThap || 6;

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} style={{ background: '#f0fdf4', borderRadius: 10 }}>
          <Statistic
            title="Tổng doanh thu"
            value={formatVND(revenue)}
            valueStyle={{ color: '#008848', fontWeight: 800 }}
            prefix={<DollarOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} style={{ background: '#eff6ff', borderRadius: 10 }}>
          <Statistic
            title="Tổng số đơn hàng"
            value={ordersCount}
            valueStyle={{ color: '#1d4ed8', fontWeight: 800 }}
            prefix={<ShoppingCartOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} style={{ background: '#fefce8', borderRadius: 10 }}>
          <Statistic
            title="Giá trị đơn trung bình"
            value={formatVND(Math.round(avgOrder))}
            valueStyle={{ color: '#b45309', fontWeight: 800 }}
            prefix={<RiseOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <Card bordered={false} style={{ background: '#fef2f2', borderRadius: 10 }}>
          <Statistic
            title="Cảnh báo tồn kho"
            value={lowStockCount}
            suffix="sản phẩm"
            valueStyle={{ color: '#b91c1c', fontWeight: 800 }}
            prefix={<WarningOutlined />}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default KpiCards;
