
import { getAllMenuItems, createMenuItem } from './menuService';
import { getRestaurantSettings, updateRestaurantSettings } from './settingsService';

// Sample menu items to seed the database
const sampleMenuItems = [
  {
    name: 'Classic Gyro',
    description: 'Traditional Greek gyro with lamb, tomatoes, onions, and tzatziki sauce in warm pita bread.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc6d2c5f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'mains',
    featured: true,
    in_stock: true
  },
  {
    name: 'Chicken Souvlaki',
    description: 'Grilled chicken skewers with Mediterranean herbs, served with rice and Greek salad.',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'mains',
    featured: true,
    in_stock: true
  },
  {
    name: 'Hummus & Pita',
    description: 'Creamy homemade hummus served with warm pita bread and olive oil drizzle.',
    price: 8.99,
    image: 'https://images.unsplash.com/photo-1571197119282-7c4d9e2fb837?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'starters',
    featured: false,
    in_stock: true
  },
  {
    name: 'Greek Salad',
    description: 'Fresh tomatoes, cucumbers, olives, feta cheese with oregano and olive oil.',
    price: 10.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'starters',
    featured: true,
    in_stock: true
  },
  {
    name: 'Moussaka',
    description: 'Traditional layered dish with eggplant, ground meat, and béchamel sauce.',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'mains',
    featured: false,
    in_stock: true
  },
  {
    name: 'Baklava',
    description: 'Sweet pastry with layers of phyllo, nuts, and honey syrup.',
    price: 6.99,
    image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'desserts',
    featured: true,
    in_stock: true
  },
  {
    name: 'Greek Coffee',
    description: 'Traditional strong coffee served with a glass of water.',
    price: 3.99,
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'drinks',
    featured: false,
    in_stock: true
  },
  {
    name: 'Spanakopita',
    description: 'Spinach and feta cheese wrapped in crispy phyllo pastry.',
    price: 9.99,
    image: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'starters',
    featured: false,
    in_stock: true
  }
];

export const initializeDatabase = async (): Promise<void> => {
  try {
    console.log('Database initialization started...');
    
    // Check if database is accessible
    const menuItems = await getAllMenuItems();
    console.log('Database connection successful');
    
    return Promise.resolve();
  } catch (error) {
    console.error('Database initialization failed:', error);
    throw error;
  }
};

export const seedDatabaseIfEmpty = async (): Promise<void> => {
  try {
    console.log('Checking if database seeding is needed...');
    
    // Check if menu items exist
    const existingMenuItems = await getAllMenuItems();
    
    if (existingMenuItems.length === 0) {
      console.log('Database is empty, seeding with sample data...');
      
      // Seed menu items
      for (const item of sampleMenuItems) {
        await createMenuItem(item);
        console.log(`Created menu item: ${item.name}`);
      }
      
      console.log('Database seeding completed successfully');
    } else {
      console.log(`Database already has ${existingMenuItems.length} menu items, skipping seeding`);
    }
    
    // Check and update restaurant settings if needed
    const settings = await getRestaurantSettings();
    console.log('Restaurant settings loaded:', settings.restaurant_name);
    
  } catch (error) {
    console.error('Database seeding failed:', error);
    // Don't throw error to prevent app from breaking
  }
};
