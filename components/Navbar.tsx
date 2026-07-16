"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Package, History } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Kasir", href: "/", icon: ShoppingCart },
    { name: "Inventori Barang", href: "/inventory", icon: Package },
    { name: "Riwayat Transaksi", href: "/transactions", icon: History },
  ];

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <span className="font-bold text-xl tracking-wider">MajuJaya POS</span>
          </div>
          <div className="flex space-x-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive ? "bg-indigo-800 text-white" : "hover:bg-indigo-500 text-indigo-100"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}