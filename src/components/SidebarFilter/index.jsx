import React, { useState } from 'react';
import styles from './SidebarFilter.module.scss';

export const SidebarFilter = ({
  categories = [],
  selectedCategoryId = null,
  onCategoryChange,
  onPriceFilterApply,
  inStockOnly = false,
  onInStockChange,
  onResetFilters
}) => {
  const handleReset = () => {
    onResetFilters();
  };

  return (
    <aside className={styles.filterCard}>
      {/* Card Header */}
      <div className={styles.header}>
        <div className={styles.titleWrap}>
          <span className={styles.filterIcon}>⚙️</span>
          <h3>Filters</h3>
        </div>
        <button
          type="button"
          className={styles.resetBtn}
          onClick={handleReset}
        >
          Reset All
        </button>
      </div>

      {/* Departments */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Departments</h4>
        <div className={styles.categoryList}>
          <button
            type="button"
            className={`${styles.categoryItem} ${!selectedCategoryId ? styles.active : ''}`}
            onClick={() => onCategoryChange(null)}
          >
            <span>All Departments</span>
            {!selectedCategoryId && <span className={styles.indicator}>●</span>}
          </button>

          {categories.map((cat) => {
            const isSelected = selectedCategoryId === cat.categoryId;
            return (
              <button
                key={cat.categoryId}
                type="button"
                className={`${styles.categoryItem} ${isSelected ? styles.active : ''}`}
                onClick={() => onCategoryChange(cat.categoryId)}
              >
                <span>{cat.categoryName}</span>
                {isSelected && <span className={styles.indicator}>●</span>}
              </button>
            );
          })}
        </div>
      </div>


      {/* Availability Toggle */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Availability</h4>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => onInStockChange(e.target.checked)}
          />
          <span className={styles.customCheck}></span>
          <span className={styles.labelText}>In-Stock Only</span>
        </label>
      </div>

      {/* Trust & Perk Badges */}
      <div className={styles.perkBadges}>
        <div className={styles.perkItem}>
          <span className={styles.perkIcon}>⚡</span>
          <div className={styles.perkContent}>
            <strong>Express 30-min</strong>
            <p>Giao tươi hỏa tốc tận nhà</p>
          </div>
        </div>

        <div className={styles.perkItem}>
          <span className={styles.perkIcon}>💳</span>
          <div className={styles.perkContent}>
            <strong>Dynamic VietQR</strong>
            <p>Thanh toán quét mã tức thì</p>
          </div>
        </div>

        <div className={styles.perkItem}>
          <span className={styles.perkIcon}>🛡️</span>
          <div className={styles.perkContent}>
            <strong>Freshness Guarantee</strong>
            <p>Đổi trả 100% nếu không tươi</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarFilter;
