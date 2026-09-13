-- ═══════════════════════════════════════════════
-- SKTrack — Database Migration Script
-- Run this in your Supabase SQL Editor
-- ═══════════════════════════════════════════════

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── 1. Profiles Table ───────────────────────────────────
-- Extends Supabase auth.users with SK-specific profile info
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    position TEXT,
    role TEXT NOT NULL DEFAULT 'kagawad'
        CHECK (role IN ('chairperson', 'treasurer', 'secretary', 'kagawad', 'admin')),
    avatar_url TEXT,
    status TEXT NOT NULL DEFAULT 'active'
        CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 2. Projects Table ──────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT,
    proposed_budget NUMERIC(12,2) DEFAULT 0,
    approved_budget NUMERIC(12,2) DEFAULT 0,
    project_head_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    start_date DATE,
    end_date DATE,
    beneficiaries TEXT,
    status TEXT NOT NULL DEFAULT 'proposed'
        CHECK (status IN ('proposed', 'for_review', 'approved', 'ongoing', 'completed', 'cancelled')),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 3. Project Members ─────────────────────────────────
CREATE TABLE IF NOT EXISTS project_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(project_id, user_id)
);

-- ─── 4. Project Status History ──────────────────────────
CREATE TABLE IF NOT EXISTS project_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 5. Proposals ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_name TEXT NOT NULL,
    description TEXT,
    proposed_budget NUMERIC(12,2) DEFAULT 0,
    objectives TEXT,
    beneficiaries TEXT,
    proposed_start DATE,
    proposed_end DATE,
    submitted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    person_responsible UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'draft'
        CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected')),
    review_notes TEXT,
    reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 6. Project Budgets ─────────────────────────────────
CREATE TABLE IF NOT EXISTS project_budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    fiscal_year TEXT,
    total_budget NUMERIC(12,2) NOT NULL DEFAULT 0,
    allocated_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    source TEXT,
    notes TEXT,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 7. Expenses ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    date DATE NOT NULL,
    category TEXT
        CHECK (category IN ('equipment', 'food', 'transportation', 'supplies', 'venue', 'services', 'prizes', 'printing', 'other')),
    recorded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    receipt_url TEXT,
    receipt_document_id UUID,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 8. Documents ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    file_type TEXT,
    document_type TEXT
        CHECK (document_type IN ('proposal', 'resolution', 'receipt', 'financial', 'accomplishment', 'meeting', 'other')),
    entity_type TEXT,
    entity_id UUID,
    uploaded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 9. Activities ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TIME,
    location TEXT,
    person_responsible UUID REFERENCES profiles(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'scheduled'
        CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ─── 10. Audit Logs ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    user_name TEXT,
    user_role TEXT,
    action TEXT NOT NULL,
    entity_type TEXT,
    entity_id UUID,
    details JSONB DEFAULT '{}',
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ─── Indexes ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_head ON projects(project_head_id);
CREATE INDEX IF NOT EXISTS idx_expenses_project ON expenses(project_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_documents_entity ON documents(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date);
CREATE INDEX IF NOT EXISTS idx_activities_project ON activities(project_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_submitted ON proposals(submitted_by);
CREATE INDEX IF NOT EXISTS idx_project_budgets_project ON project_budgets(project_id);

-- ─── Updated_at Trigger Function ─────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to all tables with updated_at
DO $$
DECLARE
    tbl TEXT;
BEGIN
    FOR tbl IN SELECT unnest(ARRAY[
        'profiles', 'projects', 'proposals', 'project_budgets',
        'expenses', 'documents', 'activities'
    ])
    LOOP
        EXECUTE format(
            'DROP TRIGGER IF EXISTS set_updated_at ON %I; CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();',
            tbl, tbl
        );
    END LOOP;
END
$$;

-- ─── Row Level Security ──────────────────────────────────
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies: Authenticated users can read all records
-- (Fine-grained role-based policies will be added per-loop)
CREATE POLICY "Authenticated users can view all profiles"
    ON profiles FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Authenticated users can view all projects"
    ON projects FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can view all project_members"
    ON project_members FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can view all project_status_history"
    ON project_status_history FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can view all proposals"
    ON proposals FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can view all project_budgets"
    ON project_budgets FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can view all expenses"
    ON expenses FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can view all documents"
    ON documents FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can view all activities"
    ON activities FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can view all audit_logs"
    ON audit_logs FOR SELECT
    TO authenticated
    USING (true);

-- INSERT/UPDATE/DELETE policies (broad for now, tighten per role later)
CREATE POLICY "Authenticated users can insert projects"
    ON projects FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
    ON projects FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert expenses"
    ON expenses FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update expenses"
    ON expenses FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert proposals"
    ON proposals FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update proposals"
    ON proposals FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert documents"
    ON documents FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can insert activities"
    ON activities FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update activities"
    ON activities FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert audit_logs"
    ON audit_logs FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can insert project_budgets"
    ON project_budgets FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update project_budgets"
    ON project_budgets FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert project_members"
    ON project_members FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can delete project_members"
    ON project_members FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert project_status_history"
    ON project_status_history FOR INSERT TO authenticated WITH CHECK (true);

-- ═══════════════════════════════════════════════
-- Migration complete!
-- ═══════════════════════════════════════════════
