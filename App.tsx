import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FilterState, Product, ProductCategory, SortOption, BottomNavTab } from './types';
import { ALL_PRODUCTS, filterAndSortProducts } from './data/products';
import { CartProvider } from './context/CartContext';
import { DatabaseProvider, useDatabase } from './context/DatabaseContext';
import { SplashScreen } from './components/SplashScreen';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategorySection } from './components/CategorySection';
import { FeaturedSection } from './components/FeaturedSection';
import { WhyMstsRail } from './components/WhyMstsRail';
import { FilterBar } from './components/FilterBar';
import { ProductGrid } from './components/ProductGrid';
import { SearchModal } from './components/SearchModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { GetItemModal } from './components/GetItemModal';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { RailwayTrackDecoration } from './components/common/RailwayTrackDecoration';
import { BottomTaskbar } from './components/BottomTaskbar';
import { HomeProductions } from './components/HomeProductions';
import { SearchView } from './components/SearchView';
import { CartView } from './components/CartView';
import { ProfileView } from './components/ProfileView';
import { OffersModal } from './components/OffersModal';
import { PilotRegistrationModal } from './components/PilotRegistrationModal';
import { OGPaperBillModal } from './components/OGPaperBillModal';
import { RoutePriceListAdModal } from './components/RoutePriceListAdModal';
import { FirstOrderBanner } from './components/FirstOrderBanner';
import { FirstOrderModal } from './components/FirstOrderModal';
import { Compass, Train, Layers, Package, Sparkles } from 'lucide-react';

