const express = require('express');
const axios = require('axios');
const app = express();

const BASE_URL = 'https://ltl-clients-api-dev.delhivery.com/pincode-service';
const PROD_URL = 'https://ltl-clients-api.delhivery.com/pincode-service';
const USE_PROD = false; // change to true once ready for production

app.get('/pincode-check', async (req, res) => {
  const pincode = req.query.pincode;
  if (!pincode || pincode.length !== 6) {
    return res.status(400).json({ success: false, message: 'Enter a valid 6‑digit pincode' });
  }

  try {
    const url = `${USE_PROD ? PROD_URL : BASE_URL}/${pincode}?weight=1`;
    const apiRes = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
       Authorization: `${process.env.DELHIVERY_KEY}`
      }
    });

    const deliverable = apiRes.data.success && apiRes.data.delivery_codes?.length > 0;
    res.json({ deliverable, pincode });

  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).json({ success: false, message: 'API call failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server up on port ${PORT}`));
