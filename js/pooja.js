/**
 * SHREE SIDDHIVINAYAK MAHALAKSHMI DHAM - POOJA & ARCHANA BOOKING ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {
  const poojaCards = document.querySelectorAll('.pooja-select-card');
  const poojaForm = document.getElementById('pooja-booking-form');
  const selectedPoojaInput = document.getElementById('selected-pooja-name');
  const selectedAmountInput = document.getElementById('selected-pooja-amount');
  const summaryPoojaEl = document.getElementById('booking-summary-pooja');
  const summaryFeeEl = document.getElementById('booking-summary-fee');
  const poojaPassModal = document.getElementById('pooja-pass-modal');

  let currentPooja = {
    name: "Maha Rudrabhishekam & Sankalpa",
    price: 2100
  };

  // Pooja Card selection
  poojaCards.forEach(card => {
    card.addEventListener('click', () => {
      poojaCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      const name = card.dataset.poojaName;
      const price = parseInt(card.dataset.poojaPrice, 10);

      currentPooja = { name, price };
      if (selectedPoojaInput) selectedPoojaInput.value = name;
      if (selectedAmountInput) selectedAmountInput.value = price;
      if (summaryPoojaEl) summaryPoojaEl.textContent = name;
      if (summaryFeeEl) summaryFeeEl.textContent = "₹" + price.toLocaleString('en-IN');
    });
  });

  // Handle Form Submission
  if (poojaForm) {
    poojaForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const devoteeName = document.getElementById('pooja-devotee-name').value.trim();
      const phone = document.getElementById('pooja-phone').value.trim();
      const email = document.getElementById('pooja-email').value.trim();
      const gotra = document.getElementById('pooja-gotra').value.trim() || 'Kashyapa';
      const date = document.getElementById('pooja-date').value;
      const timeSlot = document.getElementById('pooja-time-slot').value;
      const priest = document.getElementById('pooja-priest').value;
      const members = document.getElementById('pooja-members').value || 1;

      if (!devoteeName || !phone || !date) {
        alert("Please complete the required devotee information and date.");
        return;
      }

      const bookingData = {
        devoteeName,
        phone,
        email,
        gotra,
        date,
        time: timeSlot,
        priest,
        members,
        poojaName: currentPooja.name,
        amountPaid: currentPooja.price
      };

      // Save to centralized database
      const savedBooking = window.TempleDB.addBooking(bookingData);

      // Sound chime and flower celebration
      if (window.SoundEngine) window.SoundEngine.playTempleBell();
      if (window.flowerShower) window.flowerShower.burst(60);

      // Show Sacred Darshan & Pooja E-Pass
      showPoojaPass(savedBooking);
    });
  }

  function showPoojaPass(b) {
    const passContainer = document.getElementById('pooja-pass-content');
    if (!passContainer) return;

    passContainer.innerHTML = `
      <div style="background: #fff; border: 3px double #d4af37; border-radius: 16px; padding: 2rem; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.15);">
        <div style="text-align: center; border-bottom: 2px solid #ea580c; padding-bottom: 1rem; margin-bottom: 1.25rem;">
          <div style="font-size: 2rem;">🪔</div>
          <h2 style="font-family: 'Cinzel', serif; color: #4c0519; margin: 0.2rem 0;">DIVINE POOJA E-PASS</h2>
          <p style="color: #c2410c; font-weight: 700; font-size: 0.85rem; margin: 0;">SHREE SIDDHIVINAYAK MAHALAKSHMI DHAM</p>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; background: #fffbeb; border: 1px dashed #d4af37; padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 1.25rem;">
          <div>
            <div style="font-size: 0.75rem; color: #78716c; text-transform: uppercase;">Pass ID</div>
            <div style="font-family: 'Cinzel', serif; font-size: 1.2rem; font-weight: 800; color: #9a3412;">${b.id}</div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.75rem; color: #78716c; text-transform: uppercase;">Booking Status</div>
            <div style="color: #15803d; font-weight: 700; font-size: 0.95rem;">✓ CONFIRMED</div>
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem; margin-bottom: 1.25rem;">
          <tr>
            <td style="padding: 0.35rem 0; color: #78716c; width: 40%;">Devotee Name:</td>
            <td style="padding: 0.35rem 0; font-weight: 700; color: #1c1917;">${b.devoteeName}</td>
          </tr>
          <tr>
            <td style="padding: 0.35rem 0; color: #78716c;">Sacred Pooja:</td>
            <td style="padding: 0.35rem 0; font-weight: 700; color: #c2410c;">${b.poojaName}</td>
          </tr>
          <tr>
            <td style="padding: 0.35rem 0; color: #78716c;">Date & Time Slot:</td>
            <td style="padding: 0.35rem 0; font-weight: 600;">📅 ${b.date} at ⏰ ${b.time}</td>
          </tr>
          <tr>
            <td style="padding: 0.35rem 0; color: #78716c;">Presiding Priest:</td>
            <td style="padding: 0.35rem 0; font-weight: 600; color: #4c0519;">${b.priest}</td>
          </tr>
          <tr>
            <td style="padding: 0.35rem 0; color: #78716c;">Gotra / Family:</td>
            <td style="padding: 0.35rem 0;">${b.gotra} Gotra &bull; ${b.members} Persons</td>
          </tr>
          <tr>
            <td style="padding: 0.35rem 0; color: #78716c;">Dakshina Paid:</td>
            <td style="padding: 0.35rem 0; font-weight: 700; color: #b45309;">₹${b.amountPaid}</td>
          </tr>
        </table>

        <div style="background: #f8fafc; border-radius: 8px; padding: 0.75rem; text-align: center; font-size: 0.78rem; color: #64748b; margin-bottom: 1.25rem;">
          ⚠️ Please arrive at the temple Sanctum Sanctorum 15 minutes before the allotted slot. Traditional Vedic dress code is mandatory (Dhoti/Kurta for Men, Saree/Salwar for Women).
        </div>

        <div style="display: flex; justify-content: center; gap: 1rem;" class="no-print">
          <button class="btn btn-primary" onclick="window.print()">
            🖨️ Print Darshan Pass
          </button>
          <button class="btn btn-outline-gold" onclick="document.getElementById('pooja-pass-modal').classList.remove('open')">
            Close
          </button>
        </div>
      </div>
    `;

    if (poojaPassModal) poojaPassModal.classList.add('open');
  }
});
