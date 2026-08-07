import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import { products } from '../../data/products';
import { formatPrice } from '../../utils/formatters';

const SearchBar = ({ placeholder = "Search mini pancakes, waffles, shakes...", onSearch, className = '' }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      ).slice(0, 5);
      setResults(filtered);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProduct = (productId) => {
    setIsOpen(false);
    setQuery('');
    navigate(`/product/${productId}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      if (onSearch) {
        onSearch(query);
      } else {
        navigate(`/menu?search=${encodeURIComponent(query)}`);
      }
    }
  };

  return (
    <div ref={searchRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 bg-white/90 border border-amber-200 rounded-full text-sm text-[#2D2D2D] placeholder-amber-900/40 focus:outline-none focus:ring-2 focus:ring-[#FF4D6D] focus:border-transparent transition-all shadow-sm"
        />
        <FiSearch className="absolute left-3.5 text-amber-800/60 text-lg" />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 text-amber-800/60 hover:text-[#FF4D6D] transition-colors"
          >
            <FiX className="text-lg" />
          </button>
        )}
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-amber-100 overflow-hidden z-50 animate-in fade-in duration-200">
          <div className="p-2 border-b border-amber-50 text-xs font-semibold text-amber-900/60 uppercase tracking-wider">
            Suggested Desserts ({results.length})
          </div>
          <div className="divide-y divide-amber-50">
            {results.map((product) => (
              <div
                key={product.id}
                onClick={() => handleSelectProduct(product.id)}
                className="flex items-center gap-3 p-3 hover:bg-[#FFF8F0] cursor-pointer transition-colors"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-[#2D2D2D] truncate">
                    {product.name}
                  </h4>
                  <p className="text-xs text-amber-900/60">{product.category}</p>
                </div>
                <span className="text-sm font-bold text-[#FF4D6D]">
                  {formatPrice(product.price)}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className="w-full py-2.5 text-center text-xs font-semibold text-[#FF4D6D] bg-[#FF4D6D]/5 hover:bg-[#FF4D6D]/10 transition-colors"
          >
            View all results for "{query}"
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
