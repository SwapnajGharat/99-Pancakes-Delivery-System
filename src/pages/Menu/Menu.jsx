import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiX, FiCheck, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';
import ProductCard from '../../components/ProductCard/ProductCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import Loader from '../../components/Loader/Loader';
import { productAPI, categoryAPI } from '../../services/apiServices';
import { products as fallbackProducts } from '../../data/products';
import { categories as fallbackCategories } from '../../data/categories';

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const filterParam = searchParams.get('filter') || 'all';
  const searchQueryParam = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchQueryParam);
  const [sortBy, setSortBy] = useState('popular');
  const [vegOnly, setVegOnly] = useState(false);

  const [productsList, setProductsList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    if (searchQueryParam !== null) setSearchQuery(searchQueryParam);
  }, [categoryParam, searchQueryParam]);

  // Fetch Categories & Products from API
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch categories
      let cats = [];
      try {
        cats = await categoryAPI.getCategories();
      } catch (catErr) {
        console.warn('API Category fetch failed, using fallback categories:', catErr.message);
        cats = fallbackCategories;
      }
      setCategoriesList(cats && cats.length > 0 ? cats : fallbackCategories);

      // Fetch products with backend params
      const apiParams = {};
      if (selectedCategory !== 'all') {
        apiParams.category = selectedCategory;
      }
      if (searchQuery.trim()) {
        apiParams.search = searchQuery.trim();
      }
      if (vegOnly) {
        apiParams.isVeg = true;
      }
      if (sortBy === 'price-low') apiParams.sort = 'price-low';
      else if (sortBy === 'price-high') apiParams.sort = 'price-high';
      else if (sortBy === 'rating') apiParams.sort = 'rating';

      let prodsRes;
      try {
        prodsRes = await productAPI.getProducts(apiParams);
        const dataArr = prodsRes?.data || prodsRes;
        if (Array.isArray(dataArr) && dataArr.length > 0) {
          setProductsList(dataArr);
        } else if (Array.isArray(dataArr) && dataArr.length === 0 && selectedCategory === 'all' && !searchQuery) {
          // If database returns 0 items for 'all', fallback to mock catalog
          setProductsList(fallbackProducts);
        } else {
          setProductsList(Array.isArray(dataArr) ? dataArr : fallbackProducts);
        }
      } catch (prodErr) {
        console.warn('API Product fetch failed, using fallback products:', prodErr.message);
        setProductsList(fallbackProducts);
      }
    } catch (err) {
      console.error('[Menu] Fetch error:', err);
      setError('Unable to load menu from server. Showing local menu catalog.');
      setProductsList(fallbackProducts);
      setCategoriesList(fallbackCategories);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, vegOnly, sortBy]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle category tab change
  const handleCategoryChange = (slug) => {
    setSelectedCategory(slug);
    const newParams = new URLSearchParams(searchParams);
    if (slug === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', slug);
    }
    setSearchParams(newParams);
  };

  // Robust client-side filtering check
  const filteredProducts = productsList.filter((p) => {
    // Category match
    if (selectedCategory !== 'all') {
      const selectedSlug = selectedCategory.toLowerCase().trim();
      
      const prodCategorySlug = (
        (typeof p.category === 'object' && p.category?.slug) ||
        p.categorySlug ||
        (typeof p.category === 'string' ? p.category : '')
      ).toLowerCase().trim();

      const catNameSlug = (
        typeof p.category === 'object'
          ? p.category?.name
          : (typeof p.category === 'string' ? p.category : '')
      ).toLowerCase().trim().replace(/\s+/g, '-');

      const isCatMatch =
        prodCategorySlug === selectedSlug ||
        p.categorySlug?.toLowerCase().trim() === selectedSlug ||
        catNameSlug === selectedSlug ||
        catNameSlug.includes(selectedSlug) ||
        selectedSlug.includes(catNameSlug);

      if (!isCatMatch) {
        return false;
      }
    }

    // Filter parameter match (e.g. bestsellers)
    if (filterParam === 'bestsellers' && !p.isBestseller && !p.featured) {
      return false;
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchCat = (typeof p.category === 'object' ? p.category?.name : p.category)?.toLowerCase().includes(q);
      const matchTag = p.tags?.some(tag => tag.toLowerCase().includes(q));
      if (!matchName && !matchCat && !matchTag) return false;
    }

    // Veg filter match
    if (vegOnly && !p.isVeg) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return (b.reviewsCount || b.reviewCount || 0) - (a.reviewsCount || a.reviewCount || 0);
  });

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setVegOnly(false);
    setSortBy('popular');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Page Header */}
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#FF4D6D]">
          Delicious Selection
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#5C3D2E] mt-1">
          Our Dessert Menu
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          Explore our wide range of mini pancakes, waffles, cakes, and beverages available for immediate delivery in Panvel.
        </p>
      </div>

      {/* Search & Main Controls Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-amber-100 shadow-sm mb-8 space-y-4">
        
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="w-full md:w-96">
            <SearchBar
              placeholder="Search desserts, waffles, Nutella..."
              onSearch={(q) => setSearchQuery(q)}
            />
          </div>

          {/* Controls: Veg Toggle & Sort Dropdown */}
          <div className="w-full md:w-auto flex flex-wrap items-center justify-between md:justify-end gap-3">
            
            {/* Veg Only Toggle */}
            <button
              onClick={() => setVegOnly(!vegOnly)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                vegOnly
                  ? 'bg-green-600 text-white border-green-600 shadow-sm'
                  : 'bg-amber-50 text-slate-700 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full border border-current flex items-center justify-center`}>
                <span className="w-1 h-1 rounded-full bg-current" />
              </span>
              <span>Pure Veg Only</span>
              {vegOnly && <FiCheck className="text-sm" />}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-xs font-bold text-[#5C3D2E] hidden sm:inline">
                Sort By:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3.5 py-2 rounded-full bg-amber-50 border border-amber-200 text-xs font-semibold text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

          </div>
        </div>

        {/* Category Pill Filter Buttons */}
        <div className="pt-3 border-t border-amber-100/60 overflow-x-auto no-scrollbar flex items-center gap-2 scroll-smooth">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#FF4D6D] text-white shadow-md shadow-[#FF4D6D]/20'
                : 'bg-amber-50 hover:bg-amber-100 text-[#5C3D2E]'
            }`}
          >
            All Desserts
          </button>

          {categoriesList.map((cat) => (
            <button
              key={cat._id || cat.id || cat.slug}
              onClick={() => handleCategoryChange(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.slug
                  ? 'bg-[#FF4D6D] text-white shadow-md shadow-[#FF4D6D]/20'
                  : 'bg-amber-50 hover:bg-amber-100 text-[#5C3D2E]'
              }`}
            >
              {cat.name} ({cat.count !== undefined ? cat.count : ''})
            </button>
          ))}
        </div>

      </div>

      {/* Error Alert Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FiAlertTriangle className="text-amber-600 text-lg shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-1 px-3 py-1 bg-white border border-amber-300 rounded-full font-bold hover:bg-amber-100 transition-colors cursor-pointer"
          >
            <FiRefreshCw /> Retry
          </button>
        </div>
      )}

      {/* Filter Status & Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs sm:text-sm font-semibold text-[#5C3D2E]">
          Showing <span className="font-extrabold text-[#FF4D6D]">{filteredProducts.length}</span> desserts
          {selectedCategory !== 'all' && ` in ${categoriesList.find(c => c.slug === selectedCategory)?.name || selectedCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </p>

        {(selectedCategory !== 'all' || searchQuery || vegOnly) && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs font-bold text-[#FF4D6D] hover:underline cursor-pointer"
          >
            <FiX /> Reset All Filters
          </button>
        )}
      </div>

      {/* Product Grid / Loader / Empty State */}
      {loading ? (
        <div className="py-16 text-center">
          <Loader text="Loading fresh dessert menu..." />
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty Filter Results State */
        <div className="bg-white rounded-3xl p-12 text-center border border-amber-100 shadow-sm max-w-lg mx-auto my-12">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-[#FF4D6D] text-3xl flex items-center justify-center mx-auto mb-4">
            🥞
          </div>
          <h3 className="text-lg font-bold text-[#5C3D2E]">No Desserts Found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            We couldn't find any items matching your filter criteria. Try searching for something else or reset your filters.
          </p>
          <button
            onClick={clearFilters}
            className="px-6 py-2.5 rounded-full bg-[#FF4D6D] text-white text-xs font-bold shadow-md hover:bg-[#E63956] transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

    </div>
  );
};

export default Menu;
