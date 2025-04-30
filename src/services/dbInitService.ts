
import { query, CountResult } from '../config/database';
import { supabase } from '../integrations/supabase/client';

// Initial menu items for database seeding
const initialMenuItems = [
  {
    name: 'Traditional Gyro',
    description: 'Tender slices of beef and lamb wrapped in warm pita bread with tomatoes, onions, and tzatziki sauce.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1529589789467-4a12ccb8e5ff',
    category: 'mains',
    featured: true
  },
  {
    name: 'Greek Salad',
    description: 'Crisp lettuce, tomatoes, cucumbers, red onions, Kalamata olives, and feta cheese, tossed in our house Greek dressing.',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe',
    category: 'starters',
    featured: true
  },
  {
    name: 'Spanakopita',
    description: 'Flaky phyllo pastry filled with spinach, feta cheese, and herbs.',
    price: 7.99,
    image: 'https://images.unsplash.com/photo-1537627856186-9398d2adade3',
    category: 'starters',
    featured: false
  },
  {
    name: 'Lamb Souvlaki Plate',
    description: 'Marinated lamb skewers served with rice pilaf, Greek salad, and pita bread.',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd',
    category: 'mains',
    featured: true
  },
  {
    name: 'Baklava',
    description: 'Layers of phyllo dough filled with chopped nuts and sweetened with honey syrup.',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1519676867240-f03562e64548',
    category: 'desserts',
    featured: false
  },
  {
    name: 'Greek Fries',
    description: 'Hand-cut fries tossed with Greek herbs, feta cheese, and olive oil.',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f',
    category: 'sides',
    featured: false
  }
];

// Function to initialize database
export const initializeDatabase = async () => {
  try {
    console.log('Initializing database...');
    
    // Test connection to database
    const { data, error } = await supabase.from('settings').select('restaurant_name').limit(1);
    
    if (error) {
      console.error('Database connection error:', error);
      throw error;
    }
    
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization failed:', error);
    return false;
  }
};

// Function to seed database if empty
export const seedDatabaseIfEmpty = async () => {
  try {
    console.log('Checking if database needs seeding...');
    
    // Check if menu_items table is empty
    const result = await query('SELECT COUNT(*) FROM menu_items');
    
    // Ensure we have a CountResult
    if (!result || result.length === 0) {
      throw new Error("Could not count menu items");
    }
    
    const countResult = result[0];
    if ('count' in countResult) {
      const count = parseInt(countResult.count, 10);
      
      if (count === 0) {
        console.log('Menu items table empty, seeding data...');
        
        // Seed menu_items
        for (const item of initialMenuItems) {
          await query('INSERT INTO menu_items', [item]);
        }
        
        console.log('Database seeded successfully');
      } else {
        console.log(`Database already contains ${count} menu items, skipping seed`);
      }
    } else {
      console.error('Unexpected result format from count query');
    }
    
    return true;
  } catch (error) {
    console.error('Database seeding failed:', error);
    return false;
  }
};

// Function to check if settings need seeding
export const checkAndSeedSettings = async () => {
  try {
    // Check if settings table is empty
    const result = await query('SELECT COUNT(*) FROM settings');
    
    // Ensure we have a CountResult
    if (!result || result.length === 0) {
      throw new Error("Could not count settings");
    }
    
    const countResult = result[0];
    if ('count' in countResult) {
      const count = parseInt(countResult.count, 10);
      
      if (count === 0) {
        console.log('Settings table empty, seeding default settings...');
        
        // Seed settings with defaults
        const defaultSettings = {
          restaurant_name: 'DistinctGyrro',
          restaurant_address: '123 Mediterranean Street, Foodie District, New York, NY 10001',
          restaurant_phone: '+1 (212) 555-1234',
          restaurant_email: 'info@distinctgyrro.com',
          opening_hours: 'Monday - Friday: 8:00 AM - 10:00 PM\nSaturday: 9:00 AM - 11:00 PM\nSunday: 10:00 AM - 9:00 PM'
        };
        
        await query('INSERT INTO settings', [defaultSettings]);
        console.log('Settings seeded successfully');
      }
    }
    
    return true;
  } catch (error) {
    console.error('Settings seeding failed:', error);
    return false;
  }
};
