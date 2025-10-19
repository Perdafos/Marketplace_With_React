import { Link } from "react-router-dom";
import React from "react";
import { ShoppingCart } from "lucide-react";

type Props = {
    children?: React.ReactNode
}

const Layout = ({ children }: Props) => {
    return (
        <div className="min-h-screen flex flex-col relative">
            <nav className="w-full flex justify-between bg-transparent px-10 py-4 m-0 -mb-14 top-0 sticky z-50">
                <div className="">
                    <ul className="flex gap-10">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/shop">Shop</Link></li>
                        <li><Link to="/collection">Collections</Link></li>
                        <li><Link to="/about">About</Link></li>
                    </ul>
                </div>
                <div className="flex gap-10">
                    <button className="">Log In</button>
                    <button className=""><ShoppingCart /></button>
                </div>
            </nav>

            <main className="z-0">
                {children}
            </main>

            <footer className="w-full bg-[#f2ebe4] mt-auto">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Quick links column */}
                        <div>
                            <h4 className="font-medium text-gray-900 mb-4">Quick links</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/" className="text-gray-600 hover:text-gray-900">Home</Link></li>
                                <li><Link to="/shop" className="text-gray-600 hover:text-gray-900">Shop fragrances</Link></li>
                                <li><Link to="/about" className="text-gray-600 hover:text-gray-900">About us</Link></li>
                                <li><Link to="/faqs" className="text-gray-600 hover:text-gray-900">FAQs</Link></li>
                            </ul>
                        </div>

                        {/* Customer care column */}
                        <div>
                            <h4 className="font-medium text-gray-900 mb-4">Customer care</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/shipping" className="text-gray-600 hover:text-gray-900">Shipping & delivery</Link></li>
                                <li><Link to="/returns" className="text-gray-600 hover:text-gray-900">Returns & exchanges</Link></li>
                                <li><Link to="/track" className="text-gray-600 hover:text-gray-900">Track order</Link></li>
                            </ul>
                        </div>

                        {/* Company column */}
                        <div>
                            <h4 className="font-medium text-gray-900 mb-4">Company</h4>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="/privacy" className="text-gray-600 hover:text-gray-900">Privacy policy</Link></li>
                                <li><Link to="/terms" className="text-gray-600 hover:text-gray-900">Terms & conditions</Link></li>
                                <li><Link to="/support" className="text-gray-600 hover:text-gray-900">Customer Support</Link></li>
                            </ul>
                        </div>

                        {/* Logo/Image column */}
                        <div className="flex flex-col items-end">
                            {/* Placeholder for flower image */}
                            <div className="w-32 h-32 bg-black rounded-sm overflow-hidden mb-4">
                                <div className="w-full h-full bg-amber-700/20 flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-amber-700/40" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom section with copyright and payment methods */}
                    <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-4">
                            <p className="text-sm text-gray-600">©2024 All right reserved.</p>
                            <span className="font-serif italic text-amber-700">Eclat d'Or</span>
                        </div>
                        
                        {/* Payment method icons */}
                        <div className="flex gap-3">
                            {['DISCOVER', 'AMEX', 'MASTERCARD', 'VISA'].map((card) => (
                                <div key={card} className="h-6 w-10 bg-white rounded flex items-center justify-center text-[8px] font-medium text-gray-600">
                                    {card}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Layout;