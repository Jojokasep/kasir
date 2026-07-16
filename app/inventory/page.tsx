"use client";
import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("pos_products");
    if (stored) setProducts(JSON.parse(stored));
  }, []);

  const saveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !stock) return alert("Harap isi semua kolom!");

    let updated;
    if (editingId) {
      updated = products.map((p) =>
        p.id === editingId ? { ...p, name, price: Number(price), stock: Number(stock) } : p
      );
      setEditingId(null);
    } else {
      const newProd = { id: Date.now().toString(), name, price: Number(price), stock: Number(stock) };
      updated = [...products, newProd];
    }

    setProducts(updated);
    localStorage.setItem("pos_products", JSON.stringify(updated));
    setName("");
    setPrice("");
    setStock("");
  };

  const editProduct = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(product.price.toString());
    setStock(product.stock.toString());
  };

  const deleteProduct = (id: string) => {
    if (confirm("Hapus produk ini?")) {
      const updated = products.filter((p) => p.id !== id);
      setProducts(updated);
      localStorage.setItem("pos_products", JSON.stringify(updated));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
        <h2 className="text-lg font-bold text-slate-800 mb-4">
          {editingId ? "Edit Produk" : "Tambah Produk Baru"}
        </h2>
        <form onSubmit={saveProduct} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Nama Produk</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg text-sm focus:outline-indigo-500"
              placeholder="Contoh: Matcha Latte"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Harga (Rp)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg text-sm focus:outline-indigo-500"
              placeholder="15000"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Jumlah Stok</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg text-sm focus:outline-indigo-500"
              placeholder="50"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition text-sm flex items-center justify-center space-x-2"
          >
            <Plus size={16} />
            <span>{editingId ? "Simpan Perubahan" : "Tambah Barang"}</span>
          </button>
        </form>
      </div>

      <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Daftar Stok Produk</h2>
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-slate-500">
              <th className="py-3 px-4 font-semibold">Nama Produk</th>
              <th className="py-3 px-4 font-semibold">Harga</th>
              <th className="py-3 px-4 font-semibold">Stok</th>
              <th className="py-3 px-4 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-slate-400">Belum ada data barang.</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-slate-800">{product.name}</td>
                  <td className="py-3 px-4 text-indigo-600 font-semibold">Rp {product.price.toLocaleString("id-ID")}</td>
                  <td className={`py-3 px-4 font-semibold ${product.stock < 5 ? "text-red-500" : "text-slate-600"}`}>
                    {product.stock}
                  </td>
                  <td className="py-3 px-4 flex items-center justify-center space-x-2">
                    <button onClick={() => editProduct(product)} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => deleteProduct(product.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}