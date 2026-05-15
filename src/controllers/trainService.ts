/* ===================================================================
   Controller – TrainService
   Handles all CRUD operations for trains and reservations using
   localStorage as the persistence layer.
   =================================================================== */

import { Train, Reservation } from "@/models/types";
import { defaultTrains, defaultReservations } from "@/models/data";

const TRAINS_KEY = "ksa_trains";
const RESERVATIONS_KEY = "ksa_reservations";

/* ---------- Helpers ---------- */

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** Seed localStorage with defaults if empty */
function ensureData(): void {
  if (!isBrowser()) return;
  if (!localStorage.getItem(TRAINS_KEY)) {
    localStorage.setItem(TRAINS_KEY, JSON.stringify(defaultTrains));
  }
  if (!localStorage.getItem(RESERVATIONS_KEY)) {
    localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(defaultReservations));
  }
}

/* ---------- Train Operations ---------- */

/** Retrieve all trains from storage */
export function getTrains(): Train[] {
  ensureData();
  if (!isBrowser()) return defaultTrains;
  const raw = localStorage.getItem(TRAINS_KEY);
  return raw ? (JSON.parse(raw) as Train[]) : defaultTrains;
}

/** Retrieve a single train by ID */
export function getTrainById(id: string): Train | undefined {
  return getTrains().find((t) => t.id === id);
}

