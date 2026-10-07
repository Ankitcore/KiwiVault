-- Kiwi Vault — Supabase PostgreSQL Schema Migration
-- Privacy-Preserving Digital Identity and Credential Verification for RVSCET Jamshedpur

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'issuer', 'verifier', 'admin')),
  wallet_address TEXT NOT NULL,
  student_id TEXT,
  semester INTEGER,
  program TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CREDENTIALS TABLE (Off-chain metadata; sensitive fields encrypted/protected)
CREATE TABLE IF NOT EXISTS credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  credential_id TEXT UNIQUE NOT NULL,
  credential_hash TEXT NOT NULL,
  issuer_id TEXT NOT NULL,
  holder_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('academic', 'degree', 'identity', 'semester', 'provisional', 'bonafide')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'pending')),
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
);

-- 3. ACHIEVEMENTS TABLE (Separate from academic credentials)
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  credential_id TEXT UNIQUE NOT NULL,
  holder_id TEXT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  issuer TEXT NOT NULL,
  event TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked'))
);

-- 4. CERTIFICATIONS TABLE (Separate from achievements and academic credentials)
CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  credential_id TEXT UNIQUE NOT NULL,
  holder_id TEXT NOT NULL,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  category TEXT NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked'))
);

-- 5. VERIFICATION REQUESTS TABLE
CREATE TABLE IF NOT EXISTS verification_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id TEXT UNIQUE NOT NULL,
  verifier_id TEXT NOT NULL,
  claim_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'failed', 'revoked', 'age_restricted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_at TIMESTAMPTZ
);

-- 6. VERIFICATION LOGS TABLE
CREATE TABLE IF NOT EXISTS verification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id TEXT NOT NULL,
  proof_type TEXT NOT NULL,
  result TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credentials_holder ON credentials(holder_id);
CREATE INDEX IF NOT EXISTS idx_achievements_holder ON achievements(holder_id);
CREATE INDEX IF NOT EXISTS idx_certifications_holder ON certifications(holder_id);
CREATE INDEX IF NOT EXISTS idx_verification_requests_req_id ON verification_requests(request_id);
