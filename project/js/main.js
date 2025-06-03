/**
 * Main JavaScript file for INFOTEL PERÚ home page
 */

import { db } from './data.js';
import { renderHeader, renderFooter, showToast, renderProductCard } from './components.js';
import { CartManager } from './cart.js';

// Current filter state
const filters = {
  category: 'todos',
  color: 'todos',
  size: 'todos',
  search: ''
};

/**
 * Initialize the home page
 */
document.addEventListener('DOMContentLoaded', () => {
  // Render components
  renderHeader(document.getElementById('header'));
  renderFooter(document.getElementById('footer'));
  
  // Initialize product display
  loadProducts();
  
  // Initialize filters
  setupFilters();
  
  // Setup event listeners
  setupEventListeners();
  
  // Check URL parameters for filter values
  checkUrlParams();
});

/**
 * Load and display products
 */
function loadProducts() {
  const productsContainer = document.getElementById('products-container');
  
  // Apply filters
  const filteredProducts = db.filterProducts(filters);
  
  // Check if there are no results
  if (filteredProducts.length === 0) {
    productsContainer.innerHTML = `
      <div class="no-results">
        <p>No se encontraron productos con los filtros seleccionados.</p>
        <button id="clear-filters" class="btn-secondary">Limpiar filtros</button>
      </div>
    `;
    return;
  }
  
  // Render products
  let productsHTML = '';
  
  filteredProducts.forEach(product => {
    productsHTML += renderProductCard(product);
  });
  
  productsContainer.innerHTML = productsHTML;
  
  // Add event listeners to product cards
  setupProductCardListeners();
}

/**
 * Setup product card event listeners
 */
function setupProductCardListeners() {
  // Add to cart buttons
  const addToCartButtons = document.querySelectorAll('.btn-add-cart');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      event.preventDefault();
      
      const productId = parseInt(button.dataset.id);
      const productCard = button.closest('.product-card');
      
      // Get selected color and size
      const selectedColor = productCard.querySelector('.color-option.selected')?.dataset.color;
      const selectedSize = productCard.querySelector('.size-option.selected')?.dataset.size;
      
      // Add to cart
      const product = db.getProductById(productId);
      
      if (product) {
        // Validate color and size selection
        let color = selectedColor;
        let size = selectedSize;
        
        if (!color && product.colors.length > 0) {
          color = product.colors[0];
        }
        
        if (!size && product.sizes.length > 0) {
          size = product.sizes[0];
        }
        
        // Add to cart
        const success = CartManager.addToCart(productId, 1, color, size);
        
        if (success) {
          showToast(`${product.name} agregado al carrito`, 'success');
        }
      } else {
        showToast('Producto no encontrado', 'error');
      }
    });
  });
  
  // Product details buttons
  const detailButtons = document.querySelectorAll('.btn-details');
  detailButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = parseInt(button.dataset.id);
      openProductModal(productId);
    });
  });
  
  // Color options
  const colorOptions = document.querySelectorAll('.color-option');
  colorOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove selected class from siblings
      const siblings = option.parentElement.querySelectorAll('.color-option');
      siblings.forEach(sibling => {
        sibling.classList.remove('selected');
      });
      
      // Add selected class to clicked option
      option.classList.add('selected');
    });
  });
  
  // Size options
  const sizeOptions = document.querySelectorAll('.size-option');
  sizeOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove selected class from siblings
      const siblings = option.parentElement.querySelectorAll('.size-option');
      siblings.forEach(sibling => {
        sibling.classList.remove('selected');
      });
      
      // Add selected class to clicked option
      option.classList.add('selected');
    });
  });
  
  // Select first color and size by default
  document.querySelectorAll('.product-card').forEach(card => {
    const firstColor = card.querySelector('.color-option');
    const firstSize = card.querySelector('.size-option');
    
    if (firstColor) firstColor.classList.add('selected');
    if (firstSize) firstSize.classList.add('selected');
  });
}

/**
 * Setup filter controls
 */
