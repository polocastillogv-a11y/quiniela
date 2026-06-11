import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const missing = !supabaseUrl || !supabaseAnonKey
if (missing) {
  console.warn('⚠️ VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY no están definidas en el entorno')
}

function makeBuilder(result) {
  const fn = () => {}
  fn.then = (resolve) => resolve(result)
  fn.select = () => makeBuilder({ data: result.data || [], error: null })
  fn.order = () => makeBuilder({ data: result.data || [], error: null })
  fn.eq = () => makeBuilder({ error: new Error('Supabase no configurado') })
  fn.match = () => makeBuilder({ error: new Error('Supabase no configurado') })
  fn.neq = () => makeBuilder({ error: new Error('Supabase no configurado') })
  fn.insert = () => makeBuilder({ data: null, error: new Error('Supabase no configurado') })
  fn.update = () => makeBuilder({ data: null, error: new Error('Supabase no configurado') })
  fn.delete = () => makeBuilder({ data: null, error: new Error('Supabase no configurado') })
  fn.upsert = () => makeBuilder({ data: null, error: new Error('Supabase no configurado') })
  return fn
}

export const supabase = missing
  ? { from: () => makeBuilder({ data: [], error: null }) }
  : createClient(supabaseUrl, supabaseAnonKey)
