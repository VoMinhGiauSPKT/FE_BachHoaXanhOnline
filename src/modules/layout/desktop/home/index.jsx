import React from 'react';
import HeroBanner from '../../../../components/HeroBanner';
import SidebarFilter from '../../../../components/SidebarFilter';
import ProductCard from '../../../../components/ProductCard';
import ProductSkeleton from '../../../../components/ProductSkeleton';
import { SORT_OPTIONS } from '../../../../constants/enums';
import styles from './DesktopHome.module.scss';

export const DesktopHome = ({
  products = [],
  categories = [],
  selectedCategoryId,
  onCategoryChange,
  onPriceFilterApply,
  inStockOnly,
  onInStockChange,
  onResetFilters,
  sortBy,
  onSortChange,
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  isLoading,
  onAddToCart
}) => {
  return (
    <div className={styles.homeContainer}>
      {/* Hero Banner Component */}
      <HeroBanner />

      {/* Main Two-Column Layout */}
      <div id="catalog-section" className={styles.mainLayout}>
        {/* Left Sidebar Filter Card */}
        <div className={styles.sidebarColumn}>
          <SidebarFilter
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onCategoryChange={onCategoryChange}
            onPriceFilterApply={onPriceFilterApply}
            inStockOnly={inStockOnly}
            onInStockChange={onInStockChange}
            onResetFilters={onResetFilters}
          />
        </div>

        {/* Right Catalog Area */}
        <section className={styles.catalogColumn}>
          {/* Main Catalog Top Bar */}
          <div className={styles.catalogBar}>
            <div className={styles.itemsCounter}>
              Showing <strong>{isLoading ? '...' : totalItems}</strong> fresh items
            </div>

            <div className={styles.sortWrapper}>
              <label htmlFor="sort-select" className={styles.sortLabel}>
                SORT BY:
              </label>
              <select
                id="sort-select"
                className={styles.sortDropdown}
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Grid (4 cards per row on desktop) */}
          <div className={styles.productGrid}>
            {isLoading ? (
              <ProductSkeleton count={8} />
            ) : products.length === 0 ? (
              <div className={styles.emptyCatalog}>
                <div className={styles.emptyGraphic}>🥬</div>
                <h3>Không tìm thấy sản phẩm phù hợp</h3>
                <p>Thử điều chỉnh lại bộ lọc giá, từ khóa tìm kiếm hoặc chọn danh mục khác nhé!</p>
                <button
                  type="button"
                  className={styles.resetCatalogBtn}
                  onClick={onResetFilters}
                >
                  Xóa toàn bộ bộ lọc
                </button>
              </div>
            ) : (
              products.map((product) => (
                <ProductCard
                  key={product.productId || product.id}
                  product={product}
                  variant="desktop"
                  onAddToCart={onAddToCart}
                />
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className={styles.paginationBar}>
              <button
                type="button"
                className={styles.pageBtn}
                disabled={currentPage <= 1}
                onClick={() => onPageChange(currentPage - 1)}
              >
                ← Trước
              </button>

              <div className={styles.pageNumbers}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`${styles.numberBtn} ${p === currentPage ? styles.activePage : ''}`}
                    onClick={() => onPageChange(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className={styles.pageBtn}
                disabled={currentPage >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
              >
                Sau →
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DesktopHome;
