import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  selector: 'app-order',
  template: `
  <a class="skip-link" href="#order-content">Skip to content</a>

  <header class="site-header">
    <div class="container nav-wrap">
      <a routerLink="/" class="brand" aria-label="Pulama Farm home">
        <span class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20c0-5 2.5-8.2 7-10-1 4.5-4 8-7 10Z"></path><path d="M12 20c0-4.7-2.3-7.8-7-10 .8 4.8 3.8 8.2 7 10Z"></path><path d="M12 20V7"></path></svg>
        </span>
        <span class="brand-text"><strong>Pulama Farm</strong><span>Mamaki tea from Kona</span></span>
      </a>
      <nav class="nav-links" aria-label="Primary navigation">
        <a routerLink="/">Home</a>
        <a routerLink="/" fragment="farm">Our Farm</a>
        <a routerLink="/" fragment="benefits">Benefits</a>
        <a routerLink="/" fragment="contact">Contact</a>
      </nav>
      <button class="theme-toggle" (click)="toggleTheme()" aria-label="Switch theme">
        {{ theme === 'dark' ? '🌙' : '☀️' }}
      </button>
    </div>
  </header>

  <main id="order-content">
  <div class="order-hero">
    <div class="container">
      <span class="kicker">Secure checkout</span>
      <h1>Order Mike's Hawaiian Māmaki Tea</h1>
      <p style="color:var(--color-text-muted);max-width:52rem;margin-top:.5rem">Select your quantity, fill in your shipping and payment details, and your order will be carefully packed and shipped from Kailua Kona, Hawaii.</p>
    </div>
  </div>

  <div class="container">
    <div class="checkout-layout">

      <!-- LEFT: Product + Form -->
      <div style="display:grid;gap:1.5rem">

        <!-- Product card -->
        <article class="card product-card" aria-label="Product selection">
          <div class="product-img-wrap">
            <img src="/pulama-farm/product.jpg" alt="Mike's Hawaiian Mamaki Caffeine Free Herbal Tea pouch" width="500" height="600" />
          </div>
          <div class="product-details">
            <span class="product-badge">Kona Grown · Caffeine Free</span>
            <h2 class="product-name">Mike's Hawaiian Māmaki Tea</h2>
            <p class="product-sub">Traditional herbal tea — grown & packaged on the Big Island.</p>
            <div class="price-row">
              <span class="price-unit">$15.00</span>
              <span class="price-label">per bag</span>
            </div>
            <div class="qty-row">
              <span class="qty-label">Quantity</span>
              <div class="qty-ctrl" role="group" aria-label="Quantity selector">
                <button class="qty-btn" id="qty-minus" aria-label="Decrease quantity">−</button>
                <input class="qty-input" id="qty" type="number" value="1" min="1" max="99" aria-label="Quantity" readonly />
                <button class="qty-btn" id="qty-plus" aria-label="Increase quantity">+</button>
              </div>
            </div>
            <div class="total-box">
              <span class="total-label">Order total</span>
              <span class="total-value" id="total-display">$15.00</span>
            </div>
            <div class="trust-micro">
              <span>Free shipping over 3 bags</span>
              <span>SSL secured checkout</span>
              <span>Satisfaction guarantee</span>
            </div>
          </div>
        </article>

        <!-- Checkout form -->
        <form class="checkout-form" id="checkout-form" novalidate>

          <!-- Shipping -->
          <section class="card form-section" aria-labelledby="ship-heading">
            <h3 class="form-section-title" id="ship-heading">Shipping Information</h3>
            <div class="field-row">
              <div class="field">
                <label for="first">First name *</label>
                <input type="text" id="first" name="first" autocomplete="given-name" required />
                <span class="field-error" id="error-first"></span>
              </div>
              <div class="field">
                <label for="last">Last name *</label>
                <input type="text" id="last" name="last" autocomplete="family-name" required />
                <span class="field-error" id="error-last"></span>
              </div>
            </div>
            <div class="field full">
              <label for="email">Email address *</label>
              <input type="email" id="email" name="email" autocomplete="email" required />
              <span class="field-error" id="error-email"></span>
            </div>
            <div class="field full">
              <label for="phone">Phone number *</label>
              <input type="tel" id="phone" name="phone" autocomplete="tel" required />
              <span class="field-error" id="error-phone"></span>
            </div>
            <div class="field full">
              <label for="address">Street address *</label>
              <input type="text" id="address" name="address" autocomplete="street-address" required />
              <span class="field-error" id="error-address"></span>
            </div>
            <div class="field full"><label for="address2">Apartment, suite, etc.</label><input type="text" id="address2" name="address2" autocomplete="address-line2" /></div>
            <div class="field-row">
              <div class="field">
                <label for="city">City *</label>
                <input type="text" id="city" name="city" autocomplete="address-level2" required />
                <span class="field-error" id="error-city"></span>
              </div>
              <div class="field">
                <label for="state">State *</label>
                <select id="state" name="state" autocomplete="address-level1" required>
                  <option value="">— Select —</option>
                  <option>AL</option><option>AK</option><option>AZ</option><option>AR</option><option>CA</option><option>CO</option><option>CT</option><option>DE</option><option>FL</option><option>GA</option><option>HI</option><option>ID</option><option>IL</option><option>IN</option><option>IA</option><option>KS</option><option>KY</option><option>LA</option><option>ME</option><option>MD</option><option>MA</option><option>MI</option><option>MN</option><option>MS</option><option>MO</option><option>MT</option><option>NE</option><option>NV</option><option>NH</option><option>NJ</option><option>NM</option><option>NY</option><option>NC</option><option>ND</option><option>OH</option><option>OK</option><option>OR</option><option>PA</option><option>RI</option><option>SC</option><option>SD</option><option>TN</option><option>TX</option><option>UT</option><option>VT</option><option>VA</option><option>WA</option><option>WV</option><option>WI</option><option>WY</option>
                </select>
                <span class="field-error" id="error-state"></span>
              </div>
            </div>
            <div class="field-row">
              <div class="field">
                <label for="zip">ZIP code *</label>
                <input type="text" id="zip" name="zip" autocomplete="postal-code" required />
                <span class="field-error" id="error-zip"></span>
              </div>
              <div class="field"><label for="country">Country</label><select id="country" name="country" autocomplete="country"><option>United States</option></select></div>
            </div>
          </section>

          <!-- Billing toggle -->
          <section class="card form-section" aria-labelledby="bill-heading">
            <h3 class="form-section-title" id="bill-heading">Billing Address</h3>
            <label style="display:flex;align-items:center;gap:.6rem;cursor:pointer;font-size:var(--text-sm);text-transform:none;letter-spacing:0;font-weight:400">
              <input type="checkbox" id="same-address" checked style="width:1.1rem;height:1.1rem;accent-color:var(--color-primary)" />
              Same as shipping address
            </label>
            <div id="billing-fields" style="display:none">
              <div class="field full"><label for="bill-address">Billing street address</label><input type="text" id="bill-address" name="bill-address" autocomplete="billing street-address" /></div>
              <div class="field-row">
                <div class="field"><label for="bill-city">City</label><input type="text" id="bill-city" name="bill-city" autocomplete="billing address-level2" /></div>
                <div class="field"><label for="bill-state">State</label><input type="text" id="bill-state" name="bill-state" autocomplete="billing address-level1" /></div>
              </div>
              <div class="field-row">
                <div class="field"><label for="bill-zip">ZIP</label><input type="text" id="bill-zip" name="bill-zip" autocomplete="billing postal-code" /></div>
              </div>
            </div>
          </section>

          <!-- Payment -->
          <section class="card form-section" aria-labelledby="pay-heading">
            <h3 class="form-section-title" id="pay-heading">Payment Information</h3>
            <div class="security-banner">
              <span>Your payment details are encrypted. Pulama Farm never stores your full card number.</span>
            </div>
            <div class="field full">
              <label for="cardholder">Name on card *</label>
              <input type="text" id="cardholder" name="cardholder" autocomplete="cc-name" required />
              <span class="field-error" id="error-cardholder"></span>
            </div>
            <div class="field full">
              <label for="cardnumber">Card number *</label>
              <div class="card-number-wrap">
                <input type="text" id="cardnumber" name="cardnumber" maxlength="19" autocomplete="cc-number" required inputmode="numeric" />
                <span class="card-brand" id="card-brand-label" aria-live="polite"></span>
              </div>
              <span class="field-error" id="error-cardnumber"></span>
            </div>
            <div class="field-row">
              <div class="field">
                <label for="expiry">Expiration *</label>
                <input type="text" id="expiry" name="expiry" maxlength="7" autocomplete="cc-exp" required inputmode="numeric" placeholder="MM / YY" />
                <span class="field-error" id="error-expiry"></span>
              </div>
              <div class="field">
                <label for="cvv">CVV *</label>
                <input type="text" id="cvv" name="cvv" maxlength="4" autocomplete="cc-csc" required inputmode="numeric" />
                <span class="field-error" id="error-cvv"></span>
              </div>
            </div>
          </section>

          <div class="field-error" id="error-form" style="text-align:center;margin-bottom:.5rem;font-size:var(--text-sm)"></div>

          <button type="submit" class="submit-btn" id="submit-btn">
            <span id="submit-label">Place order — <span id="submit-total">$15.00</span></span>
          </button>
          <p style="text-align:center;font-size:var(--text-xs);color:var(--color-text-faint);margin-top:.5rem">By placing your order you agree to our terms.</p>
        </form>
      </div>

      <!-- RIGHT: Sidebar -->
      <aside class="sidebar">
        <div class="card order-summary" aria-label="Order summary">
          <h3 class="summary-title">Order Summary</h3>
          <div style="display:flex;gap:.85rem;align-items:center;padding:.5rem 0;border-bottom:1px solid color-mix(in srgb,var(--color-text) 8%,transparent)">
            <img src="/pulama-farm/product.jpg" alt="Mike's Hawaiian Mamaki Tea" width="56" height="68" style="border-radius:.5rem;object-fit:cover;flex:none;background:#f0ead6" loading="lazy" />
            <div style="flex:1">
              <div style="font-size:var(--text-sm);font-weight:700">Mike's Hawaiian Māmaki Tea</div>
              <div style="font-size:var(--text-xs);color:var(--color-text-faint)">Qty: <span id="summary-qty">1</span></div>
            </div>
            <div style="font-size:var(--text-sm);font-weight:700;color:var(--color-primary)" id="summary-subtotal">$15.00</div>
          </div>
          <div class="summary-line"><span>Subtotal</span><span id="sidebar-subtotal">$15.00</span></div>
          <div class="summary-line" id="shipping-line"><span>Shipping</span><span id="sidebar-shipping">$5.00</span></div>
          <div class="summary-line total"><span>Total</span><span id="sidebar-total">$20.00</span></div>
          <p style="font-size:var(--text-xs);color:var(--color-text-faint)">Free shipping on orders of 3 or more bags. US shipping only.</p>
        </div>
      </aside>
    </div>
  </div>
  </main>

  <!-- Success modal -->
  <div class="success-modal" id="success-modal" role="dialog" aria-modal="true" aria-labelledby="success-title">
    <div class="success-box">
      <div class="success-icon">✓</div>
      <h2 id="success-title">Order received!</h2>
      <p style="color:var(--color-text-muted)">Thank you for ordering Mike's Hawaiian Māmaki Tea. Mike will review your order and reach out at the email you provided to confirm shipment details and payment processing.</p>
      <a routerLink="/" class="btn btn-green" style="width:100%;justify-content:center;margin-top:.5rem">Back to Pulama Farm</a>
    </div>
  </div>
  `,
  styles: [`
    .field-error {
      display: block;
      color: #d9534f;
      font-size: 0.78rem;
      margin-top: 0.25rem;
      min-height: 1rem;
    }
    input.invalid, select.invalid {
      border-color: #d9534f !important;
      outline-color: #d9534f !important;
    }
  `]
})
export class OrderComponent implements OnInit, AfterViewInit {
  theme: 'light' | 'dark' = 'light';

