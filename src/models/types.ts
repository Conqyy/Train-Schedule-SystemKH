/* ===================================================================
   Models – Data structures for Train, User, and Reservation
   =================================================================== */

/** Represents a train in the schedule */
export interface Train {
  id: string;
  name: string;
  destination: string;
  origin: string;
  departureTime: string;
  arrivalTime: string;
  totalSeats: number;
  availableSeats: number;
  price: number;        // SAR
  status: "on-time" | "delayed" | "cancelled";
}

/** Represents a registered passenger / user */
export interface User {
  id: string;
  name: string;
  email: string;
}

/** Represents a ticket reservation */
export interface Reservation {
  id: string;
  trainId: string;
  passengerName: string;
  passengerEmail: string;
  seatNumber: number;
  bookingDate: string;   // ISO-8601
  status: "confirmed" | "cancelled";
}
