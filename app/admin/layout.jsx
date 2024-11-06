'use client';
import { assets } from "@/Assets/assets";
import Sidebar from "@/Components/AdminComponents/Sidebar";
import Image from "next/image";
import Link from "next/link";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'tailwindcss/tailwind.css';
import '@/app/globals.css';
import { useRouter } from "next/navigation";
import { useUser } from '@/app/userContext/UserContext'; 

export default function Layout({ children }) {
    const { user, setUser } = useUser();
    const router = useRouter();

    const handleLogout = () => {
      setUser(null); 
      router.push("/login");
    };
    // Check if user is logged in and has admin email
    const isAdmin = user && user.email === "Admin@gmail.com";

    return (
        <>
        {/* Conditional rendering based on admin access */}
        {isAdmin ? (
            <div className="flex">
                <ToastContainer theme="dark" />
                
                
                    <>
                        <Sidebar />
                        <div className="flex flex-col w-full ml-[280px]">
                            <div className="flex items-center justify-between w-full py-3 max-h-[60px] px-12 border-b border-black">
                                <h3 className="font-medium">Admin Panel</h3>
                                <div className="flex">
                                    
                                    <button 
                  onClick={handleLogout} 
                  className="header-logout-button bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Logout
                </button>
                                  
                                    &nbsp; &nbsp;&nbsp;&nbsp;
                                    <Image src={assets.profile_icon} width={40} alt="" />
                                </div>
                            </div>
                            {/* Render main content */}
                            {children}
                        </div>
                    </>
                
            </div>
            ) : (
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white shadow-lg rounded-lg max-w-md mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Looks like you don't have access to this page or you need to log in.
            </h2>
            <p className="text-gray-600 mb-6">
                Please log in to access this page or go back to the homepage.
            </p>
            <Link href="/">
                <p className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300">
                    Back to Home Page
                </p>
            </Link>
        </div>
    </div>
            )}
        </>
    );
}
