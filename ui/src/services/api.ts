import axios from "axios";
import type { Address, Skip } from "../types";

const API = "http://localhost:3001/api";

export const lookupPostcode = (postcode: string) =>
  axios.post<{ postcode: string; addresses: Address[] }>(
    `${API}/postcode/lookup`,
    { postcode }
  );

export const getSkips = (postcode: string) =>
  axios.get<{ skips: Skip[] }>(
    `${API}/skips?postcode=${postcode}`
  );

export const confirmBooking = (data: any) =>
  axios.post(`${API}/booking/confirm`, data);