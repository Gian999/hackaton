/**
 * Products database structure for INFOTEL PERÚ
 * This file simulates a database with product information
 */

// Define the available categories, colors, and sizes
export const categories = [
  { id: 'ropa', name: 'Ropa' },
  { id: 'accesorios', name: 'Accesorios' },
  { id: 'hogar', name: 'Hogar' },
  { id: 'servicios', name: 'Servicios' }
];

export const colors = [
  { id: 'rojo', name: 'Rojo', value: '#e63946' },
  { id: 'azul', name: 'Azul', value: '#457b9d' },
  { id: 'verde', name: 'Verde', value: '#2a9d8f' },
  { id: 'amarillo', name: 'Amarillo', value: '#f9c74f' },
  { id: 'negro', name: 'Negro', value: '#212529' },
  { id: 'blanco', name: 'Blanco', value: '#ffffff' },
  { id: 'gris', name: 'Gris', value: '#6c757d' },
  { id: 'marron', name: 'Marrón', value: '#774936' },
  { id: 'morado', name: 'Morado', value: '#7209b7' },
  { id: 'naranja', name: 'Naranja', value: '#f3722c' }
];

export const sizes = [
  { id: 'xs', name: 'XS' },
  { id: 's', name: 'S' },
  { id: 'm', name: 'M' },
  { id: 'l', name: 'L' },
  { id: 'xl', name: 'XL' },
  { id: 'xxl', name: 'XXL' },
  { id: 'unico', name: 'Único' }
];

// Products data array
export const products = [
  {
    id: 1,
    name: 'Poncho Andino Tradicional',
    description: 'Poncho de lana con diseños tradicionales andinos, tejido a mano por artesanos locales. Perfecto para días fríos y como prenda distintiva cultural.',
    price: 89.99,
    sizes: ['s', 'm', 'l', 'xl'],
    colors: ['rojo', 'azul', 'negro', 'marron'],
    category: 'ropa',
    image: 'https://images.pexels.com/photos/7262464/pexels-photo-7262464.jpeg',
    rating: 4.8,
    stock: 25
  },
  {
    id: 2,
    name: 'Cardigan Alpaca Premium',
    description: 'Cardigan tejido con lana de alpaca de la más alta calidad. Suave, cálido y duradero, con diseños geométricos inspirados en la cultura andina.',
    price: 129.99,
    sizes: ['xs', 's', 'm', 'l', 'xl'],
    colors: ['gris', 'marron', 'negro', 'azul'],
    category: 'ropa',
    image: 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg',
    rating: 4.9,
    stock: 15
  },
  {
    id: 3,
    name: 'Chaleco Bordado Artesanal',
    description: 'Chaleco con bordados hechos a mano, inspirados en la iconografía peruana. Cada pieza es única y cuenta una historia a través de sus detalles.',
    price: 75.50,
    sizes: ['s', 'm', 'l'],
    colors: ['negro', 'azul', 'rojo'],
    category: 'ropa',
    image: 'https://images.pexels.com/photos/4904563/pexels-photo-4904563.jpeg',
    rating: 4.7,
    stock: 20
  },
  {
    id: 4,
    name: 'Mochila Tejida Wayuu',
    description: 'Mochila tejida a mano con técnica Wayuu, colorida y resistente. Ideal para uso diario, combinando funcionalidad y tradición artesanal.',
    price: 65.00,
    sizes: ['unico'],
    colors: ['multicolor', 'rojo', 'azul', 'verde'],
    category: 'accesorios',
    image: 'https://images.pexels.com/photos/2071550/pexels-photo-2071550.jpeg',
    rating: 4.6,
    stock: 30
  },
  {
    id: 5,
    name: 'Chullo Peruano de Lana',
    description: 'Gorro tradicional peruano (chullo) tejido con lana de oveja. Mantiene tu cabeza caliente mientras muestras el increíble arte textil andino.',
    price: 35.00,
    sizes: ['s', 'm', 'l'],
    colors: ['multicolor', 'azul', 'rojo', 'verde'],
    category: 'accesorios',
    image: 'https://images.pexels.com/photos/6858673/pexels-photo-6858673.jpeg',
    rating: 4.5,
    stock: 40
  },
  {
    id: 6,
    name: 'Manta Alpaca Premium',
    description: 'Manta de alpaca 100% natural, extremadamente suave y cálida. Perfecta para decorar tu hogar y mantenerte abrigado en las noches frías.',
    price: 149.99,
    sizes: ['unico'],
    colors: ['gris', 'marron', 'negro', 'blanco'],
    category: 'hogar',
    image: 'https://images.pexels.com/photos/6580227/pexels-photo-6580227.jpeg',
    rating: 4.9,
    stock: 10
  },
  {
    id: 7,
    name: 'Cojines Decorativos Andinos',
    description: 'Set de cojines con diseños andinos, confeccionados con telas de alta calidad y bordados a mano. Dale un toque étnico a tu hogar.',
    price: 45.00,
    sizes: ['unico'],
    colors: ['multicolor', 'rojo', 'azul', 'verde'],
    category: 'hogar',
    image: 'https://images.pexels.com/photos/4946984/pexels-photo-4946984.jpeg',
    rating: 4.7,
    stock: 35
  },
  {
    id: 8,
    name: 'Servicio de Sublimado Personalizado',
    description: 'Servicio de sublimado profesional para tus diseños en diversos materiales y productos. Ideal para regalos personalizados o merchandising.',
    price: 25.00,
    sizes: ['unico'],
    colors: ['blanco'],
    category: 'servicios',
    image: 'https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg',
    rating: 4.8,
    stock: 999
  },
  {
    id: 9,
    name: 'Impresión de Alta Calidad',
    description: 'Servicio de impresión digital en alta resolución para tus proyectos. Disponible en diferentes tamaños y materiales.',
    price: 18.50,
    sizes: ['unico'],
    colors: ['blanco'],
    category: 'servicios',
    image: 'https://images.pexels.com/photos/4065876/pexels-photo-4065876.jpeg',
    rating: 4.6,
    stock: 999
  },
  {
    id: 10,
    name: 'Bolso de Mano Artesanal',
    description: 'Bolso de mano tejido con técnicas tradicionales y adornado con detalles únicos. Combina estilo y tradición en un accesorio práctico.',
    price: 55.00,
    sizes: ['unico'],
    colors: ['marron', 'negro', 'rojo', 'azul'],
    category: 'accesorios',
    image: 'https://images.pexels.com/photos/2002717/pexels-photo-2002717.jpeg',
    rating: 4.7,
    stock: 20
  },
  {
    id: 11,
    name: 'Camisa Bordada a Mano',
    description: 'Camisa de algodón con hermosos bordados hechos a mano. Cada pieza es única y representa la rica tradición textil peruana.',
    price: 69.99,
    sizes: ['xs', 's', 'm', 'l', 'xl'],
    colors: ['blanco', 'azul', 'verde'],
    category: 'ropa',
    image: 'https://images.pexels.com/photos/8386668/pexels-photo-8386668.jpeg',
    rating: 4.8,
    stock: 15
  },
  {
    id: 12,
    name: 'Tapiz Decorativo Inca',
    description: 'Hermoso tapiz inspirado en motivos incas, tejido a mano. Una pieza de arte para colgar en tu pared y darle un toque étnico a tu hogar.',
    price: 85.00,
    sizes: ['unico'],
    colors: ['multicolor', 'rojo', 'marron'],
    category: 'hogar',
    image: 'https://images.pexels.com/photos/6580625/pexels-photo-6580625.jpeg',
    rating: 4.9,
    stock: 8
  }
];

