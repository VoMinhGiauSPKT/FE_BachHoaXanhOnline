import React, { useState, useEffect, useCallback } from 'react';
import useDeviceDetect from '../../../hooks/useDeviceDetect';
import DefaultLayout from '../../layout/common/DefaultLayout';
import DefaultMobileLayout from '../../layout/common/DefaultMobileLayout';
import DesktopHome from '../../layout/desktop/home';
import MobileHome from '../../layout/mobile/home';
import productService from '../../../services/productService';
import categoryService from '../../../services/categoryService';
import useCartStore from '../../../stores/useCartStore';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from './constants';

export const HomeContainer = () => {
  const { isMobile } = useDeviceDetect();
  const { addToCart } = useCartStore();

  const [categories, setCategories] = useState(MOCK_CATEGORIES);
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [isLoading, setIsLoading] = useState(false);

  // Filter & Search & Pagination states
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: null, max: null });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(MOCK_PRODUCTS.length);

  // 1. Fetch Categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await categoryService.getCategories();
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setCategories(res.data);
        }
      } catch (err) {
        // Fallback to MOCK_CATEGORIES
        setCategories(MOCK_CATEGORIES);
      }
    };
    fetchCats();
  }, []);

  // 2. Fetch Products
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        keyword: keyword || undefined,
        categoryId: selectedCategoryId || undefined,
        // Backend ProductService chỉ chấp nhận: 'price_asc', 'price_desc', 'newest'
        sortBy: ['price_asc', 'price_desc', 'newest'].includes(sortBy) ? sortBy : undefined,
        inStock: inStockOnly ? true : undefined
      };

      const res = await productService.getProducts(params);
      if (res.data && res.data.products) {
        let prods = res.data.products;

        // Lọc giá nếu có yêu cầu
        if (priceRange.min !== null) {
          prods = prods.filter((p) => p.price >= priceRange.min);
        }
        if (priceRange.max !== null) {
          prods = prods.filter((p) => p.price <= priceRange.max);
        }

        setProducts(prods);
        setTotalItems(res.data.total || prods.length);
        setTotalPages(Math.ceil((res.data.total || prods.length) / 12) || 1);
        setIsLoading(false);
        return;
      }
      throw new Error('Fallback to mock');
    } catch {
      // Client-side filtering on mock data for offline/test reliability
      let filtered = [...MOCK_PRODUCTS];

      if (selectedCategoryId) {
        filtered = filtered.filter(
          (p) => p.category?.categoryId === selectedCategoryId || p.categoryId === selectedCategoryId
        );
      }

      if (keyword.trim()) {
        const term = keyword.toLowerCase();
        filtered = filtered.filter((p) =>
          (p.productName || p.name).toLowerCase().includes(term)
        );
      }

      if (priceRange.min !== null) {
        filtered = filtered.filter((p) => p.price >= priceRange.min);
      }
      if (priceRange.max !== null) {
        filtered = filtered.filter((p) => p.price <= priceRange.max);
      }

      if (inStockOnly) {
        filtered = filtered.filter((p) => (p.stock || 0) > 0);
      }

      // Sắp xếp
      if (sortBy === 'price_asc') {
        filtered.sort((a, b) => a.price - b.price);
      } else if (sortBy === 'price_desc') {
        filtered.sort((a, b) => b.price - a.price);
      } else if (sortBy === 'rating') {
        filtered.sort((a, b) => (b.ratingAverage || 5) - (a.ratingAverage || 5));
      } else if (sortBy === 'newest') {
        filtered.reverse();
      }

      setProducts(filtered);
      setTotalItems(filtered.length);
      setTotalPages(Math.ceil(filtered.length / 12) || 1);
      setIsLoading(false);
    }
  }, [currentPage, keyword, selectedCategoryId, sortBy, inStockOnly, priceRange]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Handlers
  const handleCategoryChange = (catId) => {
    setSelectedCategoryId(catId);
    setCurrentPage(1);
  };

  const handlePriceFilterApply = ({ min, max }) => {
    setPriceRange({ min, max });
    setCurrentPage(1);
  };

  const handleInStockChange = (checked) => {
    setInStockOnly(checked);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedCategoryId(null);
    setPriceRange({ min: null, max: null });
    setInStockOnly(false);
    setKeyword('');
    setSortBy('default');
    setCurrentPage(1);
  };

  const handleSearchChange = (val) => {
    setKeyword(val);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  const handleAddToCart = async (product) => {
    await addToCart(product, 1);
  };

  const catalogProps = {
    products,
    categories,
    selectedCategoryId,
    onCategoryChange: handleCategoryChange,
    onPriceFilterApply: handlePriceFilterApply,
    inStockOnly,
    onInStockChange: handleInStockChange,
    onResetFilters: handleResetFilters,
    sortBy,
    onSortChange: handleSortChange,
    currentPage,
    totalPages,
    totalItems,
    onPageChange: handlePageChange,
    isLoading,
    onAddToCart: handleAddToCart
  };

  if (isMobile) {
    return (
      <DefaultMobileLayout>
        <MobileHome {...catalogProps} />
      </DefaultMobileLayout>
    );
  }

  return (
    <DefaultLayout onSearchChange={handleSearchChange} searchValue={keyword}>
      <DesktopHome {...catalogProps} />
    </DefaultLayout>
  );
};

export default HomeContainer;
