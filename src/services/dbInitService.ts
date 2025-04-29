
import { query, testDatabaseConnection } from '../config/database';
import { initializeMenuItemsTable } from './menuService';
import { toast } from "sonner";

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && window.document;

// Initialize all required database tables
export const initializeDatabase = async (): Promise<void> => {
  try {
    console.log('Starting database initialization...');
    
    // Skip actual table creation in browser environment
    if (isBrowser) {
      console.log('Browser environment detected, skipping actual database initialization');
      return;
    }
    
    // Test connection before proceeding
    const connectionSuccessful = await testDatabaseConnection();
    if (!connectionSuccessful) {
      throw new Error('Database connection failed');
    }
    
    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table initialized');
    
    // Create orders table
    await query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        status VARCHAR(50) DEFAULT 'pending',
        payment_status VARCHAR(50) DEFAULT 'pending',
        total DECIMAL(10, 2) NOT NULL,
        address TEXT,
        phone VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Orders table initialized');
    
    // Initialize menu items table (already defined in menuService)
    await initializeMenuItemsTable();
    
    // Create order_items table (after menu_items table is created)
    await query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(id),
        menu_item_id INTEGER REFERENCES menu_items(id),
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL
      )
    `);
    console.log('Order items table initialized');
    
    // Create gallery table
    await query(`
      CREATE TABLE IF NOT EXISTS gallery (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        url TEXT NOT NULL,
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Gallery table initialized');
    
    console.log('Database initialization complete');
  } catch (error) {
    console.error('Database initialization error:', error);
    if (isBrowser) {
      toast.error("Database initialization failed. Using mock data instead.");
    }
    throw error;
  }
};

// Insert seed data for testing if tables are empty
export const seedDatabaseIfEmpty = async (): Promise<void> => {
  try {
    if (isBrowser) {
      console.log('Browser environment detected, skipping database seeding');
      return;
    }
    
    // Check if menu_items table is empty
    const menuItems = await query('SELECT COUNT(*) FROM menu_items');
    
    if (parseInt(menuItems[0]?.count || '0') === 0) {
      console.log('Seeding menu items...');
      
      // Sample menu items
      const sampleItems = [
        {
          name: 'Burrata Salad',
          description: 'Fresh burrata cheese with heirloom tomatoes, basil, and aged balsamic.',
          price: 14.99,
          image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          category: 'starters',
          featured: true
        },
        {
          name: 'Filet Mignon',
          description: '8oz prime beef tenderloin with red wine reduction and roasted vegetables.',
          price: 42.99,
          image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          category: 'mains',
          featured: true
        },
        {
          name: 'Chocolate Fondant',
          description: 'Warm chocolate cake with a molten center and vanilla ice cream.',
          price: 12.99,
          image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          category: 'desserts',
          featured: true
        },
        {
          name: 'Caprese Bruschetta',
          description: 'Toasted ciabatta topped with fresh tomatoes, mozzarella, and basil.',
          price: 11.99,
          image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          category: 'starters',
          featured: false
        },
        {
          name: 'Grilled Salmon',
          description: 'Fresh Atlantic salmon with lemon butter sauce and seasonal vegetables.',
          price: 28.99,
          image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          category: 'mains',
          featured: false
        }
      ];
      
      for (const item of sampleItems) {
        await query(
          'INSERT INTO menu_items (name, description, price, image, category, featured, in_stock) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [item.name, item.description, item.price, item.image, item.category, item.featured, true]
        );
      }
      
      console.log('Sample menu items added.');
    }
    
    // Check if users table is empty
    const users = await query('SELECT COUNT(*) FROM users');
    
    if (parseInt(users[0]?.count || '0') === 0) {
      console.log('Seeding admin user...');
      
      // Add admin user (password should be hashed in production)
      await query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
        ['Admin User', 'admin@restaurant.com', 'admin123', 'admin']
      );
      
      console.log('Admin user added.');
    }
    
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
