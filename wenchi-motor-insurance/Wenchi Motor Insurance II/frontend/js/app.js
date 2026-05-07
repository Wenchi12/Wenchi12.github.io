/* ============================================
   WENCHI MOTOR INSURANCE II - PROFESSIONAL JS
   ============================================ */

// configure this value after deployment (same as backend env PAYMENT_PUBLIC_KEY)
const PAYMENT_PUBLIC_KEY = 'pk_test_replace_with_live_key';
const API_BASE_URL = 'http://localhost:4000/api';
let currentStep = 1;
let formData = {
  fullName: '',
  email: '',
  phone: '',
  vehicleType: '',
  marketValue: 0,
  plateNumber: '',
  coverageType: 'Third Party',
  premium: 0
};

// --- authentication helpers ---
function getToken() {
  return localStorage.getItem('token');
}

function setToken(token) {
  if (token) localStorage.setItem('token', token);
}

function removeToken() {
  localStorage.removeItem('token');
}

async function loginUser(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Login failed');
  const data = await res.json();
  setToken(data.token);
}

async function signupUser(fullName, email, phone, password) {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, email, phone, password })
  });
  if (!res.ok) throw new Error('Signup failed');
  const data = await res.json();
  setToken(data.token);
}

function logoutUser() {
  removeToken();
  window.location.href = 'index.html';
}

function updateNav() {
  const token = getToken();
  const navMenu = document.querySelector('.nav-menu');
  if (!navMenu) return;
  // start fresh
  navMenu.innerHTML = '';
  // always include home
  navMenu.insertAdjacentHTML('beforeend', `<li><a href="index.html">Home</a></li>`);
  // on admin page keep back link
  if (window.location.pathname.endsWith('admin.html')) {
    navMenu.insertAdjacentHTML('beforeend', `<li><a href="index.html">Back to App</a></li>`);
  }
  if (token) {
    navMenu.insertAdjacentHTML('beforeend', `<li><a href="#" id="logoutLink">Logout</a></li>`);
    const logoutLink = document.getElementById('logoutLink');
    logoutLink.addEventListener('click', (e) => { e.preventDefault(); logoutUser(); });
  } else {
    navMenu.insertAdjacentHTML('beforeend', `<li><a href="login.html">Login</a></li>`);
    navMenu.insertAdjacentHTML('beforeend', `<li><a href="signup.html">Sign Up</a></li>`);
  }
}

// attach mobile nav toggle if button exists
function bindNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
    });
  }
}

// call these on document ready
document.addEventListener('DOMContentLoaded', () => {
  updateNav();
  bindNavToggle();
  bindAuthForms();
  bindQuoteForm();
});

// handle auth forms if present
function bindAuthForms() {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      try {
        await loginUser(email, password);
        showToast('Login successful');
        setTimeout(() => { window.location = 'index.html'; }, 1000);
      } catch (err) {
        console.error(err);
        showToast('Login failed');
      }
    });
  }
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fullName = document.getElementById('signupName').value.trim();
      const email = document.getElementById('signupEmail').value.trim();
      const phone = document.getElementById('signupPhone').value.trim();
      const password = document.getElementById('signupPassword').value;
      try {
        await signupUser(fullName, email, phone, password);
        showToast('Account created');
        setTimeout(() => { window.location = 'index.html'; }, 1000);
      } catch (err) {
        console.error(err);
        showToast('Signup failed');
      }
    });
  }
}


// Initialize
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('calculateBtn')?.addEventListener('click', calculatePremium);
  document.getElementById('saveQuoteBtn')?.addEventListener('click', saveQuote);
  document.getElementById('payBtn')?.addEventListener('click', initPayment);
  updateProgressIndicator();
  updateNav();
  bindAuthForms();
});

// Navigate to next step
function nextStep(fromStep) {
  // Validate current step
  if (!validateStep(fromStep)) {
    return;
  }

  // Save form data from current step
  saveFormData(fromStep);

  // Update step
  currentStep = fromStep + 1;
  updateProgressIndicator();
  showFormStep(currentStep);
  window.scrollTo({ top: document.querySelector('.quote-section').offsetTop, behavior: 'smooth' });
}

