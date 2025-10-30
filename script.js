// script.js
// Interactive JavaScript for the assignment
// Each block below is commented and simple to follow.

// ---------- Utility & state ----------
const state = {
  counter: 0,
  dark: false
};

// small helper to find elements
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

// ---------- DOM elements ----------
const counterValue = $('#counterValue');
const incrementBtn = $('#incrementBtn');
const doubleBtn = $('#doubleBtn');
const stealBtn = $('#stealBtn');
const resetBtn = $('#resetBtn');
const counterMessage = $('#counterMessage');

const darkToggle = $('#darkToggle');

const tabButtons = $$('.tab-button');
const tabPanels = $$('.tab-panel');

const faqQuestions = $$('.faq-question');

const signupForm = $('#signupForm');
const nameInput = $('#name');
const emailInput = $('#email');
const passwordInput = $('#password');
const agreeCheckbox = $('#agree');

const nameError = $('#nameError');
const emailError = $('#emailError');
const passwordError = $('#passwordError');
const agreeError = $('#agreeError');
const formMessage = $('#formMessage');

// ---------- Part 1: Event Listeners (basic) ----------

// When the user clicks the increment button, add one point.
incrementBtn.addEventListener('click', () => {
  state.counter += 1;
  updateCounterUI('You got 1 point! 🎉');
});

// Double points button
doubleBtn.addEventListener('click', () => {
  state.counter = state.counter * 2 || 1; // if it was 0, make it 1
  updateCounterUI('Points doubled!');
});

// Steal 2 points (demonstrates negative adjustment and safety)
stealBtn.addEventListener('click', () => {
  state.counter -= 2;
  if (state.counter < 0) state.counter = 0; // never negative
  updateCounterUI('Oh no — 2 points lost!');
});

// Reset button in header
resetBtn.addEventListener('click', () => {
  state.counter = 0;
  updateCounterUI('Counter reset.');
});

// Accessibility: show messages in aria-live region
function updateCounterUI(message) {
  counterValue.textContent = state.counter;
  counterMessage.textContent = message;
}

// Initialize counter UI
updateCounterUI('Ready!');

// ---------- Part 2: Interactive Feature 1 - Dark Mode Toggle ----------
darkToggle.addEventListener('click', () => {
  state.dark = !state.dark;
  document.documentElement.classList.toggle('dark', state.dark);
  darkToggle.setAttribute('aria-pressed', String(state.dark));
  darkToggle.textContent = state.dark ? 'Light Mode' : 'Toggle Dark Mode';
});

// ---------- Part 2: Interactive Feature 2 - Tabs ----------
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;

    // remove active from others
    tabButtons.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(panel => panel.classList.add('hidden'));

    // activate chosen
    btn.classList.add('active');
    const targetPanel = document.getElementById(targetId);
    if (targetPanel) targetPanel.classList.remove('hidden');
  });
});

// ---------- Collapsible FAQ (another interactive feature) ----------
faqQuestions.forEach(q => {
  q.addEventListener('click', () => {
    const answer = q.nextElementSibling;
    if (!answer) return;
    answer.classList.toggle('hidden');
    // small animation cue via text
    q.setAttribute('aria-expanded', (!answer.classList.contains('hidden')).toString());
  });
});

// ---------- Part 3: Form Validation ----------
// We will validate: name (not empty), email (regex), password (length & pattern), agree checkbox (checked).
// We prevent the default submit and show errors in the page.

function showError(el, message) {
  el.textContent = message;
}

function clearErrors() {
  showError(nameError, '');
  showError(emailError, '');
  showError(passwordError, '');
  showError(agreeError, '');
  formMessage.textContent = '';
}

// simple email regex (not perfect but fine for demo)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// password rules: at least 8 chars, one letter, one number
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

function validateForm() {
  clearErrors();
  let valid = true;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const agreed = agreeCheckbox.checked;

  // Name
  if (name.length === 0) {
    showError(nameError, 'Name cannot be empty.');
    valid = false;
  } else if (name.length < 2) {
    showError(nameError, 'Name is too short.');
    valid = false;
  }

  // Email
  if (!emailRegex.test(email)) {
    showError(emailError, 'Please enter a valid email address.');
    valid = false;
  }

  // Password
  if (!passwordRegex.test(password)) {
    showError(passwordError, 'Password must be 8+ chars and include a number.');
    valid = false;
  }

  // Agree checkbox
  if (!agreed) {
    showError(agreeError, 'You must agree to the terms.');
    valid = false;
  }

  return valid;
}

// On submit: prevent page reload, validate, and give feedback
signupForm.addEventListener('submit', (e) => {
  e.preventDefault(); // important: stop the form from reloading page
  const ok = validateForm();
  if (ok) {
    formMessage.textContent = 'Form submitted successfully! ✅';
    // Example of clearing the form (simulate successful send)
    signupForm.reset();
    // optionally, reset errors after successful submit
    setTimeout(() => clearErrors(), 2000);
  } else {
    formMessage.textContent = 'Please fix errors and try again.';
  }
});

// Live validation as the user types (nice UX)
nameInput.addEventListener('input', () => {
  if (nameInput.value.trim().length >= 2) showError(nameError, '');
});
emailInput.addEventListener('input', () => {
  if (emailRegex.test(emailInput.value.trim())) showError(emailError, '');
});
passwordInput.addEventListener('input', () => {
  if (passwordRegex.test(passwordInput.value)) showError(passwordError, '');
});
agreeCheckbox.addEventListener('change', () => {
  if (agreeCheckbox.checked) showError(agreeError, '');
});

// ---------- Extra: keyboard shortcut example ----------
document.addEventListener('keydown', (ev) => {
  // Press "d" to toggle dark mode as a quick demo
  if (ev.key === 'd' || ev.key === 'D') {
    darkToggle.click();
  }
});

