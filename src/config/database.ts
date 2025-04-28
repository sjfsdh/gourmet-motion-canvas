
import { Pool } from 'pg';

// Connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'maglev.proxy.rlwy.net',
  database: 'railway',
  password: 'oSVmWhGnHXKcdOrsBZPOIabFkQTiEOkW',
  port: 29153,
});

// Function to execute queries
export const query = async (text: string, params?: any[]) => {
  try {
    const result = await pool.query(text, params);
    return result.rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

export default pool;
