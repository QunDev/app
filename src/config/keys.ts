import fs from 'fs'
import path from 'path'

// Hoặc dùng dotenv để đọc đường dẫn PRIVATE_KEY_PATH, PUBLIC_KEY_PATH
const PRIVATE_KEY_PATH = process.env.PRIVATE_KEY_PATH || 'keys/private.pem'
const PUBLIC_KEY_PATH = process.env.PUBLIC_KEY_PATH || 'keys/public.pem'

let privateKey: string
let publicKey: string

try {
  privateKey = fs.readFileSync(path.join(__dirname, '../../', PRIVATE_KEY_PATH), 'utf-8')
  publicKey = fs.readFileSync(path.join(__dirname, '../../', PUBLIC_KEY_PATH), 'utf-8')
} catch (err) {
  console.error('Error loading RSA keys:', err)
  process.exit(1) // Dừng server nếu không load được key
}

export const RSA_PRIVATE_KEY = privateKey
export const RSA_PUBLIC_KEY = publicKey
