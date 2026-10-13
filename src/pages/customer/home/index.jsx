import React, { useEffect } from 'react';
import { Row, Col } from 'antd';
import MainLayout from '../../../layouts/MainLayout';
import { useProductStore } from '../../../stores/useProductStore';
import { useCategoryStore } from '../../../stores/useCategoryStore';
import HomeBanner from './HomeBanner';
import HomeSidebarFilter from './HomeSidebarFilter';
import HomeProductGrid from './HomeProductGrid';
import styles from './Home.module.scss';

export const HomePage = () => {
  const {
    products,
    total,
    page,
    limit,
    isLoading,
    filters,
    fetchProducts,
    setFilters,
    setPage
  } = useProductStore();

  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  return (
    <MainLayout onSearchChange={(kw) => setFilters({ keyword: kw })} searchValue={filters.keyword}>
      <div className={styles.homeContainer}>
        <HomeBanner />

        <Row gutter={[24, 24]}>
          <Col xs={24} md={7} lg={6}>
            <HomeSidebarFilter
              categories={categories}
              selectedCategoryId={filters.categoryId}
              inStockOnly={Boolean(filters.inStock === true || filters.inStock === 'in_stock')}
              sortBy={filters.sortBy}
              onCategoryChange={(catId) => setFilters({ categoryId: catId })}
              onInStockChange={(checked) => setFilters({ inStock: checked ? true : null })}
              onSortChange={(sort) => setFilters({ sortBy: sort })}
              onReset={() => setFilters({ keyword: '', categoryId: null, inStock: null, sortBy: 'default' })}
            />
          </Col>

          <Col xs={24} md={17} lg={18}>
            <HomeProductGrid
              products={products}
              isLoading={isLoading}
              page={page}
              limit={limit}
              total={total}
              onPageChange={(p) => setPage(p)}
            />
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};

export default HomePage;
