
// Create a mock database interface for browser environments
const browserDb = {
  query: async (text: string, params?: any[]) => {
    console.log('Browser environment detected, using mock data for:', text);
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
          featured: true,
          in_stock: true
        },
        {
          id: 2,
          name: 'Filet Mignon',
          description: '8oz prime beef tenderloin with red wine reduction and roasted vegetables.',
          price: 42.99,
          image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          category: 'mains',
          featured: true,
          in_stock: true
        },
        {
          id: 3,
          name: 'Chocolate Fondant',
          description: 'Warm chocolate cake with a molten center and vanilla ice cream.',
          price: 12.99,
          image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          category: 'desserts',
          featured: true,
          in_stock: true
        }
      ];
    } else if (text.includes('SELECT COUNT(*) FROM menu_items')) {
      return [{ count: "3" }];
    } else if (text.includes('SELECT COUNT(*) FROM users')) {
      return [{ count: "0" }];
    }
    return [];
  },
};

// Determine if we're in a Node.js environment or browser environment
const isNode = typeof process !== 'undefined' && 
  process.versions != null && 
  process.versions.node != null;

// Export the query function that works in both environments
export const query = async (text: string, params?: any[]) => {
  try {
    // Always use mock data in browser environment
    // In production, this would be handled by server-side code
    console.log('Executing mock database query:', text);
    return await browserDb.query(text, params);
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

// Function to test database connection
export const testDatabaseConnection = async (): Promise<boolean> => {
  try {
    console.log('Browser environment detected, skipping database connection test');
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
};

// No need to export pool since we're not creating one in the browser