function setupFilters() {
  // Populate category filter
  const categoryFilter = document.getElementById('category-filter');
  const categories = db.getCategories();
  
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id;
    option.textContent = category.name;
    categoryFilter.appendChild(option);
  });
  
  // Populate color filter
  const colorFilter = document.getElementById('color-filter');
  const colors = db.getColors();
  
  colors.forEach(color => {
    const option = document.createElement('option');
    option.value = color.id;
    option.textContent = color.name;
    colorFilter.appendChild(option);
  });
  
  // Populate size filter
  const sizeFilter = document.getElementById('size-filter');
  const sizes = db.getSizes();
  
  sizes.forEach(size => {
    const option = document.createElement('option');
    option.value = size.id;
    option.textContent = size.name;
    sizeFilter.appendChild(option);
  });
}

/**
 * Setup global event listeners
 */
function setupEventListeners() {
  // Filter change events
  const categoryFilter = document.getElementById('category-filter');
  const colorFilter = document.getElementById('color-filter');
  const sizeFilter = document.getElementById('size-filter');
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  
  // Category filter
  categoryFilter.addEventListener('change', () => {
    filters.category = categoryFilter.value;
    loadProducts();
  });
  
  // Color filter
  colorFilter.addEventListener('change', () => {
    filters.color = colorFilter.value;
    loadProducts();
  });
  
  // Size filter
  sizeFilter.addEventListener('change', () => {
    filters.size = sizeFilter.value;
    loadProducts();
  });
  
  // Search
  searchButton.addEventListener('click', () => {
    filters.search = searchInput.value.trim();
    loadProducts();
  });
  
  searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      filters.search = searchInput.value.trim();
      loadProducts();
    }
  });
  
  // Clear filters button (dynamically added when no results)
  document.addEventListener('click', (event) => {
    if (event.target.id === 'clear-filters') {
      resetFilters();
    }
  });
  
  // Featured category cards
  const categoryCards = document.querySelectorAll('.category-card');
  categoryCards.forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      filters.category = category;
      
      // Update category filter display
      categoryFilter.value = category;
      
      // Reset other filters
      colorFilter.value = 'todos';
      sizeFilter.value = 'todos';
      searchInput.value = '';
      
      filters.color = 'todos';
      filters.size = 'todos';
      filters.search = '';
      
      // Scroll to products section
      document.querySelector('.products-section').scrollIntoView({ behavior: 'smooth' });
      
      // Load products with new filter
      loadProducts();
    });
  });
  
  // Product modal events
  const modal = document.getElementById('product-modal');
  const closeModal = document.querySelector('.close-modal');
  
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });
  
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
}

/**
 * Reset all filters to default values
 */
function resetFilters() {
  // Reset filter values
  filters.category = 'todos';
  filters.color = 'todos';
  filters.size = 'todos';
  filters.search = '';
  
  // Reset filter controls
  document.getElementById('category-filter').value = 'todos';
  document.getElementById('color-filter').value = 'todos';
  document.getElementById('size-filter').value = 'todos';
  document.getElementById('search-input').value = '';
  
  // Reload products
  loadProducts();
}

/**
 * Check URL parameters for filter values
 */
function checkUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Check for category parameter
  const category = urlParams.get('category');
  if (category) {
    filters.category = category;
    document.getElementById('category-filter').value = category;
  }
  
  // Check for color parameter
  const color = urlParams.get('color');
  if (color) {
    filters.color = color;
    document.getElementById('color-filter').value = color;
  }
  
  // Check for size parameter
  const size = urlParams.get('size');
  if (size) {
    filters.size = size;
    document.getElementById('size-filter').value = size;
  }
  
  // Check for search parameter
  const search = urlParams.get('search');
  if (search) {
    filters.search = search;
    document.getElementById('search-input').value = search;
  }
  
  // If any parameters are set, reload products
  if (category || color || size || search) {
    loadProducts();
  }
}

/**
 * Open product modal with product details
 * @param {number} productId - Product ID
 */
