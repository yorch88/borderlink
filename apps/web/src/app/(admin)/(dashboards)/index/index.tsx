import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageBreadcrumb from '@/components/PageBreadcrumb';
import PageMeta from '@/components/PageMeta';
import Audience from './components/Audience';
import CustomerService from './components/CustomerService';
import OrderStatistics from './components/OrderStatistics';
import ProductOrderDetails from './components/ProductOrderDetails';
import ProductOrders from './components/ProductOrders';
import SalesRevenueOverview from './components/SalesRevenueOverview';
import SalesThisMonth from './components/SalesThisMonth';
import TopSellingProducts from './components/TopSellingProducts';
import TrafficResources from './components/TrafficResources';
import WelcomeUser from './components/WelcomeUser';
import { validateSession, logoutSession } from '@/sessions/api';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        await validateSession();
      } catch {
        await logoutSession();
        navigate('/basic-login');
      }
    };

    checkSession();
  }, [navigate]);

  return (
    <>
      <PageMeta title="Ecommerce" />

      <main>

        {/* 🔴 BOTÓN LOGOUT */}
        <div className="flex justify-end mb-4">
          <button
            onClick={async () => {
              await logoutSession();
              navigate('/basic-login');
            }}
            className="btn bg-red-500 text-white"
          >
            Logout
          </button>
        </div>

        <PageBreadcrumb title="Ecommerce" subtitle="Dashboards" />

        <div className="grid lg:grid-cols-3 grid-cols-1 gap-5 mb-5">
          <div className="lg:col-span-2 col-span-1">
            <WelcomeUser />
            <ProductOrderDetails />
          </div>
          <OrderStatistics />
        </div>

        <div className="grid lg:grid-cols-3 grid-cols-1 gap-5 mb-5">
          <SalesRevenueOverview />
          <TrafficResources />
        </div>

        <ProductOrders />

        <div className="grid lg:grid-cols-4 grid-cols-1 gap-5">
          <CustomerService />
          <SalesThisMonth />
          <TopSellingProducts />
          <Audience />
        </div>

      </main>
    </>
  );
};

export default Index;