function AppContent() {
  const { products, profile } = useDatabase();
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [showRegistrationModal, setShowRegistrationModal] = useState<boolean>(false);
  const [showRoutePriceListAd, setShowRoutePriceListAd] = useState<boolean>(false);
  const [showFirstOrderModal, setShowFirstOrderModal] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeBottomTab, setActiveBottomTab] = useState<BottomNavTab>('home');
  const [showOffersModal, setShowOffersModal] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [getItemProduct, setGetItemProduct] = useState<Product | null>(null);

  // Splash complete handler - asks user for name, photo, and age if not yet onboarded,
  // and starts the 6-second timer to show full-screen Route Price List Ad as requested
  const handleSplashComplete = () => {
    setShowSplash(false);
    if (!profile.isOnboarded) {
      setShowRegistrationModal(true);
    }
    // After splash when click on enter msts, wait 6 seconds then show the ad full screen
    setTimeout(() => {
      setShowRoutePriceListAd(true);
    }, 6000);
  };

  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    priceRange: 'all',
    subType: 'all',
    searchQuery: '',
    sortBy: 'featured'
  });

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      category:
        currentView === 'routes'
          ? 'routes'
          : currentView === 'locomotives'
          ? 'locomotives'
          : currentView === 'coaches'
          ? 'coaches'
          : currentView === 'packs'
          ? 'packs'
          : 'all',
      priceRange: 'all',
      subType: 'all',
      searchQuery: '',
      sortBy: 'featured'
    });
  };

  const handleNavigate = (view: string, category?: ProductCategory) => {
    setCurrentView(view);
    if (view === 'home') {
      setActiveBottomTab('home');
    } else if (view === 'cart') {
      setActiveBottomTab('cart');
    }
    if (category) {
      setFilters((prev) => ({
        ...prev,
        category,
        subType: 'all',
        searchQuery: ''
      }));
    } else if (view === 'home') {
      setFilters((prev) => ({
        ...prev,
        category: 'all',
        subType: 'all',
        searchQuery: ''
      }));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Tab Selection from Bottom Taskbar
  const handleBottomTabSelect = (tab: BottomNavTab) => {
    if (tab === 'offers') {
      // Show popup in middle of screen as requested
      setShowOffersModal(true);
      return;
    }

    setActiveBottomTab(tab);
    if (tab === 'home') {
      setCurrentView('home');
    } else if (tab === 'search') {
      setCurrentView('search');
    } else if (tab === 'cart') {
      setCurrentView('cart');
    } else if (tab === 'profile') {
      setCurrentView('profile');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered Products for Category views
  const filteredProducts = useMemo(() => {
    return filterAndSortProducts(products, filters);
  }, [products, filters]);

  const getPageTitle = () => {
    switch (currentView) {
      case 'routes':
        return {
          title: 'MSTS Indian Railway Routes',
          count: `${products.filter((p) => p.category === 'routes').length} Routes Available`,
          icon: Compass
        };
      case 'locomotives':
        return {
          title: 'RTW Locomotive Packs',
          count: `${products.filter((p) => p.category === 'locomotives').length} Packs Available`,
          icon: Train
        };
      case 'coaches':
        return {
          title: 'VG LHB Passenger Coaches',
          count: `${products.filter((p) => p.category === 'coaches').length} Packs Available`,
          icon: Layers
        };
      case 'packs':
        return {
          title: 'MIB & BRP Special Packs',
          count: `${products.filter((p) => p.category === 'packs').length} Packs Available`,
          icon: Package
        };
      default:
        return {
          title: 'All Simulation Catalog',
          count: `${products.length} Addons Available`,
          icon: Sparkles
        };
    }
  };

  const pageInfo = getPageTitle();
  const PageIcon = pageInfo.icon;

  return (
    <div className="min-h-screen bg-[#02040a] text-slate-100 flex flex-col font-sans relative selection:bg-emerald-500 selection:text-slate-950 overflow-x-hidden">
      {/* Background Decorative Track Patterns & Glows */}
      <RailwayTrackDecoration />

      {/* Cinematic Splash Screen */}
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      </AnimatePresence>

      {/* Top Glass Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenSearch={() => setSearchOpen(true)}
      />

      {/* Main Content Areas */}
      <main className="flex-1 relative z-10 pb-20">
        
        {/* TAB 1: HOME VIEW */}
        {/* On home: Only show production names first, clicking reveals the content inside */}
        {activeBottomTab === 'home' && currentView === 'home' && (
          <div className="space-y-4">
            {/* Top Promotional Banner: First Order Free with Live Countdown */}
            <FirstOrderBanner onOpenDetails={() => setShowFirstOrderModal(true)} />

            {/* Hero Section */}
            <Hero
              onExplore={() => {
                const el = document.getElementById('productions-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenSearch={() => {
                setActiveBottomTab('search');
                setCurrentView('search');
              }}
            />

            {/* Productions Section (Shows ONLY Production names, clicking shows contents) */}
            <div id="productions-section">
              <HomeProductions
                onSelectProduct={(product) => setSelectedProduct(product)}
              />
            </div>

            {/* Why Choose MSTS Rail Section */}
            <WhyMstsRail />
          </div>
        )}

        {/* TAB 2: SEARCH VIEW */}
        {(activeBottomTab === 'search' || currentView === 'search') && (
          <SearchView
            onSelectProduct={(product) => setSelectedProduct(product)}
          />
        )}

        {/* TAB 3: CART VIEW */}
        {(activeBottomTab === 'cart' || currentView === 'cart') && (
          <CartView
            onExplore={() => {
              setActiveBottomTab('home');
              setCurrentView('home');
            }}
            onSelectProduct={(product) => setSelectedProduct(product)}
          />
        )}

        {/* TAB 4: PROFILE VIEW */}
        {(activeBottomTab === 'profile' || currentView === 'profile') && (
          <ProfileView
            onNavigateToCart={() => {
              setActiveBottomTab('cart');
              setCurrentView('cart');
            }}
            onNavigateToHome={() => {
              setActiveBottomTab('home');
              setCurrentView('home');
            }}
          />
        )}

        {/* SPECIFIC CATEGORY VIEWS (when clicked from navbar: routes, locomotives, coaches, packs) */}
        {activeBottomTab === 'home' &&
          (currentView === 'routes' ||
            currentView === 'locomotives' ||
            currentView === 'coaches' ||
            currentView === 'packs') && (
            <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              {/* Category Page Title Header */}
              <div className="rounded-3xl p-8 sm:p-10 glass-panel border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_30px_rgba(16,185,129,0.1)] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-emerald-400 font-mono">
                    <PageIcon className="w-4 h-4" />
                    <span>Category Catalog</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-display">
                    {pageInfo.title}
                  </h1>
                </div>

                <div className="px-4 py-2 rounded-2xl bg-slate-900/60 border border-white/10 text-xs font-mono text-emerald-300 self-start md:self-auto backdrop-blur-xl shadow-inner">
                  {pageInfo.count}
                </div>
              </div>

              {/* Filter and Sorting Controls */}
              <FilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                activeCount={filteredProducts.length}
              />

              {/* Product Grid */}
              <ProductGrid
                products={filteredProducts}
                onSelectProduct={(product) => setSelectedProduct(product)}
              />
            </div>
          )}

        {/* ABOUT VIEW */}
        {activeBottomTab === 'home' && currentView === 'about' && <AboutSection />}

        {/* CONTACT VIEW */}
        {activeBottomTab === 'home' && currentView === 'contact' && <ContactSection />}
      </main>

      {/* Global Modals */}

      {/* 5th Tab: Offers Middle-of-Screen Popup Modal */}
      <OffersModal
        isOpen={showOffersModal}
        onClose={() => setShowOffersModal(false)}
        onOpenPriceList={() => {
          setShowOffersModal(false);
          setShowRoutePriceListAd(true);
        }}
      />

      {/* Fast Global Search Modal (Ctrl+K) */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectProduct={(product) => setSelectedProduct(product)}
      />

      {/* Rich Product Detail View Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onSelectRelated={(product) => setSelectedProduct(product)}
        onGetItem={(product) => {
          setGetItemProduct(product);
        }}
      />

      {/* Direct Addon Access / Order Reference Modal */}
      <GetItemModal
        product={getItemProduct}
        isOpen={!!getItemProduct}
        onClose={() => setGetItemProduct(null)}
      />

      {/* Pilot Profile Setup / Registration Modal (Prompted after splash or editable) */}
      <PilotRegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
      />

      {/* Real OG Paper Bill Modal - triggered whenever product is added to cart or checkout requested */}
      <OGPaperBillModal />

      {/* First Order Free White Paper Voucher Modal */}
      <FirstOrderModal
        isOpen={showFirstOrderModal}
        onClose={() => setShowFirstOrderModal(false)}
        onStartShopping={() => {
          const el = document.getElementById('productions-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Full-screen Route Price List Ad Modal (6s after Enter MSTS, 5s close lock, click redirects to Instagram) */}
      <RoutePriceListAdModal
        isOpen={showRoutePriceListAd}
        onClose={() => setShowRoutePriceListAd(false)}
      />

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Persistent Glassmorphism Bottom Taskbar with 5 Buttons & Morph Animation */}
      <BottomTaskbar
        activeTab={activeBottomTab}
        onSelectTab={handleBottomTabSelect}
      />
    </div>
  );
}

export default function App() {
  return (
    <DatabaseProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </DatabaseProvider>
  );
}
