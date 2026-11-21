/**
 * SHREE SIDDHIVINAYAK MAHALAKSHMI DHAM - DATABASE & STORAGE ENGINE
 * Manages Donations, Pooja Bookings, Live Announcements, and Dev Settings
 */

const STORAGE_KEY = 'TEMPLE_DB_v2';

const DEFAULT_SEED_DATA = {
  announcement: "🙏 Jai Shree Ganesh! Daily Maha Aarti live at 7:00 AM & 7:30 PM. Special Maha Shivaratri & Navratri Darshan registration is now open.",
  templeInfo: {
    name: "Shree Siddhivinayak Mahalakshmi Dham",
    tagline: "Sacred Pilgrimage & Divine Sanctum",
    trustReg: "MH-MUM-TR-2024/9871A",
    tax80G: "AAATS8942E/80G/2024-25/1102",
    contactPhone: "+91 (022) 2430-8911 / +91 98200 12345",
    contactEmail: "trust@siddhivinayakdham.org",
    location: "Siddhivinayak Marg, Prabhadevi, Mumbai, Maharashtra 400028"
  },
  donations: [
    {
      id: "TRX-89211",
      donorName: "Rajeshwar Sharma",
      phone: "+91 98210 54321",
      email: "rajeshwar.sharma@example.com",
      pan: "ABCPS1234F",
      amount: 11000,
      sevaType: "Maha Annadanam Seva (100 Devotees)",
      gotra: "Kashyapa",
      nakshatra: "Rohini",
      date: "2026-11-16 19:45",
      paymentMode: "UPI / PhonePe",
      status: "Verified",
      receiptNo: "REC-2026-89211"
    },
    {
      id: "TRX-89210",
      donorName: "Sunita & Arvind Kulkarni",
      phone: "+91 98330 98765",
      email: "arvind.kulkarni@example.com",
      pan: "BZXPK9876D",
      amount: 5100,
      sevaType: "Goshala & Gau Seva (Monthly nutrition)",
      gotra: "Bharadwaj",
      nakshatra: "Pushya",
      date: "2026-11-16 16:30",
      paymentMode: "Net Banking (HDFC)",
      status: "Verified",
      receiptNo: "REC-2026-89210"
    },
    {
      id: "TRX-89209",
      donorName: "Ananya Deshmukh",
      phone: "+91 98199 44321",
      email: "ananya.d@example.com",
      pan: "DFGPD5678Q",
      amount: 2100,
      sevaType: "Nitya Akhand Deepa & Dhoop Seva",
      gotra: "Vashistha",
      nakshatra: "Ashwini",
      date: "2026-11-16 14:15",
      paymentMode: "Google Pay UPI",
      status: "Verified",
      receiptNo: "REC-2026-89209"
    },
    {
      id: "TRX-89208",
      donorName: "Vikramaditya Singhania",
      phone: "+91 99887 11223",
      email: "vikram.singh@example.com",
      pan: "AAFPS9988G",
      amount: 25000,
      sevaType: "Temple Gopuram & Kalash Renovation Fund",
      gotra: "Sandilya",
      nakshatra: "Uttara Phalguni",
      date: "2026-11-15 11:20",
      paymentMode: "Credit Card (ICICI)",
      status: "Verified",
      receiptNo: "REC-2026-89208"
    },
    {
      id: "TRX-89207",
      donorName: "Pooja & Manoj Agarwal",
      phone: "+91 97654 32109",
      email: "manoj.agarwal@example.com",
      pan: "BRYPA4433E",
      amount: 5001,
      sevaType: "Veda Pathashala & Vidya Daan",
      gotra: "Garg",
      nakshatra: "Swati",
      date: "2026-11-15 09:10",
      paymentMode: "Paytm UPI",
      status: "Verified",
      receiptNo: "REC-2026-89207"
    }
  ],
  bookings: [
    {
      id: "BK-4091",
      devoteeName: "Sanjay Mehta",
      poojaName: "Maha Rudrabhishekam & Sankalpa",
      date: "2026-11-20",
      time: "07:30 AM",
      priest: "Pt. Ramkrishna Shastri",
      gotra: "Gautama",
      members: 4,
      status: "Confirmed",
      amountPaid: 2100
    },
    {
      id: "BK-4092",
      devoteeName: "Meenakshi Iyer",
      poojaName: "Shree Suktam & Mahalakshmi Archana",
      date: "2026-11-22",
      time: "10:00 AM",
      priest: "Pt. Vidhyadhar Joshi",
      gotra: "Kashyapa",
      members: 2,
      status: "Confirmed",
      amountPaid: 1100
    },
    {
      id: "BK-4093",
      devoteeName: "Karthik Venkatesh",
      poojaName: "Sankatahara Ganapati Homa",
      date: "2026-11-25",
      time: "08:00 AM",
      priest: "Pt. Narayana Bhat",
      gotra: "Harita",
      members: 5,
      status: "Confirmed",
      amountPaid: 3500
    }
  ],
  users: [
    {
      id: "USR-1001",
      name: "Mayank Bhandari (Lead Developer)",
      email: "developer@siddhivinayakdham.org",
      phone: "9820012345",
      password: "admin",
      role: "Developer",
      dateRegistered: "2026-11-16 10:00"
    },
    {
      id: "USR-1002",
      name: "Smt. Pushpa Bhandari",
      email: "pushpabhandari6645@gmail.com",
      phone: "9811054321",
      password: "bhajan2026",
      role: "Trustee",
      dateRegistered: "2026-11-16 11:30"
    }
  ],
  systemLogs: [
    { timestamp: "2026-11-16 22:30:15", type: "INFO", message: "Temple web database initialised successfully." },
    { timestamp: "2026-11-16 22:31:02", type: "SYNC", message: "Active Darshan schedule synced with Panchang clock." },
    { timestamp: "2026-11-16 22:33:40", type: "AUTH", message: "Developer portal ready. Gate passkey enabled." }
  ]
};

