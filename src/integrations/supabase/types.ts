export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      baby_profiles: {
        Row: {
          allergies: string[] | null
          avatar_url: string | null
          birth_date: string
          created_at: string | null
          dietary_restrictions: string[] | null
          feeding_type: string | null
          id: string
          medical_conditions: string[] | null
          name: string
          user_id: string
        }
        Insert: {
          allergies?: string[] | null
          avatar_url?: string | null
          birth_date: string
          created_at?: string | null
          dietary_restrictions?: string[] | null
          feeding_type?: string | null
          id?: string
          medical_conditions?: string[] | null
          name: string
          user_id: string
        }
        Update: {
          allergies?: string[] | null
          avatar_url?: string | null
          birth_date?: string
          created_at?: string | null
          dietary_restrictions?: string[] | null
          feeding_type?: string | null
          id?: string
          medical_conditions?: string[] | null
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "baby_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      foods: {
        Row: {
          _id: string
          ageSuggestion: string | null
          allergenInfo: string | null
          canBabiesDrinkMilk: string | null
          chokingHazardInfo: string | null
          commonAllergen: string | null
          foodType: string | null
          healthBenefits: string | null
          Image: string | null
          introductionSummary: string | null
          ironRich: string | null
          name: string | null
          servingSuggestion12Months: string | null
          servingSuggestion3Years: string | null
          servingSuggestion6Months: string | null
        }
        Insert: {
          _id: string
          ageSuggestion?: string | null
          allergenInfo?: string | null
          canBabiesDrinkMilk?: string | null
          chokingHazardInfo?: string | null
          commonAllergen?: string | null
          foodType?: string | null
          healthBenefits?: string | null
          Image?: string | null
          introductionSummary?: string | null
          ironRich?: string | null
          name?: string | null
          servingSuggestion12Months?: string | null
          servingSuggestion3Years?: string | null
          servingSuggestion6Months?: string | null
        }
        Update: {
          _id?: string
          ageSuggestion?: string | null
          allergenInfo?: string | null
          canBabiesDrinkMilk?: string | null
          chokingHazardInfo?: string | null
          commonAllergen?: string | null
          foodType?: string | null
          healthBenefits?: string | null
          Image?: string | null
          introductionSummary?: string | null
          ironRich?: string | null
          name?: string | null
          servingSuggestion12Months?: string | null
          servingSuggestion3Years?: string | null
          servingSuggestion6Months?: string | null
        }
        Relationships: []
      }
      introduced_foods: {
        Row: {
          baby_profile_id: string
          created_at: string
          food_id: string
          id: string
          introduced_date: string
          notes: string | null
          user_id: string
        }
        Insert: {
          baby_profile_id: string
          created_at?: string
          food_id: string
          id?: string
          introduced_date?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          baby_profile_id?: string
          created_at?: string
          food_id?: string
          id?: string
          introduced_date?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "introduced_foods_baby_profile_id_fkey"
            columns: ["baby_profile_id"]
            isOneToOne: false
            referencedRelation: "baby_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "introduced_foods_food_id_fkey"
            columns: ["food_id"]
            isOneToOne: false
            referencedRelation: "foods"
            referencedColumns: ["_id"]
          },
        ]
      }
      recipes: {
        Row: {
          _id: string | null
          description: string | null
          ingredients: Json | null
          link: string | null
          method: Json | null
          servings: number | null
          time: string | null
          title: string | null
        }
        Insert: {
          _id?: string | null
          description?: string | null
          ingredients?: Json | null
          link?: string | null
          method?: Json | null
          servings?: number | null
          time?: string | null
          title?: string | null
        }
        Update: {
          _id?: string | null
          description?: string | null
          ingredients?: Json | null
          link?: string | null
          method?: Json | null
          servings?: number | null
          time?: string | null
          title?: string | null
        }
        Relationships: []
      }
      scan_summary: {
        Row: {
          average_score: number | null
          created_at: string | null
          id: string
          scan_count: number | null
          scan_date: string
          user_id: string
        }
        Insert: {
          average_score?: number | null
          created_at?: string | null
          id?: string
          scan_count?: number | null
          scan_date?: string
          user_id: string
        }
        Update: {
          average_score?: number | null
          created_at?: string | null
          id?: string
          scan_count?: number | null
          scan_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scan_summary_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          last_scan_date: string | null
          month_start_date: string | null
          monthly_scan_count: number | null
          onboarding_completed: boolean | null
          total_scans_count: number | null
          updated_at: string | null
          week_start_date: string | null
          weekly_scan_count: number | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          last_scan_date?: string | null
          month_start_date?: string | null
          monthly_scan_count?: number | null
          onboarding_completed?: boolean | null
          total_scans_count?: number | null
          updated_at?: string | null
          week_start_date?: string | null
          weekly_scan_count?: number | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          last_scan_date?: string | null
          month_start_date?: string | null
          monthly_scan_count?: number | null
          onboarding_completed?: boolean | null
          total_scans_count?: number | null
          updated_at?: string | null
          week_start_date?: string | null
          weekly_scan_count?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_old_scan_summaries: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_scan_tracking: {
        Args: { user_uuid: string; scan_score?: number }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
