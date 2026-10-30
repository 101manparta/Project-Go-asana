import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, Calendar, CreditCard } from 'lucide-react';
import { api } from '../services/api';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        const res = await api.getAdminCustomers();
        setCustomers(res.data);
      } catch (err) {
        console.error('Failed to load customers:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-serif font-medium text-white">
          Practitioners &amp; Customers Directory
        </h1>
        <p className="text-xs text-neutral-400">
          Privacy-conscious registry of studio members, active passes, and booking engagement.
        </p>
      </div>

      <div className="bg-neutral-800/40 border border-white/10 rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-neutral-400">Loading customer profiles...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-300">
              <thead className="bg-neutral-900 border-b border-white/10 text-[11px] font-mono uppercase text-neutral-400">
                <tr>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Membership Plan</th>
                  <th className="py-3 px-4">Credits Remaining</th>
                  <th className="py-3 px-4">Total Reservations</th>
                  <th className="py-3 px-4">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-light">
                {customers.map((c) => (
                  <tr key={c.uid} className="hover:bg-white/5">
                    <td className="py-3.5 px-4 font-medium text-white">
                      {c.displayName}
                    </td>
                    <td className="py-3.5 px-4 text-neutral-400">
                      {c.email}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-700 text-neutral-200">
                        {c.membershipName || 'Drop-In'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {c.remainingCredits ?? 0}
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      {c.bookingsCount || 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-emerald-400 text-[10px] uppercase font-semibold">
                        {c.accountStatus || 'ACTIVE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
