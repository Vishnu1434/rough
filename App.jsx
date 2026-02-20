import React from 'react';

// --- Reusable Dropdown Component ---
const NavItem = ({ title, items }) => {
    return (
        <div className="relative group px-3 py-2">
            <button className="flex items-center gap-1.5 text-base font-semibold text-gray-600 hover:text-indigo-600 transition-colors">
                {title}
                <svg
                    className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu - Aligned to the right so it doesn't overflow the screen */}
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform origin-top-right group-hover:translate-y-0 translate-y-2">
                <div className="p-2">
                    {items.map((item, index) => (
                        <a
                            key={index}
                            href="#"
                            className="block px-4 py-2.5 text-sm text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                        >
                            {item}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
};

const App = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">

            {/* --- Navbar --- */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-50 z-50">
                <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">

                    {/* Logo Name (Left Side) */}
                    <div className="flex items-center group cursor-pointer">
                        <span className="text-3xl font-black tracking-tighter text-indigo-600">
                          vixion<span className="text-indigo-300">.</span>
                        </span>
                    </div>

                    {/* Navigation Items (Right Side) */}
                    <div className="flex items-center gap-6">
                        <NavItem
                            title="Services"
                            items={["Custom Design", "App Development", "Cloud Solutions"]}
                        />
                        <NavItem
                            title="Settings"
                            items={["Account", "Privacy", "System Prefs"]}
                        />
                        <NavItem
                            title="Docs"
                            items={["Introduction", "API Guide", "Community"]}
                        />
                    </div>
                </div>
            </nav>

            {/* --- Homepage Content --- */}
            <main className="flex items-center justify-center min-h-screen px-6">
                <div className="max-w-3xl text-center space-y-6">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 leading-[1.1]">
                        Welcome to <span className="text-indigo-600">vixion</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 font-medium tracking-wide">
                        one platform and endless possibilities.
                    </p>

                    {/* Subtle Accent Line */}
                    <div className="flex justify-center pt-8">
                        <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
                    </div>
                </div>
            </main>

        </div>
    );
};

export default App;