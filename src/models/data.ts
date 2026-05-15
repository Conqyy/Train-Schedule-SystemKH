/* ===================================================================
   Mock Data – Riyadh local transit routes
   محطة خالد (Khalid Station) is a primary hub
   =================================================================== */

import { Train, Reservation } from "./types";

/** Pre-populated train schedule (Riyadh Metro & Rail routes) */
export const defaultTrains: Train[] = [
  {
    id: "RYD-001",
    name: "خط المطار السريع",
    destination: "مطار الملك خالد الدولي",
    origin: "محطة خالد",
    departureTime: "05:30",
    arrivalTime: "06:00",
    totalSeats: 300,
    availableSeats: 300,
    price: 25,
    status: "on-time",
  },
  {
    id: "RYD-002",
    name: "خط العليا",
    destination: "العليا",
    origin: "محطة خالد",
    departureTime: "06:15",
    arrivalTime: "06:45",
    totalSeats: 250,
    availableSeats: 250,
    price: 15,
    status: "on-time",
  },
  {
    id: "RYD-003",
    name: "خط كافد المالي",
    destination: "مركز الملك عبدالله المالي",
    origin: "محطة خالد",
    departureTime: "07:00",
    arrivalTime: "07:25",
    totalSeats: 200,
    availableSeats: 200,
    price: 20,
    status: "on-time",
  },
  {
    id: "RYD-004",
    name: "خط الملز",
    destination: "محطة خالد",
    origin: "الملز",
    departureTime: "08:00",
    arrivalTime: "08:20",
    totalSeats: 180,
    availableSeats: 180,
    price: 10,
    status: "on-time",
  },
  {
    id: "RYD-005",
    name: "خط البطحاء",
    destination: "البطحاء",
    origin: "محطة خالد",
    departureTime: "09:30",
    arrivalTime: "10:00",
    totalSeats: 220,
    availableSeats: 220,
    price: 12,
    status: "delayed",
  },
  {
    id: "RYD-006",
    name: "خط الدرعية",
    destination: "الدرعية التاريخية",
    origin: "محطة خالد",
    departureTime: "10:00",
    arrivalTime: "10:35",
    totalSeats: 160,
    availableSeats: 160,
    price: 18,
    status: "on-time",
  },
  {
    id: "RYD-007",
    name: "خط جامعة الملك سعود",
    destination: "جامعة الملك سعود",
    origin: "محطة خالد",
    departureTime: "11:00",
    arrivalTime: "11:30",
    totalSeats: 200,
    availableSeats: 200,
    price: 10,
    status: "on-time",
  },
  {
    id: "RYD-008",
    name: "خط المطار الليلي",
    destination: "محطة خالد",
    origin: "مطار الملك خالد الدولي",
    departureTime: "22:00",
    arrivalTime: "22:30",
    totalSeats: 280,
    availableSeats: 280,
    price: 25,
    status: "on-time",
  },
];

/** Default reservations (empty at start) */
export const defaultReservations: Reservation[] = [];
