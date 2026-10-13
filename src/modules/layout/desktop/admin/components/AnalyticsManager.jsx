import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Button,
  Radio,
  Tabs,
  Table,
  Tag,
  Tooltip,
  Spin,
  Alert,
  Segmented
} from 'antd';
import {
  ReloadOutlined,
  RiseOutlined,
  DollarOutlined,
  ShoppingOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  GiftOutlined,
  BarChartOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { formatVND } from '../../../../../utils/formatCurrency';
import analyticsService from '../../../../../services/analyticsService';
import styles from './AnalyticsManager.module.scss';

export const AnalyticsManager = () => {
  // 1. Loading states
  const [isOverviewLoading, setIsOverviewLoading] = useState(false);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [isAlertsLoading, setIsAlertsLoading] = useState(false);
  const [isTopProductsLoading, setIsTopProductsLoading] = useState(false);

  // 2. Data states
  const [overview, setOverview] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [expiringProducts, setExpiringProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  // 3. Chart controls
  const [chartMetric, setChartMetric] = useState('PROFIT_REVENUE'); // PROFIT_REVENUE, ORDERS, VOUCHER
  const [chartPeriod, setChartPeriod] = useState('day_7'); // day_7, day_30, month, year
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // 4. Alert tab active key
  const [alertTabKey, setAlertTabKey] = useState('low_stock');

  // Load Overview Data
  const loadOverview = useCallback(async () => {
    setIsOverviewLoading(true);
    try {
      const res = await analyticsService.getOverview();
      if (res.data) {
        setOverview(res.data);
      }
    } catch (err) {
      console.warn('Lỗi tải tổng quan báo cáo:', err);
    } finally {
      setIsOverviewLoading(false);
    }
  }, []);

  // Load Chart Data
  const loadChart = useCallback(async () => {
    setIsChartLoading(true);
    try {
      let period = 'day';
      let days = 7;
      if (chartPeriod === 'day_30') {
        period = 'day';
        days = 30;
      } else if (chartPeriod === 'month') {
        period = 'month';
        days = null;
      } else if (chartPeriod === 'year') {
        period = 'year';
        days = null;
      }

      const res = await analyticsService.getChartData({ period, days });
      if (res.data?.points) {
        setChartData(res.data.points);
      } else {
        setChartData([]);
      }
    } catch (err) {
      console.warn('Lỗi tải biểu đồ:', err);
      setChartData([]);
    } finally {
      setIsChartLoading(false);
    }
  }, [chartPeriod]);

  // Load Inventory Alerts
  const loadAlerts = useCallback(async () => {
    setIsAlertsLoading(true);
    try {
      const res = await analyticsService.getInventoryAlerts();
      if (res.data) {
        setLowStockProducts(res.data.lowStockProducts || []);
        setExpiringProducts(res.data.expiringProducts || []);
      }
    } catch (err) {
      console.warn('Lỗi tải cảnh báo kho:', err);
    } finally {
      setIsAlertsLoading(false);
    }
  }, []);

  // Load Top Products
  const loadTopProducts = useCallback(async () => {
    setIsTopProductsLoading(true);
    try {
      const res = await analyticsService.getTopProducts(10);
      if (res.data) {
        setTopProducts(res.data);
      }
    } catch (err) {
      console.warn('Lỗi tải top sản phẩm:', err);
    } finally {
      setIsTopProductsLoading(false);
    }
  }, []);

  // Fetch all on mount
  const handleRefreshAll = () => {
    loadOverview();
    loadChart();
    loadAlerts();
    loadTopProducts();
  };

  useEffect(() => {
    loadOverview();
    loadAlerts();
    loadTopProducts();
  }, [loadOverview, loadAlerts, loadTopProducts]);

  useEffect(() => {
    loadChart();
  }, [loadChart]);

  // SVG Chart Computations
  const chartMetricsComputed = useMemo(() => {
    if (!chartData || chartData.length === 0) return null;

    let maxVal = 1;
    let minVal = 0;

    if (chartMetric === 'PROFIT_REVENUE') {
      chartData.forEach(p => {
        const rev = Number(p.revenue) || 0;
        const prof = Number(p.profit) || 0;
        if (rev > maxVal) maxVal = rev;
        if (prof < minVal) minVal = prof;
      });
      // Đảm bảo có headroom cho đồ thị
      maxVal = maxVal > 0 ? maxVal * 1.15 : 100000;
    } else if (chartMetric === 'ORDERS') {
      chartData.forEach(p => {
        const totalOrd = (Number(p.orderCount) || 0) + (Number(p.cancelledCount) || 0);
        if (totalOrd > maxVal) maxVal = totalOrd;
      });
      maxVal = Math.max(5, Math.ceil(maxVal * 1.2));
    } else if (chartMetric === 'VOUCHER') {
      chartData.forEach(p => {
        const disc = Number(p.discountAmount) || 0;
        if (disc > maxVal) maxVal = disc;
      });
      maxVal = maxVal > 0 ? maxVal * 1.15 : 100000;
    }

    return { maxVal, minVal };
  }, [chartData, chartMetric]);

  // Chart Dimensions
  const svgWidth = 860;
  const svgHeight = 280;
  const paddingLeft = 70;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 45;

  const innerWidth = svgWidth - paddingLeft - paddingRight;
  const innerHeight = svgHeight - paddingTop - paddingBottom;

  // Inventory Alert Columns
  const lowStockColumns = [
    {
      title: 'Sản phẩm',
      key: 'product',
      render: (_, r) => (
        <div className={styles.productRow}>
          <img
            src={r.imageUrl || 'https://via.placeholder.com/44'}
            alt={r.productName}
            className={styles.productImg}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/44'; }}
          />
          <div className={styles.productInfo}>
            <span className={styles.pName}>{r.productName}</span>
            <span className={styles.pMeta}>Mã: {r.productId} • ĐVT: {r.unit}</span>
          </div>
        </div>
      )
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 140,
      render: (v) => <Tag color="blue">{v || 'Chung'}</Tag>
    },
    {
      title: 'Giá bán / Giá vốn',
      key: 'price',
      width: 150,
      render: (_, r) => (
        <div>
          <div style={{ fontWeight: 600, color: '#059669' }}>{formatVND(r.price)}</div>
          <div style={{ fontSize: 11, color: '#64748b' }}>Vốn: {formatVND(r.costPrice)}</div>
        </div>
      )
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      width: 120,
      align: 'center',
      render: (v, r) => {
        if (v === 0) {
          return <Tag color="error" style={{ fontWeight: 700 }}>HẾT HÀNG (0)</Tag>;
        }
        return <Tag color="warning" style={{ fontWeight: 700 }}>CÒN {v} {r.unit}</Tag>;
      }
    }
  ];

  const expiringColumns = [
    {
      title: 'Sản phẩm',
      key: 'product',
      render: (_, r) => (
        <div className={styles.productRow}>
          <img
            src={r.imageUrl || 'https://via.placeholder.com/44'}
            alt={r.productName}
            className={styles.productImg}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/44'; }}
          />
          <div className={styles.productInfo}>
            <span className={styles.pName}>{r.productName}</span>
            <span className={styles.pMeta}>Mã: {r.productId} • Tồn: {r.stock} {r.unit}</span>
          </div>
        </div>
      )
    },
    {
      title: 'Hạn sử dụng',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      width: 130,
      render: (v) => {
        if (!v) return '-';
        if (Array.isArray(v)) {
          return `${v[2]}/${v[1]}/${v[0]}`;
        }
        return String(v);
      }
    },
    {
      title: 'Tình trạng hạn',
      dataIndex: 'daysUntilExpiry',
      key: 'daysUntilExpiry',
      width: 160,
      align: 'center',
      render: (v) => {
        if (v < 0) {
          return <Tag color="error" style={{ fontWeight: 700 }}>QUÁ HẠN {Math.abs(v)} NGÀY</Tag>;
        }
        if (v === 0) {
          return <Tag color="error" style={{ fontWeight: 700 }}>HẾT HẠN HÔM NAY</Tag>;
        }
        return <Tag color="orange" style={{ fontWeight: 700 }}>CÒN {v} NGÀY NỮA</Tag>;
      }
    }
  ];

  // Top Products Columns
  const topProductColumns = [
    {
      title: '#',
      key: 'rank',
      width: 50,
      align: 'center',
      render: (_, __, idx) => {
        let rankClass = styles.rankDefault;
        if (idx === 0) rankClass = styles.rank1;
        else if (idx === 1) rankClass = styles.rank2;
        else if (idx === 2) rankClass = styles.rank3;
        return <span className={`${styles.rankBadge} ${rankClass}`}>{idx + 1}</span>;
      }
    },
    {
      title: 'Sản phẩm',
      key: 'product',
      render: (_, r) => (
        <div className={styles.productRow}>
          <img
            src={r.imageUrl || 'https://via.placeholder.com/44'}
            alt={r.productName}
            className={styles.productImg}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/44'; }}
          />
          <div className={styles.productInfo}>
            <span className={styles.pName}>{r.productName}</span>
            <span className={styles.pMeta}>Danh mục: {r.categoryName || 'Chung'}</span>
          </div>
        </div>
      )
    },
    {
      title: 'Đã bán',
      dataIndex: 'soldQuantity',
      key: 'soldQuantity',
      width: 110,
      align: 'center',
      render: (v, r) => (
        <span style={{ fontWeight: 700, color: '#0f172a' }}>
          {v} {r.unit}
        </span>
      )
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      width: 130,
      align: 'right',
      render: (v) => (
        <span style={{ fontWeight: 600, color: '#059669' }}>
          {formatVND(v)}
        </span>
      )
    },
    {
      title: 'Lãi thuần',
      dataIndex: 'profit',
      key: 'profit',
      width: 130,
      align: 'right',
      render: (v) => {
        const isNegative = Number(v) < 0;
        return (
          <span style={{ fontWeight: 700, color: isNegative ? '#dc2626' : '#4f46e5' }}>
            {formatVND(v)}
          </span>
        );
      }
    }
  ];

  return (
    <div className={styles.analyticsContainer}>
      {/* 1. Header Section */}
      <div className={styles.headerSection}>
        <div className={styles.titleBlock}>
          <h2>
            <BarChartOutlined style={{ color: '#10b981' }} />
            Báo Cáo & Thống Kê Hoạt Động Kinh Doanh
          </h2>
          <p>
            Dữ liệu tổng hợp tức thời từ hệ thống • Phản ánh chính xác doanh thu, lãi thuần thực tế sau voucher và cảnh báo kho
          </p>
        </div>

        <div className={styles.actionsBlock}>
          <Button
            type="primary"
            icon={<ReloadOutlined spin={isOverviewLoading || isChartLoading} />}
            onClick={handleRefreshAll}
            style={{ background: '#10b981', borderColor: '#10b981', borderRadius: 8 }}
          >
            Làm mới số liệu
          </Button>
        </div>
      </div>

      {/* 2. Overview KPI Cards */}
      <div className={styles.kpiGrid}>
        {/* Doanh thu thuần */}
        <div className={`${styles.kpiCard} ${styles.kpiRevenue}`}>
          <div className={styles.cardTop}>
            <span className={styles.cardLabel}>Doanh Thu Thuần</span>
            <div className={styles.cardIcon}><DollarOutlined /></div>
          </div>
          <div className={styles.mainValue}>
            {overview ? formatVND(overview.totalPaidRevenue) : '0 đ'}
          </div>
          <div className={styles.cardSub}>
            <span>Doanh thu gốc: <strong>{overview ? formatVND(overview.totalOriginalRevenue) : '0 đ'}</strong></span>
            {overview && Number(overview.totalDiscount) > 0 && (
              <span className={`${styles.badgePill} ${styles.badgeNegative}`}>
                Voucher giảm: -{formatVND(overview.totalDiscount)}
              </span>
            )}
          </div>
        </div>

        {/* Lãi thuần (Net Profit) */}
        <div className={`${styles.kpiCard} ${overview && Number(overview.totalNetProfit) < 0 ? styles.kpiProfitNegative : styles.kpiProfit}`}>
          <div className={styles.cardTop}>
            <span className={styles.cardLabel}>
              Lãi Thuần Thực Tế
              <Tooltip title="Lãi thuần = Doanh thu thực nhận - Giá vốn hàng bán (COGS). Đã khấu trừ trực tiếp các khoản voucher giảm giá!">
                <span style={{ cursor: 'pointer', marginLeft: 4 }}>ℹ️</span>
              </Tooltip>
            </span>
            <div className={styles.cardIcon}><RiseOutlined /></div>
          </div>
          <div className={styles.mainValue}>
            {overview ? formatVND(overview.totalNetProfit) : '0 đ'}
          </div>
          <div className={styles.cardSub}>
            <span>COGS: <strong>{overview ? formatVND(overview.totalCogs) : '0 đ'}</strong></span>
            {overview && (
              <span className={`${styles.badgePill} ${Number(overview.profitMargin) >= 0 ? styles.badgePositive : styles.badgeNegative}`}>
                Tỷ suất: {overview.profitMargin}%
              </span>
            )}
          </div>
        </div>

        {/* Đơn hàng & Voucher */}
        <div className={`${styles.kpiCard} ${styles.kpiOrders}`}>
          <div className={styles.cardTop}>
            <span className={styles.cardLabel}>Đơn Hàng & Voucher</span>
            <div className={styles.cardIcon}><ShoppingOutlined /></div>
          </div>
          <div className={styles.mainValue}>
            {overview ? `${overview.paidOrdersCount} đơn thành công` : '0 đơn'}
          </div>
          <div className={styles.cardSub}>
            <span>Tổng đơn: <strong>{overview?.totalOrders || 0}</strong></span>
            <span className={`${styles.badgePill} ${styles.badgeNeutral}`}>
              Đã huỷ: {overview?.cancelledOrdersCount || 0}
            </span>
            <span className={`${styles.badgePill} ${styles.badgePositive}`}>
              <GiftOutlined /> {overview?.voucherUsedCount || 0} lượt voucher
            </span>
          </div>
        </div>

        {/* Sản phẩm kinh doanh */}
        <div className={`${styles.kpiCard} ${styles.kpiProducts}`}>
          <div className={styles.cardTop}>
            <span className={styles.cardLabel}>Sản Phẩm Đang Bán</span>
            <div className={styles.cardIcon}><CheckCircleOutlined /></div>
          </div>
          <div className={styles.mainValue}>
            {overview ? `${overview.totalActiveProducts} mặt hàng` : '0 mặt hàng'}
          </div>
          <div className={styles.cardSub}>
            <span>Tất cả các sản phẩm đang hiển thị và hoạt động trên sàn</span>
          </div>
        </div>

        {/* Cảnh báo tồn kho */}
        <div
          className={`${styles.kpiCard} ${styles.kpiLowStock}`}
          onClick={() => setAlertTabKey('low_stock')}
        >
          <div className={styles.cardTop}>
            <span className={styles.cardLabel}>Sắp Hết Hàng (≤10)</span>
            <div className={styles.cardIcon}><WarningOutlined /></div>
          </div>
          <div className={styles.mainValue}>
            {overview ? `${overview.lowStockCount} sản phẩm` : '0 sản phẩm'}
          </div>
          <div className={styles.cardSub}>
            <span className={`${styles.badgePill} ${overview?.lowStockCount > 0 ? styles.badgeNegative : styles.badgePositive}`}>
              {overview?.lowStockCount > 0 ? 'Cần nhập hàng bổ sung' : 'Tồn kho an toàn'}
            </span>
          </div>
        </div>

        {/* Cảnh báo hạn sử dụng */}
        <div
          className={`${styles.kpiCard} ${styles.kpiExpiring}`}
          onClick={() => setAlertTabKey('expiring')}
        >
          <div className={styles.cardTop}>
            <span className={styles.cardLabel}>Sắp Hết Hạn (≤15 ngày)</span>
            <div className={styles.cardIcon}><ClockCircleOutlined /></div>
          </div>
          <div className={styles.mainValue}>
            {overview ? `${overview.expiringCount} sản phẩm` : '0 sản phẩm'}
          </div>
          <div className={styles.cardSub}>
            <span className={`${styles.badgePill} ${overview?.expiringCount > 0 ? styles.badgeNegative : styles.badgePositive}`}>
              {overview?.expiringCount > 0 ? 'Cần thanh lý / xuất huỷ' : 'Hạn dùng ổn định'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Interactive Multi-Metric Chart Section */}
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <div className={styles.chartTitle}>
            <BarChartOutlined style={{ color: '#6366f1' }} />
            <span>Biểu Đồ Phân Tích Đa Chiều</span>
          </div>

          <div className={styles.controlsWrapper}>
            <Segmented
              value={chartMetric}
              onChange={setChartMetric}
              options={[
                { label: 'Doanh Thu & Lãi Thuần', value: 'PROFIT_REVENUE', icon: <RiseOutlined /> },
                { label: 'Số Lượng Đơn Hàng', value: 'ORDERS', icon: <ShoppingOutlined /> },
                { label: 'Voucher & Giảm Giá', value: 'VOUCHER', icon: <GiftOutlined /> }
              ]}
            />

            <Radio.Group
              value={chartPeriod}
              onChange={(e) => setChartPeriod(e.target.value)}
              buttonStyle="solid"
            >
              <Radio.Button value="day_7">7 ngày</Radio.Button>
              <Radio.Button value="day_30">30 ngày</Radio.Button>
              <Radio.Button value="month">12 tháng</Radio.Button>
              <Radio.Button value="year">Theo năm</Radio.Button>
            </Radio.Group>
          </div>
        </div>

        <div className={styles.chartWrapper}>
          {isChartLoading ? (
            <div style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Spin tip="Đang dựng biểu đồ..." />
            </div>
          ) : chartData.length === 0 ? (
            <div style={{ height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              Không có dữ liệu phát sinh trong kỳ đã chọn
            </div>
          ) : (
            <>
              {/* Dynamic SVG Interactive Chart */}
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className={styles.svgChart}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                {/* Horizontal Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                  const y = paddingTop + innerHeight * (1 - ratio);
                  let labelVal = '';
                  if (chartMetricsComputed) {
                    const val = ratio * chartMetricsComputed.maxVal;
                    if (chartMetric === 'ORDERS') {
                      labelVal = `${Math.round(val)}`;
                    } else {
                      labelVal = val >= 1000000 ? `${(val / 1000000).toFixed(1)}Tr` : `${Math.round(val / 1000)}k`;
                    }
                  }
                  return (
                    <g key={idx}>
                      <line
                        x1={paddingLeft}
                        y1={y}
                        x2={svgWidth - paddingRight}
                        y2={y}
                        className={styles.gridLine}
                      />
                      <text x={paddingLeft - 10} y={y + 4} className={styles.yAxisText}>
                        {labelVal}
                      </text>
                    </g>
                  );
                })}

                {/* X Axis Line */}
                <line
                  x1={paddingLeft}
                  y1={paddingTop + innerHeight}
                  x2={svgWidth - paddingRight}
                  y2={paddingTop + innerHeight}
                  className={styles.axisLine}
                />

                {/* Bars / Data Points */}
                {chartData.map((pt, idx) => {
                  const numPoints = chartData.length;
                  const stepX = innerWidth / numPoints;
                  const xCenter = paddingLeft + idx * stepX + stepX / 2;
                  const barWidth = Math.max(8, Math.min(28, stepX * 0.35));

                  if (chartMetric === 'PROFIT_REVENUE') {
                    const rev = Number(pt.revenue) || 0;
                    const prof = Number(pt.profit) || 0;
                    const max = chartMetricsComputed?.maxVal || 1;

                    const revHeight = Math.max(2, (rev / max) * innerHeight);
                    const revY = paddingTop + innerHeight - revHeight;

                    // Profit (có thể âm)
                    const profHeight = Math.max(2, (Math.abs(prof) / max) * innerHeight);
                    const profY = prof >= 0 ? paddingTop + innerHeight - profHeight : paddingTop + innerHeight;

                    return (
                      <g
                        key={idx}
                        className={styles.barHover}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
                          setHoveredPoint(pt);
                        }}
                      >
                        {/* Revenue Bar */}
                        <rect
                          x={xCenter - barWidth - 2}
                          y={revY}
                          width={barWidth}
                          height={revHeight}
                          fill="#10b981"
                          rx={3}
                        />

                        {/* Profit Bar */}
                        <rect
                          x={xCenter + 2}
                          y={profY}
                          width={barWidth}
                          height={profHeight}
                          fill={prof >= 0 ? '#6366f1' : '#ef4444'}
                          rx={3}
                        />

                        {/* X-axis Label */}
                        <text
                          x={xCenter}
                          y={paddingTop + innerHeight + 20}
                          className={styles.axisText}
                        >
                          {pt.label}
                        </text>
                      </g>
                    );
                  } else if (chartMetric === 'ORDERS') {
                    const orders = Number(pt.orderCount) || 0;
                    const cancelled = Number(pt.cancelledCount) || 0;
                    const max = chartMetricsComputed?.maxVal || 1;

                    const ordHeight = Math.max(2, (orders / max) * innerHeight);
                    const ordY = paddingTop + innerHeight - ordHeight;

                    const canHeight = Math.max(2, (cancelled / max) * innerHeight);
                    const canY = paddingTop + innerHeight - canHeight;

                    return (
                      <g
                        key={idx}
                        className={styles.barHover}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
                          setHoveredPoint(pt);
                        }}
                      >
                        {/* Success Orders */}
                        <rect
                          x={xCenter - barWidth - 2}
                          y={ordY}
                          width={barWidth}
                          height={ordHeight}
                          fill="#3b82f6"
                          rx={3}
                        />

                        {/* Cancelled Orders */}
                        <rect
                          x={xCenter + 2}
                          y={canY}
                          width={barWidth}
                          height={canHeight}
                          fill="#f59e0b"
                          rx={3}
                        />

                        {/* X-axis Label */}
                        <text
                          x={xCenter}
                          y={paddingTop + innerHeight + 20}
                          className={styles.axisText}
                        >
                          {pt.label}
                        </text>
                      </g>
                    );
                  } else {
                    // Voucher Metric
                    const voucherCount = Number(pt.voucherCount) || 0;
                    const discount = Number(pt.discountAmount) || 0;
                    const max = chartMetricsComputed?.maxVal || 1;

                    const discHeight = Math.max(2, (discount / max) * innerHeight);
                    const discY = paddingTop + innerHeight - discHeight;

                    return (
                      <g
                        key={idx}
                        className={styles.barHover}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltipPos({ x: rect.left + rect.width / 2, y: rect.top });
                          setHoveredPoint(pt);
                        }}
                      >
                        {/* Voucher Discount Amount */}
                        <rect
                          x={xCenter - barWidth / 2}
                          y={discY}
                          width={barWidth}
                          height={discHeight}
                          fill="#ec4899"
                          rx={3}
                        />

                        {/* X-axis Label */}
                        <text
                          x={xCenter}
                          y={paddingTop + innerHeight + 20}
                          className={styles.axisText}
                        >
                          {pt.label}
                        </text>
                      </g>
                    );
                  }
                })}
              </svg>

              {/* Tooltip Overlay */}
              {hoveredPoint && (
                <div
                  className={styles.chartTooltip}
                  style={{
                    left: `${tooltipPos.x}px`,
                    top: `${tooltipPos.y}px`,
                    position: 'fixed'
                  }}
                >
                  <div className={styles.tooltipHeader}>Kỳ: {hoveredPoint.label} ({hoveredPoint.dateKey})</div>
                  {chartMetric === 'PROFIT_REVENUE' && (
                    <>
                      <div className={styles.tooltipRow}>
                        <span className={styles.rowKey}>Doanh thu:</span>
                        <span className={styles.rowVal} style={{ color: '#34d399' }}>{formatVND(hoveredPoint.revenue)}</span>
                      </div>
                      <div className={styles.tooltipRow}>
                        <span className={styles.rowKey}>Giá vốn (COGS):</span>
                        <span className={styles.rowVal}>{formatVND(hoveredPoint.cogs)}</span>
                      </div>
                      <div className={styles.tooltipRow}>
                        <span className={styles.rowKey}>Lãi thuần:</span>
                        <span className={styles.rowVal} style={{ color: Number(hoveredPoint.profit) >= 0 ? '#818cf8' : '#f87171' }}>
                          {formatVND(hoveredPoint.profit)}
                        </span>
                      </div>
                    </>
                  )}
                  {chartMetric === 'ORDERS' && (
                    <>
                      <div className={styles.tooltipRow}>
                        <span className={styles.rowKey}>Đơn hoàn tất:</span>
                        <span className={styles.rowVal} style={{ color: '#60a5fa' }}>{hoveredPoint.orderCount} đơn</span>
                      </div>
                      <div className={styles.tooltipRow}>
                        <span className={styles.rowKey}>Đơn huỷ:</span>
                        <span className={styles.rowVal} style={{ color: '#fbbf24' }}>{hoveredPoint.cancelledCount} đơn</span>
                      </div>
                    </>
                  )}
                  {chartMetric === 'VOUCHER' && (
                    <>
                      <div className={styles.tooltipRow}>
                        <span className={styles.rowKey}>Lượt dùng voucher:</span>
                        <span className={styles.rowVal} style={{ color: '#f472b6' }}>{hoveredPoint.voucherCount} lần</span>
                      </div>
                      <div className={styles.tooltipRow}>
                        <span className={styles.rowKey}>Số tiền giảm:</span>
                        <span className={styles.rowVal} style={{ color: '#f472b6' }}>{formatVND(hoveredPoint.discountAmount)}</span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Chart Legend */}
              <div className={styles.chartLegend}>
                {chartMetric === 'PROFIT_REVENUE' && (
                  <>
                    <div className={styles.legendItem}>
                      <span className={styles.dot} style={{ background: '#10b981' }} />
                      <span>Doanh thu thuần</span>
                    </div>
                    <div className={styles.legendItem}>
                      <span className={styles.dot} style={{ background: '#6366f1' }} />
                      <span>Lãi thuần (Dương)</span>
                    </div>
                    <div className={styles.legendItem}>
                      <span className={styles.dot} style={{ background: '#ef4444' }} />
                      <span>Lỗ thuần (Âm)</span>
                    </div>
                  </>
                )}
                {chartMetric === 'ORDERS' && (
                  <>
                    <div className={styles.legendItem}>
                      <span className={styles.dot} style={{ background: '#3b82f6' }} />
                      <span>Đơn thành công</span>
                    </div>
                    <div className={styles.legendItem}>
                      <span className={styles.dot} style={{ background: '#f59e0b' }} />
                      <span>Đơn hủy</span>
                    </div>
                  </>
                )}
                {chartMetric === 'VOUCHER' && (
                  <>
                    <div className={styles.legendItem}>
                      <span className={styles.dot} style={{ background: '#ec4899' }} />
                      <span>Tiền voucher đã giảm giá</span>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 4. Actionable Alerts & Top Products Tables */}
      <div className={styles.tablesGrid}>
        {/* Table 1: Cảnh báo Kho */}
        <div className={styles.tableCard}>
          <div className={styles.cardTitle}>
            <h3>
              <WarningOutlined style={{ color: '#f59e0b' }} />
              Cảnh Báo Kho & Hạn Dùng
            </h3>
          </div>

          <Tabs
            activeKey={alertTabKey}
            onChange={setAlertTabKey}
            items={[
              {
                key: 'low_stock',
                label: `Sắp hết hàng (${lowStockProducts.length})`,
                children: (
                  <Table
                    columns={lowStockColumns}
                    dataSource={lowStockProducts}
                    rowKey="productId"
                    loading={isAlertsLoading}
                    pagination={{ pageSize: 5, size: 'small' }}
                    size="small"
                  />
                )
              },
              {
                key: 'expiring',
                label: `Sắp hết hạn / Quá hạn (${expiringProducts.length})`,
                children: (
                  <Table
                    columns={expiringColumns}
                    dataSource={expiringProducts}
                    rowKey="productId"
                    loading={isAlertsLoading}
                    pagination={{ pageSize: 5, size: 'small' }}
                    size="small"
                  />
                )
              }
            ]}
          />
        </div>

        {/* Table 2: Top Sản Phẩm Bán Chạy & Lãi Cao */}
        <div className={styles.tableCard}>
          <div className={styles.cardTitle}>
            <h3>
              <RiseOutlined style={{ color: '#10b981' }} />
              Top Sản Phẩm Doanh Thu & Lợi Nhuận
            </h3>
            <span style={{ fontSize: 12, color: '#64748b' }}>Đóng góp cao nhất</span>
          </div>

          <Table
            columns={topProductColumns}
            dataSource={topProducts}
            rowKey="productId"
            loading={isTopProductsLoading}
            pagination={{ pageSize: 5, size: 'small' }}
            size="small"
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsManager;