  ngOnInit(): void {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.theme = prefersDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', this.theme);
  }

  ngAfterViewInit(): void {
    const UNIT = 15, SHIP = 5, FREE_SHIP = 3;
    const qtyEl = document.getElementById('qty') as HTMLInputElement;
    const totalDisplay = document.getElementById('total-display')!;
    const submitTotal = document.getElementById('submit-total')!;
    const summaryQty = document.getElementById('summary-qty')!;
    const summarySubtotal = document.getElementById('summary-subtotal')!;
    const sidebarSubtotal = document.getElementById('sidebar-subtotal')!;
    const shippingLine = document.getElementById('shipping-line')!;
    const sidebarTotal = document.getElementById('sidebar-total')!;
    const qtyPlus = document.getElementById('qty-plus')!;
    const qtyMinus = document.getElementById('qty-minus')!;
    const sameAddr = document.getElementById('same-address') as HTMLInputElement;
    const billingFields = document.getElementById('billing-fields')!;
    const cardInput = document.getElementById('cardnumber') as HTMLInputElement;
    const brandLabel = document.getElementById('card-brand-label')!;
    const expInput = document.getElementById('expiry') as HTMLInputElement;
    const cvvInput = document.getElementById('cvv') as HTMLInputElement;
    const form = document.getElementById('checkout-form') as HTMLFormElement;
    const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
    const submitLabel = document.getElementById('submit-label') as HTMLElement;
    const successModal = document.getElementById('success-modal')!;

    const fmt = (n: number) => '$' + n.toFixed(2);

    function getGrand() {
      const q = Math.max(1, parseInt(qtyEl.value || '1') || 1);
      const sub = q * UNIT;
      const ship = q >= FREE_SHIP ? 0 : SHIP;
      return { q, sub, ship, grand: sub + ship };
    }

    function updateTotals() {
      const { q, sub, ship, grand } = getGrand();
      qtyEl.value = String(q);
      totalDisplay.textContent = fmt(sub);
      submitTotal.textContent = fmt(grand);
      summaryQty.textContent = String(q);
      summarySubtotal.textContent = fmt(sub);
      sidebarSubtotal.textContent = fmt(sub);
      shippingLine.querySelector('span:last-child')!.textContent = ship === 0 ? 'Free 🎉' : fmt(ship);
      sidebarTotal.textContent = fmt(grand);
    }

    qtyPlus.addEventListener('click', () => { qtyEl.value = String(Math.min(99, parseInt(qtyEl.value || '1') + 1)); updateTotals(); });
    qtyMinus.addEventListener('click', () => { qtyEl.value = String(Math.max(1, parseInt(qtyEl.value || '1') - 1)); updateTotals(); });
    qtyEl.addEventListener('change', updateTotals);
    updateTotals();

    sameAddr.addEventListener('change', () => { billingFields.style.display = sameAddr.checked ? 'none' : 'grid'; });
    billingFields.style.display = 'none';

    cardInput.addEventListener('input', () => {
      let v = cardInput.value.replace(/\D/g, '').substring(0, 16);
      cardInput.value = v.replace(/(.{4})/g, '$1 ').trim();
      const first = v.charAt(0);
      brandLabel.textContent = first === '4' ? 'VISA' : first === '5' ? 'MC' : first === '3' ? 'AMEX' : first === '6' ? 'DISC' : '';
    });

    expInput.addEventListener('input', () => {
      let v = expInput.value.replace(/\D/g, '');
      if (v.length > 2) v = v.substring(0, 2) + ' / ' + v.substring(2, 4);
      expInput.value = v;
    });

    cvvInput.addEventListener('input', function () { this.value = this.value.replace(/\D/g, ''); });

    // clear error on field input
    form.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('input', () => {
        el.classList.remove('invalid');
        const errEl = document.getElementById('error-' + (el as HTMLElement).id);
        if (errEl) errEl.textContent = '';
      });
    });

    function setError(fieldId: string, msg: string) {
      const field = document.getElementById(fieldId);
      const errEl = document.getElementById('error-' + fieldId);
      if (field) field.classList.add('invalid');
      if (errEl) errEl.textContent = msg;
    }

    function clearErrors() {
      form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
      form.querySelectorAll('.field-error').forEach(el => (el as HTMLElement).textContent = '');
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearErrors();

      const get = (id: string) => (document.getElementById(id) as HTMLInputElement | HTMLSelectElement);
      const val = (id: string) => get(id)?.value.trim() ?? '';

      let isValid = true;
      function require(id: string, label: string) {
        if (!val(id)) { setError(id, `${label} is required.`); isValid = false; }
      }

      require('first', 'First name');
      require('last', 'Last name');
      require('address', 'Street address');
      require('city', 'City');
      require('zip', 'ZIP code');

      // Email
      const emailVal = val('email');
      if (!emailVal) {
        setError('email', 'Email address is required.');
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        setError('email', 'Please enter a valid email address.');
        isValid = false;
      }

      // Phone
      const phoneDigits = val('phone').replace(/\D/g, '');
      if (!phoneDigits) {
        setError('phone', 'Phone number is required.');
        isValid = false;
      } else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
        setError('phone', 'Please enter a valid phone number (10–15 digits).');
        isValid = false;
      }

      // State
      if (!val('state')) { setError('state', 'Please select a state.'); isValid = false; }

      // Cardholder name
      require('cardholder', 'Name on card');

      // Card number — strip spaces for digit count check
      const cardDigits = val('cardnumber').replace(/\s/g, '');
      if (!cardDigits) {
        setError('cardnumber', 'Card number is required.');
        isValid = false;
      } else if (cardDigits.length < 13 || cardDigits.length > 19 || !/^\d+$/.test(cardDigits)) {
        setError('cardnumber', 'Please enter a valid card number.');
        isValid = false;
      }

      // Expiry
      const expiryVal = val('expiry');
      if (!expiryVal) {
        setError('expiry', 'Expiration date is required.');
        isValid = false;
      } else {
        const parts = expiryVal.replace(/\s/g, '').split('/');
        const mm = parseInt(parts[0], 10);
        const yy = parseInt(parts[1], 10);
        const now = new Date();
        const curYY = now.getFullYear() % 100;
        const curMM = now.getMonth() + 1;
        if (isNaN(mm) || isNaN(yy) || mm < 1 || mm > 12) {
          setError('expiry', 'Please enter a valid expiration date (MM / YY).');
          isValid = false;
        } else if (yy < curYY || (yy === curYY && mm < curMM)) {
          setError('expiry', 'Your card has expired.');
          isValid = false;
        }
      }

      // CVV
      const cvvVal = val('cvv');
      if (!cvvVal) {
        setError('cvv', 'CVV is required.');
        isValid = false;
      } else if (cvvVal.length < 3 || cvvVal.length > 4) {
        setError('cvv', 'CVV must be 3 or 4 digits.');
        isValid = false;
      }

      if (!isValid) {
        // scroll to first error
        const firstInvalid = form.querySelector('.invalid') as HTMLElement | null;
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      submitBtn.disabled = true;
      submitLabel.textContent = 'Processing…';

      const firstName = val('first');
      const lastName = val('last');
      const email = val('email');
      const phone = val('phone');
      const address1 = val('address');
      const city = val('city');
      const state = val('state');
      const zip = val('zip');

      const payload: any = {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        shipping_address_line1: address1,
        shipping_address_line2: val('address2'),
        city,
        state,
        zip_code: zip,
        country: val('country') || 'United States',
        special_instructions: '',
        items: [
          { product_name: "Mike's Hawaiian Māmaki Tea", quantity: getGrand().q, price: UNIT }
        ]
      };

      try {
        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json().catch(() => null);
        if (res.status === 201) {
          successModal.classList.add('show');
          form.reset();
          updateTotals();
        } else {
          console.error('Order API error', res.status, json);
          const formErr = document.getElementById('error-form')!;
          formErr.textContent = (json && json.message) || 'Failed to place order. Please try again.';
        }
      } catch (err) {
        console.error(err);
        const formErr = document.getElementById('error-form')!;
        formErr.textContent = 'Network error placing order. Please try again.';
      } finally {
        submitBtn.disabled = false;
        const { grand } = getGrand();
        submitLabel.innerHTML = `Place order — <span id="submit-total">${fmt(grand)}</span>`;
      }
    });

    successModal.addEventListener('click', function (e) { if (e.target === this) this.classList.remove('show'); });
  }
}