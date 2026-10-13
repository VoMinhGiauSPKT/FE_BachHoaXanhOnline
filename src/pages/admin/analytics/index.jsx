import React, { useEffect } from 'react';
import { Card, Segmented, Row, Col, Space, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useAnalyticsStore } from '../../../stores/useAnalyticsStore';
import KpiCards from './KpiCards';
import TopProductsTable from './TopProductsTable';
import InventoryAlertsTable from './InventoryAlertsTable';

export const AdminAnalyticsPage = () => {
  const {
    overview,
    inventoryAlerts,
    topProducts,
    period,
    isLoading,
    setPeriod,
    fetchAll,
    refresh
  } = useAnalyticsStore();

  useEffect(() => {
    fetchAll(period);
  }, [fetchAll, period]);

  const periodOptions = [
    { label: 'Hôm nay', value: 'today' },
    { label: '7 ngày qua', value: 'week' },
    { label: 'Tháng này', value: 'month' },
    { label: 'Năm nay', value: 'year' }
  ];

  return (
    <div>
      <Card
        title="Báo cáo Hoạt động Kinh doanh & Kho"
        variant="borderless"
        style={{ marginBottom: 20 }}
        extra={
          <Space>
            <Segmented
              options={periodOptions}
              value={period}
              onChange={(val) => setPeriod(val)}
            />
            <Button icon={<ReloadOutlined />} onClick={refresh}>
              Làm mới
            </Button>
          </Space>
        }
      >
        <KpiCards overview={overview} />

        <Row gutter={[20, 20]}>
          <Col xs={24} lg={12}>
            <Card title="🔥 Top 5 Sản phẩm Bán chạy" size="small">
              <TopProductsTable data={topProducts} isLoading={isLoading} />
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="⚠️ Cảnh báo Tồn kho Sắp hết" size="small">
              <InventoryAlertsTable data={inventoryAlerts} isLoading={isLoading} />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AdminAnalyticsPage;
