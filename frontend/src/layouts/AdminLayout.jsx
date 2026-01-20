import Header from '../components/Header';
import Footer from '../components/Footer';
// Image source: frontend/src/assets/images/admin-banner.png
// Replace this file to change admin banner without touching code
import adminBanner from "../assets/images/admin-banner.png";


const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-dark text-white flex flex-col">
      {/* Global Header */}
      <Header />

      {/* Admin Banner */}
      <div className="relative">
        <img
          src={adminBanner}
          alt="Admin Dashboard Banner"
          className="w-full h-32 md:h-40 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Admin Dashboard</h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {children}
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default AdminLayout;