import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'
import { FaChevronDown } from 'react-icons/fa'

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [loginDropdown, setLoginDropdown] = useState(false)
  const hoverTimer = useRef(null)

  const { user, setUser, setShowUserLogin, navigate, setSearchQuery, searchQuery, getCartCount, axios } = useAppContext()

  const ROUTES = {
    HOME: '/',
    PRODUCTS: '/products',
    SELLER: '/seller',
    MY_ORDERS: '/my-orders'
  }

  const logout = async () => {
    try {
      const { data } = await axios.get('/api/user/logout')
      if (data.success) {
        toast.success(data.message)
        setUser(null)
        navigate(ROUTES.HOME)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (searchQuery.length > 0) navigate(ROUTES.PRODUCTS)
  }, [searchQuery])

  const handleMouseEnter = () => {
    clearTimeout(hoverTimer.current)
    setLoginDropdown(true)
  }

  const handleMouseLeave = () => {
    hoverTimer.current = setTimeout(() => setLoginDropdown(false), 80)
  }

  const toggleDropdown = () => setLoginDropdown((prev) => !prev)

  const handleUserLogin = () => {
    setLoginDropdown(false)
    setShowUserLogin(true)
  }

  const handleSellerLogin = () => {
    setLoginDropdown(false)
    navigate(ROUTES.SELLER)
  }

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all z-50">

      {/* ✅ Logo */}
      <NavLink to={ROUTES.HOME} onClick={() => setOpen(false)}>
        <img className="h-18" src={assets.logo} alt="logo" />
      </NavLink>

      {/* ✅ Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to={ROUTES.HOME}>Home</NavLink>
        <NavLink to={ROUTES.PRODUCTS}>All Product</NavLink>
        <NavLink to={ROUTES.HOME}>Contact</NavLink>

        {/* 🔍 Search Bar */}
        <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt='search' className='w-4 h-4' />
        </div>

        {/* 🛒 Cart */}
        <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
          <img src={assets.nav_cart_icon} alt='cart' className='w-6 opacity-80' />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
        </div>

        {/* ✅ Desktop Login Dropdown */}
        {!user ? (
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full"
            >
              <span>Login</span>
              <FaChevronDown
                className={`transition-transform duration-200 ${loginDropdown ? "rotate-180" : "rotate-0"}`}
                size={12}
              />
            </button>

            <div
              className={`absolute right-1/2 translate-x-1/2 top-12 bg-white shadow-lg border border-gray-200 rounded-md py-2 w-44 text-sm z-40 text-center transition-all duration-200 transform ${loginDropdown ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
            >
              {/* 🔽 Amazon-style Arrow */}
              <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-0 h-0 
                border-l-[8px] border-r-[8px] border-b-[8px]
                border-l-transparent border-r-transparent 
                border-b-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.25)]">
              </div>

              <button onClick={handleUserLogin} className="block w-full text-center px-4 py-2 hover:bg-primary/10">Login as User</button>
              <button onClick={handleSellerLogin} className="block w-full text-center px-4 py-2 hover:bg-primary/10">Login as Seller</button>
            </div>
          </div>
        ) : (
          <div className='relative group'>
            <img src={assets.profile_icon} className='w-10' alt="" />
            <ul className='hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40'>
              <li onClick={() => navigate(ROUTES.MY_ORDERS)} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>My Orders</li>
              <li onClick={logout} className='p-1.5 pl-3 hover:bg-primary/10 cursor-pointer'>Logout</li>
            </ul>
          </div>
        )}
      </div>

      {/* ✅ Mobile Icons */}
      <div className='flex items-center gap-6 sm:hidden'>
        <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
          <img src={assets.nav_cart_icon} alt='cart' className='w-6 opacity-80' />
          <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
        </div>

        {/* ✅ Hamburger → Cross */}
        <button onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <img src={assets.menu_icon} alt='menu' />
          )}
        </button>
      </div>

      {/* ✅ Mobile Menu (Dropdown thoda niche khulta hai) */}
      <div
        className={`absolute left-0 w-full bg-white shadow-md py-4 flex flex-col items-start gap-3 px-5 text-sm md:hidden z-40 transition-all duration-300 ${open ? 'translate-y-[10px] opacity-100 pointer-events-auto' : '-translate-y-5 opacity-0 pointer-events-none'}`}
        style={{ top: '70px' }}
      >
        <NavLink to={ROUTES.HOME} onClick={() => setOpen(false)}>Home</NavLink>
        <NavLink to={ROUTES.PRODUCTS} onClick={() => setOpen(false)}>All Product</NavLink>
        {user && <NavLink to={ROUTES.MY_ORDERS} onClick={() => setOpen(false)}>My Orders</NavLink>}
        <NavLink to={ROUTES.HOME} onClick={() => setOpen(false)}>Contact</NavLink>

        {/* ✅ Centered Login Dropdown (Fixed) */}
        {!user ? (
          <div className="flex flex-col items-center justify-center w-full mt-4 space-y-2 relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center justify-center gap-2 cursor-pointer px-6 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full text-sm text-center w-[70%]"
            >
              <span>Login</span>
              <FaChevronDown
                className={`transition-transform duration-200 ${loginDropdown ? "rotate-180" : "rotate-0"}`}
                size={12}
              />
            </button>

            {loginDropdown && (
              <div className="relative w-full flex flex-col items-center mt-2">
                <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-0 h-0 
                  border-l-[8px] border-r-[8px] border-b-[8px]
                  border-l-transparent border-r-transparent 
                  border-b-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.25)]">
                </div>

                <div className="bg-white border border-gray-200 rounded-md shadow-md py-2 w-[70%] text-center">
                  <button onClick={handleUserLogin} className="block w-full px-4 py-2 hover:bg-primary/10">
                    Login as User
                  </button>
                  <button onClick={handleSellerLogin} className="block w-full px-4 py-2 hover:bg-primary/10">
                    Login as Seller
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center w-full mt-3">
            <button
              onClick={() => {
                logout()
                setOpen(false)
              }}
              className="cursor-pointer px-6 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full w-[70%] text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
