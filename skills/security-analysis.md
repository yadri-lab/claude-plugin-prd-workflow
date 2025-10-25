---
name: security-analysis
description: Security vulnerability detection and remediation
category: Security
---

# Security Analysis Skill

Provides comprehensive security analysis capabilities including vulnerability scanning, secure coding practices, and compliance checking.

## Security Scanning Tools

### 1. Dependency Vulnerability Scanning

**npm audit**:
```bash
# Basic audit
npm audit

# JSON output for parsing
npm audit --json

# Fix automatically
npm audit fix

# Only production dependencies
npm audit --production

# Set severity threshold
npm audit --audit-level=moderate  # moderate, high, critical
```

**Example Output**:
```
found 3 vulnerabilities (1 moderate, 2 high) in 1200 scanned packages
  run `npm audit fix` to fix 2 of them.
  1 vulnerability requires manual review. See the full report for details.
```

**Snyk**:
```bash
# Install
npm install -g snyk

# Authenticate
snyk auth

# Test current project
snyk test

# Monitor for ongoing alerts
snyk monitor

# Fix vulnerabilities
snyk fix
```

---

### 2. Code Security Scanning

**ESLint Security Plugin**:
```bash
npm install --save-dev eslint-plugin-security
```

**.eslintrc.security.json**:
```json
{
  "extends": ["plugin:security/recommended"],
  "plugins": ["security"],
  "rules": {
    "security/detect-object-injection": "error",
    "security/detect-non-literal-regexp": "warn",
    "security/detect-unsafe-regex": "error",
    "security/detect-buffer-noassert": "error",
    "security/detect-eval-with-expression": "error",
    "security/detect-no-csrf-before-method-override": "error",
    "security/detect-possible-timing-attacks": "warn"
  }
}
```

**Run**:
```bash
npx eslint . --ext .ts,.tsx --config .eslintrc.security.json
```

---

### 3. Secret Detection

**Pattern-based Detection**:
```bash
# Find common secret patterns
grep -r -E "(api[_-]?key|password|secret|token)[\s]*=[\s]*['\"][^'\"]+['\"]" \
  --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" \
  --exclude-dir=node_modules \
  --exclude-dir=.git \
  .

# AWS Access Keys
grep -r -E "AKIA[0-9A-Z]{16}" .

# Private Keys
grep -r -E "-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----" .

# Generic secrets
grep -r -E "(password|passwd|pwd)[\s]*=[\s]*['\"][^'\"]+['\"]" .
```

**git-secrets** (prevent committing secrets):
```bash
# Install
brew install git-secrets  # macOS
# or
apt-get install git-secrets  # Linux

# Setup for repo
git secrets --install
git secrets --register-aws

# Scan history
git secrets --scan-history
```

---

## Common Vulnerabilities & Fixes

### 1. Injection Attacks

**SQL Injection**:
```typescript
// ❌ Vulnerable
const query = `SELECT * FROM users WHERE id = ${req.params.id}`;
db.query(query);

// ✅ Fixed (Parameterized Query)
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [req.params.id]);

// ✅ Or use ORM
const user = await User.findByPk(req.params.id);
```

**NoSQL Injection**:
```typescript
// ❌ Vulnerable
db.collection('users').findOne({ username: req.body.username });

// If req.body.username = { $gt: '' }, returns all users!

// ✅ Fixed (Validate input)
import { z } from 'zod';

const schema = z.object({
  username: z.string().min(1).max(50),
});

const { username } = schema.parse(req.body);
db.collection('users').findOne({ username });
```

**Command Injection**:
```typescript
// ❌ Vulnerable
import { exec } from 'child_process';
exec(`ping ${req.query.host}`);

// ✅ Fixed (Validate & escape)
import { execFile } from 'child_process';

const allowedHosts = ['google.com', 'github.com'];
if (!allowedHosts.includes(req.query.host)) {
  throw new Error('Invalid host');
}

execFile('ping', ['-c', '4', req.query.host]);
```

---

### 2. Cross-Site Scripting (XSS)

**Reflected XSS**:
```typescript
// ❌ Vulnerable
app.get('/search', (req, res) => {
  res.send(`Results for: ${req.query.q}`);
});

// If ?q=<script>alert('XSS')</script>, executes!

// ✅ Fixed (Escape output)
import escape from 'escape-html';

app.get('/search', (req, res) => {
  res.send(`Results for: ${escape(req.query.q)}`);
});
```

**Stored XSS** (React):
```tsx
// ❌ Vulnerable
<div dangerouslySetInnerHTML={{ __html: userBio }} />

// ✅ Fixed (Sanitize)
import DOMPurify from 'dompurify';

<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userBio) }} />

// ✅ Or avoid dangerouslySetInnerHTML
<div>{userBio}</div>  // React auto-escapes
```

---

### 3. Authentication & Authorization

**Weak Password Storage**:
```typescript
// ❌ Vulnerable (plaintext)
const user = { password: req.body.password };

// ❌ Vulnerable (MD5/SHA1)
const hash = crypto.createHash('md5').update(req.body.password).digest('hex');

// ✅ Fixed (bcrypt)
import bcrypt from 'bcrypt';

const saltRounds = 12;
const hash = await bcrypt.hash(req.body.password, saltRounds);

// Verify
const match = await bcrypt.compare(req.body.password, user.passwordHash);
```

