"use client";
import { useState, useEffect } from "react";
import { Search, Plus, Minus, Trash2, CheckCircle } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}

export default function CashierPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<any>(null);

  useEffect(() => {
    const initialProducts = [
      { id: "1", name: "Kopi Susu Gula Aren", price: 18000, stock: 50 },
      { id: "2", name: "Roti Bakar Cokelat", price: 15000, stock: 30 },
      { id: "3", name: "Indomie Goreng Telur", price: 12000, stock: 40 },
      { id: "4", name: "Es Teh Manis", price: 5000, stock: 100 },
    ];
    const storedProducts = localStorage.getItem("pos_products");
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      localStorage.setItem("pos_products", JSON.stringify(initialProducts));
      setProducts(initialProducts);
    }
  }, []);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return alert("Stok habis!");
    
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert("Tidak bisa melebihi stok tersedia!");
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, amount: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + amount;
            const targetProd = products.find((p) => p.id === id);
            if (targetProd && newQty > targetProd.stock) {
              alert("Mencapai batas stok!");
              return item;
            }
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.11;
  const total = subtotal + tax;
  const change = cashReceived >= total ? cashReceived - total : 0;

  const handleCheckout = () => {
    if (cart.length === 0) return alert("Keranjang kosong!");
    if (cashReceived < total) return alert("Uang pembayaran kurang!");

    const updatedProducts = products.map((prod) => {
      const cartItem = cart.find((item) => item.id === prod.id);
      if (cartItem) {
        return { ...prod, stock: prod.stock - cartItem.quantity };
      }
      return prod;
    });

    const newTransaction = {
      id: "TRX-" + Date.now(),
      items: cart,
      subtotal,
      tax,
      total,
      cashReceived,
      change,
      date: new Date().toLocaleString("id-ID"),
    };

    const storedTransactions = JSON.parse(localStorage.getItem("pos_transactions") || "[]");
    localStorage.setItem("pos_transactions", JSON.stringify([newTransaction, ...storedTransactions]));
    localStorage.setItem("pos_products", JSON.stringify(updatedProducts));

    setProducts(updatedProducts);
    setLastTransaction(newTransaction);
    setShowReceipt(true);
    setCart([]);
    setCashReceived(0);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center space-x-3 mb-6 bg-slate-100 px-4 py-2 rounded-lg">
          <Search className="text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => addToCart(product)}
              className="border border-slate-200 p-4 rounded-xl cursor-pointer hover:border-indigo-500 hover:shadow-md transition bg-slate-50 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-slate-800 text-sm sm:text-base">{product.name}</h3>
                <p className="text-indigo-600 font-bold mt-1 text-sm">Rp {product.price.toLocaleString("id-ID")}</p>
              </div>
              <p className={`text-xs mt-3 font-medium ${product.stock < 5 ? "text-red-500" : "text-slate-500"}`}>
                Stok: {product.stock}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-120px)] sticky top-6">
        <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b">Keranjang Belanja</h2>
        
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {cart.length === 0 ? (
            <p className="text-slate-400 text-center text-sm mt-10">Belum ada item ditambahkan</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-2 text-sm">
                <div className="flex-1 pr-2">
                  <h4 className="font-semibold text-slate-700 truncate">{item.name}</h4>
                  <p className="text-xs text-slate-400">Rp {item.price.toLocaleString("id-ID")} x {item.quantity}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 bg-slate-100 rounded hover:bg-slate-200">
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 bg-slate-100 rounded hover:bg-slate-200">
                    <Plus size={14} />
                  </button>
                  <button onClick={() => removeFromCart(item.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t pt-4 space-y-2 text-sm mt-4">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span>Rp {subtotal.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Pajak (11%)</span>
            <span>Rp {tax.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between font-bold text-base text-slate-800 pt-1">
            <span>Total Akhir</span>
            <span>Rp {total.toLocaleString("id-ID")}</span>
          </div>

          <div className="pt-3">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Uang Tunai Diterima</label>
            <input
              type="number"
              value={cashReceived || ""}
              onChange={(e) => setCashReceived(Number(e.target.value))}
              placeholder="Masukkan nominal uang..."
              className="w-full border px-3 py-2 rounded-lg font-bold text-indigo-600 focus:outline-indigo-500"
            />
          </div>

          {cashReceived >= total && (
            <div className="flex justify-between text-green-600 font-semibold bg-green-50 p-2 rounded-lg mt-1 text-xs">
              <span>Kembalian:</span>
              <span>Rp {change.toLocaleString("id-ID")}</span>
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || cashReceived < total}
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg mt-4 shadow hover:bg-indigo-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <CheckCircle size={18} />
            <span>Proses Transaksi</span>
          </button>
        </div>
      </div>

      {showReceipt && lastTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full font-mono text-sm shadow-xl">
            <h3 className="text-center font-bold text-lg border-b pb-2">STRUK PEMBAYARAN</h3>
            <p className="text-xs text-slate-500 mt-2">ID: {lastTransaction.id}</p>
            <p className="text-xs text-slate-500">Waktu: {lastTransaction.date}</p>
            <div className="border-b border-dashed my-3"></div>
            <div className="space-y-2">
              {lastTransaction.items.map((item: any) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} (x{item.quantity})</span>
                  <span>{(item.price * item.quantity).toLocaleString("id-ID")}</span>
                </div>
              ))}
            </div>
            <div className="border-b border-dashed my-3"></div>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{lastTransaction.subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between">
              <span>Pajak 11%</span>
              <span>{lastTransaction.tax.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between font-bold text-base mt-1">
              <span>TOTAL</span>
              <span>{lastTransaction.total.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between mt-1 text-slate-600">
              <span>Bayar</span>
              <span>{lastTransaction.cashReceived.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-green-600 font-bold">
              <span>Kembali</span>
              <span>{lastTransaction.change.toLocaleString("id-ID")}</span>
            </div>
            <button
              onClick={() => setShowReceipt(false)}
              className="w-full bg-slate-800 text-white font-sans py-2 rounded-lg mt-6 font-semibold hover:bg-slate-700 transition"
            >
              Tutup Struk
            </button>
          </div>
        </div>
      )}
    </div>
  );
}