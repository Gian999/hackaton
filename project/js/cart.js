/**
 * Cart Module for INFOTEL PERÚ
 * Handles all shopping cart related functionality
 */

import { db } from './data.js';
import { showToast, renderHeader, renderFooter} from './components.js';

/**
 * Cart Manager object - handles cart operations
 */
export const CartManager = {
  /**
   * Get the cart from localStorage
   * @returns {Array} Array of cart items
   */
  getCart: function() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  },
  
  /**
   * Save the cart to localStorage
   * @param {Array} cart - Cart items
   */
  saveCart: function(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  },
  
  /**
   * Get the number of items in the cart
   * @returns {number} Number of items
   */
  getCartItemsCount: function() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  },
  
  /**
   * Get the total price of items in the cart
   * @returns {number} Total price
   */
  getCartTotal: function() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
  
  /**
   * Add a product to the cart
   * @param {number} productId - Product ID
   * @param {number} quantity - Quantity to add
   * @param {string} color - Selected color
   * @param {string} size - Selected size
   * @returns {boolean} Success status
   */
  addToCart: function(productId, quantity = 1, color, size) {
    const product = db.getProductById(productId);
    
    if (!product) {
      showToast('Producto no encontrado', 'error');
      return false;
    }
    
    // Validate color selection
    if (!color && product.colors.length > 0) {
      color = product.colors[0];
    }
    
    // Validate size selection
    if (!size && product.sizes.length > 0) {
      size = product.sizes[0];
    }
    
    // Get current cart
    const cart = this.getCart();
    
    // Check if product is already in cart with same color and size
    const existingItemIndex = cart.findIndex(item => 
      item.id === productId && 
      item.color === color && 
      item.size === size
    );
    
    if (existingItemIndex !== -1) {
      // Update quantity if item exists
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.push({
        id: productId,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity,
        color: color,
        size: size,
        category: product.category
      });
    }
    
    // Save updated cart
    this.saveCart(cart);
    
    // Update cart count in header
    this.updateCartCount();
    
    return true;
  },
  
  /**
   * Remove an item from the cart
   * @param {number} index - Item index in the cart
   */
  removeFromCart: function(index) {
    const cart = this.getCart();
    
    if (index >= 0 && index < cart.length) {
      cart.splice(index, 1);
      this.saveCart(cart);
      
      // Update cart count in header
      this.updateCartCount();
      
      return true;
    }
    
    return false;
  },
  
  /**
   * Update the quantity of an item in the cart
   * @param {number} index - Item index
   * @param {number} quantity - New quantity
   */
  updateQuantity: function(index, quantity) {
    const cart = this.getCart();
    
    if (index >= 0 && index < cart.length && quantity > 0) {
      cart[index].quantity = quantity;
      this.saveCart(cart);
      
      // Update cart count in header
      this.updateCartCount();
      
      return true;
    }
    
    return false;
  },
  
  /**
   * Clear the cart
   */
  clearCart: function() {
    localStorage.removeItem('cart');
    
    // Update cart count in header
    this.updateCartCount();
  },
  
  /**
   * Update the cart count in the header
   */
  updateCartCount: function() {
    const countElement = document.querySelector('.cart-count');
    if (countElement) {
      countElement.textContent = this.getCartItemsCount().toString();
    }
  }
};

/**
 * Initialize cart page functionality
 */
export function initCartPage() {
  renderCartItems();
  setupCartEventListeners();
}

/**
 * Render cart items on the cart page
 */
