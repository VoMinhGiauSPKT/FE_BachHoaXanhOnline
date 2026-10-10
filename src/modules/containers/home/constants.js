/**
 * Mock data danh mục và danh sách sản phẩm chuẩn FreshMart / Bách Hóa Xanh Online
 * Đơn vị tính (unit) đồng bộ 100% với PostgreSQL enum_donvitinh:
 * 'LON', 'CHAI', 'LOC4', 'LOC6', 'THUNG24', 'THUNG30', 'THUNG48', 'GOI', 'CAI', 'BAO', 'KG'
 */

export const MOCK_CATEGORIES = [
  { categoryId: 'DM01', categoryName: 'Rau củ & Trái cây' },
  { categoryId: 'DM02', categoryName: 'Thịt, Cá & Trứng' },
  { categoryId: 'DM03', categoryName: 'Sữa & Đồ uống' },
  { categoryId: 'DM04', categoryName: 'Gạo & Nhu yếu phẩm' },
  { categoryId: 'DM05', categoryName: 'Bánh kẹo & Đồ ăn vặt' }
];

export const MOCK_PRODUCTS = [
  {
    productId: 'SP000001',
    productName: 'Seedless Red Table Grapes (Nho Đỏ Không Hạt)',
    category: { categoryId: 'DM01', categoryName: 'Rau củ & Trái cây' },
    price: 89000,
    unit: 'KG',
    stock: 95,
    discountPercent: 20,
    ratingAverage: 5.0,
    totalReviews: 24,
    isBestSeller: true,
    specs: 'Calories: 69 kcal/100g • Giàu chất chống oxy hóa Lycopene',
    imageUrl: 'https://images.unsplash.com/photo-1596363505729-4190a9506133?auto=format&fit=crop&w=600&q=80',
    icon: '🍇'
  },
  {
    productId: 'SP000002',
    productName: 'Sữa tươi thanh trùng True Milk Organic 1L',
    category: { categoryId: 'DM03', categoryName: 'Sữa & Đồ uống' },
    price: 42000,
    unit: 'LON',
    stock: 140,
    discountPercent: 10,
    ratingAverage: 4.9,
    totalReviews: 56,
    isBestSeller: true,
    specs: '100% Sữa tươi sạch hữu cơ • Giàu Canxi tự nhiên',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=600&q=80',
    icon: '🥛'
  },
  {
    productId: 'SP000003',
    productName: 'Thịt Thăn Bò Úc Prime Ribeye Steak (Khay 300g)',
    category: { categoryId: 'DM02', categoryName: 'Thịt, Cá & Trứng' },
    price: 165000,
    unit: 'KG',
    stock: 45,
    discountPercent: 15,
    ratingAverage: 5.0,
    totalReviews: 18,
    isBestSeller: true,
    specs: 'Bò ăn cỏ tự nhiên • Cắt dày chuẩn Steak thượng hạng',
    imageUrl: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=600&q=80',
    icon: '🥩'
  },
  {
    productId: 'SP000004',
    productName: 'Bơ Sáp 034 Đắk Lắk Chuẩn VietGAP',
    category: { categoryId: 'DM01', categoryName: 'Rau củ & Trái cây' },
    price: 55000,
    unit: 'KG',
    stock: 70,
    discountPercent: 0,
    ratingAverage: 4.8,
    totalReviews: 12,
    isBestSeller: false,
    specs: 'Cơm vàng dẻo quánh • Trái dài hạt bé',
    imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=600&q=80',
    icon: '🥑'
  },
  {
    productId: 'SP000005',
    productName: 'Cá Hồi Na Uy Tươi Fillet Cao Cấp (Khay 250g)',
    category: { categoryId: 'DM02', categoryName: 'Thịt, Cá & Trứng' },
    price: 189000,
    unit: 'KG',
    stock: 30,
    discountPercent: 12,
    ratingAverage: 4.9,
    totalReviews: 33,
    isBestSeller: true,
    specs: 'Giàu Omega-3 • Ăn sống Sashimi hoặc áp chảo',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    icon: '🐟'
  },
  {
    productId: 'SP000006',
    productName: 'Rau Xà Lách Thủy Canh Mỡ Đà Lạt (Túi 500g)',
    category: { categoryId: 'DM01', categoryName: 'Rau củ & Trái cây' },
    price: 26000,
    unit: 'GOI',
    stock: 120,
    discountPercent: 0,
    ratingAverage: 4.7,
    totalReviews: 9,
    isBestSeller: false,
    specs: 'Trồng thủy canh nhà kính khép kín • Không dư lượng thuốc',
    imageUrl: 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?auto=format&fit=crop&w=600&q=80',
    icon: '🥬'
  },
  {
    productId: 'SP000007',
    productName: 'Trứng gà ta thảo mộc tự nhiên Hộp 10 quả',
    category: { categoryId: 'DM02', categoryName: 'Thịt, Cá & Trứng' },
    price: 38000,
    unit: 'CAI',
    stock: 80,
    discountPercent: 5,
    ratingAverage: 4.9,
    totalReviews: 29,
    isBestSeller: false,
    specs: 'Lòng đỏ vàng óng • Thức ăn thảo mộc tự nhiên',
    imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80',
    icon: '🥚'
  },
  {
    productId: 'SP000008',
    productName: 'Táo Envy New Zealand Size Lớn Giòn Ngọt (1kg)',
    category: { categoryId: 'DM01', categoryName: 'Rau củ & Trái cây' },
    price: 125000,
    unit: 'KG',
    stock: 65,
    discountPercent: 25,
    ratingAverage: 5.0,
    totalReviews: 45,
    isBestSeller: true,
    specs: 'Nhập khẩu trực tiếp • Giòn tan mọng nước',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80',
    icon: '🍎'
  }
];

export default MOCK_PRODUCTS;
