import React from 'react';
import { formatVND } from '../../../../utils/formatCurrency';
import styles from './AdminDashboard.module.scss';

export const DesktopAdmin = ({
  metrics,
  products,
  searchTerm,
  setSearchTerm,
  onAddProduct,
  onDeleteProduct,
  userPosition
}) => {
  return (
    <div className={styles.dashboardContainer}>
      {/* 4 Thẻ chỉ số tổng quan */}
      <section className={styles.metricsGrid}>
        {metrics.map((m, idx) => (
          <div key={idx} className={styles.metricCard}>
            <div className={styles.info}>
              <div className={styles.value} style={{ color: m.color }}>
                {m.value}
              </div>
              <div className={styles.label}>{m.label}</div>
            </div>
            <div className={styles.iconCircle}>
              <span>{m.icon}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Bảng Quản lý Sản phẩm */}
      <section className={styles.tableCard}>
        <div className={styles.cardHeader}>
          <div className={styles.titleArea}>
            <h2>📦 Quản Lý Danh Mục Sản Phẩm</h2>
            <p>Quyền hạn hiện tại: <strong>{userPosition}</strong> (Hỗ trợ nghiệp vụ Thêm, Sửa, Xóa)</p>
          </div>

          <div className={styles.actionArea}>
            <input
              type="text"
              className={styles.searchBar}
              placeholder="Tìm theo mã hoặc tên SP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <button
              type="button"
              className={styles.addBtn}
              onClick={onAddProduct}
            >
              + Thêm sản phẩm mới
            </button>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.dataTable}>
            <thead>
              <tr>
                <th>Mã SP</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Đơn giá</th>
                <th>Đơn vị</th>
                <th>Tồn kho</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '30px' }}>
                    Không tìm thấy sản phẩm nào phù hợp!
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.productId}>
                    <td><strong>{p.productId}</strong></td>
                    <td>{p.productName}</td>
                    <td>{p.categoryName}</td>
                    <td>{formatVND(p.price)}</td>
                    <td>{p.unit}</td>
                    <td><strong>{p.stock}</strong></td>
                    <td>
                      {p.status === 'ACTIVE' && (
                        <span className={`${styles.badge} ${styles.active}`}>Đang kinh doanh</span>
                      )}
                      {p.status === 'LOW_STOCK' && (
                        <span className={`${styles.badge} ${styles.lowStock}`}>Sắp hết hàng</span>
                      )}
                      {p.status === 'OUT_OF_STOCK' && (
                        <span className={`${styles.badge} ${styles.outOfStock}`}>Hết hàng</span>
                      )}
                    </td>
                    <td>
                      <div className={styles.actionBtns}>
                        <button
                          type="button"
                          className={styles.editBtn}
                          onClick={() => alert(`[Sửa SP] Đang mở giao diện chỉnh sửa cho ${p.productName}`)}
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => onDeleteProduct(p.productId, p.productName)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DesktopAdmin;
