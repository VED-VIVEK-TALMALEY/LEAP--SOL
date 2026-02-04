# 🔐 Security Guide for LEAP - Study Abroad OS

## ⚠️ CRITICAL: Protecting Your Supabase Keys

### What NOT to Do
❌ **NEVER** commit `.env` file to Git  
❌ **NEVER** share your Supabase keys publicly  
❌ **NEVER** hardcode keys in your code  
❌ **NEVER** put real keys in `.env.example`

### What TO Do
✅ **ALWAYS** use `.gitignore` to exclude `.env`  
✅ **ALWAYS** use environment variables  
✅ **ALWAYS** use `.env.example` with placeholders only  
✅ **ALWAYS** rotate keys if accidentally exposed

---

## 🛡️ Security Setup (Already Done)

### 1. `.gitignore` File
We've created a `.gitignore` that excludes:
- `.env` (your actual credentials)
- `node_modules/`
- Build files
- Logs

### 2. `.env.example` Template
This file has **placeholder values only** - safe to commit to Git.

### 3. Actual `.env` File
This file has your **real credentials** - NEVER commit this!

---

## 📤 Before Uploading to GitHub

### Step 1: Verify .gitignore
```bash
# Check if .env is ignored
git status
# .env should NOT appear in the list
```

### Step 2: Check What Will Be Committed
```bash
# See what files will be uploaded
git add .
git status
# Make sure .env is NOT in the list!
```

### Step 3: Safe to Push
```bash
git commit -m "Initial commit"
git push origin main
```

---

## 🚨 If You Accidentally Exposed Your Keys

### Immediate Actions:
1. **Go to Supabase Dashboard**
2. **Settings > API**
3. **Rotate/Regenerate your keys**
4. **Update your local `.env` file**
5. **Remove the exposed commit from Git history**

### Remove from Git History:
```bash
# Remove .env from all commits
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (WARNING: This rewrites history)
git push origin --force --all
```

---

## 🔒 Supabase Row Level Security (RLS)

Even with exposed keys, you can protect your data with RLS policies.

### Enable RLS on Tables:
```sql
-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own data
CREATE POLICY "Users can view own data"
ON users FOR SELECT
USING (auth.uid() = id);

-- Policy: Users can only update their own data
CREATE POLICY "Users can update own data"
ON users FOR UPDATE
USING (auth.uid() = id);
```

Apply similar policies to all tables!

---

## 🌐 For Production Deployment

### Use Environment Variables in Hosting Platform:

**Vercel:**
1. Go to Project Settings
2. Environment Variables
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

**Netlify:**
1. Site Settings > Build & Deploy
2. Environment Variables
3. Add your keys

**GitHub Pages:**
- NOT recommended for apps with secrets
- Use Vercel or Netlify instead

---

## ✅ Security Checklist

Before going public:
- [ ] `.gitignore` includes `.env`
- [ ] `.env.example` has placeholders only
- [ ] Real `.env` is NOT in Git history
- [ ] Supabase RLS policies are enabled
- [ ] API keys have proper restrictions
- [ ] No hardcoded secrets in code

---

## 📞 Need Help?

If you've exposed keys:
1. Rotate them immediately in Supabase
2. Check Git history
3. Enable RLS policies
4. Consider using a secrets scanner

**Your project is now secure!** 🔐
