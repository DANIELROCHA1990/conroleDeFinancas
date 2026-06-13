export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      budgets: {
        Row: {
          category_id: string | null;
          created_at: string;
          credit_card_id: string | null;
          id: string;
          limit_amount: number;
          month_ref: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          category_id?: string | null;
          created_at?: string;
          credit_card_id?: string | null;
          id?: string;
          limit_amount: number;
          month_ref: string;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["budgets"]["Insert"]>;
        Relationships: [];
      };
      categories: {
        Row: {
          active: boolean;
          color: string;
          created_at: string;
          deleted_at: string | null;
          icon: string;
          id: string;
          name: string;
          type: "income" | "expense" | "both";
          updated_at: string;
          user_id: string;
        };
        Insert: {
          active?: boolean;
          color: string;
          created_at?: string;
          deleted_at?: string | null;
          icon: string;
          id?: string;
          name: string;
          type: "income" | "expense" | "both";
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
        Relationships: [];
      };
      credit_card_bills: {
        Row: {
          closing_date: string;
          competency_month: string;
          created_at: string;
          credit_card_id: string;
          due_date: string;
          id: string;
          paid_at: string | null;
          status: "open" | "closed" | "paid" | "late";
          total_amount: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          closing_date: string;
          competency_month: string;
          created_at?: string;
          credit_card_id: string;
          due_date: string;
          id?: string;
          paid_at?: string | null;
          status: "open" | "closed" | "paid" | "late";
          total_amount?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["credit_card_bills"]["Insert"]>;
        Relationships: [];
      };
      credit_card_installments: {
        Row: {
          amount: number;
          competency_month: string;
          created_at: string;
          id: string;
          installment_number: number;
          purchase_id: string;
          status: "open" | "closed" | "paid" | "late";
          total_installments: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          competency_month: string;
          created_at?: string;
          id?: string;
          installment_number: number;
          purchase_id: string;
          status: "open" | "closed" | "paid" | "late";
          total_installments: number;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["credit_card_installments"]["Insert"]>;
        Relationships: [];
      };
      credit_card_purchases: {
        Row: {
          amount: number;
          category_id: string | null;
          created_at: string;
          credit_card_id: string;
          deleted_at: string | null;
          description: string;
          id: string;
          installment_count: number;
          notes_encrypted: string | null;
          purchased_at: string;
          status: "open" | "posted" | "cancelled";
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          category_id?: string | null;
          created_at?: string;
          credit_card_id: string;
          deleted_at?: string | null;
          description: string;
          id?: string;
          installment_count?: number;
          notes_encrypted?: string | null;
          purchased_at: string;
          status: "open" | "posted" | "cancelled";
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["credit_card_purchases"]["Insert"]>;
        Relationships: [];
      };
      credit_cards: {
        Row: {
          bank_name: string;
          best_purchase_day: number | null;
          closing_day: number;
          created_at: string;
          deleted_at: string | null;
          due_day: number;
          id: string;
          is_active: boolean;
          last_four_digits: string | null;
          limit_amount: number;
          name: string;
          private_notes_encrypted: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          bank_name: string;
          best_purchase_day?: number | null;
          closing_day: number;
          created_at?: string;
          deleted_at?: string | null;
          due_day: number;
          id?: string;
          is_active?: boolean;
          last_four_digits?: string | null;
          limit_amount: number;
          name: string;
          private_notes_encrypted?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["credit_cards"]["Insert"]>;
        Relationships: [];
      };
      expenses: {
        Row: {
          amount: number;
          category_id: string | null;
          competence_month: string | null;
          created_at: string;
          deleted_at: string | null;
          description: string;
          due_date: string;
          estimated_amount: number | null;
          fixed_expense_id: string | null;
          id: string;
          notes_encrypted: string | null;
          paid_at: string | null;
          payment_method: string | null;
          status: "pending" | "paid" | "late" | "cancelled";
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          category_id?: string | null;
          competence_month?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          description: string;
          due_date: string;
          estimated_amount?: number | null;
          fixed_expense_id?: string | null;
          id?: string;
          notes_encrypted?: string | null;
          paid_at?: string | null;
          payment_method?: string | null;
          status: "pending" | "paid" | "late" | "cancelled";
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["expenses"]["Insert"]>;
        Relationships: [];
      };
      fixed_expenses: {
        Row: {
          amount_mode: "fixed" | "variable";
          category_id: string | null;
          created_at: string;
          default_amount: number;
          deleted_at: string | null;
          due_day: number;
          id: string;
          is_active: boolean;
          name: string;
          notes_encrypted: string | null;
          notify_before_days: number;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount_mode?: "fixed" | "variable";
          category_id?: string | null;
          created_at?: string;
          default_amount: number;
          deleted_at?: string | null;
          due_day: number;
          id?: string;
          is_active?: boolean;
          name: string;
          notes_encrypted?: string | null;
          notify_before_days?: number;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["fixed_expenses"]["Insert"]>;
        Relationships: [];
      };
      financial_accounts: {
        Row: {
          account_type: "checking" | "savings" | "cash" | "investment";
          created_at: string;
          current_balance: number;
          deleted_at: string | null;
          id: string;
          initial_balance: number;
          institution: string | null;
          is_active: boolean;
          name: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          account_type: "checking" | "savings" | "cash" | "investment";
          created_at?: string;
          current_balance?: number;
          deleted_at?: string | null;
          id?: string;
          initial_balance?: number;
          institution?: string | null;
          is_active?: boolean;
          name: string;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["financial_accounts"]["Insert"]>;
        Relationships: [];
      };
      incomes: {
        Row: {
          amount: number;
          category_id: string | null;
          created_at: string;
          deleted_at: string | null;
          description: string;
          id: string;
          notes_encrypted: string | null;
          received_on: string;
          status: "received" | "expected";
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          category_id?: string | null;
          created_at?: string;
          deleted_at?: string | null;
          description: string;
          id?: string;
          notes_encrypted?: string | null;
          received_on: string;
          status: "received" | "expected";
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["incomes"]["Insert"]>;
        Relationships: [];
      };
      notifications: {
        Row: {
          created_at: string;
          id: string;
          is_read: boolean;
          message: string;
          priority: string;
          related_path: string | null;
          title: string;
          type: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_read?: boolean;
          message: string;
          priority: string;
          related_path?: string | null;
          title: string;
          type: string;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
        Relationships: [];
      };
      profiles: {
        Row: {
          created_at: string;
          full_name: string | null;
          id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          full_name?: string | null;
          id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      reminders: {
        Row: {
          created_at: string;
          id: string;
          is_completed: boolean;
          module_name: string;
          related_record_id: string | null;
          reminder_date: string;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_completed?: boolean;
          module_name: string;
          related_record_id?: string | null;
          reminder_date: string;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["reminders"]["Insert"]>;
        Relationships: [];
      };
      reserves: {
        Row: {
          created_at: string;
          current_amount: number;
          id: string;
          name: string;
          objective: string | null;
          status: "active" | "paused" | "completed";
          target_amount: number;
          target_date: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          current_amount?: number;
          id?: string;
          name: string;
          objective?: string | null;
          status: "active" | "paused" | "completed";
          target_amount: number;
          target_date?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["reserves"]["Insert"]>;
        Relationships: [];
      };
      reserve_transactions: {
        Row: {
          amount: number;
          created_at: string;
          description: string | null;
          id: string;
          reserve_id: string;
          transaction_type: "deposit" | "withdrawal";
          updated_at: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string;
          description?: string | null;
          id?: string;
          reserve_id: string;
          transaction_type: "deposit" | "withdrawal";
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["reserve_transactions"]["Insert"]>;
        Relationships: [];
      };
      audit_logs: {
        Row: {
          action_name: string;
          created_at: string;
          id: string;
          module_name: string;
          payload: Json;
          record_id: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          action_name: string;
          created_at?: string;
          id?: string;
          module_name: string;
          payload?: Json;
          record_id?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["audit_logs"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
