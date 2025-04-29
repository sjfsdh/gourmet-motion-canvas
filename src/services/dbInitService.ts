
import { query, testDatabaseConnection } from '../config/database';
import { initializeMenuItemsTable } from './menuService';
import { toast } from "sonner";

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && window.document;

// Interface for count result
interface CountResult {
  count: string;
}

// Type guard to check if an object is a CountResult
function isCountResult(obj: any): obj is CountResult {
  return obj && typeof obj.count === 'string';
}

// Initialize all required database tables
export const initializeDatabase = async (): Promise<void> => {
  try {
    console.log('Starting database initialization...');
    
    // Skip actual table creation in browser environment (already done via SQL migration)
    if (isBrowser) {
      console.log('Browser environment detected, using Supabase tables');
      return;
    }
    
    // Test connection before proceeding
    const connectionSuccessful = await testDatabaseConnection();
    if (!connectionSuccessful) {
      throw new Error('Database connection failed');
    }
    
    // Tables are already initialized through SQL migrations
    console.log('Database tables initialized via SQL migration');
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
      console.log('Browser environment detected, checking if seeding is needed');
    }
    
    // Check if menu_items table is empty
    const menuItems = await query('SELECT COUNT(*) FROM menu_items');
    
    if (menuItems.length > 0) {
      const firstItem = menuItems[0];
      
      // Use the type guard to check if this is a count result
      if (isCountResult(firstItem)) {
        const count = parseInt(firstItem.count || '0');
        console.log(`Menu items count: ${count}`);
        
        if (count === 0) {
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
          
          // Insert samples via Supabase
          for (const item of sampleItems) {
            const { data, error } = await supabase.from('menu_items').insert(item);
            if (error) console.error('Error inserting sample item:', error);
          }
          
          console.log('Sample menu items added.');
        }
      }
    }
    
    // Check if users table is empty
    const users = await query('SELECT COUNT(*) FROM users');
    
    if (users.length > 0) {
      const firstUser = users[0];
      
      // Use type guard to check if this is a count result
      if (isCountResult(firstUser)) {
        const count = parseInt(firstUser.count || '0');
        if (count === 0) {
          console.log('Admin user already added through migration');
        }
      }
    }
    
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