// Navigate to previous step
function prevStep(fromStep) {
  currentStep = fromStep - 1;
  updateProgressIndicator();
  showFormStep(currentStep);
  window.scrollTo({ top: document.querySelector('.quote-section').offsetTop, behavior: 'smooth' });
}

// Validate current step
function validateStep(step) {
  if (step === 1) {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();

    if (!fullName || !email || !phone) {
      showToast('Please fill in all required fields');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address');
      return false;
    }
    return true;
  } else if (step === 2) {
    const vehicleType = document.getElementById('vehicleType').value;
    const marketValue = document.getElementById('marketValue').value;

    if (!vehicleType || !marketValue) {
      showToast('Please select vehicle type and enter market value');
      return false;
    }
    if (isNaN(marketValue) || marketValue <= 0) {
      showToast('Market value must be a positive number');
      return false;
    }
    return true;
  }
  return true;
}

// Save form data from current step
function saveFormData(step) {
  if (step === 1) {
    formData.fullName = document.getElementById('fullName').value.trim();
    formData.email = document.getElementById('email').value.trim();
    formData.phone = document.getElementById('phone').value.trim();
  } else if (step === 2) {
    formData.vehicleType = document.getElementById('vehicleType').value;
    formData.marketValue = parseFloat(document.getElementById('marketValue').value);
    formData.plateNumber = document.getElementById('plateNumber').value.trim();
  }
}

// Show specific form step
function showFormStep(step) {
  document.querySelectorAll('.form-step').forEach(el => {
    el.classList.remove('active');
  });
  document.querySelector(`.form-step[data-step="${step}"]`).classList.add('active');
}

// Update progress indicator
function updateProgressIndicator() {
  document.querySelectorAll('.progress-step').forEach((step, index) => {
    if (index + 1 <= currentStep) {
      step.classList.add('active');
    } else {
      step.classList.remove('active');
    }
  });
}

// Calculate premium
async function calculatePremium() {
  // Get coverage type
  formData.coverageType = document.querySelector('input[name="coverage"]:checked').value;

  // Validate all data
  if (!formData.fullName || !formData.email || !formData.phone || 
      !formData.vehicleType || !formData.marketValue || !formData.coverageType) {
    showToast('Please complete all form fields');
    return;
  }

  try {
    // Show loading
    document.getElementById('calculateBtn').disabled = true;
    document.getElementById('calculateBtn').textContent = 'Calculating...';

    // Call API
    const response = await fetch(`${API_BASE_URL}/quotes/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        vehicleType: formData.vehicleType,
        marketValue: formData.marketValue,
        coverageType: formData.coverageType
      })
    });

    if (!response.ok) {
      throw new Error('Failed to calculate premium');
    }

    const result = await response.json();
    formData.premium = result.premium;

    // Display result
    displayResult(result);

  } catch (error) {
    console.error('Error:', error);
    showToast('Failed to calculate premium. Please try again.');
  } finally {
    document.getElementById('calculateBtn').disabled = false;
    document.getElementById('calculateBtn').textContent = 'Calculate Premium';
  }
}

// Display result
function displayResult(result) {
  // Hide form, show result
  document.querySelector('.form-wrapper').classList.add('hidden');
  document.getElementById('resultSection').classList.remove('hidden');

  // Populate result data
  document.getElementById('premiumAmount').textContent = result.premium.toLocaleString();
  document.getElementById('resVehicleType').textContent = formData.vehicleType;
  document.getElementById('resMarketValue').textContent = `ZMW ${formData.marketValue.toLocaleString()}`;
  document.getElementById('resCoverageType').textContent = formData.coverageType;

  // Populate calculation breakdown
  document.getElementById('baseRate').textContent = `${(result.details.baseRate * 100)}%`;
  
  // Calculate vehicle and coverage factors
  let vehicleFactor = 1;
  let coverageFactor = 1;

  if (formData.vehicleType === 'Truck') vehicleFactor += 0.3;
  if (formData.vehicleType === 'Motorcycle') vehicleFactor += 0.5;
  if (formData.coverageType === 'Comprehensive') coverageFactor += 0.5;
  if (formData.coverageType === 'Third Party Fire & Theft') coverageFactor += 0.25;

  document.getElementById('vehicleRisk').textContent = `${vehicleFactor.toFixed(2)}x`;
  document.getElementById('coverageFactor').textContent = `${coverageFactor.toFixed(2)}x`;

  // Scroll to result
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Save quote to database
async function saveQuote() {
  const token = getToken();
  if (!token) {
    showToast('Please login to save quote');
    setTimeout(() => { window.location = 'login.html'; }, 1200);
    return;
  }
  try {
    document.getElementById('saveQuoteBtn').disabled = true;
    document.getElementById('saveQuoteBtn').textContent = 'Saving...';

    const response = await fetch(`${API_BASE_URL}/quotes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        vehicleType: formData.vehicleType,
        marketValue: formData.marketValue,
        plateNumber: formData.plateNumber,
        coverageType: formData.coverageType,
        premium: formData.premium
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save quote');
    }

    const result = await response.json();
    formData.quoteId = result.quoteId;
    showToast('Quote saved successfully! Check your email.');
    document.getElementById('saveQuoteBtn').textContent = '✓ Quote Saved';
    // reveal payment button
    const payBtn = document.getElementById('payBtn');
    if (payBtn) payBtn.classList.remove('hidden');

  } catch (error) {
    console.error('Error:', error);
    showToast('Failed to save quote. Please try again.');
    document.getElementById('saveQuoteBtn').disabled = false;
    document.getElementById('saveQuoteBtn').textContent = 'Save Quote';
  }
}

