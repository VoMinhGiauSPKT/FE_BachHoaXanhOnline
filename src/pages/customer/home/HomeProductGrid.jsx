import React from 'react';
import { Row, Col, Spin, Empty, Pagination } from 'antd';
import ProductCard from '../../../components/ProductCard';
import styles from './HomeProductGrid.module.scss';

export const HomeProductGrid = ({
  products,
  isLoading,
  page,
  limit,
  total,
  onPageChange
}) => {
  if (isLoading) {
    return (
      <div className={styles.loadingWrap}>
        <Spin size="large" tip="Đang tải danh sách sản phẩm tươi mới..." />
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className={styles.emptyWrap}>
        <Empty description="Không tìm thấy sản phẩm nào phù hợp với bộ lọc." />
      </div>
    );
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        {products.map((prod) => (
          <Col xs={12} sm={8} lg={6} key={prod.productId || prod.id}>
            <ProductCard product={prod} />
          </Col>
        ))}
      </Row>

      {total > limit && (
        <div className={styles.paginationWrap}>
          <Pagination
            current={page}
            pageSize={limit}
            total={total}
            onChange={onPageChange}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};

export default HomeProductGrid;
