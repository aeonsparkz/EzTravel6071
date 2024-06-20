import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kcfqgifdnwqtlquxstib.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjZnFnaWZkbndxdGxxdXhzdGliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTg4MTEwMjUsImV4cCI6MjAzNDM4NzAyNX0.csL8mz0NK6thQK59MHfP-JJ7XZuAtYMINfY1sQ25Hjk'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase;