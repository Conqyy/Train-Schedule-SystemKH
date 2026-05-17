"use client";

import { useEffect, useState } from "react";
import { Train, Reservation } from "@/models/types";
import {
  getTrains, getReservations, cancelReservation, resetAllData,
  getDashboardStats, DashboardStats, addTrain, updateTrain, deleteTrain,
} from "@/controllers/trainService";

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) {
  return (
    <div className="glass-card p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl" style={{ background: `${color}15` }}>{icon}</div>
      <div>
        <p className="text-2xl font-extrabold text-white">{value}</p>
        <p className="text-xs font-medium" style={{ color: "#94a3b8" }}>{label}</p>
      </div>
    </div>
  );
}

const emptyTrain = {
  id: "",
  name: "",
  destination: "",
  origin: "",
  departureTime: "",
  arrivalTime: "",
  totalSeats: 0,
  price: 0,
  status: "on-time" as "on-time" | "delayed" | "cancelled"
};

export default function AdminPage() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activeTab, setActiveTab] = useState<"reservations" | "trains" | "manage">("reservations");
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState(emptyTrain);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formMsg, setFormMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const refreshData = () => { setTrains(getTrains()); setReservations(getReservations()); setStats(getDashboardStats()); };
  useEffect(() => { setMounted(true); refreshData(); }, []);

  const handleCancel = (id: string) => { const r = cancelReservation(id); if (r.success) refreshData(); alert(r.message); };
  const handleReset = () => { if (window.confirm("Reset all data to defaults?")) { resetAllData(); refreshData(); } };

  const handleTrainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg(null);
    let result;
    if (editingId) {
      const { id, ...updates } = form;
      result = updateTrain(editingId, updates);
    } else {
      result = addTrain(form);
    }
    setFormMsg({ ok: result.success, text: result.message });
    if (result.success) { setForm(emptyTrain); setEditingId(null); refreshData(); }
  };

  const startEdit = (t: Train) => {
    setEditingId(t.id);
    // @ts-ignore
    setForm({ id: t.id, name: t.name, destination: t.destination, origin: t.origin, departureTime: t.departureTime, arrivalTime: t.arrivalTime, totalSeats: t.totalSeats, price: t.price, status: t.status });
    setActiveTab("manage");
    setFormMsg(null);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this cancelled train?")) return;
    const r = deleteTrain(id);
    alert(r.message);
    if (r.success) refreshData();
  };

  if (!mounted || !stats) return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-xl animate-pulse" style={{ color: "#94a3b8" }}>Loading dashboard...</p></div>;

  return (
    <div className="animate-fade-in-up">
      <section className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2" style={{ background: "linear-gradient(135deg, #818cf8, #a78bfa, #c084fc)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Admin Dashboard</h1>
          <p style={{ color: "#94a3b8" }}>Railway staff overview — manage trains and reservations.</p>
        </div>
        <button id="reset-data-btn" onClick={handleReset} className="btn-danger self-start">🔄 Reset All Data</button>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 stagger-children">
        <StatCard icon="🚆" label="Total Trains" value={stats.totalTrains} color="#14b8a6" />
        <StatCard icon="💺" label="Total Capacity" value={stats.totalCapacity.toLocaleString()} color="#06b6d4" />
        <StatCard icon="🎫" label="Active Bookings" value={stats.activeReservations} color="#f59e0b" />
        <StatCard icon="📊" label="Occupancy Rate" value={`${stats.occupancyRate}%`} color="#818cf8" />
      </div>

      <div className="glass-card p-6 mb-10">
        <div className="flex justify-between text-sm mb-2">
          <span style={{ color: "#94a3b8" }}>System Occupancy — {stats.totalBooked.toLocaleString()} booked / {stats.totalCapacity.toLocaleString()} total</span>
          <span className="font-bold" style={{ color: "#14b8a6" }}>{stats.occupancyRate}%</span>
        </div>
        <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "rgba(148,163,184,0.1)" }}>
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${stats.occupancyRate}%`, background: "linear-gradient(90deg,#14b8a6,#06b6d4,#818cf8)" }} />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(["reservations", "trains", "manage"] as const).map((tab) => {
          const labels = { reservations: `🎫 Reservations (${reservations.length})`, trains: `🚆 Trains (${trains.length})`, manage: "⚙️ Manage Trains" };
          return (
            <button key={tab} id={`tab-${tab}`} onClick={() => { setActiveTab(tab); if (tab === "manage") { setEditingId(null); setForm(emptyTrain); setFormMsg(null); } }}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all"
              style={{ background: activeTab === tab ? "rgba(20,184,166,0.15)" : "transparent", color: activeTab === tab ? "#14b8a6" : "#94a3b8", border: activeTab === tab ? "1px solid rgba(20,184,166,0.3)" : "1px solid transparent" }}>
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* Reservations Tab */}
      {activeTab === "reservations" && (
        <div className="glass-card overflow-hidden">
          {reservations.length === 0 ? (
            <div className="text-center py-16"><p className="text-5xl mb-4">📭</p><p className="text-lg font-semibold text-white">No reservations yet</p><p style={{ color: "#94a3b8" }}>Bookings will appear here once passengers reserve tickets.</p></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr style={{ background: "rgba(148,163,184,0.05)" }}>
                  {["Reservation ID", "Passenger", "Train", "Seat", "Date", "Status", "Action"].map(h => <th key={h} className="px-6 py-4 text-left font-semibold" style={{ color: "#94a3b8" }}>{h}</th>)}
                </tr></thead>
                <tbody>{reservations.map((r) => {
                  const train = trains.find(t => t.id === r.trainId);
                  return (<tr key={r.id} style={{ borderTop: "1px solid rgba(148,163,184,0.06)" }}>
                    <td className="px-6 py-4 font-mono text-xs text-white">{r.id.slice(0, 16)}…</td>
                    <td className="px-6 py-4"><p className="font-medium text-white">{r.passengerName}</p><p className="text-xs" style={{ color: "#64748b" }}>{r.passengerEmail}</p></td>
                    <td className="px-6 py-4 text-white">{train?.name || r.trainId}</td>
                    <td className="px-6 py-4 font-bold text-white">#{r.seatNumber}</td>
                    <td className="px-6 py-4" style={{ color: "#94a3b8" }}>{new Date(r.bookingDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4"><span className={`badge ${r.status === "confirmed" ? "badge-success" : "badge-danger"}`}>{r.status}</span></td>
                    <td className="px-6 py-4">{r.status === "confirmed" && <button onClick={() => handleCancel(r.id)} className="btn-danger text-xs">Cancel</button>}</td>
                  </tr>);
                })}</tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Trains Tab */}
      {activeTab === "trains" && (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr style={{ background: "rgba(148,163,184,0.05)" }}>
                {["ID", "Train Name", "Route", "Departure", "Total Seats", "Available", "Status", "Actions"].map(h => <th key={h} className="px-6 py-4 text-left font-semibold" style={{ color: "#94a3b8" }}>{h}</th>)}
              </tr></thead>
              <tbody>{trains.map(t => (
                <tr key={t.id} style={{ borderTop: "1px solid rgba(148,163,184,0.06)" }}>
                  <td className="px-6 py-4 font-mono text-xs text-white">{t.id}</td>
                  <td className="px-6 py-4 font-medium text-white">{t.name}</td>
                  <td className="px-6 py-4" style={{ color: "#94a3b8" }}>{t.origin} → {t.destination}</td>
                  <td className="px-6 py-4 text-white">{t.departureTime}</td>
                  <td className="px-6 py-4 text-white">{t.totalSeats}</td>
                  <td className="px-6 py-4 font-bold" style={{ color: "#14b8a6" }}>{t.availableSeats}</td>
                  <td className="px-6 py-4"><span className={`badge ${t.status === "on-time" ? "badge-success" : t.status === "delayed" ? "badge-warning" : "badge-danger"}`}>{t.status}</span></td>
                  <td className="px-6 py-4 flex gap-2">
                    <button onClick={() => startEdit(t)} className="btn-secondary text-xs py-1 px-3">Edit</button>
                    {t.status === "cancelled" && <button onClick={() => handleDelete(t.id)} className="btn-danger text-xs py-1 px-3">Delete</button>}
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {/* Manage Trains Tab */}
      {activeTab === "manage" && (
        <div className="glass-card p-8 max-w-2xl">
          <h2 className="text-xl font-bold text-white mb-6">{editingId ? `✏️ Edit Train — ${editingId}` : "➕ Add New Train"}</h2>
          {formMsg && <div className="rounded-xl p-3 text-sm font-medium text-center mb-4 animate-slide-in" style={{ background: formMsg.ok ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)", color: formMsg.ok ? "#4ade80" : "#f87171", border: `1px solid ${formMsg.ok ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}` }}>{formMsg.text}</div>}
          <form onSubmit={handleTrainSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="train-id" className="block text-sm font-semibold mb-1 text-white">Train ID</label>
                <input id="train-id" className="input-field" placeholder="e.g. TR-007" value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} disabled={!!editingId} required />
              </div>
              <div>
                <label htmlFor="train-name" className="block text-sm font-semibold mb-1 text-white">Train Name</label>
                <input id="train-name" className="input-field" placeholder="e.g. Desert Express" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="train-origin" className="block text-sm font-semibold mb-1 text-white">Origin</label>
                <input id="train-origin" className="input-field" placeholder="e.g. Riyadh" value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="train-destination" className="block text-sm font-semibold mb-1 text-white">Destination</label>
                <input id="train-destination" className="input-field" placeholder="e.g. Tabuk" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="train-departure" className="block text-sm font-semibold mb-1 text-white">Departure Time</label>
                <input id="train-departure" type="time" className="input-field" value={form.departureTime} onChange={e => setForm({ ...form, departureTime: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="train-arrival" className="block text-sm font-semibold mb-1 text-white">Arrival Time</label>
                <input id="train-arrival" type="time" className="input-field" value={form.arrivalTime} onChange={e => setForm({ ...form, arrivalTime: e.target.value })} required />
              </div>
              <div>
                <label htmlFor="train-seats" className="block text-sm font-semibold mb-1 text-white">Total Seats</label>
                <input id="train-seats" type="number" min="1" className="input-field" value={form.totalSeats || ""} onChange={e => setForm({ ...form, totalSeats: parseInt(e.target.value) || 0 })} required />
              </div>
              <div>
                <label htmlFor="train-price" className="block text-sm font-semibold mb-1 text-white">Price (SAR)</label>
                <input id="train-price" type="number" min="0" className="input-field" value={form.price || ""} onChange={e => setForm({ ...form, price: parseInt(e.target.value) || 0 })} required />
              </div>
              <div>
                <label htmlFor="train-status" className="block text-sm font-semibold mb-1 text-white">Status</label>
                <select id="train-status" className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Train["status"] })}>
                  <option value="on-time">On Time</option>
                  <option value="delayed">Delayed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button id="submit-train" type="submit" className="btn-primary">{editingId ? "💾 Save Changes" : "➕ Add Train"}</button>
              {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyTrain); setFormMsg(null); }} className="btn-secondary">Cancel Edit</button>}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
