import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

// ---------------- TYPES ----------------
interface Address {
  id: string;
  line1: string;
  city: string;
}

interface Skip {
  size: string;
  price: number;
  disabled: boolean;
}

// ---------------- STEPS ----------------
const steps = ["Postcode", "Address", "Waste", "Skip", "Review"];

// ---------------- STEPPER ----------------
function Stepper({ current }: { current: number }) {
  return (
    <div className="flex justify-between mb-8">
      {steps.map((s, i) => (
        <div key={s} className="flex-1 text-center">
          <div
            className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center text-sm font-bold ${
              current >= i + 1
                ? "bg-indigo-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {i + 1}
          </div>
          <p className="text-xs mt-2 text-gray-600">{s}</p>
        </div>
      ))}
    </div>
  );
}

// ---------------- SKELETON ----------------
function Skeleton() {
  return (
    <div className="space-y-2 mt-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-4 bg-gray-200 animate-pulse rounded" />
      ))}
    </div>
  );
}

// ---------------- MAIN APP ----------------
export default function App() {
  const API = "https://qa-booking-flow-assessment-eskugqyvy-jiyanenms-projects.vercel.app/api";

  const [step, setStep] = useState(1);
  const [postcode, setPostcode] = useState("");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  const [wasteType, setWasteType] = useState("");
  const [plasterOption, setPlasterOption] = useState("");

  const [skips, setSkips] = useState<Skip[]>([]);
  const [selectedSkip, setSelectedSkip] = useState<Skip | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // ---------------- POSTCODE LOOKUP ----------------
  const lookupPostcode = async () => {
    if (!postcode) return setError("Enter postcode");

    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API}/postcode/lookup`, {
        postcode,
      });

      setAddresses(res.data.addresses);
      setStep(2);
    } catch {
      setError("Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- SKIPS ----------------
  const fetchSkips = async () => {
    if (wasteType === "plasterboard" && !plasterOption) {
      return setError("Select plaster option");
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `${API}/skips?postcode=${postcode.replace(/\s/g, "")}&heavyWaste=${
          wasteType === "heavy"
        }`
      );

      setSkips(res.data.skips);
      setStep(4);
    } catch {
      setError("Failed to load skips");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- BOOKING ----------------
  const confirmBooking = async () => {
    if (!selectedSkip) return;

    setLoading(true);
    setError("");

    try {
      await axios.post(`${API}/booking/confirm`, {
        postcode,
        addressId: selectedAddress,
        heavyWaste: wasteType === "heavy",
        plasterboard: wasteType === "plasterboard",
        skipSize: selectedSkip.size,
        price: selectedSkip.price,
      });

      setSuccess(true);
    } catch {
      setError("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">

        <h1 className="text-2xl font-bold">Skip Booking System</h1>
        <p className="text-gray-500 mb-6">
          Complete your booking in 5 steps
        </p>

        <Stepper current={step} />

        {error && (
          <div
            data-testid="error-message"
            className="bg-red-50 text-red-600 p-3 rounded mb-4"
          >
            {error}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <motion.div>
            <input
              data-testid="postcode-input"
              className="w-full border p-3 rounded-lg"
              placeholder="Enter postcode"
              value={postcode}
              onChange={(e) => setPostcode(e.target.value)}
            />

            <button
              data-testid="lookup-btn"
              onClick={lookupPostcode}
              className="mt-3 w-full bg-indigo-600 text-white py-3 rounded-lg"
            >
              Lookup
            </button>

            {loading && (
              <div data-testid="loading">
                <Skeleton />
              </div>
            )}
          </motion.div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <motion.div>
            {addresses.map((a) => (
              <button
                key={a.id}
                onClick={() => setSelectedAddress(a.id)}
                className="w-full border p-3 rounded mb-2"
              >
                {a.line1}
              </button>
            ))}

            <button
              onClick={() => setStep(3)}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg mt-3"
            >
              Continue
            </button>
          </motion.div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <motion.div>
            <div className="grid grid-cols-3 gap-2">
              {["general", "heavy", "plasterboard"].map((t) => (
                <button
                  key={t}
                  onClick={() => setWasteType(t)}
                  className="border p-3 rounded"
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={fetchSkips}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg mt-3"
            >
              Continue
            </button>
          </motion.div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <motion.div>
            {skips.map((s) => (
              <button
                key={s.size}
                disabled={s.disabled}
                onClick={() => setSelectedSkip(s)}
                className="w-full border p-3 rounded mb-2"
              >
                {s.size} - £{s.price}
              </button>
            ))}

            <button
              onClick={() => setStep(5)}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg mt-3"
            >
              Continue
            </button>
          </motion.div>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <motion.div>
            <p>Postcode: {postcode}</p>
            <p>Skip: {selectedSkip?.size}</p>

            {!success ? (
              <button
                onClick={confirmBooking}
                className="w-full bg-green-600 text-white py-3 rounded-lg mt-4"
              >
                Confirm Booking
              </button>
            ) : (
              <div className="bg-green-100 text-green-700 p-3 rounded-lg mt-4">
                Booking Confirmed!
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}