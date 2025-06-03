/**
 * Components module for INFOTEL PERÚ
 * Contains reusable UI components for the application
 */

import { db } from './data.js';
import { CartManager } from './cart.js';

/**
 * Renders the header component
 * @param {HTMLElement} container - The container element
 */
export function renderHeader(container) {
  const cartCount = CartManager.getCartItemsCount();
  
  container.innerHTML = `
    <div class="container">
      <div class="header-content">
        <div class="logo">
          <a href="index.html">INFOTEL PERÚ</a>
        </div>
        
        <button class="mobile-menu-toggle">
          <i class="fas fa-bars"></i>
        </button>
        
        <ul class="nav-links">
          <li><a href="index.html">Inicio</a></li>
          <li><a href="index.html#products">Productos</a></li>
          <li><a href="index.html#services">Servicios</a></li>
          <li><a href="index.html#about">Nosotros</a></li>
          <li><a href="index.html#contact">Contacto</a></li>
          <li>
            <a href="carrito.html" class="cart-icon">
              <i class="fas fa-shopping-cart"></i>
              <span class="cart-count">${cartCount}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  `;
  
  // Add mobile menu toggle functionality
  const menuToggle = container.querySelector('.mobile-menu-toggle');
  const navLinks = container.querySelector('.nav-links');
  
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

/**
 * Renders the footer component
 * @param {HTMLElement} container - The container element
 */
export function renderFooter(container) {
  container.innerHTML = `
    <div class="container">
      <div class="footer-content">
        <div class="footer-column">
          <h3>INFOTEL PERÚ</h3>
          <p>Empresa peruana dedicada a la venta de ropa, accesorios, artículos para el hogar y servicios como sublimado, impresión y sellado.</p>
          <div class="social-icons">
            <a href="#"><i class="fab fa-facebook"></i></a>
            <a href="#"><i class="fab fa-instagram"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-whatsapp"></i></a>
          </div>
        </div>
        
        <div class="footer-column">
          <h3>Enlaces Rápidos</h3>
          <ul class="footer-links">
            <li><a href="index.html">Inicio</a></li>
            <li><a href="index.html#products">Productos</a></li>
            <li><a href="index.html#services">Servicios</a></li>
            <li><a href="index.html#about">Nosotros</a></li>
            <li><a href="index.html#contact">Contacto</a></li>
          </ul>
        </div>
        
        <div class="footer-column">
          <h3>Categorías</h3>
          <ul class="footer-links">
            <li><a href="index.html?category=ropa">Ropa</a></li>
            <li><a href="index.html?category=accesorios">Accesorios</a></li>
            <li><a href="index.html?category=hogar">Hogar</a></li>
            <li><a href="index.html?category=servicios">Servicios</a></li>
          </ul>
        </div>
        
        <div class="footer-column">
          <h3>Contacto</h3>
          <ul class="footer-links">
            <li><i class="fas fa-map-marker-alt"></i> Av. La Marina 2000, San Miguel, Lima</li>
            <li><i class="fas fa-phone"></i> 01-234-5678</li>
            <li><i class="fas fa-mobile-alt"></i> 987-654-321</li>
            <li><i class="fas fa-envelope"></i> contacto@infotelperu.com</li>
          </ul>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} INFOTEL PERÚ. Todos los derechos reservados.</p>
      </div>
    </div>
  `;
}

/**
 * Shows a toast notification
 * @param {string} message - Message to display
 * @param {string} type - Notification type (success or error)
 */
export function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = 'toast';
  
  if (type === 'error') {
    toast.classList.add('error');
  }
  
  toast.classList.add('show');
  
  // Hide toast after 3 seconds
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/**
 * Renders the product card component
 * @param {Object} product - Product data
 * @returns {string} HTML string for the product card
 */
export function renderProductCard(product) {
  return `
    <div class="product-card" data-id="${product.id}">
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-category">${getCategoryName(product.category)}</p>
        <p class="product-price">S/. ${product.price.toFixed(2)}</p>
        <div class="product-colors">
          ${renderColorOptions(product.colors)}
        </div>
        <div class="product-sizes">
          ${renderSizeOptions(product.sizes)}
        </div>
        <div class="product-actions">
          <button class="btn-add-cart" data-id="${product.id}">
            <i class="fas fa-shopping-cart"></i> Agregar
          </button>
          <button class="btn-details" data-id="${product.id}">
            <i class="fas fa-eye"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Renders color options for a product
 * @param {Array} colors - Array of color IDs
 * @returns {string} HTML string for color options
 */
function renderColorOptions(colors) {
  const allColors = db.getColors();
  
  return colors.map(colorId => {
    const color = allColors.find(c => c.id === colorId);
    if (!color) return '';
    
    return `<div class="color-option" style="background-color: ${color.value};" data-color="${color.id}" title="${color.name}"></div>`;
  }).join('');
}

/**
 * Renders size options for a product
 * @param {Array} sizes - Array of size IDs
 * @returns {string} HTML string for size options
 */
function renderSizeOptions(sizes) {
  const allSizes = db.getSizes();
  
  return sizes.map(sizeId => {
    const size = allSizes.find(s => s.id === sizeId);
    if (!size) return '';
    
    return `<div class="size-option" data-size="${size.id}">${size.name}</div>`;
  }).join('');
}

/**
 * Gets the category name from the category ID
 * @param {string} categoryId - Category ID
 * @returns {string} Category name
 */
function getCategoryName(categoryId) {
  const categories = db.getCategories();
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.name : categoryId;
}