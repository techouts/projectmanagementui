// Supabase client with fallback handling
import { createClient } from '@supabase/supabase-js'

// Check if Supabase environment variables are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a mock client if environment variables are not available
const createMockClient = () => ({
  auth: {
    signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
    signOut: async () => ({ error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
        order: () => ({ data: [], error: null })
      }),
      order: () => ({ data: [], error: null }),
      single: async () => ({ data: null, error: { message: 'Supabase not configured' } })
    }),
    insert: () => ({
      select: () => ({
        single: async () => ({ data: null, error: { message: 'Supabase not configured' } })
      })
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          single: async () => ({ data: null, error: { message: 'Supabase not configured' } })
        })
      })
    })
  })
})

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockClient() as any

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

// Database types
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'ceo' | 'pm' | 'finance' | 'hr' | 'resource'
          avatar_url: string | null
          password_hash: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: 'admin' | 'ceo' | 'pm' | 'finance' | 'hr' | 'resource'
          avatar_url?: string | null
          password_hash: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'ceo' | 'pm' | 'finance' | 'hr' | 'resource'
          avatar_url?: string | null
          password_hash?: string
          created_at?: string
          updated_at?: string
        }
      }
      resources: {
        Row: {
          id: string
          name: string
          email: string
          role: string
          skill_set: string[]
          hourly_rate: number
          utilization_target: number
          current_utilization: number
          bench_time: number
          status: 'active' | 'on_bench' | 'inactive'
          department: string | null
          start_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          role: string
          skill_set?: string[]
          hourly_rate?: number
          utilization_target?: number
          current_utilization?: number
          bench_time?: number
          status?: 'active' | 'on_bench' | 'inactive'
          department?: string | null
          start_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: string
          skill_set?: string[]
          hourly_rate?: number
          utilization_target?: number
          current_utilization?: number
          bench_time?: number
          status?: 'active' | 'on_bench' | 'inactive'
          department?: string | null
          start_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string | null
          start_date: string
          end_date: string
          status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'
          budget: number
          actual_cost: number
          profit_margin: number | null
          client_name: string
          project_manager_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          start_date: string
          end_date: string
          status?: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'
          budget?: number
          actual_cost?: number
          client_name: string
          project_manager_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          start_date?: string
          end_date?: string
          status?: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'
          budget?: number
          actual_cost?: number
          client_name?: string
          project_manager_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          name: string
          type: 'sow' | 'msa' | 'cr' | 'other'
          file_url: string
          file_size: number
          uploaded_by: string
          project_id: string | null
          tags: string[]
          version: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'sow' | 'msa' | 'cr' | 'other'
          file_url: string
          file_size?: number
          uploaded_by: string
          project_id?: string | null
          tags?: string[]
          version?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'sow' | 'msa' | 'cr' | 'other'
          file_url?: string
          file_size?: number
          uploaded_by?: string
          project_id?: string | null
          tags?: string[]
          version?: number
          created_at?: string
          updated_at?: string
        }
      }
      activity_log: {
        Row: {
          id: string
          user_id: string
          entity_type: string
          entity_id: string
          action: string
          description: string
          metadata: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          entity_type: string
          entity_id: string
          action: string
          description: string
          metadata?: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          entity_type?: string
          entity_id?: string
          action?: string
          description?: string
          metadata?: any
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'reminder' | 'alert' | 'info' | 'success' | 'warning' | 'error'
          read: boolean
          action_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: 'reminder' | 'alert' | 'info' | 'success' | 'warning' | 'error'
          read?: boolean
          action_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'reminder' | 'alert' | 'info' | 'success' | 'warning' | 'error'
          read?: boolean
          action_url?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}