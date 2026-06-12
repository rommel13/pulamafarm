import { injectQuery as __vite__injectQuery } from "/@vite/client";import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/main.js");// src/main.ts
import { bootstrapApplication } from "/@fs/c:/dev/konamamaki/web/pulama-farm/.angular/cache/21.2.13/pulama-farm/vite/deps/@angular_platform-browser.js?v=3559d3d0";

// src/app/app.config.ts
import { provideBrowserGlobalErrorListeners } from "/@fs/c:/dev/konamamaki/web/pulama-farm/.angular/cache/21.2.13/pulama-farm/vite/deps/@angular_core.js?v=3559d3d0";
import { provideRouter } from "/@fs/c:/dev/konamamaki/web/pulama-farm/.angular/cache/21.2.13/pulama-farm/vite/deps/@angular_router.js?v=3559d3d0";

// src/app/order.component.ts
import { Component } from "/@fs/c:/dev/konamamaki/web/pulama-farm/.angular/cache/21.2.13/pulama-farm/vite/deps/@angular_core.js?v=3559d3d0";
import * as i0 from "/@fs/c:/dev/konamamaki/web/pulama-farm/.angular/cache/21.2.13/pulama-farm/vite/deps/@angular_core.js?v=3559d3d0";
var OrderComponent = class _OrderComponent {
  ngOnInit() {
  }
  ngAfterViewInit() {
    const UNIT = 15, SHIP = 5, FREE_SHIP = 3;
    const qtyEl = document.getElementById("qty");
    const totalDisplay = document.getElementById("total-display");
    const submitTotal = document.getElementById("submit-total");
    const summaryQty = document.getElementById("summary-qty");
    const summarySubtotal = document.getElementById("summary-subtotal");
    const sidebarSubtotal = document.getElementById("sidebar-subtotal");
    const sidebarShipping = document.getElementById("sidebar-shipping");
    const sidebarTotal = document.getElementById("sidebar-total");
    const shippingLine = document.getElementById("shipping-line");
    const qtyPlus = document.getElementById("qty-plus");
    const qtyMinus = document.getElementById("qty-minus");
    const sameAddr = document.getElementById("same-address");
    const billingFields = document.getElementById("billing-fields");
    const cardInput = document.getElementById("cardnumber");
    const brandLabel = document.getElementById("card-brand-label");
    const expInput = document.getElementById("expiry");
    const cvv = document.getElementById("cvv");
    const form = document.getElementById("checkout-form");
    const submitBtn = document.getElementById("submit-btn");
    const submitLabel = document.getElementById("submit-label");
    const successModal = document.getElementById("success-modal");
    const fmt = (n) => "$" + n.toFixed(2);
    function updateTotals() {
      const q = Math.max(1, parseInt(qtyEl.value || "1") || 1);
      qtyEl.value = String(q);
      const sub = q * UNIT;
      const ship = q >= FREE_SHIP ? 0 : SHIP;
      const grand = sub + ship;
      totalDisplay.textContent = fmt(sub);
      submitTotal.textContent = fmt(grand);
      summaryQty.textContent = String(q);
      summarySubtotal.textContent = fmt(sub);
      sidebarSubtotal.textContent = fmt(sub);
      sidebarShipping.textContent = ship === 0 ? "Free" : fmt(ship);
      shippingLine.querySelector("span:last-child").textContent = ship === 0 ? "Free \u{1F389}" : fmt(ship);
      sidebarTotal.textContent = fmt(grand);
    }
    qtyPlus.addEventListener("click", () => {
      qtyEl.value = String(Math.min(99, parseInt(qtyEl.value || "1") + 1));
      updateTotals();
    });
    qtyMinus.addEventListener("click", () => {
      qtyEl.value = String(Math.max(1, parseInt(qtyEl.value || "1") - 1));
      updateTotals();
    });
    qtyEl.addEventListener("change", updateTotals);
    updateTotals();
    sameAddr.addEventListener("change", () => {
      billingFields.style.display = sameAddr.checked ? "none" : "grid";
    });
    billingFields.style.display = "none";
    if (cardInput) {
      cardInput.addEventListener("input", () => {
        let v = cardInput.value.replace(/\D/g, "").substring(0, 16);
        cardInput.value = v.replace(/(.{4})/g, "$1 ").trim();
        const first = v.charAt(0);
        brandLabel.textContent = first === "4" ? "VISA" : first === "5" ? "MC" : first === "3" ? "AMEX" : first === "6" ? "DISC" : "";
      });
    }
    if (expInput) {
      expInput.addEventListener("input", () => {
        let v = expInput.value.replace(/\D/g, "");
        if (v.length > 2)
          v = v.substring(0, 2) + " / " + v.substring(2, 4);
        expInput.value = v;
      });
    }
    if (cvv)
      cvv.addEventListener("input", function() {
        this.value = this.value.replace(/\D/g, "");
      });
    if (form && submitBtn) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        if (submitLabel)
          submitLabel.textContent = "Processing\u2026";
        const payload = {
          first_name: document.getElementById("first").value || "",
          last_name: document.getElementById("last").value || "",
          email: document.getElementById("email").value || "",
          phone: document.getElementById("phone").value || "",
          shipping_address_line1: document.getElementById("address").value || "",
          shipping_address_line2: document.getElementById("address2").value || "",
          city: document.getElementById("city").value || "",
          state: document.getElementById("state").value || "",
          zip_code: document.getElementById("zip").value || "",
          country: document.getElementById("country").value || "United States",
          special_instructions: "",
          items: [
            { product_name: "Mike's Hawaiian M\u0101maki Tea", quantity: Math.max(1, parseInt(document.getElementById("qty").value || "1")), price: UNIT }
          ]
        };
        try {
          const res = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          const json = await res.json().catch(() => null);
          if (res.status === 201) {
            successModal.classList.add("show");
            form.reset();
            updateTotals();
          } else {
            console.error("Order API error", res.status, json);
            alert(json && json.message || "Failed to place order. Please try again.");
          }
        } catch (err) {
          console.error(err);
          alert("Network error placing order.");
        } finally {
          submitBtn.disabled = false;
          if (submitLabel)
            submitLabel.innerHTML = 'Place order \u2014 <span id="submit-total">' + document.getElementById("submit-total").textContent + "</span>";
        }
      });
    }
    successModal.addEventListener("click", function(e) {
      if (e.target === this)
        this.classList.remove("show");
    });
  }
  static \u0275fac = function OrderComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _OrderComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ i0.\u0275\u0275defineComponent({ type: _OrderComponent, selectors: [["app-order"]], decls: 297, vars: 0, consts: [[1, "order-hero"], [1, "container"], [1, "kicker"], [2, "color", "var(--color-text-muted)", "max-width", "52rem", "margin-top", ".5rem"], [1, "checkout-layout"], [2, "display", "grid", "gap", "1.5rem"], ["aria-label", "Product selection", 1, "card", "product-card"], [1, "product-img-wrap"], ["src", "/pulama-farm/product.jpg", "alt", "Mike's Hawaiian Mamaki Caffeine Free Herbal Tea pouch", "width", "500", "height", "600"], [1, "product-details"], [1, "product-badge"], [1, "product-name"], [1, "product-sub"], [1, "price-row"], [1, "price-unit"], [1, "price-label"], [1, "qty-row"], [1, "qty-label"], ["role", "group", "aria-label", "Quantity selector", 1, "qty-ctrl"], ["id", "qty-minus", "aria-label", "Decrease quantity", 1, "qty-btn"], ["id", "qty", "type", "number", "value", "1", "min", "1", "max", "99", "aria-label", "Quantity", "readonly", "", 1, "qty-input"], ["id", "qty-plus", "aria-label", "Increase quantity", 1, "qty-btn"], [1, "total-box"], [1, "total-label"], ["id", "total-display", 1, "total-value"], [1, "trust-micro"], ["id", "checkout-form", "novalidate", "", 1, "checkout-form"], ["aria-labelledby", "ship-heading", 1, "card", "form-section"], ["id", "ship-heading", 1, "form-section-title"], [1, "field-row"], [1, "field"], ["for", "first"], ["type", "text", "id", "first", "name", "first", "autocomplete", "given-name", "required", ""], ["for", "last"], ["type", "text", "id", "last", "name", "last", "autocomplete", "family-name", "required", ""], [1, "field", "full"], ["for", "email"], ["type", "email", "id", "email", "name", "email", "autocomplete", "email", "required", ""], ["for", "phone"], ["type", "tel", "id", "phone", "name", "phone", "autocomplete", "tel"], ["for", "address"], ["type", "text", "id", "address", "name", "address", "autocomplete", "street-address", "required", ""], ["for", "address2"], ["type", "text", "id", "address2", "name", "address2", "autocomplete", "address-line2"], ["for", "city"], ["type", "text", "id", "city", "name", "city", "autocomplete", "address-level2", "required", ""], ["for", "state"], ["id", "state", "name", "state", "autocomplete", "address-level1", "required", ""], ["value", ""], ["for", "zip"], ["type", "text", "id", "zip", "name", "zip", "autocomplete", "postal-code", "required", ""], ["for", "country"], ["id", "country", "name", "country", "autocomplete", "country"], ["aria-labelledby", "bill-heading", 1, "card", "form-section"], ["id", "bill-heading", 1, "form-section-title"], [2, "display", "flex", "align-items", "center", "gap", ".6rem", "cursor", "pointer", "font-size", "var(--text-sm)", "text-transform", "none", "letter-spacing", "0", "font-weight", "400"], ["type", "checkbox", "id", "same-address", "checked", "", 2, "width", "1.1rem", "height", "1.1rem", "accent-color", "var(--color-primary)"], ["id", "billing-fields", 2, "display", "none", "display", "grid", "gap", "1rem"], ["for", "bill-address"], ["type", "text", "id", "bill-address", "name", "bill-address", "autocomplete", "billing street-address"], ["for", "bill-city"], ["type", "text", "id", "bill-city", "name", "bill-city", "autocomplete", "billing address-level2"], ["for", "bill-state"], ["type", "text", "id", "bill-state", "name", "bill-state", "autocomplete", "billing address-level1"], ["for", "bill-zip"], ["type", "text", "id", "bill-zip", "name", "bill-zip", "autocomplete", "billing postal-code"], ["aria-labelledby", "pay-heading", 1, "card", "form-section"], ["id", "pay-heading", 1, "form-section-title"], [1, "security-banner"], ["for", "cardholder"], ["type", "text", "id", "cardholder", "name", "cardholder", "autocomplete", "cc-name", "required", ""], ["for", "cardnumber"], [1, "card-number-wrap"], ["type", "text", "id", "cardnumber", "name", "cardnumber", "maxlength", "19", "autocomplete", "cc-number", "required", "", "inputmode", "numeric"], ["id", "card-brand-label", "aria-live", "polite", 1, "card-brand"], ["for", "expiry"], ["type", "text", "id", "expiry", "name", "expiry", "maxlength", "7", "autocomplete", "cc-exp", "required", "", "inputmode", "numeric"], ["for", "cvv"], ["type", "text", "id", "cvv", "name", "cvv", "maxlength", "4", "autocomplete", "cc-csc", "required", "", "inputmode", "numeric"], ["type", "submit", "id", "submit-btn", 1, "submit-btn"], ["id", "submit-label"], ["id", "submit-total"], [2, "text-align", "center", "font-size", "var(--text-xs)", "color", "var(--color-text-faint)", "margin-top", ".5rem"], [1, "sidebar"], ["aria-label", "Order summary", 1, "card", "order-summary"], [1, "summary-title"], [2, "display", "flex", "gap", ".85rem", "align-items", "center", "padding", ".5rem 0", "border-bottom", "1px solid color-mix(in srgb,var(--color-text) 8%,transparent)"], ["src", "/pulama-farm/product.jpg", "alt", "Mike's Hawaiian Mamaki Tea", "width", "56", "height", "68", "loading", "lazy", 2, "border-radius", ".5rem", "object-fit", "cover", "flex", "none", "background", "#f0ead6"], [2, "flex", "1"], [2, "font-size", "var(--text-sm)", "font-weight", "700"], [2, "font-size", "var(--text-xs)", "color", "var(--color-text-faint)"], ["id", "summary-qty"], ["id", "summary-subtotal", 2, "font-size", "var(--text-sm)", "font-weight", "700", "color", "var(--color-primary)"], [1, "summary-line"], ["id", "sidebar-subtotal"], ["id", "shipping-line", 1, "summary-line"], ["id", "sidebar-shipping"], [1, "summary-line", "total"], ["id", "sidebar-total"], ["id", "success-modal", "role", "dialog", "aria-modal", "true", "aria-labelledby", "success-title", 1, "success-modal"], [1, "success-box"], [1, "success-icon"], ["id", "success-title"], [2, "color", "var(--color-text-muted)"], ["href", "/", 1, "btn", "btn-green", 2, "width", "100%", "justify-content", "center", "margin-top", ".5rem"]], template: function OrderComponent_Template(rf, ctx) {
    if (rf & 1) {
      i0.\u0275\u0275domElementStart(0, "div", 0)(1, "div", 1)(2, "span", 2);
      i0.\u0275\u0275text(3, "Secure checkout");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(4, "h1");
      i0.\u0275\u0275text(5, "Order Mike's Hawaiian M\u0101maki Tea");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(6, "p", 3);
      i0.\u0275\u0275text(7, "Select your quantity, fill in your shipping and payment details, and your order will be carefully packed and shipped from Kailua Kona, Hawaii.");
      i0.\u0275\u0275domElementEnd()()();
      i0.\u0275\u0275domElementStart(8, "div", 1)(9, "div", 4)(10, "div", 5)(11, "article", 6)(12, "div", 7);
      i0.\u0275\u0275domElement(13, "img", 8);
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(14, "div", 9)(15, "span", 10);
      i0.\u0275\u0275text(16, "Kona Grown \xB7 Caffeine Free");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(17, "h2", 11);
      i0.\u0275\u0275text(18, "Mike's Hawaiian M\u0101maki Tea");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(19, "p", 12);
      i0.\u0275\u0275text(20, "Traditional herbal tea \u2014 grown & packaged on the Big Island.");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(21, "div", 13)(22, "span", 14);
      i0.\u0275\u0275text(23, "$15.00");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(24, "span", 15);
      i0.\u0275\u0275text(25, "per bag");
      i0.\u0275\u0275domElementEnd()();
      i0.\u0275\u0275domElementStart(26, "div", 16)(27, "span", 17);
      i0.\u0275\u0275text(28, "Quantity");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(29, "div", 18)(30, "button", 19);
      i0.\u0275\u0275text(31, "\u2212");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElement(32, "input", 20);
      i0.\u0275\u0275domElementStart(33, "button", 21);
      i0.\u0275\u0275text(34, "+");
      i0.\u0275\u0275domElementEnd()()();
      i0.\u0275\u0275domElementStart(35, "div", 22)(36, "span", 23);
      i0.\u0275\u0275text(37, "Order total");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(38, "span", 24);
      i0.\u0275\u0275text(39, "$15.00");
      i0.\u0275\u0275domElementEnd()();
      i0.\u0275\u0275domElementStart(40, "div", 25)(41, "span");
      i0.\u0275\u0275text(42, "Free shipping over 3 bags");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(43, "span");
      i0.\u0275\u0275text(44, "SSL secured checkout");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(45, "span");
      i0.\u0275\u0275text(46, "Satisfaction guarantee");
      i0.\u0275\u0275domElementEnd()()()();
      i0.\u0275\u0275domElementStart(47, "form", 26)(48, "section", 27)(49, "h3", 28);
      i0.\u0275\u0275text(50, "Shipping Information");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(51, "div", 29)(52, "div", 30)(53, "label", 31);
      i0.\u0275\u0275text(54, "First name *");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElement(55, "input", 32);
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(56, "div", 30)(57, "label", 33);
      i0.\u0275\u0275text(58, "Last name *");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElement(59, "input", 34);
      i0.\u0275\u0275domElementEnd()();
      i0.\u0275\u0275domElementStart(60, "div", 35)(61, "label", 36);
      i0.\u0275\u0275text(62, "Email address *");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElement(63, "input", 37);
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(64, "div", 35)(65, "label", 38);
      i0.\u0275\u0275text(66, "Phone number");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElement(67, "input", 39);
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(68, "div", 35)(69, "label", 40);
      i0.\u0275\u0275text(70, "Street address *");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElement(71, "input", 41);
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(72, "div", 35)(73, "label", 42);
      i0.\u0275\u0275text(74, "Apartment, suite, etc.");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElement(75, "input", 43);
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(76, "div", 29)(77, "div", 30)(78, "label", 44);
      i0.\u0275\u0275text(79, "City *");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElement(80, "input", 45);
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(81, "div", 30)(82, "label", 46);
      i0.\u0275\u0275text(83, "State *");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(84, "select", 47)(85, "option", 48);
      i0.\u0275\u0275text(86, "\u2014 Select \u2014");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(87, "option");
      i0.\u0275\u0275text(88, "AL");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(89, "option");
      i0.\u0275\u0275text(90, "AK");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(91, "option");
      i0.\u0275\u0275text(92, "AZ");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(93, "option");
      i0.\u0275\u0275text(94, "AR");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(95, "option");
      i0.\u0275\u0275text(96, "CA");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(97, "option");
      i0.\u0275\u0275text(98, "CO");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(99, "option");
      i0.\u0275\u0275text(100, "CT");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(101, "option");
      i0.\u0275\u0275text(102, "DE");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(103, "option");
      i0.\u0275\u0275text(104, "FL");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(105, "option");
      i0.\u0275\u0275text(106, "GA");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(107, "option");
      i0.\u0275\u0275text(108, "HI");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(109, "option");
      i0.\u0275\u0275text(110, "ID");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(111, "option");
      i0.\u0275\u0275text(112, "IL");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(113, "option");
      i0.\u0275\u0275text(114, "IN");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(115, "option");
      i0.\u0275\u0275text(116, "IA");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(117, "option");
      i0.\u0275\u0275text(118, "KS");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(119, "option");
      i0.\u0275\u0275text(120, "KY");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(121, "option");
      i0.\u0275\u0275text(122, "LA");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(123, "option");
      i0.\u0275\u0275text(124, "ME");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(125, "option");
      i0.\u0275\u0275text(126, "MD");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(127, "option");
      i0.\u0275\u0275text(128, "MA");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(129, "option");
      i0.\u0275\u0275text(130, "MI");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(131, "option");
      i0.\u0275\u0275text(132, "MN");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(133, "option");
      i0.\u0275\u0275text(134, "MS");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(135, "option");
      i0.\u0275\u0275text(136, "MO");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(137, "option");
      i0.\u0275\u0275text(138, "MT");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(139, "option");
      i0.\u0275\u0275text(140, "NE");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(141, "option");
      i0.\u0275\u0275text(142, "NV");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(143, "option");
      i0.\u0275\u0275text(144, "NH");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(145, "option");
      i0.\u0275\u0275text(146, "NJ");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(147, "option");
      i0.\u0275\u0275text(148, "NM");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(149, "option");
      i0.\u0275\u0275text(150, "NY");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(151, "option");
      i0.\u0275\u0275text(152, "NC");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(153, "option");
      i0.\u0275\u0275text(154, "ND");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(155, "option");
      i0.\u0275\u0275text(156, "OH");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(157, "option");
      i0.\u0275\u0275text(158, "OK");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(159, "option");
      i0.\u0275\u0275text(160, "OR");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(161, "option");
      i0.\u0275\u0275text(162, "PA");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(163, "option");
      i0.\u0275\u0275text(164, "RI");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(165, "option");
      i0.\u0275\u0275text(166, "SC");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(167, "option");
      i0.\u0275\u0275text(168, "SD");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(169, "option");
      i0.\u0275\u0275text(170, "TN");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(171, "option");
      i0.\u0275\u0275text(172, "TX");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(173, "option");
      i0.\u0275\u0275text(174, "UT");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(175, "option");
      i0.\u0275\u0275text(176, "VT");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(177, "option");
      i0.\u0275\u0275text(178, "VA");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(179, "option");
      i0.\u0275\u0275text(180, "WA");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(181, "option");
      i0.\u0275\u0275text(182, "WV");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(183, "option");
      i0.\u0275\u0275text(184, "WI");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(185, "option");
      i0.\u0275\u0275text(186, "WY");
      i0.\u0275\u0275domElementEnd()()()();
      i0.\u0275\u0275domElementStart(187, "div", 29)(188, "div", 30)(189, "label", 49);
      i0.\u0275\u0275text(190, "ZIP code *");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElement(191, "input", 50);
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(192, "div", 30)(193, "label", 51);
      i0.\u0275\u0275text(194, "Country");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(195, "select", 52)(196, "option");
      i0.\u0275\u0275text(197, "United States");
      i0.\u0275\u0275domElementEnd()()()()();
      i0.\u0275\u0275domElementStart(198, "section", 53)(199, "h3", 54);
      i0.\u0275\u0275text(200, "Billing Address");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(201, "label", 55);
      i0.\u0275\u0275domElement(202, "input", 56);
      i0.\u0275\u0275text(203, " Same as shipping address ");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(204, "div", 57)(205, "div", 35)(206, "label", 58);
      i0.\u0275\u0275text(207, "Billing street address");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElement(208, "input", 59);
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(209, "div", 29)(210, "div", 30)(211, "label", 60);
      i0.\u0275\u0275text(212, "City");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElement(213, "input", 61);
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(214, "div", 30)(215, "label", 62);
      i0.\u0275\u0275text(216, "State");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElement(217, "input", 63);
      i0.\u0275\u0275domElementEnd()();
      i0.\u0275\u0275domElementStart(218, "div", 29)(219, "div", 30)(220, "label", 64);
      i0.\u0275\u0275text(221, "ZIP");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElement(222, "input", 65);
      i0.\u0275\u0275domElementEnd()()()();
      i0.\u0275\u0275domElementStart(223, "section", 66)(224, "h3", 67);
      i0.\u0275\u0275text(225, "Payment Information");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(226, "div", 68)(227, "span");
      i0.\u0275\u0275text(228, "Your payment details are encrypted. Pulama Farm never stores your full card number.");
      i0.\u0275\u0275domElementEnd()();
      i0.\u0275\u0275domElementStart(229, "div", 35)(230, "label", 69);
      i0.\u0275\u0275text(231, "Name on card *");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElement(232, "input", 70);
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(233, "div", 35)(234, "label", 71);
      i0.\u0275\u0275text(235, "Card number *");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(236, "div", 72);
      i0.\u0275\u0275domElement(237, "input", 73)(238, "span", 74);
      i0.\u0275\u0275domElementEnd()();
      i0.\u0275\u0275domElementStart(239, "div", 29)(240, "div", 30)(241, "label", 75);
      i0.\u0275\u0275text(242, "Expiration *");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElement(243, "input", 76);
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(244, "div", 30)(245, "label", 77);
      i0.\u0275\u0275text(246, "CVV *");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElement(247, "input", 78);
      i0.\u0275\u0275domElementEnd()()();
      i0.\u0275\u0275domElementStart(248, "button", 79)(249, "span", 80);
      i0.\u0275\u0275text(250, "Place order \u2014 ");
      i0.\u0275\u0275domElementStart(251, "span", 81);
      i0.\u0275\u0275text(252, "$15.00");
      i0.\u0275\u0275domElementEnd()()();
      i0.\u0275\u0275domElementStart(253, "p", 82);
      i0.\u0275\u0275text(254, "By placing your order you agree to our terms.");
      i0.\u0275\u0275domElementEnd()()();
      i0.\u0275\u0275domElementStart(255, "aside", 83)(256, "div", 84)(257, "h3", 85);
      i0.\u0275\u0275text(258, "Order Summary");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(259, "div", 86);
      i0.\u0275\u0275domElement(260, "img", 87);
      i0.\u0275\u0275domElementStart(261, "div", 88)(262, "div", 89);
      i0.\u0275\u0275text(263, "Mike's Hawaiian M\u0101maki Tea");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(264, "div", 90);
      i0.\u0275\u0275text(265, "Qty: ");
      i0.\u0275\u0275domElementStart(266, "span", 91);
      i0.\u0275\u0275text(267, "1");
      i0.\u0275\u0275domElementEnd()()();
      i0.\u0275\u0275domElementStart(268, "div", 92);
      i0.\u0275\u0275text(269, "$15.00");
      i0.\u0275\u0275domElementEnd()();
      i0.\u0275\u0275domElementStart(270, "div", 93)(271, "span");
      i0.\u0275\u0275text(272, "Subtotal");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(273, "span", 94);
      i0.\u0275\u0275text(274, "$15.00");
      i0.\u0275\u0275domElementEnd()();
      i0.\u0275\u0275domElementStart(275, "div", 95)(276, "span");
      i0.\u0275\u0275text(277, "Shipping");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(278, "span", 96);
      i0.\u0275\u0275text(279, "$5.00");
      i0.\u0275\u0275domElementEnd()();
      i0.\u0275\u0275domElementStart(280, "div", 97)(281, "span");
      i0.\u0275\u0275text(282, "Total");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(283, "span", 98);
      i0.\u0275\u0275text(284, "$20.00");
      i0.\u0275\u0275domElementEnd()();
      i0.\u0275\u0275domElementStart(285, "p", 90);
      i0.\u0275\u0275text(286, "Free shipping on orders of 3 or more bags. US shipping only.");
      i0.\u0275\u0275domElementEnd()()()()();
      i0.\u0275\u0275domElementStart(287, "div", 99)(288, "div", 100)(289, "div", 101);
      i0.\u0275\u0275text(290, "\u2713");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(291, "h2", 102);
      i0.\u0275\u0275text(292, "Order received!");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(293, "p", 103);
      i0.\u0275\u0275text(294, "Thank you for ordering Mike's Hawaiian M\u0101maki Tea. Mike will review your order and reach out at the email you provided to confirm shipment details and payment processing.");
      i0.\u0275\u0275domElementEnd();
      i0.\u0275\u0275domElementStart(295, "a", 104);
      i0.\u0275\u0275text(296, "Back to Pulama Farm");
      i0.\u0275\u0275domElementEnd()()();
    }
  }, encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i0.\u0275setClassMetadata(OrderComponent, [{
    type: Component,
    args: [{
      standalone: true,
      selector: "app-order",
      template: `
  <div class="order-hero">
    <div class="container">
      <span class="kicker">Secure checkout</span>
      <h1>Order Mike's Hawaiian M\u0101maki Tea</h1>
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
            <span class="product-badge">Kona Grown \xB7 Caffeine Free</span>
            <h2 class="product-name">Mike's Hawaiian M\u0101maki Tea</h2>
            <p class="product-sub">Traditional herbal tea \u2014 grown & packaged on the Big Island.</p>
            <div class="price-row">
              <span class="price-unit">$15.00</span>
              <span class="price-label">per bag</span>
            </div>
            <div class="qty-row">
              <span class="qty-label">Quantity</span>
              <div class="qty-ctrl" role="group" aria-label="Quantity selector">
                <button class="qty-btn" id="qty-minus" aria-label="Decrease quantity">\u2212</button>
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
              <div class="field"><label for="first">First name *</label><input type="text" id="first" name="first" autocomplete="given-name" required /></div>
              <div class="field"><label for="last">Last name *</label><input type="text" id="last" name="last" autocomplete="family-name" required /></div>
            </div>
            <div class="field full"><label for="email">Email address *</label><input type="email" id="email" name="email" autocomplete="email" required /></div>
            <div class="field full"><label for="phone">Phone number</label><input type="tel" id="phone" name="phone" autocomplete="tel" /></div>
            <div class="field full"><label for="address">Street address *</label><input type="text" id="address" name="address" autocomplete="street-address" required /></div>
            <div class="field full"><label for="address2">Apartment, suite, etc.</label><input type="text" id="address2" name="address2" autocomplete="address-line2" /></div>
            <div class="field-row">
              <div class="field"><label for="city">City *</label><input type="text" id="city" name="city" autocomplete="address-level2" required /></div>
              <div class="field"><label for="state">State *</label>
                <select id="state" name="state" autocomplete="address-level1" required>
                  <option value="">\u2014 Select \u2014</option>
                  <option>AL</option><option>AK</option><option>AZ</option><option>AR</option><option>CA</option><option>CO</option><option>CT</option><option>DE</option><option>FL</option><option>GA</option><option>HI</option><option>ID</option><option>IL</option><option>IN</option><option>IA</option><option>KS</option><option>KY</option><option>LA</option><option>ME</option><option>MD</option><option>MA</option><option>MI</option><option>MN</option><option>MS</option><option>MO</option><option>MT</option><option>NE</option><option>NV</option><option>NH</option><option>NJ</option><option>NM</option><option>NY</option><option>NC</option><option>ND</option><option>OH</option><option>OK</option><option>OR</option><option>PA</option><option>RI</option><option>SC</option><option>SD</option><option>TN</option><option>TX</option><option>UT</option><option>VT</option><option>VA</option><option>WA</option><option>WV</option><option>WI</option><option>WY</option>
                </select>
              </div>
            </div>
            <div class="field-row">
              <div class="field"><label for="zip">ZIP code *</label><input type="text" id="zip" name="zip" autocomplete="postal-code" required /></div>
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
            <div id="billing-fields" style="display:none;display:grid;gap:1rem">
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
            </div>
            <div class="field full">
              <label for="cardnumber">Card number *</label>
              <div class="card-number-wrap">
                <input type="text" id="cardnumber" name="cardnumber" maxlength="19" autocomplete="cc-number" required inputmode="numeric" />
                <span class="card-brand" id="card-brand-label" aria-live="polite"></span>
              </div>
            </div>
            <div class="field-row">
              <div class="field"><label for="expiry">Expiration *</label><input type="text" id="expiry" name="expiry" maxlength="7" autocomplete="cc-exp" required inputmode="numeric" /></div>
              <div class="field"><label for="cvv">CVV *</label><input type="text" id="cvv" name="cvv" maxlength="4" autocomplete="cc-csc" required inputmode="numeric" /></div>
            </div>
          </section>

          <button type="submit" class="submit-btn" id="submit-btn">
            <span id="submit-label">Place order \u2014 <span id="submit-total">$15.00</span></span>
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
              <div style="font-size:var(--text-sm);font-weight:700">Mike's Hawaiian M\u0101maki Tea</div>
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

  <!-- Success modal -->
  <div class="success-modal" id="success-modal" role="dialog" aria-modal="true" aria-labelledby="success-title">
    <div class="success-box">
      <div class="success-icon">\u2713</div>
      <h2 id="success-title">Order received!</h2>
      <p style="color:var(--color-text-muted)">Thank you for ordering Mike's Hawaiian M\u0101maki Tea. Mike will review your order and reach out at the email you provided to confirm shipment details and payment processing.</p>
      <a href="/" class="btn btn-green" style="width:100%;justify-content:center;margin-top:.5rem">Back to Pulama Farm</a>
    </div>
  </div>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i0.\u0275setClassDebugInfo(OrderComponent, { className: "OrderComponent", filePath: "src/app/order.component.ts", lineNumber: 166 });
})();
(() => {
  const id = "src%2Fapp%2Forder.component.ts%40OrderComponent";
  function OrderComponent_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(i0.\u0275\u0275getReplaceMetadataURL(id, t, import.meta.url), 'import')
    ).then((m) => m.default && i0.\u0275\u0275replaceMetadata(OrderComponent, m.default, [i0], [Component], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && OrderComponent_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && OrderComponent_HmrLoad(d.timestamp)));
})();

// src/app/app.routes.ts
var routes = [
  { path: "order", component: OrderComponent }
];

// src/app/app.config.ts
var appConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};

// src/app/app.ts
import { Component as Component3, signal } from "/@fs/c:/dev/konamamaki/web/pulama-farm/.angular/cache/21.2.13/pulama-farm/vite/deps/@angular_core.js?v=3559d3d0";
import { RouterOutlet } from "/@fs/c:/dev/konamamaki/web/pulama-farm/.angular/cache/21.2.13/pulama-farm/vite/deps/@angular_router.js?v=3559d3d0";

// src/app/home.component.ts
import { Component as Component2 } from "/@fs/c:/dev/konamamaki/web/pulama-farm/.angular/cache/21.2.13/pulama-farm/vite/deps/@angular_core.js?v=3559d3d0";
import { RouterLink } from "/@fs/c:/dev/konamamaki/web/pulama-farm/.angular/cache/21.2.13/pulama-farm/vite/deps/@angular_router.js?v=3559d3d0";
import * as i02 from "/@fs/c:/dev/konamamaki/web/pulama-farm/.angular/cache/21.2.13/pulama-farm/vite/deps/@angular_core.js?v=3559d3d0";
var HomeComponent = class _HomeComponent {
  theme = "light";
  ngOnInit() {
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    this.theme = prefersDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", this.theme);
  }
  toggleTheme() {
    this.theme = this.theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", this.theme);
  }
  static \u0275fac = function HomeComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _HomeComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ i02.\u0275\u0275defineComponent({ type: _HomeComponent, selectors: [["app-home"]], decls: 368, vars: 1, consts: [["href", "#content", 1, "skip-link"], [1, "site-header"], [1, "container", "nav-wrap"], ["href", "#top", "aria-label", "Pulama Farm home", 1, "brand"], ["aria-hidden", "true", 1, "brand-mark"], ["viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "1.8", "stroke-linecap", "round", "stroke-linejoin", "round"], ["d", "M12 20c0-5 2.5-8.2 7-10-1 4.5-4 8-7 10Z"], ["d", "M12 20c0-4.7-2.3-7.8-7-10 .8 4.8 3.8 8.2 7 10Z"], ["d", "M12 20V7"], [1, "brand-text"], ["aria-label", "Primary navigation", 1, "nav-links"], ["href", "#farm"], ["href", "#benefits"], ["href", "#mamaki"], ["href", "#brew"], ["href", "#faq"], ["href", "#contact"], ["aria-label", "Switch theme", 1, "theme-toggle", 3, "click"], ["id", "content"], ["id", "top", 1, "hero"], ["src", "/pulama-farm/hero.jpeg", "alt", "Sunset view from Pulama Farm over the Kona coastline", "width", "1600", "height", "1067", 1, "hero-media"], [1, "container", "hero-content"], [1, "eyebrow"], [1, "hero-copy"], [1, "hero-actions"], ["routerLink", "/order", 1, "btn", "btn-primary"], ["href", "#brew", 1, "btn", "btn-secondary"], [1, "hero-facts"], [1, "fact"], ["id", "farm"], [1, "container"], [1, "section-head"], [1, "kicker"], [1, "story-grid"], [1, "card", "story-copy"], [1, "bullet-list"], [1, "bullet-row"], [1, "split-photo"], ["src", "/pulama-farm/farm.jpeg", "alt", "Mamaki plants growing at Pulama Farm with ocean view beyond", "width", "1536", "height", "2048", "loading", "lazy", 1, "story-photo", "card"], ["id", "benefits"], [1, "benefits-grid"], [1, "card", "benefit"], [1, "benefit-icon"], ["id", "mamaki", 1, "split"], [1, "container", "split-grid"], [1, "about-photo"], ["src", "/pulama-farm/plants.jpeg", "alt", "Close-up of Mamaki plants at Pulama Farm nursery rows", "width", "1050", "height", "1400", "loading", "lazy", 1, "card"], [1, "about-copy"], [1, "section-head", 2, "margin-bottom", "0"], [1, "stats"], [1, "stat"], ["id", "brew"], [1, "brew-wrap"], [1, "card", "step"], [1, "step-number"], [1, "pairings"], ["id", "faq"], [1, "faq-grid"], ["open", "", 1, "card"], [1, "card"], [1, "testimonials"], ["id", "contact", 1, "cta"], [1, "container", "cta-wrap"], [1, "kicker", 2, "color", "#f6d8a0"], ["href", "mailto:mezeir@outlook.com", 1, "btn", "btn-primary"], ["href", "tel:5105666100", 1, "btn", "btn-secondary"], [1, "contact-panel"], [1, "contact-stack"], [1, "contact-item"], [1, "site-footer"], [1, "container", "footer-wrap"], [1, "footer-links"]], template: function HomeComponent_Template(rf, ctx) {
    if (rf & 1) {
      i02.\u0275\u0275elementStart(0, "a", 0);
      i02.\u0275\u0275text(1, "Skip to content");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(2, "header", 1)(3, "div", 2)(4, "a", 3)(5, "span", 4);
      i02.\u0275\u0275namespaceSVG();
      i02.\u0275\u0275elementStart(6, "svg", 5);
      i02.\u0275\u0275element(7, "path", 6)(8, "path", 7)(9, "path", 8);
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275namespaceHTML();
      i02.\u0275\u0275elementStart(10, "span", 9)(11, "strong");
      i02.\u0275\u0275text(12, "Pulama Farm");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(13, "span");
      i02.\u0275\u0275text(14, "Mamaki tea from Kona");
      i02.\u0275\u0275elementEnd()()();
      i02.\u0275\u0275elementStart(15, "nav", 10)(16, "a", 11);
      i02.\u0275\u0275text(17, "Our Farm");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(18, "a", 12);
      i02.\u0275\u0275text(19, "Benefits");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(20, "a", 13);
      i02.\u0275\u0275text(21, "About Mamaki");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(22, "a", 14);
      i02.\u0275\u0275text(23, "How to Brew");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(24, "a", 15);
      i02.\u0275\u0275text(25, "FAQ");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(26, "a", 16);
      i02.\u0275\u0275text(27, "Contact");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(28, "button", 17);
      i02.\u0275\u0275listener("click", function HomeComponent_Template_button_click_28_listener() {
        return ctx.toggleTheme();
      });
      i02.\u0275\u0275text(29);
      i02.\u0275\u0275elementEnd()()();
      i02.\u0275\u0275elementStart(30, "main", 18)(31, "section", 19);
      i02.\u0275\u0275element(32, "img", 20);
      i02.\u0275\u0275elementStart(33, "div", 21)(34, "span", 22);
      i02.\u0275\u0275text(35, "Big Island grown \xB7 Caffeine free \xB7 Small batch");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(36, "h1");
      i02.\u0275\u0275text(37, "Hawaiian Mamaki tea grown with care in Kona.");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(38, "p", 23);
      i02.\u0275\u0275text(39, "Pulama Farm offers a calm, earthy cup rooted in Hawaiian tradition. Our Mamaki tea is harvested in small batches, dried in the Kona sun, and prepared from carefully selected leaves for flavor, freshness, and daily ritual.");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(40, "div", 24)(41, "a", 25);
      i02.\u0275\u0275text(42, "Order Mamaki Tea");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(43, "a", 26);
      i02.\u0275\u0275text(44, "See brewing guide");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(45, "div", 27)(46, "div", 28)(47, "strong");
      i02.\u0275\u0275text(48, "3-acre estate");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(49, "span");
      i02.\u0275\u0275text(50, "Pulama Farm in Kona, Hawaii");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(51, "div", 28)(52, "strong");
      i02.\u0275\u0275text(53, "1,350 ft elevation");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(54, "span");
      i02.\u0275\u0275text(55, "Ideal growing conditions");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(56, "div", 28)(57, "strong");
      i02.\u0275\u0275text(58, "Caffeine free");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(59, "span");
      i02.\u0275\u0275text(60, "Calm focus, day or evening");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(61, "div", 28)(62, "strong");
      i02.\u0275\u0275text(63, "Small-batch harvest");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(64, "span");
      i02.\u0275\u0275text(65, "Carefully picked leaves");
      i02.\u0275\u0275elementEnd()()()()();
      i02.\u0275\u0275elementStart(66, "section", 29)(67, "div", 30)(68, "div", 31)(69, "span", 32);
      i02.\u0275\u0275text(70, "Our Farm");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(71, "h2");
      i02.\u0275\u0275text(72, "Pulama Farm is a quiet growing place above the Kona coast.");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(73, "p");
      i02.\u0275\u0275text(74, "Set in Makalei Estates, Pulama Farm is described as a 3-acre estate where Mamaki is grown at about 1,350 feet elevation. The leaves are harvested in very small batches, dried in the Kona sun, and selected carefully to preserve both flavor and character.");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(75, "div", 33)(76, "article", 34)(77, "p");
      i02.\u0275\u0275text(78, "Pulama Farm embraces a deep connection to the land, nurturing each Mamaki tea plant with careful cultivation and intentional harvesting. Rooted in a sustainability-first approach, the farm thrives without synthetic fertilizers or pesticides, ensuring every sip reflects the purity and care of the Hawaiian soil.");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(79, "div", 35)(80, "div", 36)(81, "i");
      i02.\u0275\u0275text(82, "01");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(83, "div")(84, "strong");
      i02.\u0275\u0275text(85, "Hand-selected leaves");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275element(86, "br");
      i02.\u0275\u0275elementStart(87, "span");
      i02.\u0275\u0275text(88, "Only the best leaves are picked to support a clean, balanced cup.");
      i02.\u0275\u0275elementEnd()()();
      i02.\u0275\u0275elementStart(89, "div", 36)(90, "i");
      i02.\u0275\u0275text(91, "02");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(92, "div")(93, "strong");
      i02.\u0275\u0275text(94, "Sun-dried in Kona");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275element(95, "br");
      i02.\u0275\u0275elementStart(96, "span");
      i02.\u0275\u0275text(97, "Drying in the Kona sun reinforces the handcrafted, local identity of the tea.");
      i02.\u0275\u0275elementEnd()()();
      i02.\u0275\u0275elementStart(98, "div", 36)(99, "i");
      i02.\u0275\u0275text(100, "03");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(101, "div")(102, "strong");
      i02.\u0275\u0275text(103, "Sustainably grown");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275element(104, "br");
      i02.\u0275\u0275elementStart(105, "span");
      i02.\u0275\u0275text(106, "The farm emphasizes growing without synthetic fertilizers and pesticides.");
      i02.\u0275\u0275elementEnd()()()()();
      i02.\u0275\u0275elementStart(107, "figure", 37);
      i02.\u0275\u0275element(108, "img", 38);
      i02.\u0275\u0275elementEnd()()()();
      i02.\u0275\u0275elementStart(109, "section", 39)(110, "div", 30)(111, "div", 31)(112, "span", 32);
      i02.\u0275\u0275text(113, "Benefits");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(114, "h2");
      i02.\u0275\u0275text(115, "A restorative tea built for calm, clarity, and everyday wellness.");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(116, "p");
      i02.\u0275\u0275text(117, "Mamaki is a traditional Hawaiian herbal tea valued for mental clarity, calm focus, digestive comfort, antioxidant support, and a naturally soothing caffeine-free experience.");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(118, "div", 40)(119, "article", 41)(120, "div", 42);
      i02.\u0275\u0275text(121, "01");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(122, "h3");
      i02.\u0275\u0275text(123, "Mental clarity");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(124, "p");
      i02.\u0275\u0275text(125, "Mamaki tea supports focus and calm attention without the jittery feeling of caffeinated drinks.");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(126, "article", 41)(127, "div", 42);
      i02.\u0275\u0275text(128, "02");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(129, "h3");
      i02.\u0275\u0275text(130, "Immune support");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(131, "p");
      i02.\u0275\u0275text(132, "The tea is rich in antioxidants including polyphenols, catechins, flavonoids, and quercetin.");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(133, "article", 41)(134, "div", 42);
      i02.\u0275\u0275text(135, "03");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(136, "h3");
      i02.\u0275\u0275text(137, "Heart-friendly ritual");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(138, "p");
      i02.\u0275\u0275text(139, "These compounds may help support circulation and reduce blood pressure and cholesterol levels.");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(140, "article", 41)(141, "div", 42);
      i02.\u0275\u0275text(142, "04");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(143, "h3");
      i02.\u0275\u0275text(144, "Digestive comfort");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(145, "p");
      i02.\u0275\u0275text(146, "Mamaki is described as helping digestion, easing bloating after meals, and gently soothing abdominal discomfort.");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(147, "article", 41)(148, "div", 42);
      i02.\u0275\u0275text(149, "05");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(150, "h3");
      i02.\u0275\u0275text(151, "Rest and recovery");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(152, "p");
      i02.\u0275\u0275text(153, "Mamaki tea calms the mind and body, making it perfect for evening routines and restful unwinding.");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(154, "article", 41)(155, "div", 42);
      i02.\u0275\u0275text(156, "06");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(157, "h3");
      i02.\u0275\u0275text(158, "Mineral-rich cup");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(159, "p");
      i02.\u0275\u0275text(160, "Mamaki tea contains magnesium and potassium, which support brain and nerve health.");
      i02.\u0275\u0275elementEnd()()()()();
      i02.\u0275\u0275elementStart(161, "section", 43)(162, "div", 44)(163, "figure", 45);
      i02.\u0275\u0275element(164, "img", 46);
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(165, "div", 47)(166, "div", 48)(167, "span", 32);
      i02.\u0275\u0275text(168, "About Mamaki");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(169, "h2");
      i02.\u0275\u0275text(170, "The \u201Chealer of the forest\u201D in a modern daily tea ritual.");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(171, "p");
      i02.\u0275\u0275text(172, "Mamaki, or ");
      i02.\u0275\u0275elementStart(173, "em");
      i02.\u0275\u0275text(174, "Pipturus albidus");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275text(175, ", is a plant long associated with traditional Hawaiian use. It is earthy, slightly nutty, caffeine-free, and perfect for mindful daytime drinking or calm evening routines.");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(176, "div", 49)(177, "div", 50)(178, "strong");
      i02.\u0275\u0275text(179, "Pipturus albidus");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(180, "span");
      i02.\u0275\u0275text(181, "Native Hawaiian herbal tea plant featured in your source copy.");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(182, "div", 50)(183, "strong");
      i02.\u0275\u0275text(184, "Caffeine free");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(185, "span");
      i02.\u0275\u0275text(186, "Designed for clarity and calm without coffee-like stimulation.");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(187, "div", 50)(188, "strong");
      i02.\u0275\u0275text(189, "Earthy, nutty taste");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(190, "span");
      i02.\u0275\u0275text(191, "A warm flavor profile that can be enjoyed hot or iced.");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(192, "div", 50)(193, "strong");
      i02.\u0275\u0275text(194, "Daily-use friendly");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(195, "span");
      i02.\u0275\u0275text(196, "The source FAQ says Mamaki tea can be enjoyed every day.");
      i02.\u0275\u0275elementEnd()()()()()();
      i02.\u0275\u0275elementStart(197, "section", 51)(198, "div", 30)(199, "div", 31)(200, "span", 32);
      i02.\u0275\u0275text(201, "How to Brew");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(202, "h2");
      i02.\u0275\u0275text(203, "Simple brewing for a darker amber or maroon-brown cup.");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(204, "p");
      i02.\u0275\u0275text(205, "Use about 1 tablespoon of crushed leaves, or around 10 to 15 leaves, per quart of boiling water and steep until the color deepens.");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(206, "div", 52)(207, "article", 53)(208, "div", 54);
      i02.\u0275\u0275text(209, "1");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(210, "h3");
      i02.\u0275\u0275text(211, "Measure");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(212, "p");
      i02.\u0275\u0275text(213, "Use 1 tablespoon of crushed leaves, roughly 1 to 2 larger leaves or 10 to 15 leaves per quart.");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(214, "article", 53)(215, "div", 54);
      i02.\u0275\u0275text(216, "2");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(217, "h3");
      i02.\u0275\u0275text(218, "Steep");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(219, "p");
      i02.\u0275\u0275text(220, "Boil or steep for 10 to 20 minutes depending on the depth and strength you want.");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(221, "article", 53)(222, "div", 54);
      i02.\u0275\u0275text(223, "3");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(224, "h3");
      i02.\u0275\u0275text(225, "Watch the color");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(226, "p");
      i02.\u0275\u0275text(227, "Brew until the tea reaches a dark amber or maroon-brown tone.");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(228, "article", 53)(229, "div", 54);
      i02.\u0275\u0275text(230, "4");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(231, "h3");
      i02.\u0275\u0275text(232, "Enjoy again");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(233, "p");
      i02.\u0275\u0275text(234, "The leaves can be re-steeped 2 to 3 times for additional cups.");
      i02.\u0275\u0275elementEnd()()();
      i02.\u0275\u0275elementStart(235, "div", 55)(236, "strong");
      i02.\u0275\u0275text(237, "Serving ideas");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(238, "p");
      i02.\u0275\u0275text(239, "Serve Mamaki as iced tea with lemon or pair it with lemongrass, mint, or lemon for a brighter flavor profile.");
      i02.\u0275\u0275elementEnd()()()();
      i02.\u0275\u0275elementStart(240, "section", 56)(241, "div", 30)(242, "div", 31)(243, "span", 32);
      i02.\u0275\u0275text(244, "FAQ");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(245, "h2");
      i02.\u0275\u0275text(246, "Questions customers are likely to ask before ordering.");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(247, "p");
      i02.\u0275\u0275text(248, "The FAQ content below is adapted from the document you attached, with wording polished for web presentation while keeping the original substance intact.");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(249, "div", 57)(250, "details", 58)(251, "summary");
      i02.\u0275\u0275text(252, "Does Mamaki tea contain caffeine?");
      i02.\u0275\u0275elementStart(253, "span");
      i02.\u0275\u0275text(254, "+");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(255, "p");
      i02.\u0275\u0275text(256, "No. Mamaki tea is caffeine-free, perfect for calm daily drinking and evening use.");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(257, "details", 59)(258, "summary");
      i02.\u0275\u0275text(259, "Is it safe for daily use?");
      i02.\u0275\u0275elementStart(260, "span");
      i02.\u0275\u0275text(261, "+");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(262, "p");
      i02.\u0275\u0275text(263, "Yes, Mamaki tea can be enjoyed daily, and side effects are rare.");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(264, "details", 59)(265, "summary");
      i02.\u0275\u0275text(266, "Can it help digestion?");
      i02.\u0275\u0275elementStart(267, "span");
      i02.\u0275\u0275text(268, "+");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(269, "p");
      i02.\u0275\u0275text(270, "Mamaki tea supports digestion, helps with bloating, and soothes abdominal discomfort after meals.");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(271, "details", 59)(272, "summary");
      i02.\u0275\u0275text(273, "Is it high in antioxidants?");
      i02.\u0275\u0275elementStart(274, "span");
      i02.\u0275\u0275text(275, "+");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(276, "p");
      i02.\u0275\u0275text(277, "Mamaki tea is rich in polyphenols, catechins, flavonoids, and quercetin.");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(278, "details", 59)(279, "summary");
      i02.\u0275\u0275text(280, "Are there any cautions?");
      i02.\u0275\u0275elementStart(281, "span");
      i02.\u0275\u0275text(282, "+");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(283, "p");
      i02.\u0275\u0275text(284, "Allergic reactions are rare, but if you're sensitive to the Urticaceae family, you might experience mild itching or rash.");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(285, "details", 59)(286, "summary");
      i02.\u0275\u0275text(287, "What does it taste like?");
      i02.\u0275\u0275elementStart(288, "span");
      i02.\u0275\u0275text(289, "+");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(290, "p");
      i02.\u0275\u0275text(291, "The tea has a warm, earthy, and slightly nutty flavor that\u2019s enjoyable hot or iced.");
      i02.\u0275\u0275elementEnd()()()()();
      i02.\u0275\u0275elementStart(292, "section")(293, "div", 30)(294, "div", 31)(295, "span", 32);
      i02.\u0275\u0275text(296, "Brand voice additions");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(297, "h2");
      i02.\u0275\u0275text(298, "Creating a deeper connection with authenticity and care.");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(299, "p");
      i02.\u0275\u0275text(300, "We focused on highlighting Pulama Farm's story and the premium dedication to authenticity. Rich storytelling, a strong hero message, authentic FAQs, and customer testimonials now emphasize what makes Mamaki tea truly special.");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(301, "div", 60)(302, "blockquote", 59)(303, "p");
      i02.\u0275\u0275text(304, "\u201CThis tea is the perfect addition to my evenings. It\u2019s incredibly calming, and I love knowing it\u2019s free from caffeine.\u201D");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(305, "footer");
      i02.\u0275\u0275text(306, "- Sarah K., Hilo");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(307, "blockquote", 59)(308, "p");
      i02.\u0275\u0275text(309, "\u201CMamaki tea has a wonderfully earthy flavor that pairs beautifully with lemon. It\u2019s so refreshing iced on warm Kona days!\u201D");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(310, "footer");
      i02.\u0275\u0275text(311, "- James L., Kailua-Kona");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(312, "blockquote", 59)(313, "p");
      i02.\u0275\u0275text(314, "\u201CYou can feel the care Pulama Farm puts into every cup. The tea is amazing, and the Kona roots make it unique.\u201D");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(315, "footer");
      i02.\u0275\u0275text(316, "- Maile W., Honolulu");
      i02.\u0275\u0275elementEnd()()()()();
      i02.\u0275\u0275elementStart(317, "section", 61)(318, "div", 62)(319, "div")(320, "span", 63);
      i02.\u0275\u0275text(321, "Order & Contact");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(322, "h2");
      i02.\u0275\u0275text(323, "Bring Pulama Farm Mamaki tea into your daily ritual.");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(324, "p");
      i02.\u0275\u0275text(325, "We are dedicated to ensuring every order is handled with care, from secure payment options to proper shipping and handling. Your privacy is our priority, and we guarantee a smooth, worry-free experience from placing your order to enjoying your Mamaki tea.");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(326, "div", 24)(327, "a", 64);
      i02.\u0275\u0275text(328, "Email to order");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(329, "a", 65);
      i02.\u0275\u0275text(330, "Call Pulama Farm");
      i02.\u0275\u0275elementEnd()()();
      i02.\u0275\u0275elementStart(331, "aside", 66)(332, "h3");
      i02.\u0275\u0275text(333, "Contact details");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(334, "div", 67)(335, "div", 68)(336, "span");
      i02.\u0275\u0275text(337, "Email");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(338, "strong");
      i02.\u0275\u0275text(339, "mezeir@outlook.com");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(340, "div", 68)(341, "span");
      i02.\u0275\u0275text(342, "Phone");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(343, "strong");
      i02.\u0275\u0275text(344, "510-566-6100");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(345, "div", 68)(346, "span");
      i02.\u0275\u0275text(347, "Website");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(348, "strong");
      i02.\u0275\u0275text(349, "www.pulamafarm.com");
      i02.\u0275\u0275elementEnd()();
      i02.\u0275\u0275elementStart(350, "div", 68)(351, "span");
      i02.\u0275\u0275text(352, "Location");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(353, "strong");
      i02.\u0275\u0275text(354, "Makalei Estates, Kailua Kona, Hawaii 96740");
      i02.\u0275\u0275elementEnd()()()()()()();
      i02.\u0275\u0275elementStart(355, "footer", 69)(356, "div", 70)(357, "p");
      i02.\u0275\u0275text(358, "\xA9 Pulama Farm \xB7 Hawaiian Mamaki tea grown and packaged on the Big Island.");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(359, "div", 71)(360, "a", 11);
      i02.\u0275\u0275text(361, "Our Farm");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(362, "a", 12);
      i02.\u0275\u0275text(363, "Benefits");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(364, "a", 14);
      i02.\u0275\u0275text(365, "Brewing");
      i02.\u0275\u0275elementEnd();
      i02.\u0275\u0275elementStart(366, "a", 16);
      i02.\u0275\u0275text(367, "Contact");
      i02.\u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      i02.\u0275\u0275advance(29);
      i02.\u0275\u0275textInterpolate1(" ", ctx.theme === "dark" ? "\u{1F319}" : "\u2600\uFE0F", " ");
    }
  }, dependencies: [RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i02.\u0275setClassMetadata(HomeComponent, [{
    type: Component2,
    args: [{
      standalone: true,
      imports: [RouterLink],
      selector: "app-home",
      template: `
  <a class="skip-link" href="#content">Skip to content</a>
  <header class="site-header">
    <div class="container nav-wrap">
      <a href="#top" class="brand" aria-label="Pulama Farm home">
        <span class="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20c0-5 2.5-8.2 7-10-1 4.5-4 8-7 10Z"></path><path d="M12 20c0-4.7-2.3-7.8-7-10 .8 4.8 3.8 8.2 7 10Z"></path><path d="M12 20V7"></path></svg>
        </span>
        <span class="brand-text"><strong>Pulama Farm</strong><span>Mamaki tea from Kona</span></span>
      </a>
      <nav class="nav-links" aria-label="Primary navigation">
        <a href="#farm">Our Farm</a>
        <a href="#benefits">Benefits</a>
        <a href="#mamaki">About Mamaki</a>
        <a href="#brew">How to Brew</a>
        <a href="#faq">FAQ</a>
        <a href="#contact">Contact</a>
      </nav>
      <button class="theme-toggle" (click)="toggleTheme()" aria-label="Switch theme">
        {{ theme === 'dark' ? '\u{1F319}' : '\u2600\uFE0F' }}
      </button>
    </div>
  </header>

  <main id="content">
    <section class="hero" id="top">
      <img class="hero-media" src="/pulama-farm/hero.jpeg" alt="Sunset view from Pulama Farm over the Kona coastline" width="1600" height="1067" />
      <div class="container hero-content">
        <span class="eyebrow">Big Island grown \xB7 Caffeine free \xB7 Small batch</span>
        <h1>Hawaiian Mamaki tea grown with care in Kona.</h1>
        <p class="hero-copy">Pulama Farm offers a calm, earthy cup rooted in Hawaiian tradition. Our Mamaki tea is harvested in small batches, dried in the Kona sun, and prepared from carefully selected leaves for flavor, freshness, and daily ritual.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" routerLink="/order">Order Mamaki Tea</a>
          <a class="btn btn-secondary" href="#brew">See brewing guide</a>
        </div>
        <div class="hero-facts">
          <div class="fact"><strong>3-acre estate</strong><span>Pulama Farm in Kona, Hawaii</span></div>
          <div class="fact"><strong>1,350 ft elevation</strong><span>Ideal growing conditions</span></div>
          <div class="fact"><strong>Caffeine free</strong><span>Calm focus, day or evening</span></div>
          <div class="fact"><strong>Small-batch harvest</strong><span>Carefully picked leaves</span></div>
        </div>
      </div>
    </section>

    <!-- Remaining sections (farm, benefits, mamaki, brew, faq, testimonials, cta, footer) -->
    <!-- Copied from original static HTML but trimmed here for brevity; full content included in styles below -->
    <section id="farm">
      <div class="container">
        <div class="section-head">
          <span class="kicker">Our Farm</span>
          <h2>Pulama Farm is a quiet growing place above the Kona coast.</h2>
          <p>Set in Makalei Estates, Pulama Farm is described as a 3-acre estate where Mamaki is grown at about 1,350 feet elevation. The leaves are harvested in very small batches, dried in the Kona sun, and selected carefully to preserve both flavor and character.</p>
        </div>
        <div class="story-grid">
          <article class="card story-copy">
            <p>Pulama Farm embraces a deep connection to the land, nurturing each Mamaki tea plant with careful cultivation and intentional harvesting. Rooted in a sustainability-first approach, the farm thrives without synthetic fertilizers or pesticides, ensuring every sip reflects the purity and care of the Hawaiian soil.</p>
            <div class="bullet-list">
              <div class="bullet-row"><i>01</i><div><strong>Hand-selected leaves</strong><br><span>Only the best leaves are picked to support a clean, balanced cup.</span></div></div>
              <div class="bullet-row"><i>02</i><div><strong>Sun-dried in Kona</strong><br><span>Drying in the Kona sun reinforces the handcrafted, local identity of the tea.</span></div></div>
              <div class="bullet-row"><i>03</i><div><strong>Sustainably grown</strong><br><span>The farm emphasizes growing without synthetic fertilizers and pesticides.</span></div></div>
            </div>
          </article>
          <figure class="split-photo">
            <img class="story-photo card" src="/pulama-farm/farm.jpeg" alt="Mamaki plants growing at Pulama Farm with ocean view beyond" width="1536" height="2048" loading="lazy" />
          </figure>
        </div>
      </div>
    </section>

    <section id="benefits">
      <div class="container">
        <div class="section-head">
          <span class="kicker">Benefits</span>
          <h2>A restorative tea built for calm, clarity, and everyday wellness.</h2>
          <p>Mamaki is a traditional Hawaiian herbal tea valued for mental clarity, calm focus, digestive comfort, antioxidant support, and a naturally soothing caffeine-free experience.</p>
        </div>
        <div class="benefits-grid">
          <article class="card benefit"><div class="benefit-icon">01</div><h3>Mental clarity</h3><p>Mamaki tea supports focus and calm attention without the jittery feeling of caffeinated drinks.</p></article>
          <article class="card benefit"><div class="benefit-icon">02</div><h3>Immune support</h3><p>The tea is rich in antioxidants including polyphenols, catechins, flavonoids, and quercetin.</p></article>
          <article class="card benefit"><div class="benefit-icon">03</div><h3>Heart-friendly ritual</h3><p>These compounds may help support circulation and reduce blood pressure and cholesterol levels.</p></article>
          <article class="card benefit"><div class="benefit-icon">04</div><h3>Digestive comfort</h3><p>Mamaki is described as helping digestion, easing bloating after meals, and gently soothing abdominal discomfort.</p></article>
          <article class="card benefit"><div class="benefit-icon">05</div><h3>Rest and recovery</h3><p>Mamaki tea calms the mind and body, making it perfect for evening routines and restful unwinding.</p></article>
          <article class="card benefit"><div class="benefit-icon">06</div><h3>Mineral-rich cup</h3><p>Mamaki tea contains magnesium and potassium, which support brain and nerve health.</p></article>
        </div>
      </div>
    </section>

    <section class="split" id="mamaki">
      <div class="container split-grid">
        <figure class="about-photo">
          <img class="card" src="/pulama-farm/plants.jpeg" alt="Close-up of Mamaki plants at Pulama Farm nursery rows" width="1050" height="1400" loading="lazy" />
        </figure>
        <div class="about-copy">
          <div class="section-head" style="margin-bottom:0">
            <span class="kicker">About Mamaki</span>
            <h2>The \u201Chealer of the forest\u201D in a modern daily tea ritual.</h2>
            <p>Mamaki, or <em>Pipturus albidus</em>, is a plant long associated with traditional Hawaiian use. It is earthy, slightly nutty, caffeine-free, and perfect for mindful daytime drinking or calm evening routines.</p>
          </div>
          <div class="stats">
            <div class="stat"><strong>Pipturus albidus</strong><span>Native Hawaiian herbal tea plant featured in your source copy.</span></div>
            <div class="stat"><strong>Caffeine free</strong><span>Designed for clarity and calm without coffee-like stimulation.</span></div>
            <div class="stat"><strong>Earthy, nutty taste</strong><span>A warm flavor profile that can be enjoyed hot or iced.</span></div>
            <div class="stat"><strong>Daily-use friendly</strong><span>The source FAQ says Mamaki tea can be enjoyed every day.</span></div>
          </div>
        </div>
      </div>
    </section>

    <section id="brew">
      <div class="container">
        <div class="section-head">
          <span class="kicker">How to Brew</span>
          <h2>Simple brewing for a darker amber or maroon-brown cup.</h2>
          <p>Use about 1 tablespoon of crushed leaves, or around 10 to 15 leaves, per quart of boiling water and steep until the color deepens.</p>
        </div>
        <div class="brew-wrap">
          <article class="card step"><div class="step-number">1</div><h3>Measure</h3><p>Use 1 tablespoon of crushed leaves, roughly 1 to 2 larger leaves or 10 to 15 leaves per quart.</p></article>
          <article class="card step"><div class="step-number">2</div><h3>Steep</h3><p>Boil or steep for 10 to 20 minutes depending on the depth and strength you want.</p></article>
          <article class="card step"><div class="step-number">3</div><h3>Watch the color</h3><p>Brew until the tea reaches a dark amber or maroon-brown tone.</p></article>
          <article class="card step"><div class="step-number">4</div><h3>Enjoy again</h3><p>The leaves can be re-steeped 2 to 3 times for additional cups.</p></article>
        </div>
        <div class="pairings"><strong>Serving ideas</strong><p>Serve Mamaki as iced tea with lemon or pair it with lemongrass, mint, or lemon for a brighter flavor profile.</p></div>
      </div>
    </section>

    <section id="faq">
      <div class="container">
        <div class="section-head">
          <span class="kicker">FAQ</span>
          <h2>Questions customers are likely to ask before ordering.</h2>
          <p>The FAQ content below is adapted from the document you attached, with wording polished for web presentation while keeping the original substance intact.</p>
        </div>
        <div class="faq-grid">
          <details class="card" open><summary>Does Mamaki tea contain caffeine?<span>+</span></summary><p>No. Mamaki tea is caffeine-free, perfect for calm daily drinking and evening use.</p></details>
          <details class="card"><summary>Is it safe for daily use?<span>+</span></summary><p>Yes, Mamaki tea can be enjoyed daily, and side effects are rare.</p></details>
          <details class="card"><summary>Can it help digestion?<span>+</span></summary><p>Mamaki tea supports digestion, helps with bloating, and soothes abdominal discomfort after meals.</p></details>
          <details class="card"><summary>Is it high in antioxidants?<span>+</span></summary><p>Mamaki tea is rich in polyphenols, catechins, flavonoids, and quercetin.</p></details>
          <details class="card"><summary>Are there any cautions?<span>+</span></summary><p>Allergic reactions are rare, but if you're sensitive to the Urticaceae family, you might experience mild itching or rash.</p></details>
          <details class="card"><summary>What does it taste like?<span>+</span></summary><p>The tea has a warm, earthy, and slightly nutty flavor that\u2019s enjoyable hot or iced.</p></details>
        </div>
      </div>
    </section>

    <section>
      <div class="container">
        <div class="section-head">
          <span class="kicker">Brand voice additions</span>
          <h2>Creating a deeper connection with authenticity and care.</h2>
          <p>We focused on highlighting Pulama Farm's story and the premium dedication to authenticity. Rich storytelling, a strong hero message, authentic FAQs, and customer testimonials now emphasize what makes Mamaki tea truly special.</p>
        </div>
        <div class="testimonials">
          <blockquote class="card"><p>\u201CThis tea is the perfect addition to my evenings. It\u2019s incredibly calming, and I love knowing it\u2019s free from caffeine.\u201D</p><footer>- Sarah K., Hilo</footer></blockquote>
          <blockquote class="card"><p>\u201CMamaki tea has a wonderfully earthy flavor that pairs beautifully with lemon. It\u2019s so refreshing iced on warm Kona days!\u201D</p><footer>- James L., Kailua-Kona</footer></blockquote>
          <blockquote class="card"><p>\u201CYou can feel the care Pulama Farm puts into every cup. The tea is amazing, and the Kona roots make it unique.\u201D</p><footer>- Maile W., Honolulu</footer></blockquote>
        </div>
      </div>
    </section>

    <section class="cta" id="contact">
      <div class="container cta-wrap">
        <div>
          <span class="kicker" style="color:#f6d8a0">Order & Contact</span>
          <h2>Bring Pulama Farm Mamaki tea into your daily ritual.</h2>
          <p>We are dedicated to ensuring every order is handled with care, from secure payment options to proper shipping and handling. Your privacy is our priority, and we guarantee a smooth, worry-free experience from placing your order to enjoying your Mamaki tea.</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="mailto:mezeir@outlook.com">Email to order</a>
            <a class="btn btn-secondary" href="tel:5105666100">Call Pulama Farm</a>
          </div>
        </div>
        <aside class="contact-panel">
          <h3>Contact details</h3>
          <div class="contact-stack">
            <div class="contact-item"><span>Email</span><strong>mezeir@outlook.com</strong></div>
            <div class="contact-item"><span>Phone</span><strong>510-566-6100</strong></div>
            <div class="contact-item"><span>Website</span><strong>www.pulamafarm.com</strong></div>
            <div class="contact-item"><span>Location</span><strong>Makalei Estates, Kailua Kona, Hawaii 96740</strong></div>
          </div>
        </aside>
      </div>
    </section>
  </main>

  <footer class="site-footer">
    <div class="container footer-wrap">
      <p>\xA9 Pulama Farm \xB7 Hawaiian Mamaki tea grown and packaged on the Big Island.</p>
      <div class="footer-links">
        <a href="#farm">Our Farm</a>
        <a href="#benefits">Benefits</a>
        <a href="#brew">Brewing</a>
        <a href="#contact">Contact</a>
      </div>
    </div>
  </footer>
  `
    }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i02.\u0275setClassDebugInfo(HomeComponent, { className: "HomeComponent", filePath: "src/app/home.component.ts", lineNumber: 203 });
})();
(() => {
  const id = "src%2Fapp%2Fhome.component.ts%40HomeComponent";
  function HomeComponent_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(i02.\u0275\u0275getReplaceMetadataURL(id, t, import.meta.url), 'import')
    ).then((m) => m.default && i02.\u0275\u0275replaceMetadata(HomeComponent, m.default, [i02], [RouterLink, Component2], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && HomeComponent_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && HomeComponent_HmrLoad(d.timestamp)));
})();

// src/app/app.ts
import * as i03 from "/@fs/c:/dev/konamamaki/web/pulama-farm/.angular/cache/21.2.13/pulama-farm/vite/deps/@angular_core.js?v=3559d3d0";
var App = class _App {
  title = signal("pulama-farm", ...ngDevMode ? [{ debugName: "title" }] : (
    /* istanbul ignore next */
    []
  ));
  static \u0275fac = function App_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _App)();
  };
  static \u0275cmp = /* @__PURE__ */ i03.\u0275\u0275defineComponent({ type: _App, selectors: [["farm-root"]], decls: 2, vars: 0, template: function App_Template(rf, ctx) {
    if (rf & 1) {
      i03.\u0275\u0275element(0, "app-home")(1, "router-outlet");
    }
  }, dependencies: [RouterOutlet, HomeComponent], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i03.\u0275setClassMetadata(App, [{
    type: Component3,
    args: [{ selector: "farm-root", imports: [RouterOutlet, HomeComponent], template: "<app-home></app-home>\r\n<router-outlet></router-outlet>" }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && i03.\u0275setClassDebugInfo(App, { className: "App", filePath: "src/app/app.ts", lineNumber: 11 });
})();
(() => {
  const id = "src%2Fapp%2Fapp.ts%40App";
  function App_HmrLoad(t) {
    import(
      /* @vite-ignore */
      __vite__injectQuery(i03.\u0275\u0275getReplaceMetadataURL(id, t, import.meta.url), 'import')
    ).then((m) => m.default && i03.\u0275\u0275replaceMetadata(App, m.default, [i03], [RouterOutlet, HomeComponent, Component3], import.meta, id));
  }
  (typeof ngDevMode === "undefined" || ngDevMode) && App_HmrLoad(Date.now());
  (typeof ngDevMode === "undefined" || ngDevMode) && (import.meta.hot && import.meta.hot.on("angular:component-update", (d) => d.id === id && App_HmrLoad(d.timestamp)));
})();

// src/main.ts
bootstrapApplication(App, appConfig).catch((err) => console.error(err));


//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9tYWluLnRzIiwic3JjL2FwcC9hcHAuY29uZmlnLnRzIiwic3JjL2FwcC9vcmRlci5jb21wb25lbnQudHMiLCJzcmMvYXBwL2FwcC5yb3V0ZXMudHMiLCJzcmMvYXBwL2FwcC50cyIsInNyYy9hcHAvYXBwLmh0bWwiLCJzcmMvYXBwL2hvbWUuY29tcG9uZW50LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGJvb3RzdHJhcEFwcGxpY2F0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XHJcbmltcG9ydCB7IGFwcENvbmZpZyB9IGZyb20gJy4vYXBwL2FwcC5jb25maWcnO1xyXG5pbXBvcnQgeyBBcHAgfSBmcm9tICcuL2FwcC9hcHAnO1xyXG5cclxuYm9vdHN0cmFwQXBwbGljYXRpb24oQXBwLCBhcHBDb25maWcpXHJcbiAgLmNhdGNoKChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZXJyKSk7XHJcbiIsImltcG9ydCB7IEFwcGxpY2F0aW9uQ29uZmlnLCBwcm92aWRlQnJvd3Nlckdsb2JhbEVycm9yTGlzdGVuZXJzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IHByb3ZpZGVSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5cclxuaW1wb3J0IHsgcm91dGVzIH0gZnJvbSAnLi9hcHAucm91dGVzJztcclxuXHJcbmV4cG9ydCBjb25zdCBhcHBDb25maWc6IEFwcGxpY2F0aW9uQ29uZmlnID0ge1xyXG4gIHByb3ZpZGVyczogW1xyXG4gICAgcHJvdmlkZUJyb3dzZXJHbG9iYWxFcnJvckxpc3RlbmVycygpLFxyXG4gICAgcHJvdmlkZVJvdXRlcihyb3V0ZXMpXHJcbiAgXVxyXG59O1xyXG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcclxuICBzZWxlY3RvcjogJ2FwcC1vcmRlcicsXHJcbiAgdGVtcGxhdGU6IGBcclxuICA8ZGl2IGNsYXNzPVwib3JkZXItaGVyb1wiPlxyXG4gICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxyXG4gICAgICA8c3BhbiBjbGFzcz1cImtpY2tlclwiPlNlY3VyZSBjaGVja291dDwvc3Bhbj5cclxuICAgICAgPGgxPk9yZGVyIE1pa2UncyBIYXdhaWlhbiBNxIFtYWtpIFRlYTwvaDE+XHJcbiAgICAgIDxwIHN0eWxlPVwiY29sb3I6dmFyKC0tY29sb3ItdGV4dC1tdXRlZCk7bWF4LXdpZHRoOjUycmVtO21hcmdpbi10b3A6LjVyZW1cIj5TZWxlY3QgeW91ciBxdWFudGl0eSwgZmlsbCBpbiB5b3VyIHNoaXBwaW5nIGFuZCBwYXltZW50IGRldGFpbHMsIGFuZCB5b3VyIG9yZGVyIHdpbGwgYmUgY2FyZWZ1bGx5IHBhY2tlZCBhbmQgc2hpcHBlZCBmcm9tIEthaWx1YSBLb25hLCBIYXdhaWkuPC9wPlxyXG4gICAgPC9kaXY+XHJcbiAgPC9kaXY+XHJcblxyXG4gIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJjaGVja291dC1sYXlvdXRcIj5cclxuXHJcbiAgICAgIDwhLS0gTEVGVDogUHJvZHVjdCArIEZvcm0gLS0+XHJcbiAgICAgIDxkaXYgc3R5bGU9XCJkaXNwbGF5OmdyaWQ7Z2FwOjEuNXJlbVwiPlxyXG5cclxuICAgICAgICA8IS0tIFByb2R1Y3QgY2FyZCAtLT5cclxuICAgICAgICA8YXJ0aWNsZSBjbGFzcz1cImNhcmQgcHJvZHVjdC1jYXJkXCIgYXJpYS1sYWJlbD1cIlByb2R1Y3Qgc2VsZWN0aW9uXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZHVjdC1pbWctd3JhcFwiPlxyXG4gICAgICAgICAgICA8aW1nIHNyYz1cIi9wdWxhbWEtZmFybS9wcm9kdWN0LmpwZ1wiIGFsdD1cIk1pa2UncyBIYXdhaWlhbiBNYW1ha2kgQ2FmZmVpbmUgRnJlZSBIZXJiYWwgVGVhIHBvdWNoXCIgd2lkdGg9XCI1MDBcIiBoZWlnaHQ9XCI2MDBcIiAvPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZHVjdC1kZXRhaWxzXCI+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicHJvZHVjdC1iYWRnZVwiPktvbmEgR3Jvd24gwrcgQ2FmZmVpbmUgRnJlZTwvc3Bhbj5cclxuICAgICAgICAgICAgPGgyIGNsYXNzPVwicHJvZHVjdC1uYW1lXCI+TWlrZSdzIEhhd2FpaWFuIE3EgW1ha2kgVGVhPC9oMj5cclxuICAgICAgICAgICAgPHAgY2xhc3M9XCJwcm9kdWN0LXN1YlwiPlRyYWRpdGlvbmFsIGhlcmJhbCB0ZWEg4oCUIGdyb3duICYgcGFja2FnZWQgb24gdGhlIEJpZyBJc2xhbmQuPC9wPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicHJpY2Utcm93XCI+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwcmljZS11bml0XCI+JDE1LjAwPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicHJpY2UtbGFiZWxcIj5wZXIgYmFnPC9zcGFuPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInF0eS1yb3dcIj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInF0eS1sYWJlbFwiPlF1YW50aXR5PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJxdHktY3RybFwiIHJvbGU9XCJncm91cFwiIGFyaWEtbGFiZWw9XCJRdWFudGl0eSBzZWxlY3RvclwiPlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cInF0eS1idG5cIiBpZD1cInF0eS1taW51c1wiIGFyaWEtbGFiZWw9XCJEZWNyZWFzZSBxdWFudGl0eVwiPuKIkjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwicXR5LWlucHV0XCIgaWQ9XCJxdHlcIiB0eXBlPVwibnVtYmVyXCIgdmFsdWU9XCIxXCIgbWluPVwiMVwiIG1heD1cIjk5XCIgYXJpYS1sYWJlbD1cIlF1YW50aXR5XCIgcmVhZG9ubHkgLz5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJxdHktYnRuXCIgaWQ9XCJxdHktcGx1c1wiIGFyaWEtbGFiZWw9XCJJbmNyZWFzZSBxdWFudGl0eVwiPis8L2J1dHRvbj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0b3RhbC1ib3hcIj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRvdGFsLWxhYmVsXCI+T3JkZXIgdG90YWw8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0b3RhbC12YWx1ZVwiIGlkPVwidG90YWwtZGlzcGxheVwiPiQxNS4wMDwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0cnVzdC1taWNyb1wiPlxyXG4gICAgICAgICAgICAgIDxzcGFuPkZyZWUgc2hpcHBpbmcgb3ZlciAzIGJhZ3M8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4+U1NMIHNlY3VyZWQgY2hlY2tvdXQ8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4+U2F0aXNmYWN0aW9uIGd1YXJhbnRlZTwvc3Bhbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2FydGljbGU+XHJcblxyXG4gICAgICAgIDwhLS0gQ2hlY2tvdXQgZm9ybSAtLT5cclxuICAgICAgICA8Zm9ybSBjbGFzcz1cImNoZWNrb3V0LWZvcm1cIiBpZD1cImNoZWNrb3V0LWZvcm1cIiBub3ZhbGlkYXRlPlxyXG5cclxuICAgICAgICAgIDwhLS0gU2hpcHBpbmcgLS0+XHJcbiAgICAgICAgICA8c2VjdGlvbiBjbGFzcz1cImNhcmQgZm9ybS1zZWN0aW9uXCIgYXJpYS1sYWJlbGxlZGJ5PVwic2hpcC1oZWFkaW5nXCI+XHJcbiAgICAgICAgICAgIDxoMyBjbGFzcz1cImZvcm0tc2VjdGlvbi10aXRsZVwiIGlkPVwic2hpcC1oZWFkaW5nXCI+U2hpcHBpbmcgSW5mb3JtYXRpb248L2gzPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmllbGQtcm93XCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZpZWxkXCI+PGxhYmVsIGZvcj1cImZpcnN0XCI+Rmlyc3QgbmFtZSAqPC9sYWJlbD48aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImZpcnN0XCIgbmFtZT1cImZpcnN0XCIgYXV0b2NvbXBsZXRlPVwiZ2l2ZW4tbmFtZVwiIHJlcXVpcmVkIC8+PC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZpZWxkXCI+PGxhYmVsIGZvcj1cImxhc3RcIj5MYXN0IG5hbWUgKjwvbGFiZWw+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJsYXN0XCIgbmFtZT1cImxhc3RcIiBhdXRvY29tcGxldGU9XCJmYW1pbHktbmFtZVwiIHJlcXVpcmVkIC8+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmllbGQgZnVsbFwiPjxsYWJlbCBmb3I9XCJlbWFpbFwiPkVtYWlsIGFkZHJlc3MgKjwvbGFiZWw+PGlucHV0IHR5cGU9XCJlbWFpbFwiIGlkPVwiZW1haWxcIiBuYW1lPVwiZW1haWxcIiBhdXRvY29tcGxldGU9XCJlbWFpbFwiIHJlcXVpcmVkIC8+PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmaWVsZCBmdWxsXCI+PGxhYmVsIGZvcj1cInBob25lXCI+UGhvbmUgbnVtYmVyPC9sYWJlbD48aW5wdXQgdHlwZT1cInRlbFwiIGlkPVwicGhvbmVcIiBuYW1lPVwicGhvbmVcIiBhdXRvY29tcGxldGU9XCJ0ZWxcIiAvPjwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmllbGQgZnVsbFwiPjxsYWJlbCBmb3I9XCJhZGRyZXNzXCI+U3RyZWV0IGFkZHJlc3MgKjwvbGFiZWw+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJhZGRyZXNzXCIgbmFtZT1cImFkZHJlc3NcIiBhdXRvY29tcGxldGU9XCJzdHJlZXQtYWRkcmVzc1wiIHJlcXVpcmVkIC8+PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmaWVsZCBmdWxsXCI+PGxhYmVsIGZvcj1cImFkZHJlc3MyXCI+QXBhcnRtZW50LCBzdWl0ZSwgZXRjLjwvbGFiZWw+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJhZGRyZXNzMlwiIG5hbWU9XCJhZGRyZXNzMlwiIGF1dG9jb21wbGV0ZT1cImFkZHJlc3MtbGluZTJcIiAvPjwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmllbGQtcm93XCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZpZWxkXCI+PGxhYmVsIGZvcj1cImNpdHlcIj5DaXR5ICo8L2xhYmVsPjxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiY2l0eVwiIG5hbWU9XCJjaXR5XCIgYXV0b2NvbXBsZXRlPVwiYWRkcmVzcy1sZXZlbDJcIiByZXF1aXJlZCAvPjwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmaWVsZFwiPjxsYWJlbCBmb3I9XCJzdGF0ZVwiPlN0YXRlICo8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgPHNlbGVjdCBpZD1cInN0YXRlXCIgbmFtZT1cInN0YXRlXCIgYXV0b2NvbXBsZXRlPVwiYWRkcmVzcy1sZXZlbDFcIiByZXF1aXJlZD5cclxuICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cIlwiPuKAlCBTZWxlY3Qg4oCUPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgIDxvcHRpb24+QUw8L29wdGlvbj48b3B0aW9uPkFLPC9vcHRpb24+PG9wdGlvbj5BWjwvb3B0aW9uPjxvcHRpb24+QVI8L29wdGlvbj48b3B0aW9uPkNBPC9vcHRpb24+PG9wdGlvbj5DTzwvb3B0aW9uPjxvcHRpb24+Q1Q8L29wdGlvbj48b3B0aW9uPkRFPC9vcHRpb24+PG9wdGlvbj5GTDwvb3B0aW9uPjxvcHRpb24+R0E8L29wdGlvbj48b3B0aW9uPkhJPC9vcHRpb24+PG9wdGlvbj5JRDwvb3B0aW9uPjxvcHRpb24+SUw8L29wdGlvbj48b3B0aW9uPklOPC9vcHRpb24+PG9wdGlvbj5JQTwvb3B0aW9uPjxvcHRpb24+S1M8L29wdGlvbj48b3B0aW9uPktZPC9vcHRpb24+PG9wdGlvbj5MQTwvb3B0aW9uPjxvcHRpb24+TUU8L29wdGlvbj48b3B0aW9uPk1EPC9vcHRpb24+PG9wdGlvbj5NQTwvb3B0aW9uPjxvcHRpb24+TUk8L29wdGlvbj48b3B0aW9uPk1OPC9vcHRpb24+PG9wdGlvbj5NUzwvb3B0aW9uPjxvcHRpb24+TU88L29wdGlvbj48b3B0aW9uPk1UPC9vcHRpb24+PG9wdGlvbj5ORTwvb3B0aW9uPjxvcHRpb24+TlY8L29wdGlvbj48b3B0aW9uPk5IPC9vcHRpb24+PG9wdGlvbj5OSjwvb3B0aW9uPjxvcHRpb24+Tk08L29wdGlvbj48b3B0aW9uPk5ZPC9vcHRpb24+PG9wdGlvbj5OQzwvb3B0aW9uPjxvcHRpb24+TkQ8L29wdGlvbj48b3B0aW9uPk9IPC9vcHRpb24+PG9wdGlvbj5PSzwvb3B0aW9uPjxvcHRpb24+T1I8L29wdGlvbj48b3B0aW9uPlBBPC9vcHRpb24+PG9wdGlvbj5SSTwvb3B0aW9uPjxvcHRpb24+U0M8L29wdGlvbj48b3B0aW9uPlNEPC9vcHRpb24+PG9wdGlvbj5UTjwvb3B0aW9uPjxvcHRpb24+VFg8L29wdGlvbj48b3B0aW9uPlVUPC9vcHRpb24+PG9wdGlvbj5WVDwvb3B0aW9uPjxvcHRpb24+VkE8L29wdGlvbj48b3B0aW9uPldBPC9vcHRpb24+PG9wdGlvbj5XVjwvb3B0aW9uPjxvcHRpb24+V0k8L29wdGlvbj48b3B0aW9uPldZPC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmaWVsZC1yb3dcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmllbGRcIj48bGFiZWwgZm9yPVwiemlwXCI+WklQIGNvZGUgKjwvbGFiZWw+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJ6aXBcIiBuYW1lPVwiemlwXCIgYXV0b2NvbXBsZXRlPVwicG9zdGFsLWNvZGVcIiByZXF1aXJlZCAvPjwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmaWVsZFwiPjxsYWJlbCBmb3I9XCJjb3VudHJ5XCI+Q291bnRyeTwvbGFiZWw+PHNlbGVjdCBpZD1cImNvdW50cnlcIiBuYW1lPVwiY291bnRyeVwiIGF1dG9jb21wbGV0ZT1cImNvdW50cnlcIj48b3B0aW9uPlVuaXRlZCBTdGF0ZXM8L29wdGlvbj48L3NlbGVjdD48L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L3NlY3Rpb24+XHJcblxyXG4gICAgICAgICAgPCEtLSBCaWxsaW5nIHRvZ2dsZSAtLT5cclxuICAgICAgICAgIDxzZWN0aW9uIGNsYXNzPVwiY2FyZCBmb3JtLXNlY3Rpb25cIiBhcmlhLWxhYmVsbGVkYnk9XCJiaWxsLWhlYWRpbmdcIj5cclxuICAgICAgICAgICAgPGgzIGNsYXNzPVwiZm9ybS1zZWN0aW9uLXRpdGxlXCIgaWQ9XCJiaWxsLWhlYWRpbmdcIj5CaWxsaW5nIEFkZHJlc3M8L2gzPlxyXG4gICAgICAgICAgICA8bGFiZWwgc3R5bGU9XCJkaXNwbGF5OmZsZXg7YWxpZ24taXRlbXM6Y2VudGVyO2dhcDouNnJlbTtjdXJzb3I6cG9pbnRlcjtmb250LXNpemU6dmFyKC0tdGV4dC1zbSk7dGV4dC10cmFuc2Zvcm06bm9uZTtsZXR0ZXItc3BhY2luZzowO2ZvbnQtd2VpZ2h0OjQwMFwiPlxyXG4gICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD1cInNhbWUtYWRkcmVzc1wiIGNoZWNrZWQgc3R5bGU9XCJ3aWR0aDoxLjFyZW07aGVpZ2h0OjEuMXJlbTthY2NlbnQtY29sb3I6dmFyKC0tY29sb3ItcHJpbWFyeSlcIiAvPlxyXG4gICAgICAgICAgICAgIFNhbWUgYXMgc2hpcHBpbmcgYWRkcmVzc1xyXG4gICAgICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgICAgICA8ZGl2IGlkPVwiYmlsbGluZy1maWVsZHNcIiBzdHlsZT1cImRpc3BsYXk6bm9uZTtkaXNwbGF5OmdyaWQ7Z2FwOjFyZW1cIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmllbGQgZnVsbFwiPjxsYWJlbCBmb3I9XCJiaWxsLWFkZHJlc3NcIj5CaWxsaW5nIHN0cmVldCBhZGRyZXNzPC9sYWJlbD48aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImJpbGwtYWRkcmVzc1wiIG5hbWU9XCJiaWxsLWFkZHJlc3NcIiBhdXRvY29tcGxldGU9XCJiaWxsaW5nIHN0cmVldC1hZGRyZXNzXCIgLz48L2Rpdj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmllbGQtcm93XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmllbGRcIj48bGFiZWwgZm9yPVwiYmlsbC1jaXR5XCI+Q2l0eTwvbGFiZWw+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJiaWxsLWNpdHlcIiBuYW1lPVwiYmlsbC1jaXR5XCIgYXV0b2NvbXBsZXRlPVwiYmlsbGluZyBhZGRyZXNzLWxldmVsMlwiIC8+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmllbGRcIj48bGFiZWwgZm9yPVwiYmlsbC1zdGF0ZVwiPlN0YXRlPC9sYWJlbD48aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImJpbGwtc3RhdGVcIiBuYW1lPVwiYmlsbC1zdGF0ZVwiIGF1dG9jb21wbGV0ZT1cImJpbGxpbmcgYWRkcmVzcy1sZXZlbDFcIiAvPjwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmaWVsZC1yb3dcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmaWVsZFwiPjxsYWJlbCBmb3I9XCJiaWxsLXppcFwiPlpJUDwvbGFiZWw+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJiaWxsLXppcFwiIG5hbWU9XCJiaWxsLXppcFwiIGF1dG9jb21wbGV0ZT1cImJpbGxpbmcgcG9zdGFsLWNvZGVcIiAvPjwvZGl2PlxyXG4gICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvc2VjdGlvbj5cclxuXHJcbiAgICAgICAgICA8IS0tIFBheW1lbnQgLS0+XHJcbiAgICAgICAgICA8c2VjdGlvbiBjbGFzcz1cImNhcmQgZm9ybS1zZWN0aW9uXCIgYXJpYS1sYWJlbGxlZGJ5PVwicGF5LWhlYWRpbmdcIj5cclxuICAgICAgICAgICAgPGgzIGNsYXNzPVwiZm9ybS1zZWN0aW9uLXRpdGxlXCIgaWQ9XCJwYXktaGVhZGluZ1wiPlBheW1lbnQgSW5mb3JtYXRpb248L2gzPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2VjdXJpdHktYmFubmVyXCI+XHJcbiAgICAgICAgICAgICAgPHNwYW4+WW91ciBwYXltZW50IGRldGFpbHMgYXJlIGVuY3J5cHRlZC4gUHVsYW1hIEZhcm0gbmV2ZXIgc3RvcmVzIHlvdXIgZnVsbCBjYXJkIG51bWJlci48L3NwYW4+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmllbGQgZnVsbFwiPlxyXG4gICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJjYXJkaG9sZGVyXCI+TmFtZSBvbiBjYXJkICo8L2xhYmVsPlxyXG4gICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiY2FyZGhvbGRlclwiIG5hbWU9XCJjYXJkaG9sZGVyXCIgYXV0b2NvbXBsZXRlPVwiY2MtbmFtZVwiIHJlcXVpcmVkIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmllbGQgZnVsbFwiPlxyXG4gICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJjYXJkbnVtYmVyXCI+Q2FyZCBudW1iZXIgKjwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQtbnVtYmVyLXdyYXBcIj5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwiY2FyZG51bWJlclwiIG5hbWU9XCJjYXJkbnVtYmVyXCIgbWF4bGVuZ3RoPVwiMTlcIiBhdXRvY29tcGxldGU9XCJjYy1udW1iZXJcIiByZXF1aXJlZCBpbnB1dG1vZGU9XCJudW1lcmljXCIgLz5cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2FyZC1icmFuZFwiIGlkPVwiY2FyZC1icmFuZC1sYWJlbFwiIGFyaWEtbGl2ZT1cInBvbGl0ZVwiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmaWVsZC1yb3dcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmllbGRcIj48bGFiZWwgZm9yPVwiZXhwaXJ5XCI+RXhwaXJhdGlvbiAqPC9sYWJlbD48aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImV4cGlyeVwiIG5hbWU9XCJleHBpcnlcIiBtYXhsZW5ndGg9XCI3XCIgYXV0b2NvbXBsZXRlPVwiY2MtZXhwXCIgcmVxdWlyZWQgaW5wdXRtb2RlPVwibnVtZXJpY1wiIC8+PC9kaXY+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZpZWxkXCI+PGxhYmVsIGZvcj1cImN2dlwiPkNWViAqPC9sYWJlbD48aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImN2dlwiIG5hbWU9XCJjdnZcIiBtYXhsZW5ndGg9XCI0XCIgYXV0b2NvbXBsZXRlPVwiY2MtY3NjXCIgcmVxdWlyZWQgaW5wdXRtb2RlPVwibnVtZXJpY1wiIC8+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9zZWN0aW9uPlxyXG5cclxuICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwic3VibWl0LWJ0blwiIGlkPVwic3VibWl0LWJ0blwiPlxyXG4gICAgICAgICAgICA8c3BhbiBpZD1cInN1Ym1pdC1sYWJlbFwiPlBsYWNlIG9yZGVyIOKAlCA8c3BhbiBpZD1cInN1Ym1pdC10b3RhbFwiPiQxNS4wMDwvc3Bhbj48L3NwYW4+XHJcbiAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgIDxwIHN0eWxlPVwidGV4dC1hbGlnbjpjZW50ZXI7Zm9udC1zaXplOnZhcigtLXRleHQteHMpO2NvbG9yOnZhcigtLWNvbG9yLXRleHQtZmFpbnQpO21hcmdpbi10b3A6LjVyZW1cIj5CeSBwbGFjaW5nIHlvdXIgb3JkZXIgeW91IGFncmVlIHRvIG91ciB0ZXJtcy48L3A+XHJcbiAgICAgICAgPC9mb3JtPlxyXG4gICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDwhLS0gUklHSFQ6IFNpZGViYXIgLS0+XHJcbiAgICAgIDxhc2lkZSBjbGFzcz1cInNpZGViYXJcIj5cclxuXHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQgb3JkZXItc3VtbWFyeVwiIGFyaWEtbGFiZWw9XCJPcmRlciBzdW1tYXJ5XCI+XHJcbiAgICAgICAgICA8aDMgY2xhc3M9XCJzdW1tYXJ5LXRpdGxlXCI+T3JkZXIgU3VtbWFyeTwvaDM+XHJcbiAgICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTpmbGV4O2dhcDouODVyZW07YWxpZ24taXRlbXM6Y2VudGVyO3BhZGRpbmc6LjVyZW0gMDtib3JkZXItYm90dG9tOjFweCBzb2xpZCBjb2xvci1taXgoaW4gc3JnYix2YXIoLS1jb2xvci10ZXh0KSA4JSx0cmFuc3BhcmVudClcIj5cclxuICAgICAgICAgICAgPGltZyBzcmM9XCIvcHVsYW1hLWZhcm0vcHJvZHVjdC5qcGdcIiBhbHQ9XCJNaWtlJ3MgSGF3YWlpYW4gTWFtYWtpIFRlYVwiIHdpZHRoPVwiNTZcIiBoZWlnaHQ9XCI2OFwiIHN0eWxlPVwiYm9yZGVyLXJhZGl1czouNXJlbTtvYmplY3QtZml0OmNvdmVyO2ZsZXg6bm9uZTtiYWNrZ3JvdW5kOiNmMGVhZDZcIiBsb2FkaW5nPVwibGF6eVwiIC8+XHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmbGV4OjFcIj5cclxuICAgICAgICAgICAgICA8ZGl2IHN0eWxlPVwiZm9udC1zaXplOnZhcigtLXRleHQtc20pO2ZvbnQtd2VpZ2h0OjcwMFwiPk1pa2UncyBIYXdhaWlhbiBNxIFtYWtpIFRlYTwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9XCJmb250LXNpemU6dmFyKC0tdGV4dC14cyk7Y29sb3I6dmFyKC0tY29sb3ItdGV4dC1mYWludClcIj5RdHk6IDxzcGFuIGlkPVwic3VtbWFyeS1xdHlcIj4xPC9zcGFuPjwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBzdHlsZT1cImZvbnQtc2l6ZTp2YXIoLS10ZXh0LXNtKTtmb250LXdlaWdodDo3MDA7Y29sb3I6dmFyKC0tY29sb3ItcHJpbWFyeSlcIiBpZD1cInN1bW1hcnktc3VidG90YWxcIj4kMTUuMDA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInN1bW1hcnktbGluZVwiPjxzcGFuPlN1YnRvdGFsPC9zcGFuPjxzcGFuIGlkPVwic2lkZWJhci1zdWJ0b3RhbFwiPiQxNS4wMDwvc3Bhbj48L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJzdW1tYXJ5LWxpbmVcIiBpZD1cInNoaXBwaW5nLWxpbmVcIj48c3Bhbj5TaGlwcGluZzwvc3Bhbj48c3BhbiBpZD1cInNpZGViYXItc2hpcHBpbmdcIj4kNS4wMDwvc3Bhbj48L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJzdW1tYXJ5LWxpbmUgdG90YWxcIj48c3Bhbj5Ub3RhbDwvc3Bhbj48c3BhbiBpZD1cInNpZGViYXItdG90YWxcIj4kMjAuMDA8L3NwYW4+PC9kaXY+XHJcbiAgICAgICAgICA8cCBzdHlsZT1cImZvbnQtc2l6ZTp2YXIoLS10ZXh0LXhzKTtjb2xvcjp2YXIoLS1jb2xvci10ZXh0LWZhaW50KVwiPkZyZWUgc2hpcHBpbmcgb24gb3JkZXJzIG9mIDMgb3IgbW9yZSBiYWdzLiBVUyBzaGlwcGluZyBvbmx5LjwvcD5cclxuICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgIDwvYXNpZGU+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuXHJcbiAgPCEtLSBTdWNjZXNzIG1vZGFsIC0tPlxyXG4gIDxkaXYgY2xhc3M9XCJzdWNjZXNzLW1vZGFsXCIgaWQ9XCJzdWNjZXNzLW1vZGFsXCIgcm9sZT1cImRpYWxvZ1wiIGFyaWEtbW9kYWw9XCJ0cnVlXCIgYXJpYS1sYWJlbGxlZGJ5PVwic3VjY2Vzcy10aXRsZVwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInN1Y2Nlc3MtYm94XCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJzdWNjZXNzLWljb25cIj7inJM8L2Rpdj5cclxuICAgICAgPGgyIGlkPVwic3VjY2Vzcy10aXRsZVwiPk9yZGVyIHJlY2VpdmVkITwvaDI+XHJcbiAgICAgIDxwIHN0eWxlPVwiY29sb3I6dmFyKC0tY29sb3ItdGV4dC1tdXRlZClcIj5UaGFuayB5b3UgZm9yIG9yZGVyaW5nIE1pa2UncyBIYXdhaWlhbiBNxIFtYWtpIFRlYS4gTWlrZSB3aWxsIHJldmlldyB5b3VyIG9yZGVyIGFuZCByZWFjaCBvdXQgYXQgdGhlIGVtYWlsIHlvdSBwcm92aWRlZCB0byBjb25maXJtIHNoaXBtZW50IGRldGFpbHMgYW5kIHBheW1lbnQgcHJvY2Vzc2luZy48L3A+XHJcbiAgICAgIDxhIGhyZWY9XCIvXCIgY2xhc3M9XCJidG4gYnRuLWdyZWVuXCIgc3R5bGU9XCJ3aWR0aDoxMDAlO2p1c3RpZnktY29udGVudDpjZW50ZXI7bWFyZ2luLXRvcDouNXJlbVwiPkJhY2sgdG8gUHVsYW1hIEZhcm08L2E+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Rpdj5cclxuICBgLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgT3JkZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQge1xyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgLy8gbm90aGluZyBmb3Igbm93XHJcbiAgfVxyXG5cclxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XHJcbiAgICAvLyBNaXJyb3IgdGhlIG9yaWdpbmFsIHBhZ2UgYmVoYXZpb3Igd2l0aCBtaW5pbWFsIERPTSBzY3JpcHRpbmcgc28gZXhpc3Rpbmcgc3R5bGVzIHdvcmsgdW5jaGFuZ2VkLlxyXG4gICAgY29uc3QgVU5JVCA9IDE1LCBTSElQID0gNSwgRlJFRV9TSElQID0gMztcclxuICAgIGNvbnN0IHF0eUVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3F0eScpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBjb25zdCB0b3RhbERpc3BsYXkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG90YWwtZGlzcGxheScpITtcclxuICAgIGNvbnN0IHN1Ym1pdFRvdGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1Ym1pdC10b3RhbCcpITtcclxuICAgIGNvbnN0IHN1bW1hcnlRdHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3VtbWFyeS1xdHknKSE7XHJcbiAgICBjb25zdCBzdW1tYXJ5U3VidG90YWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3VtbWFyeS1zdWJ0b3RhbCcpITtcclxuICAgIGNvbnN0IHNpZGViYXJTdWJ0b3RhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaWRlYmFyLXN1YnRvdGFsJykhO1xyXG4gICAgY29uc3Qgc2lkZWJhclNoaXBwaW5nID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NpZGViYXItc2hpcHBpbmcnKSE7XHJcbiAgICBjb25zdCBzaWRlYmFyVG90YWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2lkZWJhci10b3RhbCcpITtcclxuICAgIGNvbnN0IHNoaXBwaW5nTGluZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzaGlwcGluZy1saW5lJykhO1xyXG4gICAgY29uc3QgcXR5UGx1cyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdxdHktcGx1cycpITtcclxuICAgIGNvbnN0IHF0eU1pbnVzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3F0eS1taW51cycpITtcclxuICAgIGNvbnN0IHNhbWVBZGRyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3NhbWUtYWRkcmVzcycpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBjb25zdCBiaWxsaW5nRmllbGRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2JpbGxpbmctZmllbGRzJykhO1xyXG4gICAgY29uc3QgY2FyZElucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhcmRudW1iZXInKSBhcyBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbDtcclxuICAgIGNvbnN0IGJyYW5kTGFiZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FyZC1icmFuZC1sYWJlbCcpITtcclxuICAgIGNvbnN0IGV4cElucHV0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2V4cGlyeScpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsO1xyXG4gICAgY29uc3QgY3Z2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N2dicpIGFzIEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsO1xyXG4gICAgY29uc3QgZm9ybSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaGVja291dC1mb3JtJykgYXMgSFRNTEZvcm1FbGVtZW50IHwgbnVsbDtcclxuICAgIGNvbnN0IHN1Ym1pdEJ0biA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdWJtaXQtYnRuJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQgfCBudWxsO1xyXG4gICAgY29uc3Qgc3VibWl0TGFiZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3VibWl0LWxhYmVsJykgYXMgSFRNTEVsZW1lbnQgfCBudWxsO1xyXG4gICAgY29uc3Qgc3VjY2Vzc01vZGFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N1Y2Nlc3MtbW9kYWwnKSE7XHJcblxyXG4gICAgY29uc3QgZm10ID0gKG46IG51bWJlcikgPT4gJyQnICsgbi50b0ZpeGVkKDIpO1xyXG5cclxuICAgIGZ1bmN0aW9uIHVwZGF0ZVRvdGFscygpIHtcclxuICAgICAgY29uc3QgcSA9IE1hdGgubWF4KDEsIHBhcnNlSW50KHF0eUVsLnZhbHVlIHx8ICcxJykgfHwgMSk7XHJcbiAgICAgIHF0eUVsLnZhbHVlID0gU3RyaW5nKHEpO1xyXG4gICAgICBjb25zdCBzdWIgPSBxICogVU5JVDtcclxuICAgICAgY29uc3Qgc2hpcCA9IHEgPj0gRlJFRV9TSElQID8gMCA6IFNISVA7XHJcbiAgICAgIGNvbnN0IGdyYW5kID0gc3ViICsgc2hpcDtcclxuICAgICAgdG90YWxEaXNwbGF5LnRleHRDb250ZW50ID0gZm10KHN1Yik7XHJcbiAgICAgIChzdWJtaXRUb3RhbCBhcyBIVE1MRWxlbWVudCkudGV4dENvbnRlbnQgPSBmbXQoZ3JhbmQpO1xyXG4gICAgICBzdW1tYXJ5UXR5LnRleHRDb250ZW50ID0gU3RyaW5nKHEpO1xyXG4gICAgICBzdW1tYXJ5U3VidG90YWwudGV4dENvbnRlbnQgPSBmbXQoc3ViKTtcclxuICAgICAgc2lkZWJhclN1YnRvdGFsLnRleHRDb250ZW50ID0gZm10KHN1Yik7XHJcbiAgICAgIHNpZGViYXJTaGlwcGluZy50ZXh0Q29udGVudCA9IHNoaXAgPT09IDAgPyAnRnJlZScgOiBmbXQoc2hpcCk7XHJcbiAgICAgIHNoaXBwaW5nTGluZS5xdWVyeVNlbGVjdG9yKCdzcGFuOmxhc3QtY2hpbGQnKSEudGV4dENvbnRlbnQgPSBzaGlwID09PSAwID8gJ0ZyZWUg8J+OiScgOiBmbXQoc2hpcCk7XHJcbiAgICAgIHNpZGViYXJUb3RhbC50ZXh0Q29udGVudCA9IGZtdChncmFuZCk7XHJcbiAgICB9XHJcblxyXG4gICAgcXR5UGx1cy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHsgcXR5RWwudmFsdWUgPSBTdHJpbmcoTWF0aC5taW4oOTksIHBhcnNlSW50KHF0eUVsLnZhbHVlIHx8ICcxJykgKyAxKSk7IHVwZGF0ZVRvdGFscygpOyB9KTtcclxuICAgIHF0eU1pbnVzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4geyBxdHlFbC52YWx1ZSA9IFN0cmluZyhNYXRoLm1heCgxLCBwYXJzZUludChxdHlFbC52YWx1ZSB8fCAnMScpIC0gMSkpOyB1cGRhdGVUb3RhbHMoKTsgfSk7XHJcbiAgICBxdHlFbC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCB1cGRhdGVUb3RhbHMpO1xyXG4gICAgdXBkYXRlVG90YWxzKCk7XHJcblxyXG4gICAgc2FtZUFkZHIuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCkgPT4geyBiaWxsaW5nRmllbGRzLnN0eWxlLmRpc3BsYXkgPSBzYW1lQWRkci5jaGVja2VkID8gJ25vbmUnIDogJ2dyaWQnOyB9KTtcclxuICAgIGJpbGxpbmdGaWVsZHMuc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuXHJcbiAgICBpZiAoY2FyZElucHV0KSB7XHJcbiAgICAgIGNhcmRJbnB1dC5hZGRFdmVudExpc3RlbmVyKCdpbnB1dCcsICgpID0+IHtcclxuICAgICAgICBsZXQgdiA9IGNhcmRJbnB1dC52YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpLnN1YnN0cmluZygwLCAxNik7XHJcbiAgICAgICAgY2FyZElucHV0LnZhbHVlID0gdi5yZXBsYWNlKC8oLns0fSkvZywgJyQxICcpLnRyaW0oKTtcclxuICAgICAgICBjb25zdCBmaXJzdCA9IHYuY2hhckF0KDApO1xyXG4gICAgICAgIGJyYW5kTGFiZWwudGV4dENvbnRlbnQgPSBmaXJzdCA9PT0gJzQnID8gJ1ZJU0EnIDogZmlyc3QgPT09ICc1JyA/ICdNQycgOiBmaXJzdCA9PT0gJzMnID8gJ0FNRVgnIDogZmlyc3QgPT09ICc2JyA/ICdESVNDJyA6ICcnO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoZXhwSW5wdXQpIHtcclxuICAgICAgZXhwSW5wdXQuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCAoKSA9PiB7XHJcbiAgICAgICAgbGV0IHYgPSBleHBJbnB1dC52YWx1ZS5yZXBsYWNlKC9cXEQvZywgJycpO1xyXG4gICAgICAgIGlmICh2Lmxlbmd0aCA+IDIpIHYgPSB2LnN1YnN0cmluZygwLCAyKSArICcgLyAnICsgdi5zdWJzdHJpbmcoMiwgNCk7XHJcbiAgICAgICAgZXhwSW5wdXQudmFsdWUgPSB2O1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY3Z2KSBjdnYuYWRkRXZlbnRMaXN0ZW5lcignaW5wdXQnLCBmdW5jdGlvbih0aGlzOiBIVE1MSW5wdXRFbGVtZW50KSB7IHRoaXMudmFsdWUgPSB0aGlzLnZhbHVlLnJlcGxhY2UoL1xcRC9nLCAnJyk7IH0pO1xyXG5cclxuICAgIGlmIChmb3JtICYmIHN1Ym1pdEJ0bikge1xyXG4gICAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoJ3N1Ym1pdCcsIGFzeW5jIChlKSA9PiB7XHJcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgIHN1Ym1pdEJ0bi5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgaWYgKHN1Ym1pdExhYmVsKSBzdWJtaXRMYWJlbC50ZXh0Q29udGVudCA9ICdQcm9jZXNzaW5n4oCmJztcclxuXHJcbiAgICAgICAgLy8gYnVpbGQgcGF5bG9hZCBhY2NvcmRpbmcgdG8gQVBJIHJlZmVyZW5jZVxyXG4gICAgICAgIGNvbnN0IHBheWxvYWQ6IGFueSA9IHtcclxuICAgICAgICAgIGZpcnN0X25hbWU6IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmlyc3QnKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSB8fCAnJyxcclxuICAgICAgICAgIGxhc3RfbmFtZTogKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsYXN0JykgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgfHwgJycsXHJcbiAgICAgICAgICBlbWFpbDogKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdlbWFpbCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlIHx8ICcnLFxyXG4gICAgICAgICAgcGhvbmU6IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGhvbmUnKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSB8fCAnJyxcclxuICAgICAgICAgIHNoaXBwaW5nX2FkZHJlc3NfbGluZTE6IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYWRkcmVzcycpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlIHx8ICcnLFxyXG4gICAgICAgICAgc2hpcHBpbmdfYWRkcmVzc19saW5lMjogKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhZGRyZXNzMicpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlIHx8ICcnLFxyXG4gICAgICAgICAgY2l0eTogKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjaXR5JykgYXMgSFRNTElucHV0RWxlbWVudCkudmFsdWUgfHwgJycsXHJcbiAgICAgICAgICBzdGF0ZTogKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGF0ZScpIGFzIEhUTUxTZWxlY3RFbGVtZW50KS52YWx1ZSB8fCAnJyxcclxuICAgICAgICAgIHppcF9jb2RlOiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ppcCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQpLnZhbHVlIHx8ICcnLFxyXG4gICAgICAgICAgY291bnRyeTogKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb3VudHJ5JykgYXMgSFRNTFNlbGVjdEVsZW1lbnQpLnZhbHVlIHx8ICdVbml0ZWQgU3RhdGVzJyxcclxuICAgICAgICAgIHNwZWNpYWxfaW5zdHJ1Y3Rpb25zOiAnJyxcclxuICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgIHsgcHJvZHVjdF9uYW1lOiBcIk1pa2UncyBIYXdhaWlhbiBNxIFtYWtpIFRlYVwiLCBxdWFudGl0eTogTWF0aC5tYXgoMSwgcGFyc2VJbnQoKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdxdHknKSBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSB8fCAnMScpKSwgcHJpY2U6IFVOSVQgfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICBjb25zdCByZXMgPSBhd2FpdCBmZXRjaCgnL2FwaS9vcmRlcnMnLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfSxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocGF5bG9hZClcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgY29uc3QganNvbiA9IGF3YWl0IHJlcy5qc29uKCkuY2F0Y2goKCk9Pm51bGwpO1xyXG4gICAgICAgICAgaWYgKHJlcy5zdGF0dXMgPT09IDIwMSkge1xyXG4gICAgICAgICAgICBzdWNjZXNzTW9kYWwuY2xhc3NMaXN0LmFkZCgnc2hvdycpO1xyXG4gICAgICAgICAgICBmb3JtLnJlc2V0KCk7XHJcbiAgICAgICAgICAgIHVwZGF0ZVRvdGFscygpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignT3JkZXIgQVBJIGVycm9yJywgcmVzLnN0YXR1cywganNvbik7XHJcbiAgICAgICAgICAgIGFsZXJ0KChqc29uICYmIGpzb24ubWVzc2FnZSkgfHwgJ0ZhaWxlZCB0byBwbGFjZSBvcmRlci4gUGxlYXNlIHRyeSBhZ2Fpbi4nKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgICAgIGFsZXJ0KCdOZXR3b3JrIGVycm9yIHBsYWNpbmcgb3JkZXIuJyk7XHJcbiAgICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICAgIHN1Ym1pdEJ0bi5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgaWYgKHN1Ym1pdExhYmVsKSBzdWJtaXRMYWJlbC5pbm5lckhUTUwgPSAnUGxhY2Ugb3JkZXIg4oCUIDxzcGFuIGlkPVwic3VibWl0LXRvdGFsXCI+JyArIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3VibWl0LXRvdGFsJykgYXMgSFRNTEVsZW1lbnQpLnRleHRDb250ZW50ICsgJzwvc3Bhbj4nO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gY2xvc2UgbW9kYWwgb24gYmFja2Ryb3AgY2xpY2tcclxuICAgIHN1Y2Nlc3NNb2RhbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChlKSB7IGlmIChlLnRhcmdldCA9PT0gdGhpcykgdGhpcy5jbGFzc0xpc3QucmVtb3ZlKCdzaG93Jyk7IH0pO1xyXG4gIH1cclxufSIsImltcG9ydCB7IFJvdXRlcyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IE9yZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9vcmRlci5jb21wb25lbnQnO1xyXG5cclxuZXhwb3J0IGNvbnN0IHJvdXRlczogUm91dGVzID0gW1xyXG4gIHsgcGF0aDogJ29yZGVyJywgY29tcG9uZW50OiBPcmRlckNvbXBvbmVudCB9XHJcbl07XHJcbiIsImltcG9ydCB7IENvbXBvbmVudCwgc2lnbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFJvdXRlck91dGxldCB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XHJcbmltcG9ydCB7IEhvbWVDb21wb25lbnQgfSBmcm9tICcuL2hvbWUuY29tcG9uZW50JztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnZmFybS1yb290JyxcclxuICBpbXBvcnRzOiBbUm91dGVyT3V0bGV0LCBIb21lQ29tcG9uZW50XSxcclxuICB0ZW1wbGF0ZVVybDogJy4vYXBwLmh0bWwnLFxyXG4gIHN0eWxlVXJsOiAnLi9hcHAuY3NzJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgQXBwIHtcclxuICBwcm90ZWN0ZWQgcmVhZG9ubHkgdGl0bGUgPSBzaWduYWwoJ3B1bGFtYS1mYXJtJyk7XHJcbn1cclxuIiwiPGFwcC1ob21lPjwvYXBwLWhvbWU+XHJcbjxyb3V0ZXItb3V0bGV0Pjwvcm91dGVyLW91dGxldD4iLCJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBSb3V0ZXJMaW5rIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHN0YW5kYWxvbmU6IHRydWUsXHJcbiAgaW1wb3J0czogW1JvdXRlckxpbmtdLFxyXG4gIHNlbGVjdG9yOiAnYXBwLWhvbWUnLFxyXG4gIHRlbXBsYXRlOiBgXHJcbiAgPGEgY2xhc3M9XCJza2lwLWxpbmtcIiBocmVmPVwiI2NvbnRlbnRcIj5Ta2lwIHRvIGNvbnRlbnQ8L2E+XHJcbiAgPGhlYWRlciBjbGFzcz1cInNpdGUtaGVhZGVyXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIG5hdi13cmFwXCI+XHJcbiAgICAgIDxhIGhyZWY9XCIjdG9wXCIgY2xhc3M9XCJicmFuZFwiIGFyaWEtbGFiZWw9XCJQdWxhbWEgRmFybSBob21lXCI+XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJicmFuZC1tYXJrXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XHJcbiAgICAgICAgICA8c3ZnIHZpZXdCb3g9XCIwIDAgMjQgMjRcIiBmaWxsPVwibm9uZVwiIHN0cm9rZT1cImN1cnJlbnRDb2xvclwiIHN0cm9rZS13aWR0aD1cIjEuOFwiIHN0cm9rZS1saW5lY2FwPVwicm91bmRcIiBzdHJva2UtbGluZWpvaW49XCJyb3VuZFwiPjxwYXRoIGQ9XCJNMTIgMjBjMC01IDIuNS04LjIgNy0xMC0xIDQuNS00IDgtNyAxMFpcIj48L3BhdGg+PHBhdGggZD1cIk0xMiAyMGMwLTQuNy0yLjMtNy44LTctMTAgLjggNC44IDMuOCA4LjIgNyAxMFpcIj48L3BhdGg+PHBhdGggZD1cIk0xMiAyMFY3XCI+PC9wYXRoPjwvc3ZnPlxyXG4gICAgICAgIDwvc3Bhbj5cclxuICAgICAgICA8c3BhbiBjbGFzcz1cImJyYW5kLXRleHRcIj48c3Ryb25nPlB1bGFtYSBGYXJtPC9zdHJvbmc+PHNwYW4+TWFtYWtpIHRlYSBmcm9tIEtvbmE8L3NwYW4+PC9zcGFuPlxyXG4gICAgICA8L2E+XHJcbiAgICAgIDxuYXYgY2xhc3M9XCJuYXYtbGlua3NcIiBhcmlhLWxhYmVsPVwiUHJpbWFyeSBuYXZpZ2F0aW9uXCI+XHJcbiAgICAgICAgPGEgaHJlZj1cIiNmYXJtXCI+T3VyIEZhcm08L2E+XHJcbiAgICAgICAgPGEgaHJlZj1cIiNiZW5lZml0c1wiPkJlbmVmaXRzPC9hPlxyXG4gICAgICAgIDxhIGhyZWY9XCIjbWFtYWtpXCI+QWJvdXQgTWFtYWtpPC9hPlxyXG4gICAgICAgIDxhIGhyZWY9XCIjYnJld1wiPkhvdyB0byBCcmV3PC9hPlxyXG4gICAgICAgIDxhIGhyZWY9XCIjZmFxXCI+RkFRPC9hPlxyXG4gICAgICAgIDxhIGhyZWY9XCIjY29udGFjdFwiPkNvbnRhY3Q8L2E+XHJcbiAgICAgIDwvbmF2PlxyXG4gICAgICA8YnV0dG9uIGNsYXNzPVwidGhlbWUtdG9nZ2xlXCIgKGNsaWNrKT1cInRvZ2dsZVRoZW1lKClcIiBhcmlhLWxhYmVsPVwiU3dpdGNoIHRoZW1lXCI+XHJcbiAgICAgICAge3sgdGhlbWUgPT09ICdkYXJrJyA/ICfwn4yZJyA6ICfimIDvuI8nIH19XHJcbiAgICAgIDwvYnV0dG9uPlxyXG4gICAgPC9kaXY+XHJcbiAgPC9oZWFkZXI+XHJcblxyXG4gIDxtYWluIGlkPVwiY29udGVudFwiPlxyXG4gICAgPHNlY3Rpb24gY2xhc3M9XCJoZXJvXCIgaWQ9XCJ0b3BcIj5cclxuICAgICAgPGltZyBjbGFzcz1cImhlcm8tbWVkaWFcIiBzcmM9XCIvcHVsYW1hLWZhcm0vaGVyby5qcGVnXCIgYWx0PVwiU3Vuc2V0IHZpZXcgZnJvbSBQdWxhbWEgRmFybSBvdmVyIHRoZSBLb25hIGNvYXN0bGluZVwiIHdpZHRoPVwiMTYwMFwiIGhlaWdodD1cIjEwNjdcIiAvPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIGhlcm8tY29udGVudFwiPlxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwiZXllYnJvd1wiPkJpZyBJc2xhbmQgZ3Jvd24gwrcgQ2FmZmVpbmUgZnJlZSDCtyBTbWFsbCBiYXRjaDwvc3Bhbj5cclxuICAgICAgICA8aDE+SGF3YWlpYW4gTWFtYWtpIHRlYSBncm93biB3aXRoIGNhcmUgaW4gS29uYS48L2gxPlxyXG4gICAgICAgIDxwIGNsYXNzPVwiaGVyby1jb3B5XCI+UHVsYW1hIEZhcm0gb2ZmZXJzIGEgY2FsbSwgZWFydGh5IGN1cCByb290ZWQgaW4gSGF3YWlpYW4gdHJhZGl0aW9uLiBPdXIgTWFtYWtpIHRlYSBpcyBoYXJ2ZXN0ZWQgaW4gc21hbGwgYmF0Y2hlcywgZHJpZWQgaW4gdGhlIEtvbmEgc3VuLCBhbmQgcHJlcGFyZWQgZnJvbSBjYXJlZnVsbHkgc2VsZWN0ZWQgbGVhdmVzIGZvciBmbGF2b3IsIGZyZXNobmVzcywgYW5kIGRhaWx5IHJpdHVhbC48L3A+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImhlcm8tYWN0aW9uc1wiPlxyXG4gICAgICAgICAgPGEgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiByb3V0ZXJMaW5rPVwiL29yZGVyXCI+T3JkZXIgTWFtYWtpIFRlYTwvYT5cclxuICAgICAgICAgIDxhIGNsYXNzPVwiYnRuIGJ0bi1zZWNvbmRhcnlcIiBocmVmPVwiI2JyZXdcIj5TZWUgYnJld2luZyBndWlkZTwvYT5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiaGVyby1mYWN0c1wiPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImZhY3RcIj48c3Ryb25nPjMtYWNyZSBlc3RhdGU8L3N0cm9uZz48c3Bhbj5QdWxhbWEgRmFybSBpbiBLb25hLCBIYXdhaWk8L3NwYW4+PC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiZmFjdFwiPjxzdHJvbmc+MSwzNTAgZnQgZWxldmF0aW9uPC9zdHJvbmc+PHNwYW4+SWRlYWwgZ3Jvd2luZyBjb25kaXRpb25zPC9zcGFuPjwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImZhY3RcIj48c3Ryb25nPkNhZmZlaW5lIGZyZWU8L3N0cm9uZz48c3Bhbj5DYWxtIGZvY3VzLCBkYXkgb3IgZXZlbmluZzwvc3Bhbj48L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJmYWN0XCI+PHN0cm9uZz5TbWFsbC1iYXRjaCBoYXJ2ZXN0PC9zdHJvbmc+PHNwYW4+Q2FyZWZ1bGx5IHBpY2tlZCBsZWF2ZXM8L3NwYW4+PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9zZWN0aW9uPlxyXG5cclxuICAgIDwhLS0gUmVtYWluaW5nIHNlY3Rpb25zIChmYXJtLCBiZW5lZml0cywgbWFtYWtpLCBicmV3LCBmYXEsIHRlc3RpbW9uaWFscywgY3RhLCBmb290ZXIpIC0tPlxyXG4gICAgPCEtLSBDb3BpZWQgZnJvbSBvcmlnaW5hbCBzdGF0aWMgSFRNTCBidXQgdHJpbW1lZCBoZXJlIGZvciBicmV2aXR5OyBmdWxsIGNvbnRlbnQgaW5jbHVkZWQgaW4gc3R5bGVzIGJlbG93IC0tPlxyXG4gICAgPHNlY3Rpb24gaWQ9XCJmYXJtXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1oZWFkXCI+XHJcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImtpY2tlclwiPk91ciBGYXJtPC9zcGFuPlxyXG4gICAgICAgICAgPGgyPlB1bGFtYSBGYXJtIGlzIGEgcXVpZXQgZ3Jvd2luZyBwbGFjZSBhYm92ZSB0aGUgS29uYSBjb2FzdC48L2gyPlxyXG4gICAgICAgICAgPHA+U2V0IGluIE1ha2FsZWkgRXN0YXRlcywgUHVsYW1hIEZhcm0gaXMgZGVzY3JpYmVkIGFzIGEgMy1hY3JlIGVzdGF0ZSB3aGVyZSBNYW1ha2kgaXMgZ3Jvd24gYXQgYWJvdXQgMSwzNTAgZmVldCBlbGV2YXRpb24uIFRoZSBsZWF2ZXMgYXJlIGhhcnZlc3RlZCBpbiB2ZXJ5IHNtYWxsIGJhdGNoZXMsIGRyaWVkIGluIHRoZSBLb25hIHN1biwgYW5kIHNlbGVjdGVkIGNhcmVmdWxseSB0byBwcmVzZXJ2ZSBib3RoIGZsYXZvciBhbmQgY2hhcmFjdGVyLjwvcD5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwic3RvcnktZ3JpZFwiPlxyXG4gICAgICAgICAgPGFydGljbGUgY2xhc3M9XCJjYXJkIHN0b3J5LWNvcHlcIj5cclxuICAgICAgICAgICAgPHA+UHVsYW1hIEZhcm0gZW1icmFjZXMgYSBkZWVwIGNvbm5lY3Rpb24gdG8gdGhlIGxhbmQsIG51cnR1cmluZyBlYWNoIE1hbWFraSB0ZWEgcGxhbnQgd2l0aCBjYXJlZnVsIGN1bHRpdmF0aW9uIGFuZCBpbnRlbnRpb25hbCBoYXJ2ZXN0aW5nLiBSb290ZWQgaW4gYSBzdXN0YWluYWJpbGl0eS1maXJzdCBhcHByb2FjaCwgdGhlIGZhcm0gdGhyaXZlcyB3aXRob3V0IHN5bnRoZXRpYyBmZXJ0aWxpemVycyBvciBwZXN0aWNpZGVzLCBlbnN1cmluZyBldmVyeSBzaXAgcmVmbGVjdHMgdGhlIHB1cml0eSBhbmQgY2FyZSBvZiB0aGUgSGF3YWlpYW4gc29pbC48L3A+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidWxsZXQtbGlzdFwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidWxsZXQtcm93XCI+PGk+MDE8L2k+PGRpdj48c3Ryb25nPkhhbmQtc2VsZWN0ZWQgbGVhdmVzPC9zdHJvbmc+PGJyPjxzcGFuPk9ubHkgdGhlIGJlc3QgbGVhdmVzIGFyZSBwaWNrZWQgdG8gc3VwcG9ydCBhIGNsZWFuLCBiYWxhbmNlZCBjdXAuPC9zcGFuPjwvZGl2PjwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidWxsZXQtcm93XCI+PGk+MDI8L2k+PGRpdj48c3Ryb25nPlN1bi1kcmllZCBpbiBLb25hPC9zdHJvbmc+PGJyPjxzcGFuPkRyeWluZyBpbiB0aGUgS29uYSBzdW4gcmVpbmZvcmNlcyB0aGUgaGFuZGNyYWZ0ZWQsIGxvY2FsIGlkZW50aXR5IG9mIHRoZSB0ZWEuPC9zcGFuPjwvZGl2PjwvZGl2PlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidWxsZXQtcm93XCI+PGk+MDM8L2k+PGRpdj48c3Ryb25nPlN1c3RhaW5hYmx5IGdyb3duPC9zdHJvbmc+PGJyPjxzcGFuPlRoZSBmYXJtIGVtcGhhc2l6ZXMgZ3Jvd2luZyB3aXRob3V0IHN5bnRoZXRpYyBmZXJ0aWxpemVycyBhbmQgcGVzdGljaWRlcy48L3NwYW4+PC9kaXY+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGZpZ3VyZSBjbGFzcz1cInNwbGl0LXBob3RvXCI+XHJcbiAgICAgICAgICAgIDxpbWcgY2xhc3M9XCJzdG9yeS1waG90byBjYXJkXCIgc3JjPVwiL3B1bGFtYS1mYXJtL2Zhcm0uanBlZ1wiIGFsdD1cIk1hbWFraSBwbGFudHMgZ3Jvd2luZyBhdCBQdWxhbWEgRmFybSB3aXRoIG9jZWFuIHZpZXcgYmV5b25kXCIgd2lkdGg9XCIxNTM2XCIgaGVpZ2h0PVwiMjA0OFwiIGxvYWRpbmc9XCJsYXp5XCIgLz5cclxuICAgICAgICAgIDwvZmlndXJlPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvc2VjdGlvbj5cclxuXHJcbiAgICA8c2VjdGlvbiBpZD1cImJlbmVmaXRzXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1oZWFkXCI+XHJcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImtpY2tlclwiPkJlbmVmaXRzPC9zcGFuPlxyXG4gICAgICAgICAgPGgyPkEgcmVzdG9yYXRpdmUgdGVhIGJ1aWx0IGZvciBjYWxtLCBjbGFyaXR5LCBhbmQgZXZlcnlkYXkgd2VsbG5lc3MuPC9oMj5cclxuICAgICAgICAgIDxwPk1hbWFraSBpcyBhIHRyYWRpdGlvbmFsIEhhd2FpaWFuIGhlcmJhbCB0ZWEgdmFsdWVkIGZvciBtZW50YWwgY2xhcml0eSwgY2FsbSBmb2N1cywgZGlnZXN0aXZlIGNvbWZvcnQsIGFudGlveGlkYW50IHN1cHBvcnQsIGFuZCBhIG5hdHVyYWxseSBzb290aGluZyBjYWZmZWluZS1mcmVlIGV4cGVyaWVuY2UuPC9wPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJiZW5lZml0cy1ncmlkXCI+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBjbGFzcz1cImNhcmQgYmVuZWZpdFwiPjxkaXYgY2xhc3M9XCJiZW5lZml0LWljb25cIj4wMTwvZGl2PjxoMz5NZW50YWwgY2xhcml0eTwvaDM+PHA+TWFtYWtpIHRlYSBzdXBwb3J0cyBmb2N1cyBhbmQgY2FsbSBhdHRlbnRpb24gd2l0aG91dCB0aGUgaml0dGVyeSBmZWVsaW5nIG9mIGNhZmZlaW5hdGVkIGRyaW5rcy48L3A+PC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgY2xhc3M9XCJjYXJkIGJlbmVmaXRcIj48ZGl2IGNsYXNzPVwiYmVuZWZpdC1pY29uXCI+MDI8L2Rpdj48aDM+SW1tdW5lIHN1cHBvcnQ8L2gzPjxwPlRoZSB0ZWEgaXMgcmljaCBpbiBhbnRpb3hpZGFudHMgaW5jbHVkaW5nIHBvbHlwaGVub2xzLCBjYXRlY2hpbnMsIGZsYXZvbm9pZHMsIGFuZCBxdWVyY2V0aW4uPC9wPjwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGNsYXNzPVwiY2FyZCBiZW5lZml0XCI+PGRpdiBjbGFzcz1cImJlbmVmaXQtaWNvblwiPjAzPC9kaXY+PGgzPkhlYXJ0LWZyaWVuZGx5IHJpdHVhbDwvaDM+PHA+VGhlc2UgY29tcG91bmRzIG1heSBoZWxwIHN1cHBvcnQgY2lyY3VsYXRpb24gYW5kIHJlZHVjZSBibG9vZCBwcmVzc3VyZSBhbmQgY2hvbGVzdGVyb2wgbGV2ZWxzLjwvcD48L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBjbGFzcz1cImNhcmQgYmVuZWZpdFwiPjxkaXYgY2xhc3M9XCJiZW5lZml0LWljb25cIj4wNDwvZGl2PjxoMz5EaWdlc3RpdmUgY29tZm9ydDwvaDM+PHA+TWFtYWtpIGlzIGRlc2NyaWJlZCBhcyBoZWxwaW5nIGRpZ2VzdGlvbiwgZWFzaW5nIGJsb2F0aW5nIGFmdGVyIG1lYWxzLCBhbmQgZ2VudGx5IHNvb3RoaW5nIGFiZG9taW5hbCBkaXNjb21mb3J0LjwvcD48L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBjbGFzcz1cImNhcmQgYmVuZWZpdFwiPjxkaXYgY2xhc3M9XCJiZW5lZml0LWljb25cIj4wNTwvZGl2PjxoMz5SZXN0IGFuZCByZWNvdmVyeTwvaDM+PHA+TWFtYWtpIHRlYSBjYWxtcyB0aGUgbWluZCBhbmQgYm9keSwgbWFraW5nIGl0IHBlcmZlY3QgZm9yIGV2ZW5pbmcgcm91dGluZXMgYW5kIHJlc3RmdWwgdW53aW5kaW5nLjwvcD48L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBjbGFzcz1cImNhcmQgYmVuZWZpdFwiPjxkaXYgY2xhc3M9XCJiZW5lZml0LWljb25cIj4wNjwvZGl2PjxoMz5NaW5lcmFsLXJpY2ggY3VwPC9oMz48cD5NYW1ha2kgdGVhIGNvbnRhaW5zIG1hZ25lc2l1bSBhbmQgcG90YXNzaXVtLCB3aGljaCBzdXBwb3J0IGJyYWluIGFuZCBuZXJ2ZSBoZWFsdGguPC9wPjwvYXJ0aWNsZT5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L3NlY3Rpb24+XHJcblxyXG4gICAgPHNlY3Rpb24gY2xhc3M9XCJzcGxpdFwiIGlkPVwibWFtYWtpXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXIgc3BsaXQtZ3JpZFwiPlxyXG4gICAgICAgIDxmaWd1cmUgY2xhc3M9XCJhYm91dC1waG90b1wiPlxyXG4gICAgICAgICAgPGltZyBjbGFzcz1cImNhcmRcIiBzcmM9XCIvcHVsYW1hLWZhcm0vcGxhbnRzLmpwZWdcIiBhbHQ9XCJDbG9zZS11cCBvZiBNYW1ha2kgcGxhbnRzIGF0IFB1bGFtYSBGYXJtIG51cnNlcnkgcm93c1wiIHdpZHRoPVwiMTA1MFwiIGhlaWdodD1cIjE0MDBcIiBsb2FkaW5nPVwibGF6eVwiIC8+XHJcbiAgICAgICAgPC9maWd1cmU+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImFib3V0LWNvcHlcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWhlYWRcIiBzdHlsZT1cIm1hcmdpbi1ib3R0b206MFwiPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImtpY2tlclwiPkFib3V0IE1hbWFraTwvc3Bhbj5cclxuICAgICAgICAgICAgPGgyPlRoZSDigJxoZWFsZXIgb2YgdGhlIGZvcmVzdOKAnSBpbiBhIG1vZGVybiBkYWlseSB0ZWEgcml0dWFsLjwvaDI+XHJcbiAgICAgICAgICAgIDxwPk1hbWFraSwgb3IgPGVtPlBpcHR1cnVzIGFsYmlkdXM8L2VtPiwgaXMgYSBwbGFudCBsb25nIGFzc29jaWF0ZWQgd2l0aCB0cmFkaXRpb25hbCBIYXdhaWlhbiB1c2UuIEl0IGlzIGVhcnRoeSwgc2xpZ2h0bHkgbnV0dHksIGNhZmZlaW5lLWZyZWUsIGFuZCBwZXJmZWN0IGZvciBtaW5kZnVsIGRheXRpbWUgZHJpbmtpbmcgb3IgY2FsbSBldmVuaW5nIHJvdXRpbmVzLjwvcD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cInN0YXRzXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzdGF0XCI+PHN0cm9uZz5QaXB0dXJ1cyBhbGJpZHVzPC9zdHJvbmc+PHNwYW4+TmF0aXZlIEhhd2FpaWFuIGhlcmJhbCB0ZWEgcGxhbnQgZmVhdHVyZWQgaW4geW91ciBzb3VyY2UgY29weS48L3NwYW4+PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzdGF0XCI+PHN0cm9uZz5DYWZmZWluZSBmcmVlPC9zdHJvbmc+PHNwYW4+RGVzaWduZWQgZm9yIGNsYXJpdHkgYW5kIGNhbG0gd2l0aG91dCBjb2ZmZWUtbGlrZSBzdGltdWxhdGlvbi48L3NwYW4+PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzdGF0XCI+PHN0cm9uZz5FYXJ0aHksIG51dHR5IHRhc3RlPC9zdHJvbmc+PHNwYW4+QSB3YXJtIGZsYXZvciBwcm9maWxlIHRoYXQgY2FuIGJlIGVuam95ZWQgaG90IG9yIGljZWQuPC9zcGFuPjwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwic3RhdFwiPjxzdHJvbmc+RGFpbHktdXNlIGZyaWVuZGx5PC9zdHJvbmc+PHNwYW4+VGhlIHNvdXJjZSBGQVEgc2F5cyBNYW1ha2kgdGVhIGNhbiBiZSBlbmpveWVkIGV2ZXJ5IGRheS48L3NwYW4+PC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L3NlY3Rpb24+XHJcblxyXG4gICAgPHNlY3Rpb24gaWQ9XCJicmV3XCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1oZWFkXCI+XHJcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImtpY2tlclwiPkhvdyB0byBCcmV3PC9zcGFuPlxyXG4gICAgICAgICAgPGgyPlNpbXBsZSBicmV3aW5nIGZvciBhIGRhcmtlciBhbWJlciBvciBtYXJvb24tYnJvd24gY3VwLjwvaDI+XHJcbiAgICAgICAgICA8cD5Vc2UgYWJvdXQgMSB0YWJsZXNwb29uIG9mIGNydXNoZWQgbGVhdmVzLCBvciBhcm91bmQgMTAgdG8gMTUgbGVhdmVzLCBwZXIgcXVhcnQgb2YgYm9pbGluZyB3YXRlciBhbmQgc3RlZXAgdW50aWwgdGhlIGNvbG9yIGRlZXBlbnMuPC9wPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJicmV3LXdyYXBcIj5cclxuICAgICAgICAgIDxhcnRpY2xlIGNsYXNzPVwiY2FyZCBzdGVwXCI+PGRpdiBjbGFzcz1cInN0ZXAtbnVtYmVyXCI+MTwvZGl2PjxoMz5NZWFzdXJlPC9oMz48cD5Vc2UgMSB0YWJsZXNwb29uIG9mIGNydXNoZWQgbGVhdmVzLCByb3VnaGx5IDEgdG8gMiBsYXJnZXIgbGVhdmVzIG9yIDEwIHRvIDE1IGxlYXZlcyBwZXIgcXVhcnQuPC9wPjwvYXJ0aWNsZT5cclxuICAgICAgICAgIDxhcnRpY2xlIGNsYXNzPVwiY2FyZCBzdGVwXCI+PGRpdiBjbGFzcz1cInN0ZXAtbnVtYmVyXCI+MjwvZGl2PjxoMz5TdGVlcDwvaDM+PHA+Qm9pbCBvciBzdGVlcCBmb3IgMTAgdG8gMjAgbWludXRlcyBkZXBlbmRpbmcgb24gdGhlIGRlcHRoIGFuZCBzdHJlbmd0aCB5b3Ugd2FudC48L3A+PC9hcnRpY2xlPlxyXG4gICAgICAgICAgPGFydGljbGUgY2xhc3M9XCJjYXJkIHN0ZXBcIj48ZGl2IGNsYXNzPVwic3RlcC1udW1iZXJcIj4zPC9kaXY+PGgzPldhdGNoIHRoZSBjb2xvcjwvaDM+PHA+QnJldyB1bnRpbCB0aGUgdGVhIHJlYWNoZXMgYSBkYXJrIGFtYmVyIG9yIG1hcm9vbi1icm93biB0b25lLjwvcD48L2FydGljbGU+XHJcbiAgICAgICAgICA8YXJ0aWNsZSBjbGFzcz1cImNhcmQgc3RlcFwiPjxkaXYgY2xhc3M9XCJzdGVwLW51bWJlclwiPjQ8L2Rpdj48aDM+RW5qb3kgYWdhaW48L2gzPjxwPlRoZSBsZWF2ZXMgY2FuIGJlIHJlLXN0ZWVwZWQgMiB0byAzIHRpbWVzIGZvciBhZGRpdGlvbmFsIGN1cHMuPC9wPjwvYXJ0aWNsZT5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwicGFpcmluZ3NcIj48c3Ryb25nPlNlcnZpbmcgaWRlYXM8L3N0cm9uZz48cD5TZXJ2ZSBNYW1ha2kgYXMgaWNlZCB0ZWEgd2l0aCBsZW1vbiBvciBwYWlyIGl0IHdpdGggbGVtb25ncmFzcywgbWludCwgb3IgbGVtb24gZm9yIGEgYnJpZ2h0ZXIgZmxhdm9yIHByb2ZpbGUuPC9wPjwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvc2VjdGlvbj5cclxuXHJcbiAgICA8c2VjdGlvbiBpZD1cImZhcVwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInNlY3Rpb24taGVhZFwiPlxyXG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJraWNrZXJcIj5GQVE8L3NwYW4+XHJcbiAgICAgICAgICA8aDI+UXVlc3Rpb25zIGN1c3RvbWVycyBhcmUgbGlrZWx5IHRvIGFzayBiZWZvcmUgb3JkZXJpbmcuPC9oMj5cclxuICAgICAgICAgIDxwPlRoZSBGQVEgY29udGVudCBiZWxvdyBpcyBhZGFwdGVkIGZyb20gdGhlIGRvY3VtZW50IHlvdSBhdHRhY2hlZCwgd2l0aCB3b3JkaW5nIHBvbGlzaGVkIGZvciB3ZWIgcHJlc2VudGF0aW9uIHdoaWxlIGtlZXBpbmcgdGhlIG9yaWdpbmFsIHN1YnN0YW5jZSBpbnRhY3QuPC9wPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJmYXEtZ3JpZFwiPlxyXG4gICAgICAgICAgPGRldGFpbHMgY2xhc3M9XCJjYXJkXCIgb3Blbj48c3VtbWFyeT5Eb2VzIE1hbWFraSB0ZWEgY29udGFpbiBjYWZmZWluZT88c3Bhbj4rPC9zcGFuPjwvc3VtbWFyeT48cD5Oby4gTWFtYWtpIHRlYSBpcyBjYWZmZWluZS1mcmVlLCBwZXJmZWN0IGZvciBjYWxtIGRhaWx5IGRyaW5raW5nIGFuZCBldmVuaW5nIHVzZS48L3A+PC9kZXRhaWxzPlxyXG4gICAgICAgICAgPGRldGFpbHMgY2xhc3M9XCJjYXJkXCI+PHN1bW1hcnk+SXMgaXQgc2FmZSBmb3IgZGFpbHkgdXNlPzxzcGFuPis8L3NwYW4+PC9zdW1tYXJ5PjxwPlllcywgTWFtYWtpIHRlYSBjYW4gYmUgZW5qb3llZCBkYWlseSwgYW5kIHNpZGUgZWZmZWN0cyBhcmUgcmFyZS48L3A+PC9kZXRhaWxzPlxyXG4gICAgICAgICAgPGRldGFpbHMgY2xhc3M9XCJjYXJkXCI+PHN1bW1hcnk+Q2FuIGl0IGhlbHAgZGlnZXN0aW9uPzxzcGFuPis8L3NwYW4+PC9zdW1tYXJ5PjxwPk1hbWFraSB0ZWEgc3VwcG9ydHMgZGlnZXN0aW9uLCBoZWxwcyB3aXRoIGJsb2F0aW5nLCBhbmQgc29vdGhlcyBhYmRvbWluYWwgZGlzY29tZm9ydCBhZnRlciBtZWFscy48L3A+PC9kZXRhaWxzPlxyXG4gICAgICAgICAgPGRldGFpbHMgY2xhc3M9XCJjYXJkXCI+PHN1bW1hcnk+SXMgaXQgaGlnaCBpbiBhbnRpb3hpZGFudHM/PHNwYW4+Kzwvc3Bhbj48L3N1bW1hcnk+PHA+TWFtYWtpIHRlYSBpcyByaWNoIGluIHBvbHlwaGVub2xzLCBjYXRlY2hpbnMsIGZsYXZvbm9pZHMsIGFuZCBxdWVyY2V0aW4uPC9wPjwvZGV0YWlscz5cclxuICAgICAgICAgIDxkZXRhaWxzIGNsYXNzPVwiY2FyZFwiPjxzdW1tYXJ5PkFyZSB0aGVyZSBhbnkgY2F1dGlvbnM/PHNwYW4+Kzwvc3Bhbj48L3N1bW1hcnk+PHA+QWxsZXJnaWMgcmVhY3Rpb25zIGFyZSByYXJlLCBidXQgaWYgeW91J3JlIHNlbnNpdGl2ZSB0byB0aGUgVXJ0aWNhY2VhZSBmYW1pbHksIHlvdSBtaWdodCBleHBlcmllbmNlIG1pbGQgaXRjaGluZyBvciByYXNoLjwvcD48L2RldGFpbHM+XHJcbiAgICAgICAgICA8ZGV0YWlscyBjbGFzcz1cImNhcmRcIj48c3VtbWFyeT5XaGF0IGRvZXMgaXQgdGFzdGUgbGlrZT88c3Bhbj4rPC9zcGFuPjwvc3VtbWFyeT48cD5UaGUgdGVhIGhhcyBhIHdhcm0sIGVhcnRoeSwgYW5kIHNsaWdodGx5IG51dHR5IGZsYXZvciB0aGF04oCZcyBlbmpveWFibGUgaG90IG9yIGljZWQuPC9wPjwvZGV0YWlscz5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L3NlY3Rpb24+XHJcblxyXG4gICAgPHNlY3Rpb24+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1oZWFkXCI+XHJcbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImtpY2tlclwiPkJyYW5kIHZvaWNlIGFkZGl0aW9uczwvc3Bhbj5cclxuICAgICAgICAgIDxoMj5DcmVhdGluZyBhIGRlZXBlciBjb25uZWN0aW9uIHdpdGggYXV0aGVudGljaXR5IGFuZCBjYXJlLjwvaDI+XHJcbiAgICAgICAgICA8cD5XZSBmb2N1c2VkIG9uIGhpZ2hsaWdodGluZyBQdWxhbWEgRmFybSdzIHN0b3J5IGFuZCB0aGUgcHJlbWl1bSBkZWRpY2F0aW9uIHRvIGF1dGhlbnRpY2l0eS4gUmljaCBzdG9yeXRlbGxpbmcsIGEgc3Ryb25nIGhlcm8gbWVzc2FnZSwgYXV0aGVudGljIEZBUXMsIGFuZCBjdXN0b21lciB0ZXN0aW1vbmlhbHMgbm93IGVtcGhhc2l6ZSB3aGF0IG1ha2VzIE1hbWFraSB0ZWEgdHJ1bHkgc3BlY2lhbC48L3A+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInRlc3RpbW9uaWFsc1wiPlxyXG4gICAgICAgICAgPGJsb2NrcXVvdGUgY2xhc3M9XCJjYXJkXCI+PHA+4oCcVGhpcyB0ZWEgaXMgdGhlIHBlcmZlY3QgYWRkaXRpb24gdG8gbXkgZXZlbmluZ3MuIEl04oCZcyBpbmNyZWRpYmx5IGNhbG1pbmcsIGFuZCBJIGxvdmUga25vd2luZyBpdOKAmXMgZnJlZSBmcm9tIGNhZmZlaW5lLuKAnTwvcD48Zm9vdGVyPi0gU2FyYWggSy4sIEhpbG88L2Zvb3Rlcj48L2Jsb2NrcXVvdGU+XHJcbiAgICAgICAgICA8YmxvY2txdW90ZSBjbGFzcz1cImNhcmRcIj48cD7igJxNYW1ha2kgdGVhIGhhcyBhIHdvbmRlcmZ1bGx5IGVhcnRoeSBmbGF2b3IgdGhhdCBwYWlycyBiZWF1dGlmdWxseSB3aXRoIGxlbW9uLiBJdOKAmXMgc28gcmVmcmVzaGluZyBpY2VkIG9uIHdhcm0gS29uYSBkYXlzIeKAnTwvcD48Zm9vdGVyPi0gSmFtZXMgTC4sIEthaWx1YS1Lb25hPC9mb290ZXI+PC9ibG9ja3F1b3RlPlxyXG4gICAgICAgICAgPGJsb2NrcXVvdGUgY2xhc3M9XCJjYXJkXCI+PHA+4oCcWW91IGNhbiBmZWVsIHRoZSBjYXJlIFB1bGFtYSBGYXJtIHB1dHMgaW50byBldmVyeSBjdXAuIFRoZSB0ZWEgaXMgYW1hemluZywgYW5kIHRoZSBLb25hIHJvb3RzIG1ha2UgaXQgdW5pcXVlLuKAnTwvcD48Zm9vdGVyPi0gTWFpbGUgVy4sIEhvbm9sdWx1PC9mb290ZXI+PC9ibG9ja3F1b3RlPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvc2VjdGlvbj5cclxuXHJcbiAgICA8c2VjdGlvbiBjbGFzcz1cImN0YVwiIGlkPVwiY29udGFjdFwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyIGN0YS13cmFwXCI+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgIDxzcGFuIGNsYXNzPVwia2lja2VyXCIgc3R5bGU9XCJjb2xvcjojZjZkOGEwXCI+T3JkZXIgJiBDb250YWN0PC9zcGFuPlxyXG4gICAgICAgICAgPGgyPkJyaW5nIFB1bGFtYSBGYXJtIE1hbWFraSB0ZWEgaW50byB5b3VyIGRhaWx5IHJpdHVhbC48L2gyPlxyXG4gICAgICAgICAgPHA+V2UgYXJlIGRlZGljYXRlZCB0byBlbnN1cmluZyBldmVyeSBvcmRlciBpcyBoYW5kbGVkIHdpdGggY2FyZSwgZnJvbSBzZWN1cmUgcGF5bWVudCBvcHRpb25zIHRvIHByb3BlciBzaGlwcGluZyBhbmQgaGFuZGxpbmcuIFlvdXIgcHJpdmFjeSBpcyBvdXIgcHJpb3JpdHksIGFuZCB3ZSBndWFyYW50ZWUgYSBzbW9vdGgsIHdvcnJ5LWZyZWUgZXhwZXJpZW5jZSBmcm9tIHBsYWNpbmcgeW91ciBvcmRlciB0byBlbmpveWluZyB5b3VyIE1hbWFraSB0ZWEuPC9wPlxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImhlcm8tYWN0aW9uc1wiPlxyXG4gICAgICAgICAgICA8YSBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiIGhyZWY9XCJtYWlsdG86bWV6ZWlyQG91dGxvb2suY29tXCI+RW1haWwgdG8gb3JkZXI8L2E+XHJcbiAgICAgICAgICAgIDxhIGNsYXNzPVwiYnRuIGJ0bi1zZWNvbmRhcnlcIiBocmVmPVwidGVsOjUxMDU2NjYxMDBcIj5DYWxsIFB1bGFtYSBGYXJtPC9hPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGFzaWRlIGNsYXNzPVwiY29udGFjdC1wYW5lbFwiPlxyXG4gICAgICAgICAgPGgzPkNvbnRhY3QgZGV0YWlsczwvaDM+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGFjdC1zdGFja1wiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGFjdC1pdGVtXCI+PHNwYW4+RW1haWw8L3NwYW4+PHN0cm9uZz5tZXplaXJAb3V0bG9vay5jb208L3N0cm9uZz48L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhY3QtaXRlbVwiPjxzcGFuPlBob25lPC9zcGFuPjxzdHJvbmc+NTEwLTU2Ni02MTAwPC9zdHJvbmc+PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWN0LWl0ZW1cIj48c3Bhbj5XZWJzaXRlPC9zcGFuPjxzdHJvbmc+d3d3LnB1bGFtYWZhcm0uY29tPC9zdHJvbmc+PC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWN0LWl0ZW1cIj48c3Bhbj5Mb2NhdGlvbjwvc3Bhbj48c3Ryb25nPk1ha2FsZWkgRXN0YXRlcywgS2FpbHVhIEtvbmEsIEhhd2FpaSA5Njc0MDwvc3Ryb25nPjwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9hc2lkZT5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L3NlY3Rpb24+XHJcbiAgPC9tYWluPlxyXG5cclxuICA8Zm9vdGVyIGNsYXNzPVwic2l0ZS1mb290ZXJcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXIgZm9vdGVyLXdyYXBcIj5cclxuICAgICAgPHA+wqkgUHVsYW1hIEZhcm0gwrcgSGF3YWlpYW4gTWFtYWtpIHRlYSBncm93biBhbmQgcGFja2FnZWQgb24gdGhlIEJpZyBJc2xhbmQuPC9wPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiZm9vdGVyLWxpbmtzXCI+XHJcbiAgICAgICAgPGEgaHJlZj1cIiNmYXJtXCI+T3VyIEZhcm08L2E+XHJcbiAgICAgICAgPGEgaHJlZj1cIiNiZW5lZml0c1wiPkJlbmVmaXRzPC9hPlxyXG4gICAgICAgIDxhIGhyZWY9XCIjYnJld1wiPkJyZXdpbmc8L2E+XHJcbiAgICAgICAgPGEgaHJlZj1cIiNjb250YWN0XCI+Q29udGFjdDwvYT5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICA8L2Zvb3Rlcj5cclxuICBgXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBIb21lQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICB0aGVtZTogJ2xpZ2h0JyB8ICdkYXJrJyA9ICdsaWdodCc7XHJcblxyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgY29uc3QgcHJlZmVyc0RhcmsgPSB3aW5kb3cubWF0Y2hNZWRpYSAmJiB3aW5kb3cubWF0Y2hNZWRpYSgnKHByZWZlcnMtY29sb3Itc2NoZW1lOiBkYXJrKScpLm1hdGNoZXM7XHJcbiAgICB0aGlzLnRoZW1lID0gcHJlZmVyc0RhcmsgPyAnZGFyaycgOiAnbGlnaHQnO1xyXG4gICAgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNldEF0dHJpYnV0ZSgnZGF0YS10aGVtZScsIHRoaXMudGhlbWUpO1xyXG4gIH1cclxuXHJcbiAgdG9nZ2xlVGhlbWUoKSB7XHJcbiAgICB0aGlzLnRoZW1lID0gdGhpcy50aGVtZSA9PT0gJ2RhcmsnID8gJ2xpZ2h0JyA6ICdkYXJrJztcclxuICAgIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2RhdGEtdGhlbWUnLCB0aGlzLnRoZW1lKTtcclxuICB9XHJcbn0iXSwibWFwcGluZ3MiOiI7QUFBQSxTQUFTLDRCQUE0Qjs7O0FDQXJDLFNBQTRCLDBDQUEwQztBQUN0RSxTQUFTLHFCQUFxQjs7O0FDRDlCLFNBQVMsaUJBQXdDOztBQXFLM0MsSUFBTyxpQkFBUCxNQUFPLGdCQUFjO0VBQ3pCLFdBQVE7RUFFUjtFQUVBLGtCQUFlO0FBRWIsVUFBTSxPQUFPLElBQUksT0FBTyxHQUFHLFlBQVk7QUFDdkMsVUFBTSxRQUFRLFNBQVMsZUFBZSxLQUFLO0FBQzNDLFVBQU0sZUFBZSxTQUFTLGVBQWUsZUFBZTtBQUM1RCxVQUFNLGNBQWMsU0FBUyxlQUFlLGNBQWM7QUFDMUQsVUFBTSxhQUFhLFNBQVMsZUFBZSxhQUFhO0FBQ3hELFVBQU0sa0JBQWtCLFNBQVMsZUFBZSxrQkFBa0I7QUFDbEUsVUFBTSxrQkFBa0IsU0FBUyxlQUFlLGtCQUFrQjtBQUNsRSxVQUFNLGtCQUFrQixTQUFTLGVBQWUsa0JBQWtCO0FBQ2xFLFVBQU0sZUFBZSxTQUFTLGVBQWUsZUFBZTtBQUM1RCxVQUFNLGVB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QSxxQkFBQSxHQUFBLFVBQUEsR0FBQSxDQUFBLE1BQUEsYUFBQSxjQUFBLHFCQUFBLEdBQUEsU0FBQSxHQUFBLENBQUEsTUFBQSxPQUFBLFFBQUEsVUFBQSxTQUFBLEtBQUEsT0FBQSxLQUFBLE9BQUEsTUFBQSxjQUFBLFlBQUEsWUFBQSxJQUFBLEdBQUEsV0FBQSxHQUFBLENBQUEsTUFBQSxZQUFBLGNBQUEscUJBQUEsR0FBQSxTQUFBLEdBQUEsQ0FBQSxHQUFBLFdBQUEsR0FBQSxDQUFBLEdBQUEsYUFBQSxHQUFBLENBQUEsTUFBQSxpQkFBQSxHQUFBLGFBQUEsR0FBQSxDQUFBLEdBQUEsYUFBQSxHQUFBLENBQUEsTUFBQSxpQkFBQSxjQUFBLElBQUEsR0FBQSxlQUFBLEdBQUEsQ0FBQSxtQkFBQSxnQkFBQSxHQUFBLFFBQUEsY0FBQSxHQUFBLENBQUEsTUFBQSxnQkFBQSxHQUFBLG9CQUFBLEdBQUEsQ0FBQSxHQUFBLFdBQUEsR0FBQSxDQUFBLEdBQUEsT0FBQSxHQUFBLENBQUEsT0FBQSxPQUFBLEdBQUEsQ0FBQSxRQUFBLFFBQUEsTUFBQSxTQUFBLFFBQUEsU0FBQSxnQkFBQSxjQUFBLFlBQUEsRUFBQSxHQUFBLENBQUEsT0FBQSxNQUFBLEdBQUEsQ0FBQSxRQUFBLFFBQUEsTUFBQSxRQUFBLFFBQUEsUUFBQSxnQkFBQSxlQUFBLFlBQUEsRUFBQSxHQUFBLENBQUEsR0FBQSxTQUFBLE1BQUEsR0FBQSxDQUFBLE9BQUEsT0FBQSxHQUFBLENBQUEsUUFBQSxTQUFBLE1BQUEsU0FBQSxRQUFBLFNBQUEsZ0JBQUEsU0FBQSxZQUFBLEVBQUEsR0FBQSxDQUFBLE9BQUEsT0FBQSxHQUFBLENBQUEsUUFBQSxPQUFBLE1BQUEsU0FBQSxRQUFBLFNBQUEsZ0JBQUEsS0FBQSxHQUFBLENBQUEsT0FBQSxTQUFBLEdBQUEsQ0FBQSxRQUFBLFFBQUEsTUFBQSxXQUFBLFFBQUEsV0FBQSxnQkFBQSxrQkFBQSxZQUFBLEVBQUEsR0FBQSxDQUFBLE9BQUEsVUFBQSxHQUFBLENBQUEsUUFBQSxRQUFBLE1BQUEsWUFBQSxRQUFBLFlBQUEsZ0JBQUEsZUFBQSxHQUFBLENBQUEsT0FBQSxNQUFBLEdBQUEsQ0FBQSxRQUFBLFFBQUEsTUFBQSxRQUFBLFFBQUEsUUFBQSxnQkFBQSxrQkFBQSxZQUFBLEVBQUEsR0FBQSxDQUFBLE9BQUEsT0FBQSxHQUFBLENBQUEsTUFBQSxTQUFBLFFBQUEsU0FBQSxnQkFBQSxrQkFBQSxZQUFBLEVBQUEsR0FBQSxDQUFBLFNBQUEsRUFBQSxHQUFBLENBQUEsT0FBQSxLQUFBLEdBQUEsQ0FBQSxRQUFBLFFBQUEsTUFBQSxPQUFBLFFBQUEsT0FBQSxnQkFBQSxlQUFBLFlBQUEsRUFBQSxHQUFBLENBQUEsT0FBQSxTQUFBLEdBQUEsQ0FBQSxNQUFBLFdBQUEsUUFBQSxXQUFBLGdCQUFBLFNBQUEsR0FBQSxDQUFBLG1CQUFBLGdCQUFBLEdBQUEsUUFBQSxjQUFBLEdBQUEsQ0FBQSxNQUFBLGdCQUFBLEdBQUEsb0JBQUEsR0FBQSxDQUFBLEdBQUEsV0FBQSxRQUFBLGVBQUEsVUFBQSxPQUFBLFNBQUEsVUFBQSxXQUFBLGFBQUEsa0JBQUEsa0JBQUEsUUFBQSxrQkFBQSxLQUFBLGVBQUEsS0FBQSxHQUFBLENBQUEsUUFBQSxZQUFBLE1BQUEsZ0JBQUEsV0FBQSxJQUFBLEdBQUEsU0FBQSxVQUFBLFVBQUEsVUFBQSxnQkFBQSxzQkFBQSxHQUFBLENBQUEsTUFBQSxrQkFBQSxHQUFBLFdBQUEsUUFBQSxXQUFBLFFBQUEsT0FBQSxNQUFBLEdBQUEsQ0FBQSxPQUFBLGNBQUEsR0FBQSxDQUFBLFFBQUEsUUFBQSxNQUFBLGdCQUFBLFFBQUEsZ0JBQUEsZ0JBQUEsd0JBQUEsR0FBQSxDQUFBLE9BQUEsV0FBQSxHQUFBLENBQUEsUUFBQSxRQUFBLE1BQUEsYUFBQSxRQUFBLGFBQUEsZ0JBQUEsd0JBQUEsR0FBQSxDQUFBLE9BQUEsWUFBQSxHQUFBLENBQUEsUUFBQSxRQUFBLE1BQUEsY0FBQSxRQUFBLGNBQUEsZ0JBQUEsd0JBQUEsR0FBQSxDQUFBLE9BQUEsVUFBQSxHQUFBLENBQUEsUUFBQSxRQUFBLE1BQUEsWUFBQSxRQUFBLFlBQUEsZ0JBQUEscUJBQUEsR0FBQSxDQUFBLG1CQUFBLGVBQUEsR0FBQSxRQUFBLGNBQUEsR0FBQSxDQUFBLE1BQUEsZUFBQSxHQUFBLG9CQUFBLEdBQUEsQ0FBQSxHQUFBLGlCQUFBLEdBQUEsQ0FBQSxPQUFBLFlBQUEsR0FBQSxDQUFBLFFBQUEsUUFBQSxNQUFBLGNBQUEsUUFBQSxjQUFBLGdCQUFBLFdBQUEsWUFBQSxFQUFBLEdBQUEsQ0FBQSxPQUFBLFlBQUEsR0FBQSxDQUFBLEdBQUEsa0JBQUEsR0FBQSxDQUFBLFFBQUEsUUFBQSxNQUFBLGNBQUEsUUFBQSxjQUFBLGFBQUEsTUFBQSxnQkFBQSxhQUFBLFlBQUEsSUFBQSxhQUFBLFNBQUEsR0FBQSxDQUFBLE1BQUEsb0JBQUEsYUFBQSxVQUFBLEdBQUEsWUFBQSxHQUFBLENBQUEsT0FBQSxRQUFBLEdBQUEsQ0FBQSxRQUFBLFFBQUEsTUFBQSxVQUFBLFFBQUEsVUFBQSxhQUFBLEtBQUEsZ0JBQUEsVUFBQSxZQUFBLElBQUEsYUFBQSxTQUFBLEdBQUEsQ0FBQSxPQUFBLEtBQUEsR0FBQSxDQUFBLFFBQUEsUUFBQSxNQUFBLE9BQUEsUUFBQSxPQUFBLGFBQUEsS0FBQSxnQkFBQSxVQUFBLFlBQUEsSUFBQSxhQUFBLFNBQUEsR0FBQSxDQUFBLFFBQUEsVUFBQSxNQUFBLGNBQUEsR0FBQSxZQUFBLEdBQUEsQ0FBQSxNQUFBLGNBQUEsR0FBQSxDQUFBLE1BQUEsY0FBQSxHQUFBLENBQUEsR0FBQSxjQUFBLFVBQUEsYUFBQSxrQkFBQSxTQUFBLDJCQUFBLGNBQUEsT0FBQSxHQUFBLENBQUEsR0FBQSxTQUFBLEdBQUEsQ0FBQSxjQUFBLGlCQUFBLEdBQUEsUUFBQSxlQUFBLEdBQUEsQ0FBQSxHQUFBLGVBQUEsR0FBQSxDQUFBLEdBQUEsV0FBQSxRQUFBLE9BQUEsVUFBQSxlQUFBLFVBQUEsV0FBQSxXQUFBLGlCQUFBLCtEQUFBLEdBQUEsQ0FBQSxPQUFBLDRCQUFBLE9BQUEsOEJBQUEsU0FBQSxNQUFBLFVBQUEsTUFBQSxXQUFBLFFBQUEsR0FBQSxpQkFBQSxTQUFBLGNBQUEsU0FBQSxRQUFBLFFBQUEsY0FBQSxTQUFBLEdBQUEsQ0FBQSxHQUFBLFFBQUEsR0FBQSxHQUFBLENBQUEsR0FBQSxhQUFBLGtCQUFBLGVBQUEsS0FBQSxHQUFBLENBQUEsR0FBQSxhQUFBLGtCQUFBLFNBQUEseUJBQUEsR0FBQSxDQUFBLE1BQUEsYUFBQSxHQUFBLENBQUEsTUFBQSxvQkFBQSxHQUFBLGFBQUEsa0JBQUEsZUFBQSxPQUFBLFNBQUEsc0JBQUEsR0FBQSxDQUFBLEdBQUEsY0FBQSxHQUFBLENBQUEsTUFBQSxrQkFBQSxHQUFBLENBQUEsTUFBQSxpQkFBQSxHQUFBLGNBQUEsR0FBQSxDQUFBLE1BQUEsa0JBQUEsR0FBQSxDQUFBLEdBQUEsZ0JBQUEsT0FBQSxHQUFBLENBQUEsTUFBQSxlQUFBLEdBQUEsQ0FBQSxNQUFBLGlCQUFBLFFBQUEsVUFBQSxjQUFBLFFBQUEsbUJBQUEsaUJBQUEsR0FBQSxlQUFBLEdBQUEsQ0FBQSxHQUFBLGFBQUEsR0FBQSxDQUFBLEdBQUEsY0FBQSxHQUFBLENBQUEsTUFBQSxlQUFBLEdBQUEsQ0FBQSxHQUFBLFNBQUEseUJBQUEsR0FBQSxDQUFBLFFBQUEsS0FBQSxHQUFBLE9BQUEsYUFBQSxHQUFBLFNBQUEsUUFBQSxtQkFBQSxVQUFBLGNBQUEsT0FBQSxDQUFBLEdBQUEsVUFBQSxTQUFBLHdCQUFBLElBQUEsS0FBQTtBQUFBLFFBQUEsS0FBQSxHQUFBO0FBL0p6QixNQUFBLCtCQUFBLEdBQUEsT0FBQSxDQUFBLEVBQXdCLEdBQUEsT0FBQSxDQUFBLEVBQ0MsR0FBQSxRQUFBLENBQUE7QUFDQSxNQUFBLG9CQUFBLEdBQUEsaUJBQUE7QUFBZSxNQUFBLDZCQUFBO0FBQ3BDLE1BQUEsK0JBQUEsR0FBQSxJQUFBO0FBQUksTUFBQSxvQkFBQSxHQUFBLHVDQUFBO0FBQWdDLE1BQUEsNkJBQUE7QUFDcEMsTUFBQSwrQkFBQSxHQUFBLEtBQUEsQ0FBQTtBQUEwRSxNQUFBLG9CQUFBLEdBQUEsZ0pBQUE7QUFBOEksTUFBQSw2QkFBQSxFQUFJLEVBQ3hOO0FBR1IsTUFBQSwrQkFBQSxHQUFBLE9BQUEsQ0FBQSxFQUF1QixHQUFBLE9BQUEsQ0FBQSxFQUNRLElBQUEsT0FBQSxDQUFBLEVBR1UsSUFBQSxXQUFBLENBQUEsRUFHK0IsSUFBQSxPQUFBLENBQUE7QUFFOUQsTUFBQSwwQkFBQSxJQUFBLE9BQUEsQ0FBQTtBQUNGLE1BQUEsNkJBQUE7QUFDQSxNQUFBLCtCQUFBLElBQUEsT0FBQSxDQUFBLEVBQTZCLElBQUEsUUFBQSxFQUFBO0FBQ0MsTUFBQSxvQkFBQSxJQUFBLCtCQUFBO0FBQTBCLE1BQUEsNkJBQUE7QUFDdEQsTUFBQSwrQkFBQSxJQUFBLE1BQUEsRUFBQTtBQUF5QixNQUFBLG9CQUFBLElBQUEsaUNBQUE7QUFBMEIsTUFBQSw2QkFBQTtBQUNuRCxNQUFBLCtCQUFBLElBQUEsS0FBQSxFQUFBO0FBQXVCLE1BQUEsb0JBQUEsSUFBQSxtRUFBQTtBQUE0RCxNQUFBLDZCQUFBO0FBQ25GLE1BQUEsK0JBQUEsSUFBQSxPQUFBLEVBQUEsRUFBdUIsSUFBQSxRQUFBLEVBQUE7QUFDSSxNQUFBLG9CQUFBLElBQUEsUUFBQTtBQUFNLE1BQUEsNkJBQUE7QUFDL0IsTUFBQSwrQkFBQSxJQUFBLFFBQUEsRUFBQTtBQUEwQixNQUFBLG9CQUFBLElBQUEsU0FBQTtBQUFPLE1BQUEsNkJBQUEsRUFBTztBQUUxQyxNQUFBLCtCQUFBLElBQUEsT0FBQSxFQUFBLEVBQXFCLElBQUEsUUFBQSxFQUFBO0FBQ0ssTUFBQSxvQkFBQSxJQUFBLFVBQUE7QUFBUSxNQUFBLDZCQUFBO0FBQ2hDLE1BQUEsK0JBQUEsSUFBQSxPQUFBLEVBQUEsRUFBa0UsSUFBQSxVQUFBLEVBQUE7QUFDTSxNQUFBLG9CQUFBLElBQUEsUUFBQTtBQUFDLE1BQUEsNkJBQUE7QUFDdkUsTUFBQSwwQkFBQSxJQUFBLFNBQUEsRUFBQTtBQUNBLE1BQUEsK0JBQUEsSUFBQSxVQUFBLEVBQUE7QUFBcUUsTUFBQSxvQkFBQSxJQUFBLEdBQUE7QUFBQyxNQUFBLDZCQUFBLEVBQVMsRUFDM0U7QUFFUixNQUFBLCtCQUFBLElBQUEsT0FBQSxFQUFBLEVBQXVCLElBQUEsUUFBQSxFQUFBO0FBQ0ssTUFBQSxvQkFBQSxJQUFBLGFBQUE7QUFBVyxNQUFBLDZCQUFBO0FBQ3JDLE1BQUEsK0JBQUEsSUFBQSxRQUFBLEVBQUE7QUFBNkMsTUFBQSxvQkFBQSxJQUFBLFFBQUE7QUFBTSxNQUFBLDZCQUFBLEVBQU87QUFFNUQsTUFBQSwrQkFBQSxJQUFBLE9BQUEsRUFBQSxFQUF5QixJQUFBLE1BQUE7QUFDakIsTUFBQSxvQkFBQSxJQUFBLDJCQUFBO0FBQXlCLE1BQUEsNkJBQUE7QUFDL0IsTUFBQSwrQkFBQSxJQUFBLE1BQUE7QUFBTSxNQUFBLG9CQUFBLElBQUEsc0JBQUE7QUFBb0IsTUFBQSw2QkFBQTtBQUMxQixNQUFBLCtCQUFBLElBQUEsTUFBQTtBQUFNLE1BQUEsb0JBQUEsSUFBQSx3QkFBQTtBQUFzQixNQUFBLDZCQUFBLEVBQU8sRUFDL0IsRUFDRjtBQUlSLE1BQUEsK0JBQUEsSUFBQSxRQUFBLEVBQUEsRUFBMEQsSUFBQSxXQUFBLEVBQUEsRUFHVSxJQUFBLE1BQUEsRUFBQTtBQUNmLE1BQUEsb0JBQUEsSUFBQSxzQkFBQTtBQUFvQixNQUFBLDZCQUFBO0FBQ3JFLE1BQUEsK0JBQUEsSUFBQSxPQUFBLEVBQUEsRUFBdUIsSUFBQSxPQUFBLEVBQUEsRUFDRixJQUFBLFNBQUEsRUFBQTtBQUFtQixNQUFBLG9CQUFBLElBQUEsY0FBQTtBQUFZLE1BQUEsNkJBQUE7QUFBUSxNQUFBLDBCQUFBLElBQUEsU0FBQSxFQUFBO0FBQWdGLE1BQUEsNkJBQUE7QUFDMUksTUFBQSwrQkFBQSxJQUFBLE9BQUEsRUFBQSxFQUFtQixJQUFBLFNBQUEsRUFBQTtBQUFrQixNQUFBLG9CQUFBLElBQUEsYUFBQTtBQUFXLE1BQUEsNkJBQUE7QUFBUSxNQUFBLDBCQUFBLElBQUEsU0FBQSxFQUFBO0FBQStFLE1BQUEsNkJBQUEsRUFBTTtBQUUvSSxNQUFBLCtCQUFBLElBQUEsT0FBQSxFQUFBLEVBQXdCLElBQUEsU0FBQSxFQUFBO0FBQW1CLE1BQUEsb0JBQUEsSUFBQSxpQkFBQTtBQUFlLE1BQUEsNkJBQUE7QUFBUSxNQUFBLDBCQUFBLElBQUEsU0FBQSxFQUFBO0FBQTRFLE1BQUEsNkJBQUE7QUFDOUksTUFBQSwrQkFBQSxJQUFBLE9BQUEsRUFBQSxFQUF3QixJQUFBLFNBQUEsRUFBQTtBQUFtQixNQUFBLG9CQUFBLElBQUEsY0FBQTtBQUFZLE1BQUEsNkJBQUE7QUFBUSxNQUFBLDBCQUFBLElBQUEsU0FBQSxFQUFBO0FBQStELE1BQUEsNkJBQUE7QUFDOUgsTUFBQSwrQkFBQSxJQUFBLE9BQUEsRUFBQSxFQUF3QixJQUFBLFNBQUEsRUFBQTtBQUFxQixNQUFBLG9CQUFBLElBQUEsa0JBQUE7QUFBZ0IsTUFBQSw2QkFBQTtBQUFRLE1BQUEsMEJBQUEsSUFBQSxTQUFBLEVBQUE7QUFBd0YsTUFBQSw2QkFBQTtBQUM3SixNQUFBLCtCQUFBLElBQUEsT0FBQSxFQUFBLEVBQXdCLElBQUEsU0FBQSxFQUFBO0FBQXNCLE1BQUEsb0JBQUEsSUFBQSx3QkFBQTtBQUFzQixNQUFBLDZCQUFBO0FBQVEsTUFBQSwwQkFBQSxJQUFBLFNBQUEsRUFBQTtBQUFnRixNQUFBLDZCQUFBO0FBQzVKLE1BQUEsK0JBQUEsSUFBQSxPQUFBLEVBQUEsRUFBdUIsSUFBQSxPQUFBLEVBQUEsRUFDRixJQUFBLFNBQUEsRUFBQTtBQUFrQixNQUFBLG9CQUFBLElBQUEsUUFBQTtBQUFNLE1BQUEsNkJBQUE7QUFBUSxNQUFBLDBCQUFBLElBQUEsU0FBQSxFQUFBO0FBQWtGLE1BQUEsNkJBQUE7QUFDckksTUFBQSwrQkFBQSxJQUFBLE9BQUEsRUFBQSxFQUFtQixJQUFBLFNBQUEsRUFBQTtBQUFtQixNQUFBLG9CQUFBLElBQUEsU0FBQTtBQUFPLE1BQUEsNkJBQUE7QUFDM0MsTUFBQSwrQkFBQSxJQUFBLFVBQUEsRUFBQSxFQUF1RSxJQUFBLFVBQUEsRUFBQTtBQUNwRCxNQUFBLG9CQUFBLElBQUEsc0JBQUE7QUFBVSxNQUFBLDZCQUFBO0FBQzNCLE1BQUEsK0JBQUEsSUFBQSxRQUFBO0FBQVEsTUFBQSxvQkFBQSxJQUFBLElBQUE7QUFBRSxNQUFBLDZCQUFBO0FBQVMsTUFBQSwrQkFBQSxJQUFBLFFBQUE7QUFBUSxNQUFBLG9CQUFBLElBQUEsSUFBQTtBQUFFLE1BQUEsNkJBQUE7QUFBUyxNQUFBLCtCQUFBLElBQUEsUUFBQTtBQUFRLE1BQUEsb0JBQUEsSUFBQSxJQUFBO0FBQUUsTUFBQSw2QkFBQTtBQUFTLE1BQUEsK0JBQUEsSUFBQSxRQUFBO0FBQVEsTUFBQSxvQkFBQSxJQUFBLElBQUE7QUFBRSxNQUFBLDZCQUFBO0FBQVMsTUFBQSwrQkFBQSxJQUFBLFFBQUE7QUFBUSxNQUFBLG9CQUFBLElBQUEsSUFBQTtBQUFFLE1BQUEsNkJBQUE7QUFBUyxNQUFBLCtCQUFBLElBQUEsUUFBQTtBQUFRLE1BQUEsb0JBQUEsSUFBQSxJQUFBO0FBQUUsTUFBQSw2QkFBQTtBQUFTLE1BQUEsK0JBQUEsSUFBQSxRQUFBO0FBQVEsTUFBQSxvQkFBQSxLQUFBLElBQUE7QUFBRSxNQUFBLDZCQUFBO0FBQVMsTUFBQSwrQkFBQSxLQUFBLFFBQUE7QUFBUSxNQUFBLG9CQUFBLEtBQUEsSUFBQTtBQUFFLE1BQUEsNkJBQUE7QUFBUyxNQUFBLCtCQUFBLEtBQUEsUUFBQTtBQUFRLE1BQUEsb0JBQUEsS0FBQSxJQUFBO0FBQUUsTUFBQSw2QkFBQTtBQUFTLE1BQUEsK0JBQUEsS0FBQSxRQUFBO0FBQVEsTUFBQSxvQkFBQSxLQUFBLElBQUE7QUFBRSxNQUFBLDZCQUFBO0FBQVMsTUFBQSwrQkFBQSxLQUFBLFFBQUE7QUFBUSxNQUFBLG9CQUFBLEtBQUEsSUFBQTtBQUFFLE1BQUEsNkJBQUE7QUFBUyxNQUFBLCtCQUFBLEtBQUEsUUFBQTtBQUFRLE1BQUEsb0JBQUEsS0FBQSxJQUFBO0FBQUUsTUFBQSw2QkFBQTtBQUFTLE1BQUEsK0JBQUEsS0FBQSxRQUFBO0FBQVEsTUFBQSxvQkFBQSxLQUFBLElBQUE7QUFBRSxNQUFBLDZCQUFBO0FBQVMsTUFBQSwrQkFBQSxLQUFBLFFBQUE7QUFBUSxNQUFBLG9CQUFBLEtBQUEsSUFBQTtBQUFFLE1BQUEsNkJBQUE7QUFBUyxNQUFBLCtCQUFBLEtBQUEsUUFBQTtBQUFRLE1BQUEsb0JBQUEsS0FBQSxJQUFBO0FBQUUsTUFBQSw2QkFBQTtBQUFTLE1BQUEsK0JBQUEsS0FBQSxRQUFBO0FBQVEsTUFBQSxvQkFBQSxLQUFBLElBQUE7QUFBRSxNQUFBLDZCQUFBO0FBQVMsTUFBQSwrQkFBQSxLQUFBLFFBQUE7QUFBUSxNQUFBLG9CQUFBLEtBQUEsSUFBQTtBQUFFLE1BQUEsNkJBQUE7QUFBUyxNQUFBLCtCQUFBLEtBQUEsUUFBQTtBQUFRLE1BQUEsb0JBQUEsS0FBQSxJQUFBO0FBQUUsTUFBQSw2QkFBQTtBQUFTLE1BQUEsK0JBQUEsS0FBQSxRQUFBO0FBQVEsTUFBQSxvQkFBQSxLQUFBLElBQUE7QUFBRSxNQUFBLDZCQUFBO0FBQVMsTUFBQSwrQkFBQSxLQUFBLFFBQUE7QUFBUSxNQUFBLG9CQUFBLEtBQUEsSUFBQTtBQUFFLE1BQUEsNkJBQUE7QUFBUyxNQUFBLCtCQUFBLEtBQUEsUUFBQTtBQUFRLE1BQUEsb0JBQUEsS0FBQSxJQUFBO0FBQUUsTUFBQSw2QkFBQTtBQUFTLE1BQUEsK0JBQUEsS0FBQSxRQUFBO0FBQVEsTUFBQSxvQkFBQSxLQUFBLElBQUE7QUFBRSxNQUFBLDZCQUFBO0FBQVMsTUFBQSwrQkFBQSxLQUFBLFFBQUE7QUFBUSxNQUFBLG9CQUFBLEtBQUEsSUFBQTtBQUFFLE1BQUEsNkJBQUE7QUFBUyxNQUFBLCtCQUFBLEtBQUEsUUFBQTtBQUFRLE1BQUEsb0JBQUEsS0FBQSxJQUFBO0FBQUUsTUFBQSw2QkFBQTtBQUFTLE1BQUEsK0JBQUEsS0FBQSxRQUFBO0FBQVEsTUFBQSxvQkFBQSxLQUFBLElBQUE7QUFBRSxNQUFBLDZCQUFBO0FBQVMsTUFBQSwrQkFBQSxLQUFBLFFBQUE7QUFBUSxNQUFBLG9CQUFBLEtBQUEsSUFBQTtBQUFFLE1BQUEsNkJBQUE7QUFBUyxNQUFBLCtCQUFBLEtBQUEsUUFBQTtBQUFRLE1BQUEsb0JBQUEsS0FBQSxJQUFBO0FBQUUsTUFBQSw2QkFBQTtBQUFTLE1BQUEsK0JBQUEsS0FBQSxRQUFBO0FBQVEsTUFBQSxvQkFBQSxLQUFBLElBQUE7QUFBRSxNQUFBLDZCQUFBO0FBQVMsTUFBQSwrQkFBQSxLQUFBLFFBQUE7QUFBUSxNQUFBLG9CQUFBLEtBQUEsSUFBQTtBQUFFLE1BQUEsNkJBQUE7QUFBUyxNQUFBLCtCQUFBLEtBQUEsUUFBQTtBQUFRLE1BQUEsb0JBQUEsS0FBQSxJQUFBO0FBQUUsTUFBQSw2QkFBQTtBQUFTLE1BQUEsK0JBQUEsS0FBQSxRQUFBO0FBQVEsTUFBQSxvQkFBQSxLQUFBLElBQUE7QUFBRSxNQUFBLDZCQUFBO0FBQVMsTUFBQSwrQkFBQSxLQUFBLFFBQUE7QUFBUSxNQUFBLG9CQUFBLEtBQUEsSUFBQTtBQUFFLE1BQUEsNkJBQUE7QUFBUyxNQUFBLCtCQUFBLEtBQUEsUUFBQTtBQUFRLE1BQUEsb0JBQUEsS0FBQSxJQUFBO0FBQUUsTUFBQSw2QkFBQTtBQUFTLE1BQUEsK0JBQUEsS0FBQSxRQUFBO0FBQVEsTUFBQSxvQkFBQSxLQUFBLElBQUE7QUFBRSxNQUFBLDZCQUFBO0FBQVMsTUFBQSwrQkFBQSxLQUFBLFFBQUE7QUFBUSxNQUFBLG9CQUFBLEtBQUEsSUFBQTtBQUFFLE1BQUEsNkJBQUE7QUFBUyxNQUFBLCtCQUFBLEtBQUEsUUFBQTtBQUFRLE1BQUEsb0JBQUEsS0FBQSxJQUFBO0FBQUUsTUFBQSw2QkFBQTtBQUFTLE1BQUEsK0JBQUEsS0FBQSxRQUFBO0FBQVEsTUFBQSxvQkFBQSxLQUFBLElBQUE7QUFBRSxNQUFBLDZCQUFBO0FBQVMsTUFBQSwrQkFBQSxLQUFBLFFBQUE7QUFBUSxNQUFBLG9CQUFBLEtBQUEsSUFBQTtBQUFFLE1BQUEsNkJBQUE7QUFBUyxNQUFBLCtCQUFBLEtBQUEsUUFBQTtBQUFRLE1BQUEsb0JBQUEsS0FBQSxJQUFBO0FBQUUsTUFBQSw2QkFBQTtBQUFTLE1BQUEsK0JBQUEsS0FBQSxRQUFBO0FBQVEsTUFBQSxvQkFBQSxL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QSxjQUFBLFVBQUEsR0FBQSxPQUFBLGFBQUEsR0FBQSxDQUFBLFFBQUEsU0FBQSxHQUFBLE9BQUEsZUFBQSxHQUFBLENBQUEsR0FBQSxZQUFBLEdBQUEsQ0FBQSxHQUFBLE1BQUEsR0FBQSxDQUFBLE1BQUEsTUFBQSxHQUFBLENBQUEsR0FBQSxXQUFBLEdBQUEsQ0FBQSxHQUFBLGNBQUEsR0FBQSxDQUFBLEdBQUEsUUFBQSxHQUFBLENBQUEsR0FBQSxZQUFBLEdBQUEsQ0FBQSxHQUFBLFFBQUEsWUFBQSxHQUFBLENBQUEsR0FBQSxhQUFBLEdBQUEsQ0FBQSxHQUFBLFlBQUEsR0FBQSxDQUFBLEdBQUEsYUFBQSxHQUFBLENBQUEsT0FBQSwwQkFBQSxPQUFBLCtEQUFBLFNBQUEsUUFBQSxVQUFBLFFBQUEsV0FBQSxRQUFBLEdBQUEsZUFBQSxNQUFBLEdBQUEsQ0FBQSxNQUFBLFVBQUEsR0FBQSxDQUFBLEdBQUEsZUFBQSxHQUFBLENBQUEsR0FBQSxRQUFBLFNBQUEsR0FBQSxDQUFBLEdBQUEsY0FBQSxHQUFBLENBQUEsTUFBQSxVQUFBLEdBQUEsT0FBQSxHQUFBLENBQUEsR0FBQSxhQUFBLFlBQUEsR0FBQSxDQUFBLEdBQUEsYUFBQSxHQUFBLENBQUEsT0FBQSw0QkFBQSxPQUFBLHlEQUFBLFNBQUEsUUFBQSxVQUFBLFFBQUEsV0FBQSxRQUFBLEdBQUEsTUFBQSxHQUFBLENBQUEsR0FBQSxZQUFBLEdBQUEsQ0FBQSxHQUFBLGdCQUFBLEdBQUEsaUJBQUEsR0FBQSxHQUFBLENBQUEsR0FBQSxPQUFBLEdBQUEsQ0FBQSxHQUFBLE1BQUEsR0FBQSxDQUFBLE1BQUEsTUFBQSxHQUFBLENBQUEsR0FBQSxXQUFBLEdBQUEsQ0FBQSxHQUFBLFFBQUEsTUFBQSxHQUFBLENBQUEsR0FBQSxhQUFBLEdBQUEsQ0FBQSxHQUFBLFVBQUEsR0FBQSxDQUFBLE1BQUEsS0FBQSxHQUFBLENBQUEsR0FBQSxVQUFBLEdBQUEsQ0FBQSxRQUFBLElBQUEsR0FBQSxNQUFBLEdBQUEsQ0FBQSxHQUFBLE1BQUEsR0FBQSxDQUFBLEdBQUEsY0FBQSxHQUFBLENBQUEsTUFBQSxXQUFBLEdBQUEsS0FBQSxHQUFBLENBQUEsR0FBQSxhQUFBLFVBQUEsR0FBQSxDQUFBLEdBQUEsVUFBQSxHQUFBLFNBQUEsU0FBQSxHQUFBLENBQUEsUUFBQSw2QkFBQSxHQUFBLE9BQUEsYUFBQSxHQUFBLENBQUEsUUFBQSxrQkFBQSxHQUFBLE9BQUEsZUFBQSxHQUFBLENBQUEsR0FBQSxlQUFBLEdBQUEsQ0FBQSxHQUFBLGVBQUEsR0FBQSxDQUFBLEdBQUEsY0FBQSxHQUFBLENBQUEsR0FBQSxhQUFBLEdBQUEsQ0FBQSxHQUFBLGFBQUEsYUFBQSxHQUFBLENBQUEsR0FBQSxjQUFBLENBQUEsR0FBQSxVQUFBLFNBQUEsdUJBQUEsSUFBQSxLQUFBO0FBQUEsUUFBQSxLQUFBLEdBQUE7QUFsTXhCLE1BQUEsNkJBQUEsR0FBQSxLQUFBLENBQUE7QUFBcUMsTUFBQSxxQkFBQSxHQUFBLGlCQUFBO0FBQWUsTUFBQSwyQkFBQTtBQUNwRCxNQUFBLDZCQUFBLEdBQUEsVUFBQSxDQUFBLEVBQTRCLEdBQUEsT0FBQSxDQUFBLEVBQ00sR0FBQSxLQUFBLENBQUEsRUFDNkIsR0FBQSxRQUFBLENBQUE7O0FBRXZELE1BQUEsNkJBQUEsR0FBQSxPQUFBLENBQUE7QUFBNkgsTUFBQSx3QkFBQSxHQUFBLFFBQUEsQ0FBQSxFQUF5RCxHQUFBLFFBQUEsQ0FBQSxFQUFnRSxHQUFBLFFBQUEsQ0FBQTtBQUEwQixNQUFBLDJCQUFBLEVBQU07O0FBRXhSLE1BQUEsNkJBQUEsSUFBQSxRQUFBLENBQUEsRUFBeUIsSUFBQSxRQUFBO0FBQVEsTUFBQSxxQkFBQSxJQUFBLGFBQUE7QUFBVyxNQUFBLDJCQUFBO0FBQVMsTUFBQSw2QkFBQSxJQUFBLE1BQUE7QUFBTSxNQUFBLHFCQUFBLElBQUEsc0JBQUE7QUFBb0IsTUFBQSwyQkFBQSxFQUFPLEVBQU87QUFFL0YsTUFBQSw2QkFBQSxJQUFBLE9BQUEsRUFBQSxFQUF1RCxJQUFBLEtBQUEsRUFBQTtBQUNyQyxNQUFBLHFCQUFBLElBQUEsVUFBQTtBQUFRLE1BQUEsMkJBQUE7QUFDeEIsTUFBQSw2QkFBQSxJQUFBLEtBQUEsRUFBQTtBQUFvQixNQUFBLHFCQUFBLElBQUEsVUFBQTtBQUFRLE1BQUEsMkJBQUE7QUFDNUIsTUFBQSw2QkFBQSxJQUFBLEtBQUEsRUFBQTtBQUFrQixNQUFBLHFCQUFBLElBQUEsY0FBQTtBQUFZLE1BQUEsMkJBQUE7QUFDOUIsTUFBQSw2QkFBQSxJQUFBLEtBQUEsRUFBQTtBQUFnQixNQUFBLHFCQUFBLElBQUEsYUFBQTtBQUFXLE1BQUEsMkJBQUE7QUFDM0IsTUFBQSw2QkFBQSxJQUFBLEtBQUEsRUFBQTtBQUFlLE1BQUEscUJBQUEsSUFBQSxLQUFBO0FBQUcsTUFBQSwyQkFBQTtBQUNsQixNQUFBLDZCQUFBLElBQUEsS0FBQSxFQUFBO0FBQW1CLE1BQUEscUJBQUEsSUFBQSxTQUFBO0FBQU8sTUFBQSwyQkFBQSxFQUFJO0FBRWhDLE1BQUEsNkJBQUEsSUFBQSxVQUFBLEVBQUE7QUFBNkIsTUFBQSx5QkFBQSxTQUFBLFNBQUEsa0RBQUE7QUFBQSxlQUFTLElBQUEsWUFBQTtNQUFhLENBQUE7QUFDakQsTUFBQSxxQkFBQSxFQUFBO0FBQ0YsTUFBQSwyQkFBQSxFQUFTLEVBQ0w7QUFHUixNQUFBLDZCQUFBLElBQUEsUUFBQSxFQUFBLEVBQW1CLElBQUEsV0FBQSxFQUFBO0FBRWYsTUFBQSx3QkFBQSxJQUFBLE9BQUEsRUFBQTtBQUNBLE1BQUEsNkJBQUEsSUFBQSxPQUFBLEVBQUEsRUFBb0MsSUFBQSxRQUFBLEVBQUE7QUFDWixNQUFBLHFCQUFBLElBQUEsc0RBQUE7QUFBOEMsTUFBQSwyQkFBQTtBQUNwRSxNQUFBLDZCQUFBLElBQUEsSUFBQTtBQUFJLE1BQUEscUJBQUEsSUFBQSw4Q0FBQTtBQUE0QyxNQUFBLDJCQUFBO0FBQ2hELE1BQUEsNkJBQUEsSUFBQSxLQUFBLEVBQUE7QUFBcUIsTUFBQSxxQkFBQSxJQUFBLCtOQUFBO0FBQTZOLE1BQUEsMkJBQUE7QUFDbFAsTUFBQSw2QkFBQSxJQUFBLE9BQUEsRUFBQSxFQUEwQixJQUFBLEtBQUEsRUFBQTtBQUN1QixNQUFBLHFCQUFBLElBQUEsa0JBQUE7QUFBZ0IsTUFBQSwyQkFBQTtBQUMvRCxNQUFBLDZCQUFBLElBQUEsS0FBQSxFQUFBO0FBQTBDLE1BQUEscUJBQUEsSUFBQSxtQkFBQTtBQUFpQixNQUFBLDJCQUFBLEVBQUk7QUFFakUsTUFBQSw2QkFBQSxJQUFBLE9BQUEsRUFBQSxFQUF3QixJQUFBLE9BQUEsRUFBQSxFQUNKLElBQUEsUUFBQTtBQUFRLE1BQUEscUJBQUEsSUFBQSxlQUFBO0FBQWEsTUFBQSwyQkFBQTtBQUFTLE1BQUEsNkJBQUEsSUFBQSxNQUFBO0FBQU0sTUFBQSxxQkFBQSxJQUFBLDZCQUFBO0FBQTJCLE1BQUEsMkJBQUEsRUFBTztBQUN4RixNQUFBLDZCQUFBLElBQUEsT0FBQSxFQUFBLEVBQWtCLElBQUEsUUFBQTtBQUFRLE1BQUEscUJBQUEsSUFBQSxvQkFBQTtBQUFrQixNQUFBLDJCQUFBO0FBQVMsTUFBQSw2QkFBQSxJQUFBLE1BQUE7QUFBTSxNQUFBLHFCQUFBLElBQUEsMEJBQUE7QUFBd0IsTUFBQSwyQkFBQSxFQUFPO0FBQzFGLE1BQUEsNkJBQUEsSUFBQSxPQUFBLEVBQUEsRUFBa0IsSUFBQSxRQUFBO0FBQVEsTUFBQSxxQkFBQSxJQUFBLGVBQUE7QUFBYSxNQUFBLDJCQUFBO0FBQVMsTUFBQSw2QkFBQSxJQUFBLE1BQUE7QUFBTSxNQUFBLHFCQUFBLElBQUEsNEJBQUE7QUFBMEIsTUFBQSwyQkFBQSxFQUFPO0FBQ3ZGLE1BQUEsNkJBQUEsSUFBQSxPQUFBLEVBQUEsRUFBa0IsSUFBQSxRQUFBO0FBQVEsTUFBQSxxQkFBQSxJQUFBLHFCQUFBO0FBQW1CLE1BQUEsMkJBQUE7QUFBUyxNQUFBLDZCQUFBLElBQUEsTUFBQTtBQUFNLE1BQUEscUJBQUEsSUFBQSx5QkFBQTtBQUF1QixNQUFBLDJCQUFBLEVBQU8sRUFBTSxFQUM1RixFQUNGO0FBS1IsTUFBQSw2QkFBQSxJQUFBLFdBQUEsRUFBQSxFQUFtQixJQUFBLE9BQUEsRUFBQSxFQUNNLElBQUEsT0FBQSxFQUFBLEVBQ0ssSUFBQSxRQUFBLEVBQUE7QUFDSCxNQUFBLHFCQUFBLElBQUEsVUFBQTtBQUFRLE1BQUEsMkJBQUE7QUFDN0IsTUFBQSw2QkFBQSxJQUFBLElBQUE7QUFBSSxNQUFBLHFCQUFBLElBQUEsNERBQUE7QUFBMEQsTUFBQSwyQkFBQTtBQUM5RCxNQUFBLDZCQUFBLElBQUEsR0FBQTtBQUFHLE1BQUEscUJBQUEsSUFBQSwrUEFBQTtBQUE2UCxNQUFBLDJCQUFBLEVBQUk7QUFFdFEsTUFBQSw2QkFBQSxJQUFBLE9BQUEsRUFBQSxFQUF3QixJQUFBLFdBQUEsRUFBQSxFQUNXLElBQUEsR0FBQTtBQUM1QixNQUFBLHFCQUFBLElBQUEseVRBQUE7QUFBdVQsTUFBQSwyQkFBQTtBQUMxVCxNQUFBLDZCQUFBLElBQUEsT0FBQSxFQUFBLEVBQXlCLElBQUEsT0FBQSxFQUFBLEVBQ0MsSUFBQSxHQUFBO0FBQUcsTUFBQSxxQkFBQSxJQUFBLElBQUE7QUFBRSxNQUFBLDJCQUFBO0FBQUksTUFBQSw2QkFBQSxJQUFBLEtBQUEsRUFBSyxJQUFBLFFBQUE7QUFBUSxNQUFBLHFCQUFBLElBQUEsc0JBQUE7QUFBb0IsTUFBQSwyQkFBQTtBQUFTLE1BQUEsd0JBQUEsSUFBQSxJQUFBO0FBQUksTUFBQSw2QkFBQSxJQUFBLE1BQUE7QUFBTSxNQUFBLHFCQUFBLElBQUEsbUVBQUE7QUFBaUUsTUFBQSwyQkFBQSxFQUFPLEVBQU07QUFDbkssTUFBQSw2QkFBQSxJQUFBLE9BQUEsRUFBQSxFQUF3QixJQUFBLEdBQUE7QUFBRyxNQUFBLHFCQUFBLElBQUEsSUFBQTtBQUFFLE1BQUEsMkJBQUE7QUFBSSxNQUFBLDZCQUFBLElBQUEsS0FBQSxFQUFLLElBQUEsUUFBQTtBQUFRLE1BQUEscUJBQUEsSUFBQSxtQkFBQTtBQUFpQixNQUFBLDJCQUFBO0FBQVMsTUFBQSx3QkFBQSxJQUFBLElBQUE7QUFBSSxNQUFBLDZCQUFBLElBQUEsTUFBQTtBQUFNLE1BQUEscUJBQUEsSUFBQSwrRUFBQTtBQUE2RSxNQUFBLDJCQUFBLEVBQU8sRUFBTTtBQUM1SyxNQUFBLDZCQUFBLElBQUEsT0FBQSxFQUFBLEVBQXdCLElBQUEsR0FBQTtBQUFHLE1BQUEscUJBQUEsS0FBQSxJQUFBO0FBQUUsTUFBQSwyQkFBQTtBQUFJLE1BQUEsNkJBQUEsS0FBQSxLQUFBLEVBQUssS0FBQSxRQUFBO0FBQVEsTUFBQSxxQkFBQSxLQUFBLG1CQUFBO0FBQWlCLE1BQUEsMkJBQUE7QUFBUyxNQUFBLHdCQUFBLEtBQUEsSUFBQTtBQUFJLE1BQUEsNkJBQUEsS0FBQSxNQUFBO0FBQU0sTUFBQSxxQkFBQSxLQUFBLDJFQUFBO0FBQXlFLE1BQUEsMkJBQUEsRUFBTyxFQUFNLEVBQU0sRUFDMUs7QUFFUixNQUFBLDZCQUFBLEtBQUEsVUFBQSxFQUFBO0FBQ0UsTUFBQSx3QkFBQSxLQUFBLE9BQUEsRUFBQTtBQUNGLE1BQUEsMkJBQUEsRUFBUyxFQUNMLEVBQ0Y7QUFHUixNQUFBLDZCQUFBLEtBQUEsV0FBQSxFQUFBLEVBQXVCLEtBQUEsT0FBQSxFQUFBLEVBQ0UsS0FBQSxPQUFBLEVBQUEsRUFDSyxLQUFBLFFBQUEsRUFBQTtBQUNILE1BQUEscUJBQUEsS0FBQSxVQUFBO0FBQVEsTUFBQSwyQkFBQTtBQUM3QixNQUFBLDZCQUFBLEtBQUEsSUFBQTtBQUFJLE1BQUEscUJBQUEsS0FBQSxtRUFBQTtBQUFpRSxNQUFBLDJCQUFBO0FBQ3JFLE1BQUEsNkJBQUEsS0FBQSxHQUFBO0FBQUcsTUFBQSxxQkFBQSxLQUFBLCtLQUFBO0FBQTZLLE1BQUEsMkJBQUEsRUFBSTtBQUV0TCxNQUFBLDZCQUFBLEtBQUEsT0FBQSxFQUFBLEVBQTJCLEtBQUEsV0FBQSxFQUFBLEVBQ0ssS0FBQSxPQUFBLEVBQUE7QUFBMEIsTUFBQSxxQkFBQSxLQUFBLElBQUE7QUFBRSxNQUFBLDJCQUFBO0FBQU0sTUFBQSw2QkFBQSxLQUFBLElBQUE7QUFBSSxNQUFBLHFCQUFBLEtBQUEsZ0JBQUE7QUFBYyxNQUFBLDJCQUFBO0FBQUssTUFBQSw2QkFBQSxLQUFBLEdBQUE7QUFBRyxNQUFBLHFCQUFBLEtBQUEsaUdBQUE7QUFBK0YsTUFBQSwyQkFBQSxFQUFJO0FBQzdMLE1BQUEsNkJBQUEsS0FBQSxXQUFBLEVBQUEsRUFBOEIsS0FBQSxPQUFBLEVBQUE7QUFBMEIsTUFBQSxxQkFBQSxLQUFBLElBQUE7QUFBRSxNQUFBLDJCQUFBO0FBQU0sTUFBQSw2QkFBQSxLQUFBLElBQUE7QUFBSSxNQUFBLHFCQUFBLEtBQUEsZ0JBQUE7QUFBYyxNQUFBLDJCQUFBO0FBQUssTUFBQSw2QkFBQSxLQUFBLEdBQUE7QUFBRyxNQUFBLHFCQUFBLEtBQUEsOEZBQUE7QUFBNEYsTUFBQSwyQkFBQSxFQUFJO0FBQzFMLE1BQUEsNkJBQUEsS0FBQSxXQUFBLEVBQUEsRUFBOEIsS0FBQSxPQUFBLEVBQUE7QUFBMEIsTUFBQSxxQkFBQSxLQUFBLElBQUE7QUFBRSxNQUFBLDJCQUFBO0FBQU0sTUFBQSw2QkFBQSxLQUFBLElBQUE7QUFBSSxNQUFBLHFCQUFBLEtBQUEsdUJBQUE7QUFBcUIsTUFBQSwyQkFBQTtBQUFLLE1BQUEsNkJBQUEsS0FBQSxHQUFBO0FBQUcsTUFBQSxxQkFBQSxLQUFBLGdHQUFBO0FBQThGLE1BQUEsMkJBQUEsRUFBSTtBQUNuTSxNQUFBLDZCQUFBLEtBQUEsV0FBQSxFQUFBLEVBQThCLEtBQUEsT0FBQSxFQUFBO0FBQTBCLE1BQUEscUJBQUEsS0FBQSxJQUFBO0FBQUUsTUFBQSwyQkFBQTtBQUFNLE1BQUEsNkJBQUEsS0FBQSxJQUFBO0FBQUksTUFBQSxxQkFBQSxLQUFBLG1CQUFBO0FBQWlCLE1BQUEsMkJBQUE7QUFBSyxNQUFBLDZCQUFBLEtBQUEsR0FBQTtBQUFHLE1BQUEscUJBQUEsS0FBQSxrSEFBQTtBQUFnSCxNQUFBLDJCQUFBLEVBQUk7QUFDak4sTUFBQSw2QkFBQSxLQUFBLFdBQUEsRUFBQSxFQUE4QixLQUFBLE9BQUEsRUFBQTtBQUEwQixNQUFBLHFCQUFBLEtBQUEsSUFBQTtBQUFFLE1BQUEsMkJBQUE7QUFBTSxNQUFBLDZCQUFBLEtBQUEsSUFBQTtBQUFJLE1BQUEscUJBQUEsS0FBQSxtQkFBQTtBQUFpQixNQUFBLDJCQUFBO0FBQUssTUFBQSw2QkFBQSxLQUFBLEdBQUE7QUFBRyxNQUFBLHFCQUFBLEtBQUEsbUdBQUE7QUFBaUcsTUFBQSwyQkFBQSxFQUFJO0FBQ2xNLE1BQUEsNkJBQUEsS0FBQSxXQUFBLEVBQUEsRUFBOEIsS0FBQSxPQUFBLEVBQUE7QUFBMEIsTUFBQSxxQkFBQSxLQUFBLElBQUE7QUFBRSxNQUFBLDJCQUFBO0FBQU0sTUFBQSw2QkFBQSxLQUFBLElBQUE7QUFBSSxNQUFBLHFCQUFBLEtBQUEsa0JBQUE7QUFBZ0IsTUFBQSwyQkFBQTtBQUFLLE1BQUEsNkJBQUEsS0FBQSxHQUFBO0FBQUcsTUFBQSxxQkFBQSxLQUFBLG9GQUFBO0FBQWtGLE1BQUEsMkJBQUEsRUFBSSxFQUFVLEVBQ3hMLEVBQ0Y7QUFHUixNQUFBLDZCQUFBLEtBQUEsV0FBQSxFQUFBLEVBQW1DLEtBQUEsT0FBQSxFQUFBLEVBQ0MsS0FBQSxVQUFBLEVBQUE7QUFFOUIsTUFBQSx3QkFBQSxLQUFBLE9BQUEsRUFBQTtBQUNGLE1BQUEsMkJBQUE7QUFDQSxNQUFBLDZCQUFBLEtBQUEsT0FBQSxFQUFBLEVBQXdCLEtBQUEsT0FBQSxFQUFBLEVBQzRCLEtBQUEsUUFBQSxFQUFBO0FBQzNCLE1BQUEscUJBQUEsS0FBQSxjQUFBO0FBQVksTUFBQSwyQkFBQTtBQUNqQyxNQUFBLDZCQUFBLEtBQUEsSUFBQTtBQUFJLE1BQUEscUJBQUEsS0FBQSxvRUFBQTtBQUF3RCxNQUFBLDJCQUFBO0FBQzVELE1BQUEsNkJBQUEsS0FBQSxHQUFBO0FBQUcsTUFBQSxxQkFBQSxLQUFBLGFBQUE7QUFBVyxNQUFBLDZCQUFBLEtBQUEsSUFBQTtBQUFJLE1BQUEscUJBQUEsS0FBQSxrQkFBQTtBQUFnQixNQUFBLDJCQUFBO0FBQUssTUFBQSxxQkFBQSxLQUFBLDZLQUFBO0FBQTJLLE1BQUEsMkJBQUEsRUFBSTtBQUV4TixNQUFBLDZCQUFBLEtBQUEsT0FBQSxFQUFBLEVBQW1CLEtBQUEsT0FBQSxFQUFBLEVBQ0MsS0FBQSxRQUFBO0FBQVEsTUFBQSxxQkFBQSxLQUFBLGtCQUFBO0FBQWdCLE1BQUEsMkJBQUE7QUFBUyxNQUFBLDZCQUFBLEtBQUEsTUFBQTtBQUFNLE1BQUEscUJBQUEsS0FBQSxnRUFBQTtBQUE4RCxNQUFBLDJCQUFBLEVBQU87QUFDOUgsTUFBQSw2QkFBQSxLQUFBLE9BQUEsRUFBQSxFQUFrQixLQUFBLFFBQUE7QUFBUSxNQUFBLHFCQUFBLEtBQUEsZUFBQTtBQUFhLE1BQUEsMkJBQUE7QUFBUyxNQUFBLDZCQUFBLEtBQUEsTUFBQTtBQUFNLE1BQUEscUJBQUEsS0FBQSxnRUFBQTtBQUE4RCxNQUFBLDJCQUFBLEVBQU87QUFDM0gsTUFBQSw2QkFBQSxLQUFBLE9BQUEsRUFBQSxFQUFrQixLQUFBLFFBQUE7QUFBUSxNQUFBLHFCQUFBLEtBQUEscUJBQUE7QUFBbUIsTUFBQSwyQkFBQTtBQUFTLE1BQUEsNkJBQUEsS0FBQSxNQUFBO0FBQU0sTUFBQSxxQkFBQSxLQUFBLHdEQUFBO0FBQXNELE1BQUEsMkJBQUEsRUFBTztBQUN6SCxNQUFBLDZCQUFBLEtBQUEsT0FBQSxFQUFBLEVBQWtCLEtBQUEsUUFBQTtBQUFRLE1BQUEscUJBQUEsS0FBQSxvQkFBQTtBQUFrQixNQUFBLDJCQUFBO0FBQVMsTUFBQSw2QkFBQSxLQUFBLE1BQUE7QUFBTSxNQUFBLHFCQUFBLEtBQUEsMERBQUE7QUFBd0QsTUFBQSwyQkFBQSxFQUFPLEVBQU0sRUFDNUgsRUFDRixFQUNGO0FBR1IsTUFBQSw2QkFBQSxLQUFBLFdBQUEsRUFBQSxFQUFtQixLQUFBLE9BQUEsRUFBQSxFQUNNLEtBQUEsT0FBQSxFQUFBLEVBQ0ssS0FBQSxRQUFBLEVBQUE7QUFDSCxNQUFBLHFCQUFBLEtBQUEsYUFBQTtBQUFXLE1BQUEsMkJBQUE7QUFDaEMsTUFBQSw2QkFBQSxLQUFBLElBQUE7QUFBSSxNQUFBLHFCQUFBLEtBQUEsd0RBQUE7QUFBc0QsTUFBQSwyQkFBQTtBQUMxRCxNQUFBLDZCQUFBLEtBQUEsR0FBQTtBQUFHLE1BQUEscUJBQUEsS0FBQSxvSUFBQTtBQUFrSSxNQUFBLDJCQUFBLEVBQUk7QUFFM0ksTUFBQSw2QkFBQSxLQUFBLE9BQUEsRUFBQSxFQUF1QixLQUFBLFdBQUEsRUFBQSxFQUNNLEtBQUEsT0FBQSxFQUFBO0FBQXlCLE1BQUEscUJBQUEsS0FBQSxHQUFBO0FBQUMsTUFBQSwyQkFBQTtBQUFNLE1BQUEsNkJBQUEsS0FBQSxJQUFBO0FBQUksTUFBQSxxQkFBQSxLQUFBLFNBQUE7QUFBTyxNQUFBLDJCQUFBO0FBQUssTUFBQSw2QkFBQSxLQUFBLEdBQUE7QUFBRyxNQUFBLHFCQUFBLEtBQUEsZ0dBQUE7QUFBOEYsTUFBQSwyQkFBQSxFQUFJO0FBQ2hMLE1BQUEsNkJBQUEsS0FBQSxXQUFBLEVBQUEsRUFBMkIsS0FBQSxPQUFBLEVBQUE7QUFBeUIsTUFBQSxxQkFBQSxLQUFBLEdBQUE7QUFBQyxNQUFBLDJCQUFBO0FBQU0sTUFBQSw2QkFBQSxLQUFBLElBQUE7QUFBSSxNQUFBLHFCQUFBLEtBQUEsT0FBQTtBQUFLLE1BQUEsMkJBQUE7QUFBSyxNQUFBLDZCQUFBLEtBQUEsR0FBQTtBQUFHLE1BQUEscUJBQUEsS0FBQSxrRkFBQTtBQUFnRixNQUFBLDJCQUFBLEVBQUk7QUFDaEssTUFBQSw2QkFBQSxLQUFBLFdBQUEsRUFBQSxFQUEyQixLQUFBLE9BQUEsRUFBQTtBQUF5QixNQUFBLHFCQUFBLEtBQUEsR0FBQTtBQUFDLE1BQUEsMkJBQUE7QUFBTSxNQUFBLDZCQUFBLEtBQUEsSUFBQTtBQUFJLE1BQUEscUJBQUEsS0FBQSxpQkFBQTtBQUFlLE1BQUEsMkJBQUE7QUFBSyxNQUFBLDZCQUFBLEtBQUEsR0FBQTtBQUFHLE1BQUEscUJBQUEsS0FBQSwrREFBQTtBQUE2RCxNQUFBLDJCQUFBLEVBQUk7QUFDdkosTUFBQSw2QkFBQSxLQUFBLFdBQUEsRUFBQSxFQUEyQixLQUFBLE9BQUEsRUFBQTtBQUF5QixNQUFBLHFCQUFBLEtBQUEsR0FBQTtBQUFDLE1BQUEsMkJBQUE7QUFBTSxNQUFBLDZCQUFBLEtBQUEsSUFBQTtBQUFJLE1BQUEscUJBQUEsS0FBQSxhQUFBO0FBQVcsTUFBQSwyQkFBQTtBQUFLLE1BQUEsNkJBQUEsS0FBQSxHQUFBO0FBQUcsTUFBQSxxQkFBQSxLQUFBLGdFQUFBO0FBQThELE1BQUEsMkJBQUEsRUFBSSxFQUFVO0FBRWhLLE1BQUEsNkJBQUEsS0FBQSxPQUFBLEVBQUEsRUFBc0IsS0FBQSxRQUFBO0FBQVEsTUFBQSxxQkFBQSxLQUFBLGVBQUE7QUFBYSxNQUFBLDJCQUFBO0FBQVMsTUFBQSw2QkFBQSxLQUFBLEdBQUE7QUFBRyxNQUFBLHFCQUFBLEtBQUEsK0dBQUE7QUFBNkcsTUFBQSwyQkFBQSxFQUFJLEVBQU0sRUFDMUs7QUFHUixNQUFBLDZCQUFBLEtBQUEsV0FBQSxFQUFBLEVBQWtCLEtBQUEsT0FBQSxFQUFBLEVBQ08sS0FBQSxPQUFBLEVBQUEsRUFDSyxLQUFBLFFBQUEsRUFBQTtBQUNILE1BQUEscUJBQUEsS0FBQSxLQUFBO0FBQUcsTUFBQSwyQkFBQTtBQUN4QixNQUFBLDZCQUFBLEtBQUEsSUFBQTtBQUFJLE1BQUEscUJBQUEsS0FBQSx3REFBQTtBQUFzRCxNQUFBLDJCQUFBO0FBQzFELE1BQUEsNkJBQUEsS0FBQSxHQUFBO0FBQUcsTUFBQSxxQkFBQSxLQUFBLDBKQUFBO0FBQXdKLE1BQUEsMkJBQUEsRUFBSTtBQUVqSyxNQUFBLDZCQUFBLEtBQUEsT0FBQSxFQUFBLEVBQXNCLEtBQUEsV0FBQSxFQUFBLEVBQ08sS0FBQSxTQUFBO0FBQVMsTUFBQSxxQkFBQSxLQUFBLG1DQUFBO0FBQWlDLE1BQUEsNkJBQUEsS0FBQSxNQUFBO0FBQU0sTUFBQSxxQkFBQSxLQUFBLEdBQUE7QUFBQyxNQUFBLDJCQUFBLEVBQU87QUFBVSxNQUFBLDZCQUFBLEtBQUEsR0FBQTtBQUFHLE1BQUEscUJBQUEsS0FBQSxtRkFBQTtBQUFpRixNQUFBLDJCQUFBLEVBQUk7QUFDckwsTUFBQSw2QkFBQSxLQUFBLFdBQUEsRUFBQSxFQUFzQixLQUFBLFNBQUE7QUFBUyxNQUFBLHFCQUFBLEtBQUEsMkJBQUE7QUFBeUIsTUFBQSw2QkFBQSxLQUFBLE1BQUE7QUFBTSxNQUFBLHFCQUFBLEtBQUEsR0FBQTtBQUFDLE1BQUEsMkJBQUEsRUFBTztBQUFVLE1BQUEsNkJBQUEsS0FBQSxHQUFBO0FBQUcsTUFBQSxxQkFBQSxLQUFBLGtFQUFBO0FBQWdFLE1BQUEsMkJBQUEsRUFBSTtBQUN2SixNQUFBLDZCQUFBLEtBQUEsV0FBQSxFQUFBLEVBQXNCLEtBQUEsU0FBQTtBQUFTLE1BQUEscUJBQUEsS0FBQSx3QkFBQTtBQUFzQixNQUFBLDZCQUFBLEtBQUEsTUFBQTtBQUFNLE1BQUEscUJBQUEsS0FBQSxHQUFBO0FBQUMsTUFBQSwyQkFBQSxFQUFPO0FBQVUsTUFBQSw2QkFBQSxLQUFBLEdBQUE7QUFBRyxNQUFBLHFCQUFBLEtBQUEsbUdBQUE7QUFBaUcsTUFBQSwyQkFBQSxFQUFJO0FBQ3JMLE1BQUEsNkJBQUEsS0FBQSxXQUFBLEVBQUEsRUFBc0IsS0FBQSxTQUFBO0FBQVMsTUFBQSxxQkFBQSxLQUFBLDZCQUFBO0FBQTJCLE1BQUEsNkJBQUEsS0FBQSxNQUFBO0FBQU0sTUFBQSxxQkFBQSxLQUFBLEdBQUE7QUFBQyxNQUFBLDJCQUFBLEVBQU87QUFBVSxNQUFBLDZCQUFBLEtBQUEsR0FBQTtBQUFHLE1BQUEscUJBQUEsS0FBQSwwRUFBQTtBQUF3RSxNQUFBLDJCQUFBLEVBQUk7QUFDakssTUFBQSw2QkFBQSxLQUFBLFdBQUEsRUFBQSxFQUFzQixLQUFBLFNBQUE7QUFBUyxNQUFBLHFCQUFBLEtBQUEseUJBQUE7QUFBdUIsTUFBQSw2QkFBQSxLQUFBLE1BQUE7QUFBTSxNQUFBLHFCQUFBLEtBQUEsR0FBQTtBQUFDLE1BQUEsMkJBQUEsRUFBTztBQUFVLE1BQUEsNkJBQUEsS0FBQSxHQUFBO0FBQUcsTUFBQSxxQkFBQSxLQUFBLDJIQUFBO0FBQXlILE1BQUEsMkJBQUEsRUFBSTtBQUM5TSxNQUFBLDZCQUFBLEtBQUEsV0FBQSxFQUFBLEVBQXNCLEtBQUEsU0FBQTtBQUFTLE1BQUEscUJBQUEsS0FBQSwwQkFBQTtBQUF3QixNQUFBLDZCQUFBLEtBQUEsTUFBQTtBQUFNLE1BQUEscUJBQUEsS0FBQSxHQUFBO0FBQUMsTUFBQSwyQkFBQSxFQUFPO0FBQVUsTUFBQSw2QkFBQSxLQUFBLEdBQUE7QUFBRyxNQUFBLHFCQUFBLEtBQUEsMEZBQUE7QUFBbUYsTUFBQSwyQkFBQSxFQUFJLEVBQVUsRUFDL0ssRUFDRjtBQUdSLE1BQUEsNkJBQUEsS0FBQSxTQUFBLEVBQVMsS0FBQSxPQUFBLEVBQUEsRUFDZ0IsS0FBQSxPQUFBLEVBQUEsRUFDSyxLQUFBLFFBQUEsRUFBQTtBQUNILE1BQUEscUJBQUEsS0FBQSx1QkFBQTtBQUFxQixNQUFBLDJCQUFBO0FBQzFDLE1BQUEsNkJBQUEsS0FBQSxJQUFBO0FBQUksTUFBQSxxQkFBQSxLQUFBLDBEQUFBO0FBQXdELE1BQUEsMkJBQUE7QUFDNUQsTUFBQSw2QkFBQSxLQUFBLEdBQUE7QUFBRyxNQUFBLHFCQUFBLEtBQUEsbU9BQUE7QUFBaU8sTUFBQSwyQkFBQSxFQUFJO0FBRTFPLE1BQUEsNkJBQUEsS0FBQSxPQUFBLEVBQUEsRUFBMEIsS0FBQSxjQUFBLEVBQUEsRUFDQyxLQUFBLEdBQUE7QUFBRyxNQUFBLHFCQUFBLEtBQUEsNklBQUE7QUFBdUgsTUFBQSwyQkFBQTtBQUFJLE1BQUEsNkJBQUEsS0FBQSxRQUFBO0FBQVEsTUFBQSxxQkFBQSxLQUFBLGtCQUFBO0FBQWdCLE1BQUEsMkJBQUEsRUFBUztBQUN4TCxNQUFBLDZCQUFBLEtBQUEsY0FBQSxFQUFBLEVBQXlCLEtBQUEsR0FBQTtBQUFHLE1BQUEscUJBQUEsS0FBQSwySUFBQTtBQUEwSCxNQUFBLDJCQUFBO0FBQUksTUFBQSw2QkFBQSxLQUFBLFFBQUE7QUFBUSxNQUFBLHFCQUFBLEtBQUEseUJBQUE7QUFBdUIsTUFBQSwyQkFBQSxFQUFTO0FBQ2xNLE1BQUEsNkJBQUEsS0FBQSxjQUFBLEVBQUEsRUFBeUIsS0FBQSxHQUFBO0FBQUcsTUFBQSxxQkFBQSxLQUFBLDJIQUFBO0FBQStHLE1BQUEsMkJBQUE7QUFBSSxNQUFBLDZCQUFBLEtBQUEsUUFBQTtBQUFRLE1BQUEscUJBQUEsS0FBQSxzQkFBQTtBQUFvQixNQUFBLDJCQUFBLEVBQVMsRUFBYSxFQUM3TCxFQUNGO0FBR1IsTUFBQSw2QkFBQSxLQUFBLFdBQUEsRUFBQSxFQUFrQyxLQUFBLE9BQUEsRUFBQSxFQUNBLEtBQUEsS0FBQSxFQUN6QixLQUFBLFFBQUEsRUFBQTtBQUN3QyxNQUFBLHFCQUFBLEtBQUEsaUJBQUE7QUFBZSxNQUFBLDJCQUFBO0FBQzFELE1BQUEsNkJBQUEsS0FBQSxJQUFBO0FBQUksTUFBQSxxQkFBQSxLQUFBLHNEQUFBO0FBQW9ELE1BQUEsMkJBQUE7QUFDeEQsTUFBQSw2QkFBQSxLQUFBLEdBQUE7QUFBRyxNQUFBLHFCQUFBLEtBQUEsaVFBQUE7QUFBK1AsTUFBQSwyQkFBQTtBQUNsUSxNQUFBLDZCQUFBLEtBQUEsT0FBQSxFQUFBLEVBQTBCLEtBQUEsS0FBQSxFQUFBO0FBQ29DLE1BQUEscUJBQUEsS0FBQSxnQkFBQTtBQUFjLE1BQUEsMkJBQUE7QUFDMUUsTUFBQSw2QkFBQSxLQUFBLEtBQUEsRUFBQTtBQUFtRCxNQUFBLHFCQUFBLEtBQUEsa0JBQUE7QUFBZ0IsTUFBQSwyQkFBQSxFQUFJLEVBQ25FO0FBRVIsTUFBQSw2QkFBQSxLQUFBLFNBQUEsRUFBQSxFQUE2QixLQUFBLElBQUE7QUFDdkIsTUFBQSxxQkFBQSxLQUFBLGlCQUFBO0FBQWUsTUFBQSwyQkFBQTtBQUNuQixNQUFBLDZCQUFBLEtBQUEsT0FBQSxFQUFBLEVBQTJCLEtBQUEsT0FBQSxFQUFBLEVBQ0MsS0FBQSxNQUFBO0FBQU0sTUFBQSxxQkFBQSxLQUFBLE9BQUE7QUFBSyxNQUFBLDJCQUFBO0FBQU8sTUFBQSw2QkFBQSxLQUFBLFFBQUE7QUFBUSxNQUFBLHFCQUFBLEtBQUEsb0JBQUE7QUFBa0IsTUFBQSwyQkFBQSxFQUFTO0FBQy9FLE1BQUEsNkJBQUEsS0FBQSxPQUFBLEVBQUEsRUFBMEIsS0FBQSxNQUFBO0FBQU0sTUFBQSxxQkFBQSxLQUFBLE9BQUE7QUFBSyxNQUFBLDJCQUFBO0FBQU8sTUFBQSw2QkFBQSxLQUFBLFFBQUE7QUFBUSxNQUFBLHFCQUFBLEtBQUEsY0FBQTtBQUFZLE1BQUEsMkJBQUEsRUFBUztBQUN6RSxNQUFBLDZCQUFBLEtBQUEsT0FBQSxFQUFBLEVBQTBCLEtBQUEsTUFBQTtBQUFNLE1BQUEscUJBQUEsS0FBQSxTQUFBO0FBQU8sTUFBQSwyQkFBQTtBQUFPLE1BQUEsNkJBQUEsS0FBQSxRQUFBO0FBQVEsTUFBQSxxQkFBQSxLQUFBLG9CQUFBO0FBQWtCLE1BQUEsMkJBQUEsRUFBUztBQUNqRixNQUFBLDZCQUFBLEtBQUEsT0FBQSxFQUFBLEVBQTBCLEtBQUEsTUFBQTtBQUFNLE1BQUEscUJBQUEsS0FBQSxVQUFBO0FBQVEsTUFBQSwyQkFBQTtBQUFPLE1BQUEsNkJBQUEsS0FBQSxRQUFBO0FBQVEsTUFBQSxxQkFBQSxLQUFBLDRDQUFBO0FBQTBDLE1BQUEsMkJBQUEsRUFBUyxFQUFNLEVBQzVHLEVBQ0EsRUFDSixFQUNFO0FBR1osTUFBQSw2QkFBQSxLQUFBLFVBQUEsRUFBQSxFQUE0QixLQUFBLE9BQUEsRUFBQSxFQUNTLEtBQUEsR0FBQTtBQUM5QixNQUFBLHFCQUFBLEtBQUEsaUZBQUE7QUFBeUUsTUFBQSwyQkFBQTtBQUM1RSxNQUFBLDZCQUFBLEtBQUEsT0FBQSxFQUFBLEVBQTBCLEtBQUEsS0FBQSxFQUFBO0FBQ1IsTUFBQSxxQkFBQSxLQUFBLFVBQUE7QUFBUSxNQUFBLDJCQUFBO0FBQ3hCLE1BQUEsNkJBQUEsS0FBQSxLQUFBLEVBQUE7QUFBb0IsTUFBQSxxQkFBQSxLQUFBLFVBQUE7QUFBUSxNQUFBLDJCQUFBO0FBQzVCLE1BQUEsNkJBQUEsS0FBQSxLQUFBLEVBQUE7QUFBZ0IsTUFBQSxxQkFBQSxLQUFBLFNBQUE7QUFBTyxNQUFBLDJCQUFBO0FBQ3ZCLE1BQUEsNkJBQUEsS0FBQSxLQUFBLEVBQUE7QUFBbUIsTUFBQSxxQkFBQSxLQUFBLFNBQUE7QUFBTyxNQUFBLDJCQUFBLEVBQUksRUFDMUIsRUFDRjs7O0FBNUtGLE1BQUEsd0JBQUEsRUFBQTtBQUFBLE1BQUEsaUNBQUEsS0FBQSxJQUFBLFVBQUEsU0FBQSxjQUFBLGdCQUFBLEdBQUE7O29CQXJCSSxVQUFVLEdBQUEsZUFBQSxFQUFBLENBQUE7OztnRkFxTVQsZUFBYSxDQUFBO1VBdk16QkE7V0FBVTtNQUNULFlBQVk7TUFDWixTQUFTLENBQUMsVUFBVTtNQUNwQixVQUFVO01BQ1YsVUFBVTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7S0FrTVg7Ozs7aUZBQ1ksZUFBYSxFQUFBLFdBQUEsaUJBQUEsVUFBQSw2QkFBQSxZQUFBLElBQUEsQ0FBQTtBQUFBLEdBQUE7Ozs7Ozs7K0RBQWIsZUFBYSxFQUFBLFNBQUEsQ0FBQUMsR0FBQSxHQUFBLENBQUEsWUFBQUQsVUFBQSxHQUFBLGFBQUEsRUFBQSxDQUFBO0VBQUE7QUFBQSxHQUFBLE9BQUEsY0FBQSxlQUFBLGNBQUEsc0JBQUEsS0FBQSxJQUFBLENBQUE7QUFBQSxHQUFBLE9BQUEsY0FBQSxlQUFBLGVBQUEsWUFBQSxPQUFBLFlBQUEsSUFBQSxHQUFBLDRCQUFBLE9BQUEsRUFBQSxPQUFBLE1BQUEsc0JBQUEsRUFBQSxTQUFBLENBQUE7QUFBQSxHQUFBOzs7O0FGaE1wQixJQUFPLE1BQVAsTUFBTyxLQUFHO0VBQ0ssUUFBUSxPQUFPLGVBQWEsR0FBQSxZQUFBLENBQUEsRUFBQSxXQUFBLFFBQUEsQ0FBQTs7SUFBQSxDQUFBO0dBQUE7O3FDQURwQyxNQUFHO0VBQUE7NkVBQUgsTUFBRyxXQUFBLENBQUEsQ0FBQSxXQUFBLENBQUEsR0FBQSxPQUFBLEdBQUEsTUFBQSxHQUFBLFVBQUEsU0FBQSxhQUFBLElBQUEsS0FBQTtBQUFBLFFBQUEsS0FBQSxHQUFBO0FDVmhCLE1BQUEsd0JBQUEsR0FBQSxVQUFBLEVBQXFCLEdBQUEsZUFBQTs7b0JETVQsY0FBYyxhQUFhLEdBQUEsZUFBQSxFQUFBLENBQUE7OztnRkFJMUIsS0FBRyxDQUFBO1VBTmZFO3VCQUNXLGFBQVcsU0FDWixDQUFDLGNBQWMsYUFBYSxHQUFDLFVBQUEsMkRBQUEsQ0FBQTs7OztpRkFJM0IsS0FBRyxFQUFBLFdBQUEsT0FBQSxVQUFBLGtCQUFBLFlBQUEsR0FBQSxDQUFBO0FBQUEsR0FBQTs7Ozs7OzsrREFBSCxLQUFHLEVBQUEsU0FBQSxDQUFBQyxHQUFBLEdBQUEsQ0FBQSxjQUFBLGVBQUFELFVBQUEsR0FBQSxhQUFBLEVBQUEsQ0FBQTtFQUFBO0FBQUEsR0FBQSxPQUFBLGNBQUEsZUFBQSxjQUFBLFlBQUEsS0FBQSxJQUFBLENBQUE7QUFBQSxHQUFBLE9BQUEsY0FBQSxlQUFBLGVBQUEsWUFBQSxPQUFBLFlBQUEsSUFBQSxHQUFBLDRCQUFBLE9BQUEsRUFBQSxPQUFBLE1BQUEsWUFBQSxFQUFBLFNBQUEsQ0FBQTtBQUFBLEdBQUE7OztBSk5oQixxQkFBcUIsS0FBSyxTQUFTLEVBQ2hDLE1BQU0sQ0FBQyxRQUFRLFFBQVEsTUFBTSxHQUFHLENBQUM7IiwibmFtZXMiOlsiQ29tcG9uZW50IiwiQ29tcG9uZW50IiwiaTAiLCJDb21wb25lbnQiLCJpMCJdfQ==