function openProductModal(productId) {
  const product = db.getProductById(productId);
  
  if (!product) {
    showToast('Producto no encontrado', 'error');
    return;
  }
  
  const modalContent = document.getElementById('modal-product-details');
  const modal = document.getElementById('product-modal');
  
  // Get color and size names
  const colors = db.getColors();
  const sizes = db.getSizes();
  
  // Render modal content
  modalContent.innerHTML = `
    <div class="product-modal-content">
      <div class="modal-product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      
      <div class="modal-product-info">
        <h2>${product.name}</h2>
        <p class="modal-product-category">${getCategoryName(product.category)}</p>
        <p class="modal-product-price">S/. ${product.price.toFixed(2)}</p>
        <p class="modal-product-description">${product.description}</p>
        
        <div class="modal-product-options">
          <p class="option-title">Colores:</p>
          <div class="product-colors">
            ${product.colors.map(colorId => {
              const color = colors.find(c => c.id === colorId);
              return `<div class="color-option" style="background-color: ${color.value};" data-color="${color.id}" title="${color.name}"></div>`;
            }).join('')}
          </div>
          
          <p class="option-title">Tallas:</p>
          <div class="product-sizes">
            ${product.sizes.map(sizeId => {
              const size = sizes.find(s => s.id === sizeId);
              return `<div class="size-option" data-size="${size.id}">${size.name}</div>`;
            }).join('')}
          </div>
        </div>
        
        <div class="modal-product-actions">
          <div class="quantity-selector">
            <button class="quantity-btn quantity-decrease">-</button>
            <input type="number" class="quantity-input" value="1" min="1" max="99">
            <button class="quantity-btn quantity-increase">+</button>
          </div>
          
          <button class="btn-primary modal-add-to-cart" data-id="${product.id}">
            <i class="fas fa-shopping-cart"></i> Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Show modal
  modal.style.display = 'block';
  
  // Setup modal event listeners
  setupModalEventListeners(product);
}

/**
 * Setup event listeners for product modal
 * @param {Object} product - Product data
 */
function setupModalEventListeners(product) {
  const modalContent = document.getElementById('modal-product-details');
  
  // Color options
  const colorOptions = modalContent.querySelectorAll('.color-option');
  colorOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove selected class from siblings
      const siblings = option.parentElement.querySelectorAll('.color-option');
      siblings.forEach(sibling => {
        sibling.classList.remove('selected');
      });
      
      // Add selected class to clicked option
      option.classList.add('selected');
    });
  });
  
  // Select first color by default
  if (colorOptions.length > 0) {
    colorOptions[0].classList.add('selected');
  }
  
  // Size options
  const sizeOptions = modalContent.querySelectorAll('.size-option');
  sizeOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove selected class from siblings
      const siblings = option.parentElement.querySelectorAll('.size-option');
      siblings.forEach(sibling => {
        sibling.classList.remove('selected');
      });
      
      // Add selected class to clicked option
      option.classList.add('selected');
    });
  });
  
  // Select first size by default
  if (sizeOptions.length > 0) {
    sizeOptions[0].classList.add('selected');
  }
  
  // Quantity controls
  const quantityInput = modalContent.querySelector('.quantity-input');
  const decreaseBtn = modalContent.querySelector('.quantity-decrease');
  const increaseBtn = modalContent.querySelector('.quantity-increase');
  
  decreaseBtn.addEventListener('click', () => {
    let quantity = parseInt(quantityInput.value) - 1;
    if (quantity < 1) quantity = 1;
    quantityInput.value = quantity;
  });
  
  increaseBtn.addEventListener('click', () => {
    let quantity = parseInt(quantityInput.value) + 1;
    quantityInput.value = quantity;
  });
  
  // Add to cart button
  const addToCartBtn = modalContent.querySelector('.modal-add-to-cart');
  addToCartBtn.addEventListener('click', () => {
    const quantity = parseInt(quantityInput.value);
    const selectedColor = modalContent.querySelector('.color-option.selected')?.dataset.color;
    const selectedSize = modalContent.querySelector('.size-option.selected')?.dataset.size;
    
    // Add to cart
    const success = CartManager.addToCart(product.id, quantity, selectedColor, selectedSize);
    
    if (success) {
      showToast(`${product.name} agregado al carrito`, 'success');
      
      // Close modal
      document.getElementById('product-modal').style.display = 'none';
    }
  });
}

/**
 * Get category name from category ID
 * @param {string} categoryId - Category ID
 * @returns {string} Category name
 */
function getCategoryName(categoryId) {
  const categories = db.getCategories();
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.name : categoryId;
}