/**
 * SHREE SIDDHIVINAYAK MAHALAKSHMI DHAM - DONATION & SEVA ENGINE
 * Handles Seva selection, dynamic UPI QR generation, 80G Receipt generation & live donor wall
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const presetButtons = document.querySelectorAll('.amount-preset-btn');
  const customAmountInput = document.getElementById('custom-donation-amount');
  const sevaCards = document.querySelectorAll('.seva-card');
  const donationForm = document.getElementById('temple-donation-form');
  const paymentModal = document.getElementById('payment-modal');
  const receiptModal = document.getElementById('receipt-modal');
  const qrImage = document.getElementById('upi-qr-image');
  const qrAmountDisplay = document.getElementById('qr-modal-amount');
  const donorWallContainer = document.getElementById('live-donor-wall');

  let selectedAmount = 2100;
  let selectedSeva = "Annadanam Seva (Maha Prasad)";
  let currentDonationData = null;

  // Preset Amount Selection
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedAmount = parseInt(btn.dataset.amount, 10);
      if (customAmountInput) customAmountInput.value = selectedAmount;
      updateSummary();
    });
  });

  // Custom Amount input
  if (customAmountInput) {
    customAmountInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      if (val > 0) {
        selectedAmount = val;
        presetButtons.forEach(b => {
          if (parseInt(b.dataset.amount, 10) === val) {
            b.classList.add('active');
          } else {
            b.classList.remove('active');
          }
        });
        updateSummary();
      }
    });
  }

  // Seva Card Selection
  sevaCards.forEach(card => {
    card.addEventListener('click', () => {
      sevaCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedSeva = card.dataset.sevaName || card.querySelector('h3').textContent;
      
      const suggestedAmount = card.dataset.suggestedAmount;
      if (suggestedAmount) {
        selectedAmount = parseInt(suggestedAmount, 10);
        if (customAmountInput) customAmountInput.value = selectedAmount;
        presetButtons.forEach(b => {
          b.classList.toggle('active', parseInt(b.dataset.amount, 10) === selectedAmount);
        });
      }
      updateSummary();
    });
  });

  function updateSummary() {
    const summarySeva = document.getElementById('summary-seva');
    const summaryAmount = document.getElementById('summary-amount');
    const summaryTotal = document.getElementById('summary-total');
    if (summarySeva) summarySeva.textContent = selectedSeva;
    if (summaryAmount) summaryAmount.textContent = "₹" + selectedAmount.toLocaleString('en-IN');
    if (summaryTotal) summaryTotal.textContent = "₹" + selectedAmount.toLocaleString('en-IN');
  }

  // Form Submission -> Opens UPI & Payment Gateway Simulation Modal
  if (donationForm) {
    donationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const donorName = document.getElementById('donor-name').value.trim();
      const phone = document.getElementById('donor-phone').value.trim();
      const email = document.getElementById('donor-email').value.trim();
      const pan = (document.getElementById('donor-pan').value || 'PAN_NOT_PROVIDED').toUpperCase().trim();
      const gotra = document.getElementById('donor-gotra').value.trim() || 'Kashyapa';
      const nakshatra = document.getElementById('donor-nakshatra').value || 'Not Specified';
      const sankalpa = document.getElementById('donor-sankalpa').value.trim() || 'Sarva Karya Siddhi & Family Well-being';
      const paymentMode = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'UPI / QR Code';

      if (!donorName || !phone) {
        alert("Please enter your sacred name and mobile number.");
        return;
      }

      currentDonationData = {
        donorName,
        phone,
        email,
        pan,
        gotra,
        nakshatra,
        sankalpa,
        amount: selectedAmount,
        sevaType: selectedSeva,
        paymentMode
      };

      openPaymentModal(currentDonationData);
    });
  }

  function openPaymentModal(data) {
    if (qrAmountDisplay) {
      qrAmountDisplay.textContent = "₹" + data.amount.toLocaleString('en-IN');
    }

    // Generate Dynamic UPI QR Code
    // UPI URL format: upi://pay?pa=siddhivinayak.trust@sbi&pn=ShreeSiddhivinayakDham&am=AMOUNT&cu=INR&tn=SevaDonation
    const upiString = `upi://pay?pa=temple.trust@sbi&pn=ShreeSiddhivinayakDham&am=${data.amount}&cu=INR&tn=Donation-${encodeURIComponent(data.sevaType.substring(0, 15))}`;
    if (qrImage) {
      qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}&color=881337`;
    }

    if (paymentModal) {
      paymentModal.classList.add('open');
      startCountdownTimer(300); // 5 minutes timer
    }
  }

  let timerInterval = null;
  function startCountdownTimer(seconds) {
    const timerDisplay = document.getElementById('payment-timer');
    if (!timerDisplay) return;

    clearInterval(timerInterval);
    let remaining = seconds;
    timerInterval = setInterval(() => {
      const mins = Math.floor(remaining / 60);
      const secs = remaining % 60;
      timerDisplay.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      remaining--;
      if (remaining < 0) {
        clearInterval(timerInterval);
        timerDisplay.textContent = "Expired";
      }
    }, 1000);
  }

  // Simulate Instant UPI / Card Confirmation
  const confirmPaymentBtn = document.getElementById('btn-confirm-payment');
  if (confirmPaymentBtn) {
    confirmPaymentBtn.addEventListener('click', () => {
      confirmPaymentBtn.disabled = true;
      confirmPaymentBtn.innerHTML = '🔄 Verifying with Bank / NPCI...';

      setTimeout(() => {
        clearInterval(timerInterval);
        if (paymentModal) paymentModal.classList.remove('open');
        confirmPaymentBtn.disabled = false;
        confirmPaymentBtn.innerHTML = '✅ Simulate Successful Payment';

        // Save to centralized database
        const savedDonation = window.TempleDB.addDonation(currentDonationData);

        // Sound chime & flower shower celebration
        if (window.SoundEngine) window.SoundEngine.playTempleBell();
        if (window.flowerShower) window.flowerShower.burst(100);

        // Show Official 80G Tax Exemption Receipt
        showReceipt(savedDonation);
        renderDonorWall();
      }, 1500);
    });
  }

  // Close modals
  document.querySelectorAll('.modal-close-btn, .btn-modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      if (paymentModal) paymentModal.classList.remove('open');
      if (receiptModal) receiptModal.classList.remove('open');
      clearInterval(timerInterval);
    });
  });

  // Render Official 80G Receipt
  function showReceipt(donation) {
    const receiptContainer = document.getElementById('receipt-container');
    if (!receiptContainer) return;

    const amountInWords = numberToEnglishWords(donation.amount);

    receiptContainer.innerHTML = `
      <div class="tax-receipt-printable" id="printable-area">
        <div class="receipt-watermark">80G EXEMPT</div>
        
        <div class="receipt-header">
          <div style="font-size: 2.2rem; color: #d4af37;">🕉️</div>
          <h2 style="font-family: 'Cinzel', serif; color: #4c0519; margin: 0.25rem 0;">SHREE SIDDHIVINAYAK MAHALAKSHMI DHAM TRUST</h2>
          <p style="font-size: 0.85rem; color: #57534e; margin: 0;">Regd. Under Mumbai Public Trusts Act, 1950 | Reg No. MH-MUM-TR-2024/9871A</p>
          <p style="font-size: 0.82rem; color: #c2410c; font-weight: 600;">80G Registration No: AAATS8942E/80G/2024-25/1102 (Tax Exemption Eligible)</p>
          <p style="font-size: 0.8rem; color: #78716c;">Siddhivinayak Marg, Prabhadevi, Mumbai 400028 | Tel: +91 (022) 2430-8911</p>
        </div>

        <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #d4af37; padding-bottom: 0.75rem; margin-bottom: 1rem; font-size: 0.9rem;">
          <div><strong>Receipt No:</strong> <span style="color: #c2410c; font-weight: 700;">${donation.receiptNo}</span></div>
          <div><strong>Date:</strong> ${donation.date}</div>
          <div><strong>Txn ID:</strong> ${donation.id}</div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: 0.92rem;">
          <tr>
            <td style="padding: 0.4rem 0; width: 35%; color: #57534e;">Received with thanks from:</td>
            <td style="padding: 0.4rem 0; font-weight: 700; color: #1c1917; font-size: 1.05rem;">${donation.donorName}</td>
          </tr>
          <tr>
            <td style="padding: 0.4rem 0; color: #57534e;">PAN Number:</td>
            <td style="padding: 0.4rem 0; font-weight: 600;">${donation.pan || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 0.4rem 0; color: #57534e;">Gotra & Nakshatra:</td>
            <td style="padding: 0.4rem 0;">${donation.gotra} Gotra | ${donation.nakshatra}</td>
          </tr>
          <tr>
            <td style="padding: 0.4rem 0; color: #57534e;">Purpose of Seva / Donation:</td>
            <td style="padding: 0.4rem 0; font-weight: 600; color: #c2410c;">${donation.sevaType}</td>
          </tr>
          <tr>
            <td style="padding: 0.4rem 0; color: #57534e;">Sankalpa / Intention:</td>
            <td style="padding: 0.4rem 0; font-style: italic;">"${donation.sankalpa}"</td>
          </tr>
          <tr>
            <td style="padding: 0.4rem 0; color: #57534e;">Payment Mode:</td>
            <td style="padding: 0.4rem 0;">${donation.paymentMode}</td>
          </tr>
          <tr style="border-top: 2px solid #b45309; border-bottom: 2px solid #b45309; background: #fffbeb;">
            <td style="padding: 0.75rem 0.5rem; font-weight: 700; font-size: 1.1rem; color: #4c0519;">Total Amount Paid:</td>
            <td style="padding: 0.75rem 0.5rem; font-weight: 800; font-size: 1.35rem; color: #c2410c; font-family: 'Cinzel', serif;">
              ₹${Number(donation.amount).toLocaleString('en-IN')}/-
              <div style="font-size: 0.8rem; font-family: 'Poppins', sans-serif; font-weight: 500; color: #57534e;">(${amountInWords} Rupees Only)</div>
            </td>
          </tr>
        </table>

        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 2rem; font-size: 0.85rem;">
          <div style="text-align: center;">
            <div style="border: 2px solid #b45309; border-radius: 50%; width: 75px; height: 75px; display: flex; align-items: center; justify-content: center; margin: 0 auto 0.25rem; color: #b45309; font-weight: 700; font-size: 0.65rem; text-align: center; text-transform: uppercase;">
              TEMPLE TRUST<br>SEAL
            </div>
            <span style="color: #78716c;">Official Seal</span>
          </div>
          <div style="text-align: center;">
            <div style="font-family: 'Cinzel Decorative', cursive; font-size: 1.2rem; color: #4c0519; margin-bottom: 0.25rem;">R. Shastri</div>
            <div style="border-top: 1px solid #78716c; padding-top: 0.25rem;">
              <strong>Authorized Signatory</strong><br>
              <span style="font-size: 0.75rem; color: #78716c;">Hon. Treasurer, Temple Board</span>
            </div>
          </div>
        </div>

        <div style="margin-top: 1.5rem; background: #fef2f2; border: 1px solid #fecdd3; border-radius: 6px; padding: 0.65rem; font-size: 0.75rem; color: #9f1239; text-align: center;">
          📜 <strong>Tax Benefit:</strong> Donations made to Shree Siddhivinayak Mahalakshmi Dham Trust are eligible for 50% deduction under Section 80G of the Income Tax Act, 1961.
        </div>
      </div>

      <div style="display: flex; justify-content: center; gap: 1rem; margin-top: 1.5rem;" class="no-print">
        <button class="btn btn-primary" onclick="window.print()">
          🖨️ Print / Save as PDF
        </button>
        <button class="btn btn-outline-gold btn-modal-close" onclick="document.getElementById('receipt-modal').classList.remove('open')">
          Close Window
        </button>
      </div>
    `;

    if (receiptModal) receiptModal.classList.add('open');
  }

  // Render Live Donor Wall
  function renderDonorWall() {
    if (!donorWallContainer || !window.TempleDB) return;
    const donations = window.TempleDB.getDonations().slice(0, 6);

    donorWallContainer.innerHTML = donations.map(d => `
      <div style="background: #fff; border: 1px solid var(--border-gold); border-radius: var(--radius-sm); padding: 1rem; display: flex; justify-content: space-between; align-items: center; box-shadow: var(--shadow-sm);">
        <div>
          <div style="font-weight: 700; color: var(--sacred-maroon);">${d.donorName}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${d.sevaType} &bull; Gotra: ${d.gotra || 'Kashyapa'}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-family: var(--font-display); font-weight: 700; color: var(--primary); font-size: 1.15rem;">₹${Number(d.amount).toLocaleString('en-IN')}</div>
          <div style="font-size: 0.72rem; color: #15803d; font-weight: 600;">✓ Blessed</div>
        </div>
      </div>
    `).join('');
  }

  renderDonorWall();

  // Helper: Number to Indian English words
  function numberToEnglishWords(num) {
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if (num === 0) return 'Zero';
    function convert(n) {
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
      if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + convert(n % 100) : '');
      if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convert(n % 1000) : '');
      if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + convert(n % 100000) : '');
      return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + convert(n % 10000000) : '');
    }
    return convert(num);
  }
});
