import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const Sidebar = () => {
    const router = useRouter();
    const [isCompanyOpen, setIsCompanyOpen] = useState(false);
    const [isSettingsSidebarOpen, setIsSettingsSidebarOpen] = useState(false);

    // Effect to manage dropdown state based on the current route
    useEffect(() => {
        const isInCompanyRoutes = router.pathname === '/about' || router.pathname === '/contact';
        const isInSettingsRoutes = router.pathname === '/navbar' || router.pathname === '/footer';

        setIsCompanyOpen(isInCompanyRoutes);
        setIsSettingsSidebarOpen(isInSettingsRoutes);
    }, [router.pathname]);

    const toggleCompanyDropdown = () => {
        setIsCompanyOpen((prev) => !prev);
    };

    const handleSettingsClick = () => {
        // Navigate to Navbar page
        router.push('/navbar');
        // Keep the settings sidebar open
        setIsSettingsSidebarOpen(true);
    };

    const handleOptionClick = () => {
        // Close the settings sidebar when any other option is clicked
        setIsSettingsSidebarOpen(false);
    };

    return (
        <div className="flex">
            <aside className="fixed left-0 top-0 w-64 h-full bg-primary text-white p-6">
                <h1 className="text-4xl font-mono mt-5 font-bold mb-2 p-4 rounded-lg hover:bg-white hover:text-black">
                    <Link href="/">Dashboard</Link>
                </h1>
                <nav className="ms-3">
                    <ul>
                        <li>
                            <Link
                                href="/" 
                                className={`block text-xl rounded-lg p-2 ${router.pathname === '/' ? 'bg-white text-black font-semibold' : 'hover:text-black hover:bg-white hover:font-semibold'}`}
                                onClick={handleOptionClick}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <div
                                className="flex text-xl rounded-lg p-2 cursor-pointer justify-between items-center hover:text-black hover:bg-white hover:font-semibold"
                                onClick={toggleCompanyDropdown}
                            >
                                <span>Company</span>
                            </div>
                            {isCompanyOpen && (
                                <dl className="mt-2">
                                    <dd>
                                        <Link
                                            href="/about"
                                            className={`mt-1 block rounded-lg p-2 text-lg ms-5 ${router.pathname === '/about' ? 'bg-white text-black font-semibold' : 'hover:text-black hover:bg-white hover:font-semibold'}`}
                                            onClick={handleOptionClick}
                                        >
                                            About Us
                                        </Link>
                                    </dd>
                                    <dd>
                                        <Link
                                            href="/contact"
                                            className={`mt-1 block rounded-lg p-2 text-lg ms-5 ${router.pathname === '/contact' ? 'bg-white text-black font-semibold' : 'hover:text-black hover:bg-white hover:font-semibold'}`}
                                            onClick={handleOptionClick}
                                        >
                                            Contact Us
                                        </Link>
                                    </dd>
                                </dl>
                            )}
                        </li>
                        <li>
                            <Link
                                href="/support"
                                className={`block rounded-lg p-2 text-lg ${router.pathname === '/support' ? 'bg-white text-black font-semibold' : 'hover:text-black hover:bg-white hover:font-semibold'}`}
                                onClick={handleOptionClick}
                            >
                                Support
                            </Link>
                        </li>
                        <li>
                            <div
                                className="flex text-xl rounded-lg p-2 cursor-pointer justify-between items-center hover:text-black hover:bg-white hover:font-semibold"
                                onClick={handleSettingsClick}
                            >
                                <span>Settings</span>
                            </div>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Conditional rendering of the second sidebar */}
            {isSettingsSidebarOpen && (
                <aside className="fixed left-64 top-0 w-36 h-full bg-blue-400 text-white p-6">
                    <nav>
                        <ul>
                            <li>
                                <Link
                                    href="/navbar"
                                    className={`block rounded-lg p-2 text-lg ${router.pathname === '/navbar' ? 'bg-white text-black font-semibold' : 'hover:text-black hover:bg-white hover:font-semibold'}`}
                                >
                                    Navbar
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/footer"
                                    className={`block rounded-lg mt-2 p-2 text-lg ${router.pathname === '/footer' ? 'bg-white text-black font-semibold' : 'hover:text-black hover:bg-white hover:font-semibold'}`}
                                    onClick={handleOptionClick}
                                >
                                    Footer
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </aside>
            )}
        </div>
    );
};

export default Sidebar;
