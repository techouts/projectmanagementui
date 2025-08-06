// Simple mock database for client-side compatibility
export class Database {
  private static instance: Database;
  private useMockData: boolean = true;

  private constructor() {
    this.useMockData = true;
    console.log('Using mock data for database operations');
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  // Check if using mock data
  public isUsingMockData(): boolean {
    return this.useMockData;
  }

  // Mock query method
  async query(text: string, params?: any[]): Promise<any> {
    throw new Error('Database not available - using mock data');
  }

  // Mock client method
  async getClient(): Promise<any> {
    throw new Error('Database not available - using mock data');
  }

  // Mock transaction method
  async transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
    throw new Error('Database not available - using mock data');
  }

  // Mock close method
  async close(): Promise<void> {
    // No-op for mock
  }

  // Mock health check
  async healthCheck(): Promise<boolean> {
    return false;
  }
}

// Export the singleton instance
export const db = Database.getInstance();

// Utility function for safe database operations
export async function withDatabase<T>(operation: (db: Database) => Promise<T>): Promise<T> {
  try {
    return await operation(db);
  } catch (error) {
    console.error('Database operation failed:', error);
    throw new Error('Database operation failed. Please try again.');
  }
}