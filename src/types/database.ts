export interface Profile {
  id:           string
  full_name:    string | null
  company_name: string | null
  country:      string | null
  phone:        string | null
  role:         'buyer' | 'admin'
  created_at:   string
  updated_at:   string
}

export interface QuoteRequest {
  id:                   string
  user_id:              string | null
  ref:                  string
  company_name:         string
  email:                string
  phone:                string | null
  product:              string
  quantity:             string
  buyer_country:        string
  delivery_destination: string | null
  ship_date:            string | null
  notes:                string | null
  status:               QuoteStatus
  admin_notes:          string | null
  eta:                  string | null
  created_at:           string
  updated_at:           string
}

export interface OrderTracking {
  id:         string
  quote_id:   string
  status:     string
  label:      string
  description:string | null
  location:   string | null
  created_at: string
}

export type QuoteStatus =
  | 'pending'
  | 'reviewing'
  | 'sourcing'
  | 'in_store'
  | 'transit'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled'