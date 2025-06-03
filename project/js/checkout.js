/**
 * Checkout page JavaScript for INFOTEL PERÚ
 */

import { renderHeader, renderFooter, showToast } from './components.js';
import { CartManager } from './cart.js';
import { db } from './data.js';

// Form data
let formData = {
  nombre: '',
  email: '',
  telefono: '',
  direccion: '',
  ciudad: '',
  codigo_postal: '',
  metodo_pago: 'tarjeta'
};

/**
 * Initialize checkout page
 */
document.addEventListener('DOMContentLoaded', () => {
  // Render components
  renderHeader(document.getElementById('header'));
  renderFooter(document.getElementById('footer'));
  
  // Check if cart has items
  if (CartManager.getCartItemsCount() === 0) {
    window.location.href = 'carrito.html';
    return;
  }
  
  // Render checkout items
  renderCheckoutItems();
  
  // Setup event listeners
  setupEventListeners();
  
  // Load saved form data if available
  loadSavedFormData();
});

/**
 * Render checkout items
 */
function renderCheckoutItems() {
  const checkoutItemsContainer = document.getElementById('checkout-items');
  const cart = CartManager.getCart();
  
  let checkoutItemsHTML = '';
  
  cart.forEach(item => {
    checkoutItemsHTML += `
      <div class="checkout-item">
        <div class="checkout-item-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="checkout-item-details">
          <h4 class="checkout-item-title">${item.name}</h4>
          <p class="checkout-item-variant">
            ${getColorName(item.color)} / ${getSizeName(item.size)} | Cantidad: ${item.quantity}
          </p>
          <div class="checkout-item-price">
            <span>S/. ${item.price.toFixed(2)}</span>
            <span>S/. ${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        </div>
      </div>
    `;
  });
  
  checkoutItemsContainer.innerHTML = checkoutItemsHTML;
  
  // Update order summary
  updateOrderSummary();
}

/**
 * Update order summary with current totals
 */
function updateOrderSummary() {
  const subtotalElement = document.getElementById('checkout-subtotal');
  const totalElement = document.getElementById('checkout-total');
  const shippingElement = document.getElementById('checkout-shipping');
  
  const subtotal = CartManager.getCartTotal();
  const shipping = 15; // Fixed shipping cost
  const total = subtotal + shipping;
  
  subtotalElement.textContent = `S/. ${subtotal.toFixed(2)}`;
  shippingElement.textContent = `S/. ${shipping.toFixed(2)}`;
  totalElement.textContent = `S/. ${total.toFixed(2)}`;
}

/**
 * Setup event listeners for checkout page
 */
function setupEventListeners() {
  const checkoutForm = document.getElementById('checkout-form');
  const paymentMethods = document.querySelectorAll('input[name="metodo_pago"]');
  const tarjetaDetails = document.getElementById('tarjeta-details');
  
  // Form submission
  checkoutForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    // Get form data
    const formElements = checkoutForm.elements;
    
    formData = {
      nombre: formElements.nombre.value,
      email: formElements.email.value,
      telefono: formElements.telefono.value,
      direccion: formElements.direccion.value,
      ciudad: formElements.ciudad.value,
      codigo_postal: formElements.codigo_postal.value,
      metodo_pago: formElements.metodo_pago.value
    };
    
    // Save form data to localStorage
    saveFormData();
    
    // Show confirmation modal
    showConfirmationModal();
  });
  
  // Payment method change
  paymentMethods.forEach(method => {
    method.addEventListener('change', () => {
      if (method.value === 'tarjeta') {
        tarjetaDetails.style.display = 'block';
      } else {
        tarjetaDetails.style.display = 'none';
      }
      
      // Update form data
      formData.metodo_pago = method.value;
      saveFormData();
    });
  });
  
  // Save form data on input change
  const formInputs = document.querySelectorAll('#checkout-form input[type="text"], #checkout-form input[type="email"], #checkout-form input[type="tel"]');
  formInputs.forEach(input => {
    input.addEventListener('input', () => {
      formData[input.name] = input.value;
      saveFormData();
    });
  });
}

/**
 * Show order confirmation modal
 */
function showConfirmationModal() {
  const modal = document.getElementById('confirmation-modal');
  const orderNumber = generateOrderNumber();
  const emailElement = document.getElementById('confirmation-email');
  const orderNumberElement = document.getElementById('order-number');
  
  // Set confirmation details
  emailElement.textContent = formData.email;
  orderNumberElement.textContent = orderNumber;
  
  // Show modal
  modal.style.display = 'block';
  
  // Clear cart
  CartManager.clearCart();
  
  // Clear form data
  localStorage.removeItem('checkoutFormData');
}

/**
 * Generate random order number
 * @returns {string} Order number
 */
function generateOrderNumber() {
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INF-${timestamp}-${random}`;
}

/**
 * Save form data to localStorage
 */
function saveFormData() {
  localStorage.setItem('checkoutFormData', JSON.stringify(formData));
}

/**
 * Load saved form data from localStorage
 */
function loadSavedFormData() {
  const savedData = localStorage.getItem('checkoutFormData');
  
  if (savedData) {
    formData = JSON.parse(savedData);
    
    // Populate form fields
    document.getElementById('nombre').value = formData.nombre || '';
    document.getElementById('email').value = formData.email || '';
    document.getElementById('telefono').value = formData.telefono || '';
    document.getElementById('direccion').value = formData.direccion || '';
    document.getElementById('ciudad').value = formData.ciudad || '';
    document.getElementById('codigo_postal').value = formData.codigo_postal || '';
    
    // Set payment method
    if (formData.metodo_pago) {
      const paymentMethod = document.querySelector(`input[name="metodo_pago"][value="${formData.metodo_pago}"]`);
      if (paymentMethod) {
        paymentMethod.checked = true;
        
        // Show/hide card details
        const tarjetaDetails = document.getElementById('tarjeta-details');
        tarjetaDetails.style.display = formData.metodo_pago === 'tarjeta' ? 'block' : 'none';
      }
    }
  }
}

/**
 * Get color name from color ID
 * @param {string} colorId - Color ID
 * @returns {string} Color name
 */
function getColorName(colorId) {
  const colors = db.getColors();
  const color = colors.find(c => c.id === colorId);
  return color ? color.name : colorId;
}

/**
 * Get size name from size ID
 * @param {string} sizeId - Size ID
 * @returns {string} Size name
 */
function getSizeName(sizeId) {
  const sizes = db.getSizes();
  const size = sizes.find(s => s.id === sizeId);
  return size ? size.name : sizeId;
}