function renderCartItems() {
  const cart = CartManager.getCart();
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartEmptyElement = document.getElementById('cart-empty');
  const cartContentElement = document.getElementById('cart-content');
  
  // Only proceed if we're on the cart page and elements exist
  if (!cartItemsContainer || !cartEmptyElement || !cartContentElement) {
    return;
  }
  
  // Show empty cart message if cart is empty
  if (cart.length === 0) {
    cartEmptyElement.classList.remove('hidden');
    cartContentElement.classList.add('hidden');
    return;
  }
  
  // Hide empty cart message and show cart content
  cartEmptyElement.classList.add('hidden');
  cartContentElement.classList.remove('hidden');
  
  // Render cart items
  let cartItemsHTML = '';
  
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    
    cartItemsHTML += `
      <div class="cart-item" data-index="${index}">
        <div class="item-product">
          <div class="item-image">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="item-details">
            <h3>${item.name}</h3>
            <p class="item-variant">
              ${getColorName(item.color)} / ${getSizeName(item.size)}
            </p>
          </div>
        </div>
        
        <div class="item-price" data-label="Precio:">
          S/. ${item.price.toFixed(2)}
        </div>
        
        <div class="item-quantity" data-label="Cantidad:">
          <div class="quantity-selector">
            <button class="quantity-btn quantity-decrease">-</button>
            <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="99">
            <button class="quantity-btn quantity-increase">+</button>
          </div>
        </div>
        
        <div class="item-total" data-label="Total:">
          S/. ${itemTotal.toFixed(2)}
        </div>
        
        <div class="item-remove">
          <i class="fas fa-trash-alt"></i>
        </div>
      </div>
    `;
  });
  
  cartItemsContainer.innerHTML = cartItemsHTML;
  
  // Update cart summary
  updateCartSummary();
}

/**
 * Update the cart summary with current totals
 */
function updateCartSummary() {
  const subtotalElement = document.getElementById('cart-subtotal');
  const totalElement = document.getElementById('cart-total');
  const shippingElement = document.getElementById('cart-shipping');
  
  // Only proceed if we're on the cart page and elements exist
  if (!subtotalElement || !totalElement || !shippingElement) {
    return;
  }
  
  const subtotal = CartManager.getCartTotal();
  const shipping = subtotal > 0 ? 15 : 0;
  const total = subtotal + shipping;
  
  subtotalElement.textContent = `S/. ${subtotal.toFixed(2)}`;
  shippingElement.textContent = `S/. ${shipping.toFixed(2)}`;
  totalElement.textContent = `S/. ${total.toFixed(2)}`;
}

/**
 * Set up event listeners for cart page
 */
function setupCartEventListeners() {
  const cartItemsContainer = document.getElementById('cart-items-container');
  const checkoutButton = document.getElementById('checkout-button');
  
  // Event delegation for cart item actions
  if (cartItemsContainer) {
    cartItemsContainer.addEventListener('click', (event) => {
      const target = event.target;
      const cartItem = target.closest('.cart-item');
      
      if (!cartItem) return;
      
      const index = parseInt(cartItem.dataset.index);
      
      // Handle remove button
      if (target.classList.contains('fa-trash-alt') || target.classList.contains('item-remove')) {
        CartManager.removeFromCart(index);
        renderCartItems();
        showToast('Producto eliminado del carrito');
      }
      
      // Handle quantity decrease
      if (target.classList.contains('quantity-decrease')) {
        const inputElement = cartItem.querySelector('.quantity-input');
        let quantity = parseInt(inputElement.value) - 1;
        
        if (quantity < 1) quantity = 1;
        
        inputElement.value = quantity;
        CartManager.updateQuantity(index, quantity);
        renderCartItems();
      }
      
      // Handle quantity increase
      if (target.classList.contains('quantity-increase')) {
        const inputElement = cartItem.querySelector('.quantity-input');
        let quantity = parseInt(inputElement.value) + 1;
        
        inputElement.value = quantity;
        CartManager.updateQuantity(index, quantity);
        renderCartItems();
      }
    });
    
    // Handle quantity input changes
    cartItemsContainer.addEventListener('change', (event) => {
      const target = event.target;
      
      if (target.classList.contains('quantity-input')) {
        const cartItem = target.closest('.cart-item');
        const index = parseInt(cartItem.dataset.index);
        let quantity = parseInt(target.value);
        
        if (quantity < 1) {
          quantity = 1;
          target.value = 1;
        }
        
        CartManager.updateQuantity(index, quantity);
        renderCartItems();
      }
    });
  }
  
  // Handle checkout button
  if (checkoutButton) {
    checkoutButton.addEventListener('click', () => {
      if (CartManager.getCartItemsCount() > 0) {
        window.location.href = 'checkout.html';
      } else {
        showToast('Tu carrito está vacío', 'error');
      }
    });
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

// Initialize cart page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize cart page functionality if we're on the cart page
  if (window.location.pathname.endsWith('/carrito.html')) {
    // Render components
    renderHeader(document.getElementById('header'));
    renderFooter(document.getElementById('footer'));
    
    // Initialize cart functionality
    initCartPage();
  }
});