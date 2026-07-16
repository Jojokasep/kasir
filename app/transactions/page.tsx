"use client";
import { useState, useEffect } from "react";
import { Calendar, DollarSign } from "lucide-react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("pos_transactions");
    if (stored) setTransactions(JSON.parse(stored));
  }, []);

  const totalOmset = transactions.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="space-y-6">
      <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-xl flex items-center space-x-4 max-w-sm">
        <div className="p-3 bg-indigo-600 text-white rounded-lg">
          <DollarSign size={24} />
        </div>
        <div>
          <p className="text-xs font-semibold text-indigo-600">Total Pendapatan (Omset)</p>
          <p className="text-2xl font-bold text-indigo-900 mt-1">Rp {totalOmset.toLocaleString("id-ID")}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold text-slate-800 mb-4">Log Riwayat Transaksi</h2>
        
        {transactions.length === 0 ? (
          <p className="text-slate-400 text-center py-10 text-sm">Belum ada transaksi tercatat hari ini.</p>
        ) : (
          <div className="space-y-4">
            {transactions.map((trx) => (
              <div key={trx.id} className="border border-slate-100 p-4 rounded-xl bg-slate-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm">
                <div>
                  <div className="flex items-center space-x-2 text-slate-500 text-xs">
                    <Calendar size={14} />
                    <span>{trx.date}</span>
                    <span className="font-bold text-slate-400">|</span>
                    <span className="font-mono text-indigo-600">{trx.id}</span>
                  </div>
                  <div className="mt-2 space-y-1">
                    {trx.items.map((item: any) => (
                      <p key={item.id} className="text-slate-700 font-medium">
                        • {item.name} <span className="text-slate-400 text-xs">(x{item.quantity})</span>
                      </p>
                    ))}
                  </div>
                </div>
                <div className="sm:text-right flex flex-col justify-between border-t sm:border-t-0 pt-3 sm:pt-0">
                  <span className="text-xs text-slate-400">Total Pembayaran</span>
                  <span className="text-lg font-bold text-indigo-600">Rp {trx.total.toLocaleString("id-ID")}</span>
                  <span className="text-xs text-green-600 font-medium mt-1">
                    Tunai: Rp {trx.cashReceived.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}