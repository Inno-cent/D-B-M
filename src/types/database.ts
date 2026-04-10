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