**Weak Password Policy**:
```typescript
// ❌ Vulnerable
const PASSWORD_REGEX = /^.{6,}$/;

// ✅ Fixed (Strong policy)
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;

// Or use zxcvbn
import zxcvbn from 'zxcvbn';

const result = zxcvbn(password);
if (result.score < 3) {
  throw new Error('Password too weak');
}
```

**JWT Security**:
```typescript
// ❌ Vulnerable (weak secret)
const token = jwt.sign({ userId }, 'secret', { expiresIn: '1d' });

// ✅ Fixed (strong secret, env var)
const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
  expiresIn: '1h',  // Shorter expiry
  algorithm: 'HS256',
});

// Verify
try {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
} catch (err) {
  // Invalid token
}
```

---

### 4. CSRF (Cross-Site Request Forgery)

**Without Protection**:
```typescript
// ❌ Vulnerable
app.post('/transfer', (req, res) => {
  transferMoney(req.user.id, req.body.to, req.body.amount);
  res.send('OK');
});

// Attacker can trigger via: <img src="https://yoursite.com/transfer?to=attacker&amount=1000">

// ✅ Fixed (CSRF token)
import csrf from 'csurf';

const csrfProtection = csrf({ cookie: true });

app.get('/form', csrfProtection, (req, res) => {
  res.render('send', { csrfToken: req.csrfToken() });
});

app.post('/transfer', csrfProtection, (req, res) => {
  transferMoney(req.user.id, req.body.to, req.body.amount);
  res.send('OK');
});
```

---

### 5. Insecure Direct Object Reference (IDOR)

```typescript
// ❌ Vulnerable
app.get('/api/invoices/:id', (req, res) => {
  const invoice = db.getInvoice(req.params.id);
  res.json(invoice);  // Any user can access any invoice!
});

// ✅ Fixed (Authorization check)
app.get('/api/invoices/:id', requireAuth, (req, res) => {
  const invoice = db.getInvoice(req.params.id);

  if (invoice.userId !== req.user.id) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  res.json(invoice);
});
```

---

### 6. Security Misconfiguration

**Missing Security Headers**:
```typescript
// ❌ Vulnerable (no security headers)
app.get('/', (req, res) => {
  res.send('Hello');
});

// ✅ Fixed (Helmet.js)
import helmet from 'helmet';

app.use(helmet());  // Sets multiple security headers:
// - X-Content-Type-Options: nosniff
// - X-Frame-Options: DENY
// - X-XSS-Protection: 1; mode=block
// - Strict-Transport-Security
// - Content-Security-Policy
```

**CORS Misconfiguration**:
```typescript
// ❌ Vulnerable (wildcard)
app.use(cors({ origin: '*' }));

// ✅ Fixed (Whitelist)
const allowedOrigins = [
  'https://acmecorp.com',
  'https://app.acmecorp.com',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
```

---

## Security Checklist

### Application Security

- [ ] Input validation on all user inputs
- [ ] Output encoding/escaping
- [ ] Parameterized queries (no SQL injection)
- [ ] Password hashing (bcrypt, argon2)
- [ ] Secure session management
- [ ] CSRF protection
- [ ] XSS protection
- [ ] HTTPS only (no HTTP)
- [ ] Secure cookies (httpOnly, secure, sameSite)

### Authentication & Authorization

- [ ] Strong password policy (min 12 chars)
- [ ] Multi-factor authentication (MFA)
- [ ] Rate limiting (prevent brute force)
- [ ] Account lockout after N failed attempts
- [ ] Proper authorization checks (RBAC)
- [ ] JWT with short expiry (<1h)
- [ ] Refresh token rotation

### Data Protection

- [ ] Encryption at rest (database, files)
- [ ] Encryption in transit (TLS 1.2+)
- [ ] No sensitive data in logs
- [ ] No PII in error messages
- [ ] Secure file uploads (type/size validation)
- [ ] Data minimization (collect only what's needed)

### Dependency Security

- [ ] Regular dependency updates
- [ ] No known CVEs (npm audit, Snyk)
- [ ] Lock file committed (package-lock.json)
- [ ] Minimal dependencies (reduce attack surface)

### Infrastructure Security

- [ ] Firewall configured
- [ ] Principle of least privilege
- [ ] Security groups/network policies
- [ ] Regular backups
- [ ] Incident response plan
- [ ] Security monitoring/alerting

---

## Automated Security Scanning

**GitHub Actions Workflow**:
```yaml
name: Security Scan

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run npm audit
        run: npm audit --audit-level=high

      - name: Run Snyk
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

      - name: Run ESLint security scan
        run: |
          npm run lint:security

      - name: Scan for secrets
        run: |
          git secrets --scan-history
```

---

## Severity Scoring (CVSS)

**Critical (9.0-10.0)**:
- Remote code execution
- Full system compromise
- Mass data breach

**High (7.0-8.9)**:
- Authentication bypass
- Privilege escalation
- Significant data exposure

**Medium (4.0-6.9)**:
- XSS, CSRF
- Information disclosure
- DoS

**Low (0.1-3.9)**:
- Minor info leak
- Hardening recommendations

---

## Related

- Commands: `/security-audit` (runs full scan)
- Agents: `security-expert` (analyzes results)
- Skills: `code-quality`
