import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumb, Tabs, Spin, Card } from 'antd';
import MainLayout from '../../../layouts/MainLayout';
import { useProductStore } from '../../../stores/useProductStore';
import { useReviewStore } from '../../../stores/useReviewStore';
import { PATHS } from '../../../constants/paths';
import ProductInfo from './ProductInfo';
import ProductReviews from './ProductReviews';
import styles from './ProductDetail.module.scss';

export const ProductDetailPage = () => {
  const { id } = useParams();
  const { currentProduct, isDetailLoading, fetchProductById } = useProductStore();
  const { reviews, fetchProductReviews, createReview } = useReviewStore();

  useEffect(() => {
    if (id) {
      fetchProductById(id);
      fetchProductReviews(id);
    }
  }, [id, fetchProductById, fetchProductReviews]);

  if (isDetailLoading && !currentProduct) {
    return (
      <MainLayout>
        <div className={styles.loadingWrap}>
          <Spin size="large" tip="Đang tải thông tin sản phẩm..." />
        </div>
      </MainLayout>
    );
  }

  const tabItems = [
    {
      key: 'reviews',
      label: `Đánh giá & Bình luận (${reviews?.length || 0})`,
      children: (
        <ProductReviews reviews={reviews} />
      )
    }
  ];

  return (
    <MainLayout>
      <div className={styles.container}>
        <Breadcrumb
          className={styles.breadcrumb}
          items={[
            { title: <Link to={PATHS.HOME}>Trang chủ</Link> },
            { title: currentProduct?.category?.categoryName || 'Sản phẩm' },
            { title: currentProduct?.productName || currentProduct?.name || 'Chi tiết' }
          ]}
        />

        <ProductInfo product={currentProduct} />

        <div className={styles.tabSection}>
          <Tabs defaultActiveKey="specs" items={tabItems} size="large" />
        </div>
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;
