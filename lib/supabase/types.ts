// Database types for Supabase — matches the schema in supabase/migrations/
// Regenerate with: npx supabase gen types typescript --local > lib/supabase/types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          birth_date: string
          birth_time: string | null
          birth_place: string | null
          birth_lat: number | null
          birth_lon: number | null
          birth_tz: number | null
          birth_name: string | null
          sun_sign: string | null
          moon_sign: string | null
          rising_sign: string | null
          life_path: number | null
          is_public: boolean
          show_birth_date: boolean
          natal_chart_json: Json | null
          numerology_json: Json | null
          matrix_json: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          birth_date: string
          birth_time?: string | null
          birth_place?: string | null
          birth_lat?: number | null
          birth_lon?: number | null
          birth_tz?: number | null
          birth_name?: string | null
          sun_sign?: string | null
          moon_sign?: string | null
          rising_sign?: string | null
          life_path?: number | null
          is_public?: boolean
          show_birth_date?: boolean
          natal_chart_json?: Json | null
          numerology_json?: Json | null
          matrix_json?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          birth_date?: string
          birth_time?: string | null
          birth_place?: string | null
          birth_lat?: number | null
          birth_lon?: number | null
          birth_tz?: number | null
          birth_name?: string | null
          sun_sign?: string | null
          moon_sign?: string | null
          rising_sign?: string | null
          life_path?: number | null
          is_public?: boolean
          show_birth_date?: boolean
          natal_chart_json?: Json | null
          numerology_json?: Json | null
          matrix_json?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      friendships: {
        Row: {
          id: string
          requester: string
          addressee: string
          status: 'pending' | 'accepted' | 'blocked'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          requester: string
          addressee: string
          status?: 'pending' | 'accepted' | 'blocked'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          requester?: string
          addressee?: string
          status?: 'pending' | 'accepted' | 'blocked'
          created_at?: string
          updated_at?: string
        }
      }
      invite_links: {
        Row: {
          id: string
          creator: string
          token: string
          max_uses: number
          used_count: number
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          creator: string
          token?: string
          max_uses?: number
          used_count?: number
          expires_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          creator?: string
          token?: string
          max_uses?: number
          used_count?: number
          expires_at?: string
          created_at?: string
        }
      }
      synastry_cache: {
        Row: {
          id: string
          user_a: string
          user_b: string
          result: Json
          computed_at: string
        }
        Insert: {
          id?: string
          user_a: string
          user_b: string
          result: Json
          computed_at?: string
        }
        Update: {
          id?: string
          user_a?: string
          user_b?: string
          result?: Json
          computed_at?: string
        }
      }
      transit_feed: {
        Row: {
          id: string
          user_id: string
          feed_date: string
          transit_type: string
          title: string
          body: string
          priority: number
          metadata: Json | null
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          feed_date: string
          transit_type: string
          title: string
          body: string
          priority?: number
          metadata?: Json | null
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          feed_date?: string
          transit_type?: string
          title?: string
          body?: string
          priority?: number
          metadata?: Json | null
          read_at?: string | null
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// Convenience type aliases
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Friendship = Database['public']['Tables']['friendships']['Row']
export type InviteLink = Database['public']['Tables']['invite_links']['Row']
export type SynastryCache = Database['public']['Tables']['synastry_cache']['Row']
export type TransitFeedItem = Database['public']['Tables']['transit_feed']['Row']