/** Persist updated trains list */
function saveTrains(trains: Train[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(TRAINS_KEY, JSON.stringify(trains));
}

/* ---------- Reservation Operations ---------- */

/** Retrieve all reservations */
export function getReservations(): Reservation[] {
  ensureData();
  if (!isBrowser()) return [];
  const raw = localStorage.getItem(RESERVATIONS_KEY);
  return raw ? (JSON.parse(raw) as Reservation[]) : [];
}

/** Persist updated reservations list */
function saveReservations(reservations: Reservation[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(reservations));
}

/* ---------- Booking Logic (Controller Core) ---------- */

export interface BookingResult {
  success: boolean;
  message: string;
  reservation?: Reservation;
}

/**
 * Process a ticket reservation:
 *  1. Check the train exists
 *  2. Verify seats are available
 *  3. Assign a seat number
 *  4. Create the reservation record
 *  5. Decrement available seats on the train
 */
export function bookTicket(
  trainId: string,
  passengerName: string,
  passengerEmail: string,
): BookingResult {
  const trains = getTrains();
  const trainIndex = trains.findIndex((t) => t.id === trainId);

  if (trainIndex === -1) {
    return { success: false, message: "Train not found." };
  }

  const train = trains[trainIndex];

  if (train.status === "cancelled") {
    return { success: false, message: "This train has been cancelled." };
  }

  if (train.availableSeats <= 0) {
    return { success: false, message: "No seats available on this train." };
  }

  // Calculate seat number (total - available + 1)
  const seatNumber = train.totalSeats - train.availableSeats + 1;

  // Create reservation
  const reservation: Reservation = {
    id: `RSV-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    trainId,
    passengerName,
    passengerEmail,
    seatNumber,
    bookingDate: new Date().toISOString(),
    status: "confirmed",
  };

  // Update available seats
  trains[trainIndex] = {
    ...train,
    availableSeats: train.availableSeats - 1,
  };

  // Persist
  saveTrains(trains);
  const reservations = getReservations();
  reservations.push(reservation);
  saveReservations(reservations);

  return {
    success: true,
    message: `Booking confirmed! Seat #${seatNumber} on ${train.name} to ${train.destination}.`,
    reservation,
  };
}

/**
 * Cancel an existing reservation and restore the seat.
 */
export function cancelReservation(reservationId: string): BookingResult {
  const reservations = getReservations();
  const idx = reservations.findIndex((r) => r.id === reservationId);

  if (idx === -1) {
    return { success: false, message: "Reservation not found." };
  }

  const reservation = reservations[idx];

  if (reservation.status === "cancelled") {
    return { success: false, message: "Reservation is already cancelled." };
  }

  // Cancel reservation
  reservations[idx] = { ...reservation, status: "cancelled" };
  saveReservations(reservations);

  // Restore seat
  const trains = getTrains();
  const trainIdx = trains.findIndex((t) => t.id === reservation.trainId);
  if (trainIdx !== -1) {
    trains[trainIdx] = {
      ...trains[trainIdx],
      availableSeats: trains[trainIdx].availableSeats + 1,
    };
    saveTrains(trains);
  }

  return { success: true, message: "Reservation cancelled successfully." };
}

/**
 * Reset all data back to defaults (useful for demo / testing).
 */
export function resetAllData(): void {
  if (!isBrowser()) return;
  localStorage.setItem(TRAINS_KEY, JSON.stringify(defaultTrains));
  localStorage.setItem(RESERVATIONS_KEY, JSON.stringify(defaultReservations));
}

/* ---------- Train CRUD (Admin – Use Case #9) ---------- */

export interface TrainResult {
  success: boolean;
  message: string;
}

/**
 * Add a brand-new train to the schedule.
 */
export function addTrain(train: Omit<Train, "availableSeats">): TrainResult {
  const trains = getTrains();
  if (trains.some((t) => t.id === train.id)) {
    return { success: false, message: `Train ID "${train.id}" already exists.` };
  }
  const newTrain: Train = { ...train, availableSeats: train.totalSeats };
  trains.push(newTrain);
  saveTrains(trains);
  return { success: true, message: `Train "${train.name}" added successfully.` };
}

/**
 * Update an existing train's editable fields (time, capacity, status, etc.).
 */
export function updateTrain(
  id: string,
  updates: Partial<Omit<Train, "id">>,
): TrainResult {
  const trains = getTrains();
  const idx = trains.findIndex((t) => t.id === id);
  if (idx === -1) {
    return { success: false, message: "Train not found." };
  }

  // If totalSeats changed, adjust availableSeats proportionally
  if (updates.totalSeats !== undefined) {
    const booked = trains[idx].totalSeats - trains[idx].availableSeats;
    const newAvailable = Math.max(0, updates.totalSeats - booked);
    updates.availableSeats = newAvailable;
  }

  trains[idx] = { ...trains[idx], ...updates };
  saveTrains(trains);
  return { success: true, message: `Train "${trains[idx].name}" updated successfully.` };
}

/**
 * Delete a cancelled train from the schedule.
 * Only cancelled trains may be deleted (safety rule).
 */
export function deleteTrain(id: string): TrainResult {
  const trains = getTrains();
  const idx = trains.findIndex((t) => t.id === id);
  if (idx === -1) {
    return { success: false, message: "Train not found." };
  }
  if (trains[idx].status !== "cancelled") {
    return {
      success: false,
      message: "Only cancelled trains can be deleted. Change the status first.",
    };
  }
  trains.splice(idx, 1);
  saveTrains(trains);
  return { success: true, message: "Train deleted successfully." };
}

/* ---------- Statistics (for Admin Dashboard) ---------- */

export interface DashboardStats {
  totalTrains: number;
  totalCapacity: number;
  totalBooked: number;
  totalAvailable: number;
  activeReservations: number;
  cancelledReservations: number;
  occupancyRate: number; // 0-100
}

export function getDashboardStats(): DashboardStats {
  const trains = getTrains();
  const reservations = getReservations();

  const totalCapacity = trains.reduce((sum, t) => sum + t.totalSeats, 0);
  const totalAvailable = trains.reduce((sum, t) => sum + t.availableSeats, 0);
  const totalBooked = totalCapacity - totalAvailable;
  const activeReservations = reservations.filter((r) => r.status === "confirmed").length;
  const cancelledReservations = reservations.filter((r) => r.status === "cancelled").length;

  return {
    totalTrains: trains.length,
    totalCapacity,
    totalBooked,
    totalAvailable,
    activeReservations,
    cancelledReservations,
    occupancyRate: totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0,
  };
}