// Initialize payment via gateway (Paystack example)
async function initPayment() {
  const token = getToken();
  if (!token) {
    showToast('Please login to proceed with payment');
    setTimeout(() => window.location = 'login.html', 1000);
    return;
  }
  try {
    const res = await fetch(`${API_BASE_URL}/payments/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        amount: formData.premium,
        email: formData.email,
        metadata: formData.quoteId ? { quoteId: formData.quoteId } : {}
      })
    });
    const data = await res.json();
    if (!data.status) throw new Error('payment init failed');
    const { authorization_url, reference } = data.data;
    // open Paystack inline
    if (window.PaystackPop) {
      const handler = PaystackPop.setup({
        key: PAYMENT_PUBLIC_KEY,
        email: formData.email,
        amount: Math.round(formData.premium * 100),
        currency: 'ZMW',
        ref: reference,
        callback: function(response) {
            showToast('Payment successful! Reference: ' + response.reference);
            // mark quote as paid on server if we saved it earlier
            if (formData.quoteId) {
              fetch(`${API_BASE_URL}/quotes/${formData.quoteId}/paid`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + getToken()
                },
                body: JSON.stringify({ reference: response.reference })
              }).catch(console.error);
            }
        },
        onClose: function() {
          showToast('Payment window closed');
        }
      });
      handler.openIframe();
    } else {
      // fallback redirect
      window.location.href = authorization_url;
    }
  } catch (err) {
    console.error(err);
    showToast('Payment initialization failed');
  }
}

// Reset and start new quote
function resetForm() {
  // Reset data
  formData = {
    fullName: '',
    email: '',
    phone: '',
    vehicleType: '',
    marketValue: 0,
    plateNumber: '',
    coverageType: 'Third Party',
    premium: 0
  };

  // Reset form
  document.getElementById('quoteForm').reset();
  document.getElementById('saveQuoteBtn').disabled = false;
  document.getElementById('saveQuoteBtn').textContent = 'Save Quote';

  // Show form, hide result
  document.querySelector('.form-wrapper').classList.remove('hidden');
  document.getElementById('resultSection').classList.add('hidden');

  // Reset step
  currentStep = 1;
  updateProgressIndicator();
  showFormStep(1);

  // Scroll to quote section
  document.getElementById('quote').scrollIntoView({ behavior: 'smooth' });
}

// Show toast notification
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Format numbers with thousand separators
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
