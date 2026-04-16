import cors from "cors";
import express from "express";

const app = express();

app.use(cors({
  origin: "https://qa-booking-flow-assessment.onrender.com",
  methods: ["GET", "POST"],
}));

app.use(express.json());

let retry = false;

app.post('/api/postcode/lookup', (req, res) => {
  const { postcode } = req.body;

  if (postcode === 'SW1A 1AA') {
    return res.json({
      postcode,
      addresses: Array.from({ length: 12 }).map((_, i) => ({
        id: `addr_${i}`,
        line1: `Address ${i}`,
        city: 'London'
      }))
    });
  }

  if (postcode === 'EC1A 1BB') {
    return res.json({ postcode, addresses: [] });
  }

  if (postcode === 'M1 1AE') {
    return setTimeout(() => {
      res.json({ postcode, addresses: [] });
    }, 3000);
  }

  if (postcode === 'BS1 4DJ') {
    if (!retry) {
      retry = true;
      return res.status(500).json({ error: 'Fail first time' });
    }
    return res.json({
      postcode,
      addresses: [{ id: '1', line1: 'Retry Success', city: 'Bristol' }]
    });
  }

  res.json({ postcode, addresses: [] });
});

app.get('/api/skips', (req, res) => {
  res.json({
    skips: [
      { size: '4-yard', price: 120, disabled: false },
      { size: '6-yard', price: 150, disabled: false },
      { size: '8-yard', price: 180, disabled: false },
      { size: '10-yard', price: 200, disabled: false },
      { size: '12-yard', price: 260, disabled: true },
      { size: '14-yard', price: 300, disabled: true },
      { size: '16-yard', price: 350, disabled: false },
      { size: '20-yard', price: 400, disabled: false }
    ]
  });
});

app.post('/api/booking/confirm', (req, res) => {
  res.json({ status: 'success', bookingId: 'BK-12345' });
});

app.listen(3001, () => console.log('API running on https://qa-booking-flow-assessment.onrender.com'));