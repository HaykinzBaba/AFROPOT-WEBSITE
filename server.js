// ===================== AFROPOT BOOKING, REGISTRATION & LOGIN SERVER =====================

// 1️⃣ IMPORT DEPENDENCIES
const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
const nodemailer = require("nodemailer");

// 2️⃣ APP INITIALIZATION
const app = express();
app.use(cors());
app.use(express.json());

// 3️⃣ STRIPE SETUP (Replace with your own Secret Key)
const stripe = new Stripe(
  "sk_test_51SSozmAi0kLeGO9eQYXrinCURqC0UUrbp3nbShP0GzYkQBjVTyKe2Yji7MtTQukqrk5K40lXAZVTKICGFrelKIsC0052gwx0Im"
);

// 4️⃣ NODEMAILER SETUP (Use Gmail App Password)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "abdulrazaksaana855@gmail.com", // your Gmail
    pass: "YOUR_APP_PASSWORD", // ⚠️ replace with Gmail App Password (not normal password)
  },
});

// Temporary storage (since no database yet)
let registeredUsers = []; // [{ name, email, password }]

// 5️⃣ USER REGISTRATION (from register.html)
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Check if user already exists
    const existingUser = registeredUsers.find((user) => user.email === email);
    if (existingUser) {
      return res.json({ success: false, error: "User already registered." });
    }

    // Save user temporarily
    registeredUsers.push({ name, email, password });
    console.log(`📩 New Registration: ${name} (${email})`);

    // ✅ Send registration confirmation email
    const mailOptions = {
      from: "Afropot Registration <abdulrazaksaana855@gmail.com>",
      to: "abdulrazaksaana855@gmail.com",
      subject: `🧾 New Afropot Registration - ${name}`,
      text: `
      A new user has registered on Afropot.

      Name: ${name}
      Email: ${email}

      Please verify or follow up if needed.
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.error("❌ Email error:", err);
      else console.log("✅ Registration email sent:", info.response);
    });

    res.json({ success: true, message: "User registered successfully." });
  } catch (error) {
    console.error("❌ Registration Error:", error.message);
    res.status(500).json({ error: "Registration failed." });
  }
});

// 6️⃣ USER LOGIN (from login.html)
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    // Check user credentials
    const user = registeredUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      return res.json({ success: false, error: "Invalid email or password." });
    }

    console.log(`🔐 ${user.name} just logged in.`);

    res.json({
      success: true,
      message: "Login successful!",
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("❌ Login Error:", error.message);
    res.status(500).json({ error: "Login failed." });
  }
});

// 7️⃣ CATERING BOOKING (Stripe Payment Integration)
app.post("/create-booking-session", async (req, res) => {
  try {
    const { name, email, eventType, date, price } = req.body;

    if (!name || !email || !eventType || !date || !price) {
      return res.status(400).json({ error: "Missing booking details." });
    }

    // ✅ Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: `Catering: ${eventType}` },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://127.0.0.1:5500/success.html",
      cancel_url: "http://127.0.0.1:5500/catering.html",
      metadata: { name, email, eventType, date },
    });

    // ✅ Notify admin via email
    const mailOptions = {
      from: "Afropot Catering <abdulrazaksaana855@gmail.com>",
      to: "abdulrazaksaana855@gmail.com",
      subject: `🍽 New Catering Booking - ${eventType}`,
      text: `
      New catering booking received:

      Name: ${name}
      Email: ${email}
      Event: ${eventType}
      Date: ${date}
      Price: €${price}

      The customer is redirected to Stripe to complete payment.
      `,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) console.error("❌ Email error:", err);
      else console.log("✅ Booking email sent:", info.response);
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("❌ Stripe Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 8️⃣ ROOT TEST ROUTE
app.get("/", (req, res) => res.send("✅ Afropot Server is Running Successfully!"));

// 9️⃣ START SERVER
const PORT = 4242;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
