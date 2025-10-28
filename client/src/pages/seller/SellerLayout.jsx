import { Link, NavLink, Outlet } from "react-router-dom";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

const SellerLayout = () => {
  const { axios, navigate } = useAppContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarLinks = [
    { name: "Add Product", path: "/seller", icon: assets.add_icon },
    { name: "Product List", path: "/seller/product-list", icon: assets.product_list_icon },
    { name: "Orders", path: "/seller/orders", icon: assets.order_icon },
  ];

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/seller/logout");
      if (data.success) {
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 relative overflow-hidden">
      {/* ✅ Top Navbar */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow-sm relative z-40">
        <Link to="/">
          <img src={assets.logo} alt="logo" className="h-15 w-auto cursor-pointer" />
        </Link>

        <div className="flex items-center gap-4 text-gray-600">
          <p className="hidden sm:block font-medium">Hi, Admin 👋</p>
          <button
            onClick={logout}
            className="border border-primary text-primary px-4 py-1.5 rounded-full text-sm hover:bg-primary hover:text-white transition"
          >
            Logout
          </button>

          {/* ☰ Hamburger Icon on Right Side */}
          <button
            className="md:hidden text-gray-700 ml-2"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </header>

      {/* ✅ Main Layout */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* ✅ Sidebar */}
        <aside
          className={`fixed md:static inset-y-0 left-0 bg-white border-r border-gray-200 shadow-md md:shadow-none transform md:translate-x-0 transition-transform duration-300 ease-in-out z-40
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex flex-col h-full w-56 md:w-64 py-6">
            <nav className="flex-1 space-y-2">
              {sidebarLinks.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === "/seller"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-5 py-3 text-gray-700 font-medium transition-all ${
                      isActive
                        ? "bg-primary/10 text-primary border-r-4 border-primary"
                        : "hover:bg-gray-100"
                    }`
                  }
                  onClick={() => setSidebarOpen(false)}
                >
                  <img src={item.icon} alt="" className="w-6 h-6 opacity-80" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </nav>

            <div className="mt-auto px-5 text-xs text-gray-400 border-t border-gray-100 pt-3">
              © {new Date().getFullYear()} Synergy Admin
            </div>
          </div>
        </aside>

        {/* ✅ Background Click Closes Sidebar (no black overlay) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 md:hidden z-30"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* ✅ Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6 relative z-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;