/**
 * Helper function to simulate database query functionality
 * This could be replaced with actual API calls in the future
 */
export const db = {
  /**
   * Get all products
   * @returns {Array} All products
   */
  getProducts: function() {
    return products;
  },
  
  /**
   * Get product by ID
   * @param {number} id - Product ID
   * @returns {Object|null} Product object or null if not found
   */
  getProductById: function(id) {
    return products.find(product => product.id === parseInt(id)) || null;
  },
  
  /**
   * Filter products by various criteria
   * @param {Object} filters - Object containing filter criteria
   * @returns {Array} Filtered products
   */
  filterProducts: function(filters = {}) {
    return products.filter(product => {
      // Filter by category
      if (filters.category && filters.category !== 'todos' && product.category !== filters.category) {
        return false;
      }
      
      // Filter by color
      if (filters.color && filters.color !== 'todos' && !product.colors.includes(filters.color)) {
        return false;
      }
      
      // Filter by size
      if (filters.size && filters.size !== 'todos' && !product.sizes.includes(filters.size)) {
        return false;
      }
      
      // Filter by search term
      if (filters.search && filters.search.trim() !== '') {
        const searchTerm = filters.search.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
        );
      }
      
      return true;
    });
  },
  
  /**
   * Get all available categories
   * @returns {Array} Categories
   */
  getCategories: function() {
    return categories;
  },
  
  /**
   * Get all available colors
   * @returns {Array} Colors
   */
  getColors: function() {
    return colors;
  },
  
  /**
   * Get all available sizes
   * @returns {Array} Sizes
   */
  getSizes: function() {
    return sizes;
  }
};