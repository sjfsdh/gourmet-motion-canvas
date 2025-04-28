
import { Pool } from 'pg';

// Create a connection pool configuration
const poolConfig = {
  user: 'postgres',
  host: 'maglev.proxy.rlwy.net',
  database: 'railway',
  password: 'oSVmWhGnHXKcdOrsBZPOIabFkQTiEOkW',
  port: 29153,
  // Add SSL if needed for your railway deployment
  // ssl: { rejectUnauthorized: false }
};

// Create a mock database interface for browser environments
const browserDb = {
  query: async (text: string, params?: any[]) => {
    console.warn('Database query attempted in browser environment:', text);
    // Return mock data based on common query patterns
    if (text.includes('SELECT * FROM menu_items')) {
      return [
        {
          id: 1,
          name: 'Burrata Salad',
          description: 'Fresh burrata cheese with heirloom tomatoes, basil, and aged balsamic.',
          price: 14.99,
          image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          category: 'starters',
          featured: true
        },
        {
          id: 2,
          name: 'Filet Mignon',
          description: '8oz prime beef tenderloin with red wine reduction and roasted vegetables.',
          price: 42.99,
          image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          category: 'mains',
          featured: true
        },
        {
          id: 3,
          name: 'Chocolate Fondant',
          description: 'Warm chocolate cake with a molten center and vanilla ice cream.',
          price: 12.99,
          image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          category: 'desserts',
          featured: true
        }
      ];
    }
    return [];
  },
};

// Determine if we're in a Node.js environment or browser environment
const isNode = typeof process !== 'undefined' && 
  process.versions != null && 
  process.versions.node != null;

// Create pool only in Node.js environment
const pool = isNode ? new Pool(poolConfig) : null;

// Export the query function that works in both environments
export const query = async (text: string, params?: any[]) => {
  try {
    if (pool) {
      // Node.js environment - use real database
      const result = await pool.query(text, params);
      return result.rows;
    } else {
      // Browser environment - use mock data
      return await browserDb.query(text, params);
    }
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

export default pool;
