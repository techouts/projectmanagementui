// Mock database setup for client-side compatibility
export class DatabaseSetup {
  
  // Check if database tables exist
  static async checkTables(): Promise<boolean> {
    return false; // Always return false for mock data
  }

  // Create database tables
  static async createTables(): Promise<void> {
    console.log('Mock database - tables creation skipped');
  }

  // Create database indexes
  static async createIndexes(): Promise<void> {
    console.log('Mock database - index creation skipped');
  }

  // Create database triggers
  static async createTriggers(): Promise<void> {
    console.log('Mock database - trigger creation skipped');
  }

  // Seed initial data
  static async seedData(): Promise<void> {
    console.log('Mock database - data seeding skipped');
  }

  // Initialize database (create tables and seed data)
  static async initialize(): Promise<void> {
    console.log('Mock database initialized - using in-memory data');
  }
}

// Auto-initialize database on import (only on server side)
if (typeof window === 'undefined') {
  DatabaseSetup.initialize().catch(error => {
    console.warn('Mock database initialization:', error);
  });
}