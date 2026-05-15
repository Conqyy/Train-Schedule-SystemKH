"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Train } from "@/models/types";
import { getTrains, bookTicket, BookingResult } from "@/controllers/trainService";

/* ---------- Booking Form (inner, uses useSearchParams) ---------- */
function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselected = searchParams.get("train") || "";

  const [trains, setTrains] = useState<Train[]>([]);
  const [selectedTrain, setSelectedTrain] = useState(preselected);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<BookingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTrains(getTrains());
  }, []);

  const selectedTrainData = trains.find((t) => t.id === selectedTrain);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrain || !name.trim() || !email.trim()) return;

    setLoading(true);
    // Simulate a small delay for UX
    setTimeout(() => {
      const res = bookTicket(selectedTrain, name.trim(), email.trim());
      setResult(res);
      setLoading(false);
      if (res.success) {
        // Refresh train data
        setTrains(getTrains());
      }
    }, 800);
  };

  const handleReset = () => {
    setResult(null);
    setName("");
    setEmail("");
    setSelectedTrain("");
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-center">
          <p className="text-xl" style={{ color: "#94a3b8" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {/* Header */}
      <section className="text-center mb-10">
        <h1
          className="text-4xl md:text-5xl font-extrabold mb-4"
          style={{
            background: "linear-gradient(135deg, #f59e0b, #f97316, #ef4444)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Book Your Ticket
        </h1>
        <p className="text-lg" style={{ color: "#94a3b8" }}>
          Select a train, enter your details, and reserve your seat instantly.
        </p>
      </section>

      <div className="max-w-2xl mx-auto">
        {/* Success / Error Result */}
        {result && (
          <div
            className="glass-card p-8 mb-8 text-center animate-fade-in-up"
            style={{
              borderColor: result.success
                ? "rgba(34, 197, 94, 0.3)"
                : "rgba(239, 68, 68, 0.3)",
            }}
          >
            <p className="text-5xl mb-4">{result.success ? "✅" : "❌"}</p>
            <h2 className="text-xl font-bold text-white mb-2">
              {result.success ? "Booking Confirmed!" : "Booking Failed"}
            </h2>
            <p className="mb-6" style={{ color: "#94a3b8" }}>
              {result.message}
            </p>
            {result.reservation && (
              <div
                className="rounded-xl p-4 mb-6 text-left text-sm space-y-2"
                style={{ background: "rgba(20, 184, 166, 0.08)" }}
              >
                <p>
                  <span style={{ color: "#94a3b8" }}>Reservation ID:</span>{" "}
                  <span className="font-mono text-white">
                    {result.reservation.id}
                  </span>
                </p>
                <p>
                  <span style={{ color: "#94a3b8" }}>Seat Number:</span>{" "}
                  <span className="font-bold text-white">
                    #{result.reservation.seatNumber}
                  </span>
                </p>
                <p>
                  <span style={{ color: "#94a3b8" }}>Passenger:</span>{" "}
                  <span className="text-white">
                    {result.reservation.passengerName}
                  </span>
                </p>
              </div>
            )}
            <div className="flex gap-3 justify-center">
              <button onClick={handleReset} className="btn-primary">
                Book Another
              </button>
              <button onClick={() => router.push("/")} className="btn-secondary">
                View Schedules
              </button>
            </div>
          </div>
        )}

        {/* Booking Form */}
        {!result && (
          <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
            {/* Train Selection */}
            <div>
              <label
                htmlFor="train-select"
                className="block text-sm font-semibold mb-2 text-white"
              >
                Select Train
              </label>
              <select
                id="train-select"
                value={selectedTrain}
                onChange={(e) => setSelectedTrain(e.target.value)}
                className="input-field"
                required
              >
                <option value="">— Choose a train —</option>
                {trains
                  .filter((t) => t.status !== "cancelled" && t.availableSeats > 0)
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} — {t.origin} → {t.destination} ({t.availableSeats}{" "}
                      seats)
                    </option>
                  ))}
              </select>
            </div>

            {/* Selected Train Details */}
            {selectedTrainData && (
              <div
                className="rounded-xl p-4 space-y-2 animate-slide-in"
                style={{ background: "rgba(20, 184, 166, 0.06)" }}
              >
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#94a3b8" }}>Route</span>
                  <span className="text-white font-medium">
                    {selectedTrainData.origin} → {selectedTrainData.destination}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#94a3b8" }}>Departure</span>
                  <span className="text-white font-medium">
                    {selectedTrainData.departureTime}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#94a3b8" }}>Arrival</span>
                  <span className="text-white font-medium">
                    {selectedTrainData.arrivalTime}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#94a3b8" }}>Price</span>
                  <span
                    className="font-bold"
                    style={{ color: "#14b8a6" }}
                  >
                    {selectedTrainData.price} SAR
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "#94a3b8" }}>Available Seats</span>
                  <span className="font-bold text-white">
                    {selectedTrainData.availableSeats} /{" "}
                    {selectedTrainData.totalSeats}
                  </span>
                </div>
              </div>
            )}

            {/* Passenger Name */}
            <div>
              <label
                htmlFor="passenger-name"
                className="block text-sm font-semibold mb-2 text-white"
              >
                Passenger Name
              </label>
              <input
                id="passenger-name"
                type="text"
                placeholder="e.g. Khalid Al-Fahd"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-field"
                required
              />
            </div>

            {/* Passenger Email */}
            <div>
              <label
                htmlFor="passenger-email"
                className="block text-sm font-semibold mb-2 text-white"
              >
                Email Address
              </label>
              <input
                id="passenger-email"
                type="email"
                placeholder="e.g. khalid@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>

            {/* Submit */}
            <button
              id="submit-booking"
              type="submit"
              disabled={loading || !selectedTrain || !name.trim() || !email.trim()}
              className="btn-primary w-full text-base py-3"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </span>
              ) : (
                "Confirm Reservation 🎫"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

/* ---------- Page wrapper with Suspense ---------- */
export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-xl" style={{ color: "#94a3b8" }}>Loading...</p>
        </div>
      }
    >
      <BookingForm />
    </Suspense>
  );
}
