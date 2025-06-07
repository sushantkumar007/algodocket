import React, { useEffect } from "react";
import { User, Code, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, NavLink, useNavigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import Logo from "/src/assets/Logo.png"

const Navbar = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate()
  
  const navItems = [
    {
      name: "Home",
      path: "/",
      active: true,
    },
    {
      name: "Problems",
      path: "/problems",
      active: true,
    },
    {
      name: "Tests",
      path: "/tests",
      active: false,
    },
    {},
  ];

  return (
    <nav className="w-full fixed bg-[#060A14] z-50">
      <div className="flex w-full justify-between mx-auto py-4 px-14">
        {/* Navbar - left */}
        {/* Logo Section */}
        <Link to="/" className="w-1/4 flex items-center gap-3 cursor-pointer">
          <img
            src={Logo}
            className="h-10 w-10 bg-primary/20 text-primary border-none rounded-full"
          />
          <span className="text-lg md:text-2xl font-bold tracking-tight text-white hidden md:block">
            Algodocket
          </span>
        </Link>

        {/* Navbar - right */}
        <div className="w-3/4 flex justify-between">
          <ul className="flex justify-start items-center">
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({isActive}) => `inline-bock mx-4 px-2 duration-200 md:text-lg md:font-semibold hover:text-[#164E63] cursor-pointer ${isActive ? "text-[#0B645D]" : "text-[#F1F6F9]"}`}
                  >
                    {item.name}
                  </NavLink>
                </li>
              ) : null
            )}
          </ul>

          {!authUser ? (
            <ul className="flex justify-center items-center">
              {authUser ? null : (
                <li>
                  <button
                    onClick={() => navigate("/login")}
                    className="text-[#F1F6F9] border border-[#0B645D] hover:bg-[#0B645D] md:font-bold mx-6 px-4 py-2 rounded-md"
                  >
                    Login
                  </button>
                </li>
              )}
              {authUser ? null : (
                <li>
                  <button
                    onClick={() => navigate("/signup")}
                    className="text-[#F1F6F9] bg-[#0B645D] md:font-bold px-4 py-2 rounded-md hover:bg-[#F1F6F9] hover:text-[#060A14]"
                  >
                    Sign up
                  </button>
                </li>
              )}
            </ul>
          ) : (
            <div className="flex items-center gap-8">
              {/* User Profile and Dropdown */}
              <div className="dropdown dropdown-end">
                <label
                  tabIndex={0}
                  className="btn btn-ghost btn-circle avatar flex flex-row "
                >
                  <div className="w-10 rounded-full ">
                    <img
                      src={
                        authUser?.image ||
                        "https://avatar.iran.liara.run/public/boy"
                      }
                      alt="User Avatar"
                      className="object-cover"
                    />
                  </div>
                </label>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 space-y-3"
                >
                  {/* Common Options */}
                  <li>
                    <p className="text-base font-semibold">{authUser?.name}</p>
                    <hr className="border-gray-200/10" />
                  </li>
                  <li>
                    <Link
                      to="/profile"
                      className="hover:bg-primary hover:text-white text-base font-semibold"
                    >
                      <User className="w-4 h-4 mr-2" />
                      My Profile
                    </Link>
                  </li>
                  {authUser?.role === "ADMIN" && (
                    <li>
                      <Link
                        to="/add-problem"
                        className="hover:bg-primary hover:text-white text-base font-semibold"
                      >
                        <Code className="w-4 h-4 mr-1" />
                        Add Problem
                      </Link>
                    </li>
                  )}
                  <li>
                    <LogoutButton className="hover:bg-primary hover:text-white">
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </LogoutButton>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