class TempleDatabase {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (!parsed.users || parsed.users.length === 0) {
          parsed.users = DEFAULT_SEED_DATA.users;
        }
        return parsed;
      }
    } catch (e) {
      console.warn("Could not read local storage, loading default data", e);
    }
    this.saveData(DEFAULT_SEED_DATA);
    return JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));
  }

  saveData(data) {
    this.data = data || this.data;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      window.dispatchEvent(new CustomEvent('temple-db-changed', { detail: this.data }));
    } catch (e) {
      console.error("Storage error", e);
    }
  }

  getAnnouncement() {
    return this.data.announcement || DEFAULT_SEED_DATA.announcement;
  }

  setAnnouncement(text) {
    this.data.announcement = text;
    this.addLog("BROADCAST", `Updated live announcement banner: "${text.substring(0, 30)}..."`);
    this.saveData();
  }

  getDonations() {
    return this.data.donations || [];
  }

  // --- USER AUTHENTICATION & REGISTRATION ---
  getUsers() {
    return this.data.users || [];
  }

  registerUser({ name, email, phone, password, role = 'Devotee' }) {
    if (!this.data.users) this.data.users = [];

    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPhone = (phone || '').replace(/\D/g, '');

    // Check if user already exists
    const existing = this.data.users.find(u => 
      (cleanEmail && u.email.toLowerCase() === cleanEmail) ||
      (cleanPhone && u.phone.replace(/\D/g, '') === cleanPhone)
    );

    if (existing) {
      throw new Error("An account with this Email or Mobile Number is already registered! Please login.");
    }

    const newUser = {
      id: "USR-" + Math.floor(1000 + Math.random() * 9000),
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      password: password,
      role: role || 'Devotee',
      dateRegistered: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    this.data.users.push(newUser);
    this.addLog("AUTH", `New user registered: ${newUser.name} (${newUser.role})`);
    this.saveData();
    return newUser;
  }

  loginUser(identifier, password) {
    if (!this.data.users) this.data.users = [];

    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPhone = cleanId.replace(/\D/g, '');

    const user = this.data.users.find(u => 
      (u.email && u.email.toLowerCase() === cleanId) ||
      (u.phone && u.phone.replace(/\D/g, '') === cleanPhone) ||
      (u.name && u.name.toLowerCase() === cleanId)
    );

    if (!user) {
      throw new Error("No registered account found with these details. Please register first!");
    }

    if (user.password !== password) {
      throw new Error("Incorrect password. Please verify and try again.");
    }

    // Save active session
    const session = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      loginTime: new Date().toISOString()
    };

    localStorage.setItem('TEMPLE_AUTH_SESSION', JSON.stringify(session));
    this.addLog("AUTH", `User logged in: ${user.name} (${user.role})`);
    window.dispatchEvent(new CustomEvent('temple-auth-changed', { detail: session }));
    return session;
  }

  getCurrentUser() {
    try {
      const stored = localStorage.getItem('TEMPLE_AUTH_SESSION');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  }

  logoutUser() {
    const user = this.getCurrentUser();
    if (user) {
      this.addLog("AUTH", `User logged out: ${user.name}`);
    }
    localStorage.removeItem('TEMPLE_AUTH_SESSION');
    sessionStorage.removeItem('TEMPLE_DEV_AUTH');
    window.dispatchEvent(new CustomEvent('temple-auth-changed', { detail: null }));
  }

  addDonation(donation) {
    const newDonation = {
      id: "TRX-" + Math.floor(10000 + Math.random() * 90000),
      receiptNo: "REC-2026-" + Math.floor(10000 + Math.random() * 90000),
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: "Verified",
      ...donation
    };
    this.data.donations.unshift(newDonation);
    this.addLog("DONATION", `New donation of ₹${newDonation.amount} received from ${newDonation.donorName} (${newDonation.sevaType})`);
    this.saveData();
    return newDonation;
  }

  getDonationById(id) {
    return this.data.donations.find(d => d.id === id || d.receiptNo === id);
  }

  getBookings() {
    return this.data.bookings || [];
  }

  addBooking(booking) {
    const newBooking = {
      id: "BK-" + Math.floor(1000 + Math.random() * 9000),
      status: "Confirmed",
      dateCreated: new Date().toISOString().replace('T', ' ').substring(0, 16),
      ...booking
    };
    this.data.bookings.unshift(newBooking);
    this.addLog("BOOKING", `New Pooja booked by ${newBooking.devoteeName} for ${newBooking.poojaName}`);
    this.saveData();
    return newBooking;
  }

  addLog(type, message) {
    const time = new Date().toISOString().replace('T', ' ').substring(0, 19);
    this.data.systemLogs.unshift({ timestamp: time, type, message });
    if (this.data.systemLogs.length > 50) {
      this.data.systemLogs.pop();
    }
  }

  getLogs() {
    return this.data.systemLogs || [];
  }

  getStats() {
    const donations = this.getDonations();
    const totalDonations = donations.reduce((sum, d) => sum + Number(d.amount || 0), 0);
    const bookings = this.getBookings();
    
    // Group by seva type
    const sevaBreakdown = {};
    donations.forEach(d => {
      const type = d.sevaType || 'General Seva';
      sevaBreakdown[type] = (sevaBreakdown[type] || 0) + Number(d.amount || 0);
    });

    return {
      totalDonations,
      donorCount: donations.length,
      bookingCount: bookings.length,
      estimatedAartiVisitors: 4520,
      sevaBreakdown
    };
  }

  seedSampleData() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_SEED_DATA));
    this.addLog("SYSTEM", "Re-seeded default database records.");
    this.saveData();
  }

  resetAll() {
    this.data = {
      announcement: DEFAULT_SEED_DATA.announcement,
      templeInfo: DEFAULT_SEED_DATA.templeInfo,
      donations: [],
      bookings: [],
      systemLogs: [{ timestamp: new Date().toISOString(), type: "RESET", message: "Database wiped clean." }]
    };
    this.saveData();
  }

  exportCSV() {
    const donations = this.getDonations();
    const headers = ["Transaction ID", "Receipt No", "Date", "Donor Name", "Phone", "Email", "PAN", "Seva Type", "Amount (INR)", "Payment Mode", "Status"];
    const rows = donations.map(d => [
      d.id,
      d.receiptNo,
      `"${d.date}"`,
      `"${d.donorName}"`,
      `"${d.phone}"`,
      `"${d.email}"`,
      d.pan,
      `"${d.sevaType}"`,
      d.amount,
      `"${d.paymentMode}"`,
      d.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Temple_Donations_${new Date().toISOString().substring(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.data, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `Temple_Master_Backup_${new Date().toISOString().substring(0,10)}.json`);
    dlAnchorElem.click();
  }
}

// Global instance
window.TempleDB = new TempleDatabase();
