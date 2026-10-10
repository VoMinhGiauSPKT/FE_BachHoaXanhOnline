import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../layout/common/DefaultLayout';
import authService from '../../../services/authService';
import addressService from '../../../services/addressService';
import reviewService from '../../../services/reviewService';
import useAuthStore from '../../../stores/useAuthStore';
import useToastStore from '../../../stores/useToastStore';
import { formatDate } from '../../../utils/formatDate';
import styles from './Profile.module.scss';

export const ProfileContainer = () => {
  const { user, logout } = useAuthStore();
  const { addToast } = useToastStore();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'addresses' | 'reviews'
  const [profileData, setProfileData] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Đổi mật khẩu
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Địa chỉ
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [addressErrors, setAddressErrors] = useState({});
  const [addressForm, setAddressForm] = useState({
    receiverName: '',
    phoneNumber: '',
    street: '',
    ward: '',
    city: 'TP. Hồ Chí Minh',
    isDefault: false
  });

  // Đánh giá của tôi
  const [myReviews, setMyReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);

  // Tải profile
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const res = await authService.getProfile();
        if (res.data) {
          setProfileData(res.data);
          if (res.data.addresses) {
            setAddresses(
              res.data.addresses.map((a) => ({
                ...a,
                isDefault: Boolean(a.isDefault ?? a.default ?? a.laMacDinh)
              }))
            );
          }
        }
      } catch {
        setProfileData(user || {
          username: 'hoangnam',
          fullName: 'Nguyễn Hoàng Nam',
          email: 'hoangnam@example.com',
          phoneNumber: '0912345678',
          birthDate: '2000-05-15',
          userType: 'CUSTOMER'
        });
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [user]);

  // Tải sổ địa chỉ khi chuyển tab
  const loadAddresses = async () => {
    try {
      const res = await addressService.getAddresses();
      if (res.data && Array.isArray(res.data)) {
        setAddresses(
          res.data.map((a) => ({
            ...a,
            isDefault: Boolean(a.isDefault ?? a.default ?? a.laMacDinh)
          }))
        );
      }
    } catch {
      // Keep existing addresses
    }
  };

  // Tải đánh giá của tôi khi chuyển tab
  const loadMyReviews = async () => {
    setIsLoadingReviews(true);
    try {
      const res = await reviewService.getMyReviews();
      if (res.data?.reviews) {
        setMyReviews(res.data.reviews);
      }
    } catch {
      setMyReviews([
        {
          reviewId: 1,
          rating: 5,
          comment: 'Sữa tươi rất thơm ngon, date dài, nhân viên giao hàng nhanh và lịch sự.',
          createdAt: '2026-10-09 14:00:00',
          product: {
            productId: 'SP000001',
            productName: 'Seedless Red Table Grapes',
            unit: 'kg'
          }
        }
      ]);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'addresses') loadAddresses();
    if (activeTab === 'reviews') loadMyReviews();
  }, [activeTab]);

  // Validate form đổi mật khẩu
  const validatePasswordForm = () => {
    const errors = {};
    if (!passwordForm.currentPassword.trim()) {
      errors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    }
    if (!passwordForm.newPassword) {
      errors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = 'Mật khẩu mới phải có tối thiểu 6 ký tự';
    }
    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận mật khẩu mới';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Xử lý đổi mật khẩu
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!validatePasswordForm()) {
      addToast({ type: 'warning', message: 'Vui lòng kiểm tra lại thông tin mật khẩu!' });
      return;
    }

    setIsChangingPassword(true);
    try {
      await authService.changePassword(passwordForm);
      addToast({
        type: 'success',
        message: 'Đổi mật khẩu thành công! Vui lòng đăng nhập lại.'
      });
      logout();
    } catch (err) {
      addToast({
        type: 'error',
        message: err.message || 'Mật khẩu hiện tại không đúng!'
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  // Validate form địa chỉ
  const validateAddressForm = () => {
    const errors = {};
    if (!addressForm.receiverName.trim()) {
      errors.receiverName = 'Vui lòng nhập họ và tên người nhận';
    }
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!addressForm.phoneNumber.trim()) {
      errors.phoneNumber = 'Vui lòng nhập số điện thoại nhận hàng';
    } else if (!phoneRegex.test(addressForm.phoneNumber.trim())) {
      errors.phoneNumber = 'Số điện thoại không hợp lệ (10 chữ số, VD: 0912345678)';
    }
    if (!addressForm.street.trim()) {
      errors.street = 'Vui lòng nhập số nhà, tên đường';
    }
    if (!addressForm.ward.trim()) {
      errors.ward = 'Vui lòng nhập Phường / Xã';
    }
    if (!addressForm.city.trim()) {
      errors.city = 'Vui lòng nhập Tỉnh / Thành phố';
    }
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Xử lý thêm/sửa địa chỉ
  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!validateAddressForm()) {
      addToast({ type: 'warning', message: 'Vui lòng kiểm tra lại thông tin địa chỉ!' });
      return;
    }

    try {
      if (editingAddressId) {
        await addressService.updateAddress(editingAddressId, addressForm);
        addToast({ type: 'success', message: 'Cập nhật địa chỉ thành công!' });
      } else {
        await addressService.createAddress(addressForm);
        addToast({ type: 'success', message: 'Thêm địa chỉ giao hàng thành công!' });
      }
      setShowAddressModal(false);
      setEditingAddressId(null);
      setAddressErrors({});
      await loadAddresses();
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Thao tác không thành công!' });
    }
  };

  // Đặt làm địa chỉ mặc định (Optimistic update + Server sync)
  const handleSetDefaultAddress = async (id) => {
    // Cập nhật ngay trên giao diện để người dùng thấy phản hồi tức thì
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.addressId === id
      }))
    );

    try {
      await addressService.setDefaultAddress(id);
      addToast({ type: 'success', message: 'Đã đặt làm địa chỉ mặc định!' });
      await loadAddresses();
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Không thể đặt mặc định!' });
      await loadAddresses();
    }
  };

  // Xóa địa chỉ thông qua Popup Modal
  const handleConfirmDeleteAddress = async () => {
    if (!addressToDelete) return;
    try {
      await addressService.deleteAddress(addressToDelete.addressId);
      addToast({ type: 'info', message: 'Đã xóa địa chỉ thành công!' });
      setAddressToDelete(null);
      await loadAddresses();
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Thất bại!' });
    }
  };

  // Xóa review
  const handleDeleteReview = async (id) => {
    try {
      await reviewService.deleteReview(id);
      addToast({ type: 'info', message: 'Đã xóa bài đánh giá!' });
      setMyReviews((prev) => prev.filter((r) => r.reviewId !== id));
    } catch (err) {
      addToast({ type: 'error', message: err.message || 'Không thể xóa!' });
    }
  };

  return (
    <DefaultLayout>
      <div className={styles.profilePage}>
        {/* Page Title */}
        <div className={styles.pageHeader}>
          <h1>👤 Trung Tâm Tài Khoản</h1>
          <p>Quản lý thông tin cá nhân, sổ địa chỉ nhận hàng và lịch sử nhận xét</p>
        </div>

        {/* Navigation Tabs */}
        <div className={styles.tabsBar}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'profile' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Thông Tin Cá Nhân
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'addresses' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('addresses')}
          >
            Sổ Địa Chỉ Giao Hàng ({addresses.length})
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'reviews' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Đánh Giá Của Tôi ({myReviews.length})
          </button>
        </div>

        {/* Tab 1: Profile & Đổi mật khẩu */}
        {activeTab === 'profile' && (
          <div className={styles.profileGrid}>
            <div className={styles.card}>
              <h3>📋 Hồ Sơ Cá Nhân</h3>
              <div className={styles.infoList}>
                <div className={styles.infoRow}>
                  <span>Tên đăng nhập:</span>
                  <strong>{profileData?.username}</strong>
                </div>
                <div className={styles.infoRow}>
                  <span>Họ và tên:</span>
                  <strong>{profileData?.fullName}</strong>
                </div>
                <div className={styles.infoRow}>
                  <span>Email:</span>
                  <span>{profileData?.email || 'Chưa cập nhật'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span>Số điện thoại:</span>
                  <span>{profileData?.phoneNumber}</span>
                </div>
                {profileData?.birthDate && (
                  <div className={styles.infoRow}>
                    <span>Ngày sinh:</span>
                    <span>{formatDate(profileData?.birthDate)}</span>
                  </div>
                )}
                <div className={styles.infoRow}>
                  <span>Loại tài khoản:</span>
                  <span className={styles.roleBadge}>{profileData?.userType || 'CUSTOMER'}</span>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h3>🔒 Đổi Mật Khẩu</h3>
              <form onSubmit={handleChangePassword} className={styles.passwordForm} noValidate>
                <div className={styles.inputGroup}>
                  <label>Mật khẩu hiện tại *</label>
                  {passwordErrors.currentPassword && (
                    <div className={styles.inputErrorMessage}>⚠️ {passwordErrors.currentPassword}</div>
                  )}
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu hiện tại"
                    className={passwordErrors.currentPassword ? styles.inputInvalid : ''}
                    value={passwordForm.currentPassword}
                    onChange={(e) => {
                      setPasswordForm({ ...passwordForm, currentPassword: e.target.value });
                      if (passwordErrors.currentPassword) {
                        setPasswordErrors((prev) => ({ ...prev, currentPassword: null }));
                      }
                    }}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Mật khẩu mới * (tối thiểu 6 ký tự)</label>
                  {passwordErrors.newPassword && (
                    <div className={styles.inputErrorMessage}>⚠️ {passwordErrors.newPassword}</div>
                  )}
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    className={passwordErrors.newPassword ? styles.inputInvalid : ''}
                    value={passwordForm.newPassword}
                    onChange={(e) => {
                      setPasswordForm({ ...passwordForm, newPassword: e.target.value });
                      if (passwordErrors.newPassword) {
                        setPasswordErrors((prev) => ({ ...prev, newPassword: null }));
                      }
                    }}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Xác nhận mật khẩu mới *</label>
                  {passwordErrors.confirmPassword && (
                    <div className={styles.inputErrorMessage}>⚠️ {passwordErrors.confirmPassword}</div>
                  )}
                  <input
                    type="password"
                    placeholder="Nhập lại mật khẩu mới"
                    className={passwordErrors.confirmPassword ? styles.inputInvalid : ''}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => {
                      setPasswordForm({ ...passwordForm, confirmPassword: e.target.value });
                      if (passwordErrors.confirmPassword) {
                        setPasswordErrors((prev) => ({ ...prev, confirmPassword: null }));
                      }
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className={styles.changePassBtn}
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 2: Sổ địa chỉ */}
        {activeTab === 'addresses' && (
          <div className={styles.addressSection}>
            <div className={styles.sectionTop}>
              <h3>Danh Sách Địa Chỉ Nhận Hàng</h3>
              <button
                type="button"
                className={styles.addAddressBtn}
                onClick={() => {
                  setEditingAddressId(null);
                  setAddressErrors({});
                  setAddressForm({
                    receiverName: profileData?.fullName || '',
                    phoneNumber: profileData?.phoneNumber || '',
                    street: '',
                    ward: '',
                    city: 'TP. Hồ Chí Minh',
                    isDefault: addresses.length === 0
                  });
                  setShowAddressModal(true);
                }}
              >
                + Thêm Địa Chỉ Mới
              </button>
            </div>

            <div className={styles.addressGrid}>
              {addresses.map((addr) => {
                const isDef = Boolean(addr.isDefault);
                return (
                  <div key={addr.addressId} className={styles.addressCard}>
                    <div className={styles.addrCardHeader}>
                      <strong>{addr.receiverName}</strong>
                      {isDef && <span className={styles.defaultBadge}>Mặc định</span>}
                    </div>
                    <p className={styles.addrPhone}>📞 {addr.phoneNumber}</p>
                    <p className={styles.addrStreet}>
                      🏠 {addr.street}, {addr.ward}, {addr.city}
                    </p>

                    <div className={styles.addrActions}>
                      {!isDef && (
                        <button
                          type="button"
                          className={styles.btnSecondary}
                          onClick={() => handleSetDefaultAddress(addr.addressId)}
                        >
                          Đặt làm mặc định
                        </button>
                      )}
                      <button
                        type="button"
                        className={styles.btnSecondary}
                        onClick={() => {
                          setEditingAddressId(addr.addressId);
                          setAddressErrors({});
                          setAddressForm({
                            receiverName: addr.receiverName,
                            phoneNumber: addr.phoneNumber,
                            street: addr.street,
                            ward: addr.ward,
                            city: addr.city,
                            isDefault: isDef
                          });
                          setShowAddressModal(true);
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        type="button"
                        className={styles.btnDelete}
                        onClick={() => setAddressToDelete(addr)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Đánh giá của tôi */}
        {activeTab === 'reviews' && (
          <div className={styles.reviewsTabSection}>
            <h3>Lịch Sử Đánh Giá Sản Phẩm Của Bạn</h3>
            {isLoadingReviews ? (
              <p>Đang tải...</p>
            ) : myReviews.length === 0 ? (
              <p className={styles.emptyText}>Bạn chưa đánh giá sản phẩm nào.</p>
            ) : (
              <div className={styles.myReviewsList}>
                {myReviews.map((rev) => (
                  <div key={rev.reviewId} className={styles.myReviewCard}>
                    <div className={styles.myRevTop}>
                      <strong>{rev.product?.productName || 'Sản phẩm FreshMart'}</strong>
                      <span className={styles.stars}>{'★'.repeat(rev.rating)}</span>
                    </div>
                    <p className={styles.myRevComment}>"{rev.comment}"</p>
                    <div className={styles.myRevBottom}>
                      <span className={styles.myRevTime}>{formatDate(rev.createdAt, true)}</span>
                      <button
                        type="button"
                        className={styles.deleteRevBtn}
                        onClick={() => handleDeleteReview(rev.reviewId)}
                      >
                        🗑️ Xóa đánh giá
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal Thêm/Sửa Địa Chỉ */}
        {showAddressModal && (
          <div className={styles.modalOverlay} onClick={() => setShowAddressModal(false)}>
            <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>{editingAddressId ? 'Sửa Địa Chỉ' : 'Thêm Địa Chỉ Giao Hàng'}</h3>
                <button type="button" onClick={() => setShowAddressModal(false)}>✕</button>
              </div>

              <form onSubmit={handleSaveAddress} className={styles.modalBody} noValidate>
                <div className={styles.inputGroup}>
                  <label>Tên người nhận *</label>
                  {addressErrors.receiverName && (
                    <div className={styles.inputErrorMessage}>⚠️ {addressErrors.receiverName}</div>
                  )}
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    className={addressErrors.receiverName ? styles.inputInvalid : ''}
                    value={addressForm.receiverName}
                    onChange={(e) => {
                      setAddressForm({ ...addressForm, receiverName: e.target.value });
                      if (addressErrors.receiverName) {
                        setAddressErrors((prev) => ({ ...prev, receiverName: null }));
                      }
                    }}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Số điện thoại *</label>
                  {addressErrors.phoneNumber && (
                    <div className={styles.inputErrorMessage}>⚠️ {addressErrors.phoneNumber}</div>
                  )}
                  <input
                    type="tel"
                    placeholder="VD: 0912345678"
                    className={addressErrors.phoneNumber ? styles.inputInvalid : ''}
                    value={addressForm.phoneNumber}
                    onChange={(e) => {
                      setAddressForm({ ...addressForm, phoneNumber: e.target.value });
                      if (addressErrors.phoneNumber) {
                        setAddressErrors((prev) => ({ ...prev, phoneNumber: null }));
                      }
                    }}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Số nhà, tên đường *</label>
                  {addressErrors.street && (
                    <div className={styles.inputErrorMessage}>⚠️ {addressErrors.street}</div>
                  )}
                  <input
                    type="text"
                    placeholder="VD: 123 Võ Văn Ngân"
                    className={addressErrors.street ? styles.inputInvalid : ''}
                    value={addressForm.street}
                    onChange={(e) => {
                      setAddressForm({ ...addressForm, street: e.target.value });
                      if (addressErrors.street) {
                        setAddressErrors((prev) => ({ ...prev, street: null }));
                      }
                    }}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.inputGroup}>
                    <label>Phường / Xã *</label>
                    {addressErrors.ward && (
                      <div className={styles.inputErrorMessage}>⚠️ {addressErrors.ward}</div>
                    )}
                    <input
                      type="text"
                      placeholder="VD: Linh Chiểu"
                      className={addressErrors.ward ? styles.inputInvalid : ''}
                      value={addressForm.ward}
                      onChange={(e) => {
                        setAddressForm({ ...addressForm, ward: e.target.value });
                        if (addressErrors.ward) {
                          setAddressErrors((prev) => ({ ...prev, ward: null }));
                        }
                      }}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Tỉnh / Thành phố *</label>
                    {addressErrors.city && (
                      <div className={styles.inputErrorMessage}>⚠️ {addressErrors.city}</div>
                    )}
                    <input
                      type="text"
                      placeholder="VD: TP. Hồ Chí Minh"
                      className={addressErrors.city ? styles.inputInvalid : ''}
                      value={addressForm.city}
                      onChange={(e) => {
                        setAddressForm({ ...addressForm, city: e.target.value });
                        if (addressErrors.city) {
                          setAddressErrors((prev) => ({ ...prev, city: null }));
                        }
                      }}
                    />
                  </div>
                </div>

                <button type="submit" className={styles.saveAddrBtn}>
                  Lưu Địa Chỉ
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Popup Modal Xác Nhận Xóa Địa Chỉ (Thay thế window.confirm) */}
        {addressToDelete && (
          <div className={styles.modalOverlay} onClick={() => setAddressToDelete(null)}>
            <div className={styles.confirmCard} onClick={(e) => e.stopPropagation()}>
              <h3>🗑️ Xác Nhận Xóa Địa Chỉ</h3>
              <p>
                Bạn có chắc chắn muốn xóa địa chỉ của <strong>{addressToDelete.receiverName}</strong> (
                {addressToDelete.street}, {addressToDelete.ward}, {addressToDelete.city}) không?
              </p>
              <div className={styles.confirmActions}>
                <button
                  type="button"
                  className={styles.cancelBtn}
                  onClick={() => setAddressToDelete(null)}
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  className={styles.confirmDeleteBtn}
                  onClick={handleConfirmDeleteAddress}
                >
                  Xác nhận xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default ProfileContainer;
