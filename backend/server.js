global.DOMMatrix = class {};
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const mongoose = require('mongoose');

// DB and Models
const connectDB = require('./config/db');
const User = require('./models/User');
const { ROLE_SKILL_MATRIX, SKILL_SYNONYMS } = require('./skill_engine');

// Connect to MongoDB
connectDB();

// Robust pdf-parse import
let pdf;
try {
    const pdfImport = require('pdf-parse');
    pdf = typeof pdfImport === 'function' ? pdfImport : pdfImport.default;
} catch (e) {
    console.error('Failed to load pdf-parse:', e);
}

// Hugging Face Transformers Integration (Real Local BERT)
let pipeline;
let env;
let extractor;
(async () => {
    try {
        const transformers = await import('@xenova/transformers');
        pipeline = transformers.pipeline;
        env = transformers.env;
        console.log("[SYSTEM] Loading semantic embedding model...");
        extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', { quantized: true });
        console.log("[SYSTEM] Semantic embedding model loaded!");
    } catch(e) {
        console.error("Failed to load @xenova/transformers:", e);
    }
})();


const app = express();
const PORT = process.env.PORT || 8001;
const SECRET_KEY = process.env.JWT_SECRET || 'bert-secret-key-123';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Mock Data for demonstration if API Key is missing
const MOCK_ANALYSIS = {
  "candidate": {
    "name": "Alex Career",
    "email": "alex@career.com",
    "location": "Remote",
    "experience": "3",
    "education": "Relevant Degree",
    "skills": ["React", "Node.js", "Python"]
  },
  "dashboard": {
    "skills_identified": 3,
    "last_analysis": "Today"
  },
  "roles": [
    { "role": "Software Engineer", "match_score": 0, "matched_skills": ["Node.js", "Python", "Git"], "missing_skills": ["Java", "C++"], "total_skills": 5, "matched_count": 0, "reason": "Consistent experience in general software development." },
    { "role": "Frontend Developer", "match_score": 0, "matched_skills": ["React", "JavaScript", "HTML", "CSS"], "missing_skills": ["Tailwind", "Next.js"], "total_skills": 6, "matched_count": 0, "reason": "Strong frontend core, missing modern CSS frameworks." },
    { "role": "Backend Developer", "match_score": 90, "matched_skills": ["Node.js", "SQL", "Python"], "missing_skills": ["GraphQL"], "total_skills": 5, "matched_count": 4, "reason": "Excellent backend foundation with diverse language support." },
    { "role": "Full Stack Developer", "match_score": 92, "matched_skills": ["React", "Node.js", "SQL"], "missing_skills": ["System Design"], "total_skills": 6, "matched_count": 5, "reason": "Highly balanced skills across the full stack." },
    { "role": "Data Analyst", "match_score": 65, "matched_skills": ["Python", "SQL"], "missing_skills": ["Tableau", "R"], "total_skills": 5, "matched_count": 2, "reason": "Good math/logic base, but requires data-specific tool mastery." },
    { "role": "Data Scientist", "match_score": 60, "matched_skills": ["Python"], "missing_skills": ["Statistics", "ML Frameworks"], "total_skills": 7, "matched_count": 2, "reason": "Programming skills present, but technical DS skills missing." },
    { "role": "ML Engineer", "match_score": 55, "matched_skills": ["Python"], "missing_skills": ["PyTorch", "TensorFlow"], "total_skills": 8, "matched_count": 2, "reason": "Requires significant training in ML specific frameworks." },
    { "role": "DevOps Engineer", "match_score": 78, "matched_skills": ["Docker", "AWS"], "missing_skills": ["Terraform", "Kubernetes"], "total_skills": 6, "matched_count": 3, "reason": "Solid cloud exposure with modern containerization habits." },
    { "role": "Cloud Engineer", "match_score": 80, "matched_skills": ["AWS", "Docker"], "missing_skills": ["Azure", "Cloud Architecture"], "total_skills": 5, "matched_count": 3, "reason": "Strong AWS foundations but needs multi-cloud awareness." },
    { "role": "MLOps Engineer", "match_score": 50, "matched_skills": ["Docker"], "missing_skills": ["MLFlow", "SageMaker"], "total_skills": 8, "matched_count": 2, "reason": "Early stage for MLOps; infrastructure core is there but ML ops missing." },
    { "role": "Business Analyst", "match_score": 62, "matched_skills": ["SQL"], "missing_skills": ["Excel", "Requirement Gathering"], "total_skills": 6, "matched_count": 2, "reason": "Technical enough for data side, needs soft-skill and business focus." },
    { "role": "HR Executive", "match_score": 40, "matched_skills": [], "missing_skills": ["ATS", "Recruitment"], "total_skills": 6, "matched_count": 0, "reason": "Minimal alignment with human resource management." },
    { "role": "Digital Marketing", "match_score": 45, "matched_skills": [], "missing_skills": ["SEO", "Google Ads"], "total_skills": 7, "matched_count": 0, "reason": "Highly technical profile vs creative marketing needs." },
    { "role": "Project Coordinator", "match_score": 72, "matched_skills": ["Communication"], "missing_skills": ["Agile", "Scrum"], "total_skills": 6, "matched_count": 2, "reason": "Natural organized mindset, but needs formal management framework." },
    { "role": "Operations Analyst", "match_score": 75, "matched_skills": ["SQL", "Logic"], "missing_skills": ["Six Sigma"], "total_skills": 5, "matched_count": 3, "reason": "Analytical strength translates well to operations optimization." }
  ],
  "skill_gap_analysis": {
    "missing_skills": ["System Design", "GraphQL", "Java"],
    "learning_focus": "Deepen architectural skills and adopt enterprise languages like Java."
  },
  "job_market": {
    "salary_range": "₹12,00,000 - ₹35,00,000",
    "demand": "High",
    "platforms": ["LinkedIn", "Indeed", "Glassdoor"]
  },
  "learning_path": {
    "coursera": [],
    "udemy": [],
    "edx": []
  }
};

// BRUTE-FORCE PRODUCTION CORS (Ensures Vercel can always talk to Render)
app.use(cors({
    origin: true, // Dynamically allow whatever origin is making the request
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: '*', // Allow all headers (x-user-email, Authorization, etc.)
    credentials: true
}));



// Render.com Health Check Endpoint
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB Limit
});

// User Authentication Middleware
// Dynamic Skill-to-Course Mapper Service (Scalable Pattern)
const generateLearningPathForGaps = (skills, roleTitle) => {
    // If no missing skills, suggest advanced role certification
    const baseSkills = skills && skills.length > 0 ? skills.slice(0, 2).map(s => typeof s === 'object' ? (s.name || s.skill) : s) : [roleTitle];
    
    return {
        coursera: baseSkills.map(skill => ({
            title: `${skill} Professional Certification`,
            url: `https://www.coursera.org/search?query=${encodeURIComponent(skill)}`
        })),
        udemy: baseSkills.map(skill => ({
            title: `${skill} Masterclass: Zero to Hero`,
            url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(skill)}`
        })),
        edx: baseSkills.map(skill => ({
            title: `MicroMasters in ${skill}`,
            url: `https://www.edx.org/search?q=${encodeURIComponent(skill)}`
        }))
    };
};

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const firebaseEmail = req.headers['x-user-email'];

    // 1. JWT Strategy
    if (token) {
        try {
            const decoded = jwt.verify(token, SECRET_KEY);
            const user = await User.findById(decoded.id);
            if (user) {
                req.user = user;
                return next();
            }
        } catch (err) {
            console.warn('JWT Verification failed, trying fallback identity:', err.message);
        }
    }

    // 2. Firebase Identity Strategy (Bridge)
    if (firebaseEmail) {
        try {
            let user = await User.findOne({ email: firebaseEmail });
            
            // If new social login user not in DB yet, create a skeleton record
            if (!user) {
                user = await User.create({
                    email: firebaseEmail,
                    name: firebaseEmail.split('@')[0],
                    skills: [],
                    roles: []
                });
            }
            
            req.user = user;
            return next();
        } catch (e) {
            console.error('Firebase DB Bridge Error:', e);
        }
    }

    if (!token && !firebaseEmail) {
        console.warn('[AUTH] Missing both JWT token and x-user-email header');
    }

    return res.status(401).json({ error: 'Unauthorized: Missing token or identity' });
};


// AI Resume Analysis Logic
const analyzeResumeAI = async (resumeText) => {
    const keys = [
        process.env.GEMINI_API_KEY,
        process.env.GEMINI_API_KEY_2,
        process.env.GEMINI_API_KEY_3
    ].filter(Boolean);

    if (keys.length === 0) {
        throw new Error('No GEMINI_API_KEY configured in .env');
    }

    const modelsToTry = [
        "models/gemini-2.5-flash",
        "models/gemini-2.0-flash",
        "models/gemini-2.0-flash-lite",
        "models/gemini-2.5-flash-lite",
        "models/gemini-2.5-pro"
    ];

    const prompt = `
You are a PRODUCTION-GRADE Career Intelligence AI.

Analyze the resume text and produce a DYNAMIC, SEMANTIC JSON response that reflects real-world job market requirements.

1. **Candidate Profile**: Extract name, email, location, experience (years), education, and a comprehensive skill list.
2. **Dashboard Overview**: Summary of "Skills Identified".
3. **Role Selection**: Provide a detailed analysis for exactly 15 career paths:
   - Software Engineer, Frontend Developer, Backend Developer, Full Stack Developer, Data Analyst
   - Data Scientist, ML Engineer, MLOps Engineer, DevOps Engineer, Cloud Engineer
   - Business Analyst, Project Coordinator, HR Executive, Digital Marketing, Operations Analyst
4. **Skill Intelligence (MANDATORY STRUCTURE)**:
   For every role, provide:
   - "core": Top 3-4 critical skills (Weight: 1.0)
   - "important": 3-4 supporting skills (Weight: 0.6)
   - "optional": 2-3 nice-to-have skills (Weight: 0.3)
   - "types": A map of skill name to its type (Language, Framework, Tool, Concept)
   - "explanations": A map of skill name to a concise reason why it's required for this role.
   - "match_score": Initial estimate (will be refined by backend math).
5. **Skill Gap Intelligence**: Identify gaps and rank them by importance.
6. **Job Market**: Real-world salary ranges in Indian Rupees (INR) with ₹ symbol and market demand trends.

FINAL JSON FORMAT
-----------------------------------
{
  "candidate": { "name": "", "email": "", "location": "", "experience": "0", "education": "", "skills": [] },
  "dashboard": { "skills_identified": 0, "last_analysis": "Today" },
  "roles": [ 
    { 
      "role": "", 
      "core": [], 
      "important": [], 
      "optional": [],
      "types": {},
      "explanations": {},
      "reason": "" 
    } 
  ],
  "skill_gap_analysis": { "missing_skills": [], "learning_focus": "" },
  "job_market": { "salary_range": "₹XX,XX,XXX - ₹XX,XX,XXX", "demand": "", "platforms": ["LinkedIn", "Indeed"] },
  "learning_path": { "coursera": [], "udemy": [], "edx": [] }
}

Resume Text:
${resumeText}
`;

    // ── FAST HEALTH PROBE (Limited to avoid Browser Timeout) ─────────────────
    // We only probe the FIRST key with the first 2 models. 
    // This keeps the total "wait time" under 10 seconds before deciding to fall back.
    let geminiAvailable = false;
    let workingKey = null;
    let workingModel = null;

    const firstKey = keys[0];
    const genAI = new GoogleGenerativeAI(firstKey);
    
    // Try only the top 2 models for a quick check
    for (const modelName of modelsToTry.slice(0, 2)) {
        try {
            console.log(`[AI] Quick probe: Model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName, generationConfig: { responseMimeType: "application/json" } });
            
            let probeTimeoutId;
            const probeTimeout = new Promise((_, reject) => {
                probeTimeoutId = setTimeout(() => reject(new Error('probe timeout')), 3000); // 3s per probe
            });
            const probePromise = model.generateContent('{"ok":true}');
            probePromise.catch(() => {});
            
            await Promise.race([probePromise, probeTimeout]).finally(() => clearTimeout(probeTimeoutId));
            
            geminiAvailable = true;
            workingKey = firstKey;
            workingModel = modelName;
            console.log(`[AI] Gemini is UP. Using Model: ${modelName}`);
            break;
        } catch (err) {
            console.warn(`[AI] Probe failed for ${modelName}: ${err.message}`);
        }
    }

    if (!geminiAvailable) {
        throw new Error('Gemini API is currently overloaded or unresponsive. Using local backup.');
    }


    // ── REAL ANALYSIS (30s max) ─────────────────────────────────────────────────
    // Reusing the genAI instance from the probe

    const model = genAI.getGenerativeModel({ 
        model: workingModel,
        generationConfig: { responseMimeType: "application/json" }
    });

    let analysisTimeoutId;
    const analysisTimeout = new Promise((_, reject) => {
        analysisTimeoutId = setTimeout(() => reject(new Error('Gemini API Timeout')), 30000);
    });
    const analysisPromise = model.generateContent(prompt);
    analysisPromise.catch(() => {});

    const result = await Promise.race([analysisPromise, analysisTimeout]).finally(() => clearTimeout(analysisTimeoutId));
    const response = await result.response;
    const text = response.text();
    
    // Validate JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : text);
};


// Routes
app.post('/api/register/', async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = await User.create({
            name,
            email,
            password: hashedPassword,
            skills: [],
            roles: []
        });

        const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY);
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/token/', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        if (user.password) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
        } else {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY);
        res.json({ access: token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/profile/', authenticateToken, async (req, res) => {

    try {
        const userProfile = await User.findById(req.user._id).select('-password');
        if (!userProfile) return res.status(404).json({ error: 'User not found' });
        res.json(userProfile);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/resume/analyze/', authenticateToken, upload.single('resume'), async (req, res) => {
    console.log('>>> [HANDSHAKE SUCCESS] STARTING ANALYSIS FOR:', req.user?.email || 'Unknown User');
    console.log(">>> RECEIVED ANALYSIS REQUEST <<<");
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const dataBuffer = req.file.buffer;
        const fileName = req.file.originalname.toLowerCase();
        
        let resumeText = '';

        try {
            if (fileName.endsWith('.pdf')) {
                if (typeof pdf === 'function') {
                    const data = await pdf(dataBuffer);
                    resumeText = data.text;
                } else {
                    throw new Error('PDF parser not initialized');
                }
            } else if (fileName.endsWith('.docx')) {
                const mammoth = require('mammoth');
                const result = await mammoth.extractRawText({ buffer: dataBuffer });
                resumeText = result.value;
            } else if (fileName.endsWith('.txt')) {
                resumeText = dataBuffer.toString('utf-8');
            } else {
                return res.status(400).json({ error: 'Unsupported file format. Please upload PDF, DOCX, or TXT.' });
            }

            if (!resumeText || resumeText.trim().length < 50) {
                return res.status(400).json({ error: 'Could not extract enough text from resume. Please ensure the file is not empty or scan-only.' });
            }
        } catch (pdfErr) {
            console.error('PDF Parse error (file processing failed) - using fallback extraction:', pdfErr);
            resumeText = dataBuffer.toString('utf8'); 
        }
        
        if (!resumeText || resumeText.trim().length < 10) {
            resumeText = "Candidate Name: Unknown\nProfessional Profile: Software Engineer with experience in React and Node.js.";
        }

        let bertScoresMap = {};
        
        // ==========================================
        // REAL BERT TRANSFORMER EXECUTION (ZERO-SHOT)
        // ==========================================
        if (pipeline && resumeText) {
            try {
                console.log("\n[SYSTEM] Initializing Local BERT Zero-Shot Classifier...");
                const classifier = await pipeline('zero-shot-classification', 'Xenova/mobilebert-uncased-mnli', { quantized: true });
                
                // Truncate to avoid exceeding max tokens on massive PDFs
                const truncatedText = resumeText.substring(0, 1000); 
                console.log("[SYSTEM] Processing text through BERT Model to classify roles...");
                
                const candidate_labels = MOCK_ANALYSIS.roles.map(r => r.role);
                
                // Run full Zero-Shot BERT Classification with a 10-second timeout to prevent hanging
                let bertTimeoutId;
                const timeoutPromise = new Promise((_, reject) => {
                    bertTimeoutId = setTimeout(() => reject(new Error("BERT Execution Timeout")), 10000);
                });
                
                const classifierPromise = classifier(truncatedText, candidate_labels);
                classifierPromise.catch(() => {}); // Prevent unhandled rejection
                
                const output = await Promise.race([
                    classifierPromise,
                    timeoutPromise
                ]).finally(() => clearTimeout(bertTimeoutId));
                
                // Map the resulting BERT confidence probabilities to our scores (0-100)
                output.labels.forEach((label, index) => {
                    // MobileBERT confidence scores can be sharp. Normalizing them slightly for UI logic.
                    // Score is * 100 to make it an integer percentage
                    bertScoresMap[label] = Math.min(100, Math.round(output.scores[index] * 100 * 2)); 
                });
                
                console.log(`[SYSTEM] Successfully ran BERT! Predictions calculated for all ${candidate_labels.length} roles.\n`);
            } catch (err) {
                 console.error("[SYSTEM] BERT execution error:", err);
            }
        }
        // ==========================================

        // Local Information Extraction (IE) - FALLBACK for missing GEMINI_API_KEY
        const extractInfo = (text) => {
            const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
            const name = lines[0] || 'Unknown User';
            const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
            const email = emailMatch ? emailMatch[0] : 'user@example.com';
            
            // Advanced Multi-Domain Skill extraction engine
            const skillList = [
                "React", "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind", "Vite", "Next.js", "Redux", "Angular", "Vue",
                "Node.js", "Express", "Python", "Django", "Flask", "Java", "Spring Boot", "Go", "Ruby", "PHP", "C#", ".NET",
                "SQL", "PostgreSQL", "MongoDB", "MySQL", "Redis", "Firebase", "Oracle",
                "Machine Learning", "ML", "Data Science", "Python", "R", "Statistics", "Deep Learning", "TensorFlow", "PyTorch", "Scikit", "Pandas", "NumPy", "Tableau", "Power BI", "Data Modeling", "MLOps",
                "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Terraform", "Jenkins", "CI/CD", "Git", "GitHub", "Linux",
                "Agile", "Scrum", "Project Management", "Marketing", "SEO", "Ads", "Excel", "Sales", "HR Tools", "Recruitment", "Product Management"
            ];
            const skillsFound = skillList.filter(s => text.toLowerCase().includes(s.toLowerCase()));

            const expMatch = text.match(/(\d+)\s*(?:years?|yrs?|yr)/i);
            const experience = expMatch ? expMatch[1] : "1";

            return { name, email, location: "Remote", experience, skills: skillsFound };
        };

        const { name, email, location, experience, skills } = extractInfo(resumeText);

        // DYNAMIC ANALYSIS GENERATOR (Anti-Gravity Engine)
        const generateDynamicAnalysis = (name, email, loc, exp, skills) => {
            const base = JSON.parse(JSON.stringify(MOCK_ANALYSIS));
            base.candidate = { name, email, location: loc, experience: exp, skills };
            base.dashboard = { skills_identified: skills.length, last_analysis: "Today" };
            
            // Re-derive roles dynamically from the Skill Matrix
            base.roles = Object.keys(ROLE_SKILL_MATRIX).map(roleName => {
                const matrix = ROLE_SKILL_MATRIX[roleName];
                return {
                    role: roleName,
                    core: matrix.core,
                    important: matrix.important,
                    optional: matrix.optional,
                    types: matrix.types,
                    explanations: matrix.explanations,
                    reason: `Derived via Anti-Gravity Skill Matrix for ${roleName}.`
                };
            });
            return base;
        };

        let analysis;
        if (!GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY missing - generating DYNAMIC ANTI-GRAVITY ANALYSIS');
            analysis = generateDynamicAnalysis(name, email, location, experience, skills);
        } else {
            try {
                analysis = await analyzeResumeAI(resumeText);
            } catch (aiErr) {
                console.error('ALL Gemini AI Attempts Failed. Falling back to Dynamic Skill Matrix:', aiErr.message);
                analysis = generateDynamicAnalysis(name, email, location, experience, skills);
            }
        }

        // ==========================================
        // ENFORCE STRICT MATH SCORING (MANDATORY)
        // ==========================================
        const STANDARDIZE_MAP = {
            ...SKILL_SYNONYMS,
            "js": "javascript",
            "react.js": "react",
            "node.js": "node",
            "vue.js": "vue",
            "ts": "typescript",
            "c++": "cpp",
            "c#": "csharp",
            "react native": "react-native"
        };
        const standardizeSkill = (s) => {
            if (!s) return "";
            const clean = s.toLowerCase().trim();
            return STANDARDIZE_MAP[clean] || clean;
        };

        // 1. Normalize User Skills
        const userSkillsRaw = analysis.candidate.skills || [];
        const userSkillsUnique = Array.from(new Set(userSkillsRaw.map(standardizeSkill))).filter(Boolean);
        analysis.candidate.skills = userSkillsUnique;

        const userEmbeddings = [];
        if (extractor) {
            for (const s of userSkillsUnique) {
                try {
                    const out = await extractor(s, { pooling: 'mean', normalize: true });
                    userEmbeddings.push(Array.from(out.data));
                } catch (e) {
                    userEmbeddings.push(null);
                }
            }
        }

        const cosineSim = (vecA, vecB) => {
            if (!vecA || !vecB) return 0;
            let dot = 0, normA = 0, normB = 0;
            for(let i = 0; i < vecA.length; i++) {
                dot += vecA[i] * vecB[i];
                normA += vecA[i] * vecA[i];
                normB += vecB[i] * vecB[i];
            }
            return (normA === 0 || normB === 0) ? 0 : (dot / (Math.sqrt(normA) * Math.sqrt(normB)));
        };

        // ==========================================
        // DYNAMIC WEIGHTED SEMANTIC MATCHING (Anti-Gravity)
        // ==========================================
        for (const r of analysis.roles) {
            const weights = { core: 1.0, important: 0.6, optional: 0.3 };
            // Support both Gemini format (core/important/optional) and fallback format (matched_skills/missing_skills)
            const coreSkills = r.core || [];
            const importantSkills = r.important || [];
            const optionalSkills = r.optional || [];
            // If no structured skills, build from matched+missing
            const legacySkills = (coreSkills.length === 0 && importantSkills.length === 0)
                ? [...(r.matched_skills || []).map(s => ({ name: typeof s === 'object' ? (s.name || s.skill) : s, weight: weights.core, category: 'Core' })),
                   ...(r.missing_skills || []).map(s => ({ name: typeof s === 'object' ? (s.name || s.skill) : s, weight: weights.important, category: 'Important' }))]
                : [];
            const categorizedSkills = legacySkills.length > 0 ? legacySkills : [
                ...coreSkills.map(s => ({ name: s, weight: weights.core, category: 'Core' })),
                ...importantSkills.map(s => ({ name: s, weight: weights.important, category: 'Important' })),
                ...optionalSkills.map(s => ({ name: s, weight: weights.optional, category: 'Optional' }))
            ];

            let totalWeight = 0;
            let earnedWeight = 0;
            const matched = [];
            const missing = [];

            for (const reqSkill of categorizedSkills) {
                totalWeight += reqSkill.weight;
                const reqClean = standardizeSkill(reqSkill.name);
                
                // Semantic check
                let bestSim = 0;
                let matchedAs = "";
                
                // 1. Direct Keyword Match
                if (userSkillsUnique.includes(reqClean)) {
                    bestSim = 1.0;
                    matchedAs = reqSkill.name;
                } 
                // 2. Semantic Embedding Match
                else if (extractor) {
                    try {
                        const reqEmbed = await extractor(reqSkill.name, { pooling: 'mean', normalize: true });
                        for (let i = 0; i < userSkillsUnique.length; i++) {
                            const sim = cosineSim(reqEmbed.data, userEmbeddings[i]);
                            if (sim > bestSim) {
                                bestSim = sim;
                                matchedAs = userSkillsRaw[i];
                            }
                        }
                    } catch (e) {}
                }

                if (bestSim >= 0.88) {
                    earnedWeight += reqSkill.weight * bestSim;
                    matched.push({ 
                        name: reqSkill.name, 
                        matchedAs, 
                        similarity: bestSim, 
                        category: reqSkill.category,
                        type: r.types?.[reqSkill.name] || 'Skill',
                        explanation: r.explanations?.[reqSkill.name]
                    });
                } else {
                    missing.push({
                        name: reqSkill.name,
                        category: reqSkill.category,
                        type: r.types?.[reqSkill.name] || 'Skill',
                        explanation: r.explanations?.[reqSkill.name]
                    });
                }
            }

            const score = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
            
            r.match_score = Math.min(100, Math.max(0, score));
            r.matched_skills = matched;
            r.missing_skills = missing;
            r.total_skills = categorizedSkills.length;
            r.matched_count = matched.length;
        }
        // ==========================================

        // DYNAMIC PREDICTION OVERRIDE logic
        // If a role was previously selected/locked, ensure it stays at the top
        const selectedRoleId = req.user.selected_role_id;
        let sortedRoles = [...analysis.roles].sort((a, b) => b.match_score - a.match_score);
        
        if (selectedRoleId) {
            const lockedRole = sortedRoles.find(r => r.roleId == selectedRoleId || r.role === selectedRoleId);
            if (lockedRole) {
                // Move the locked role to the absolute top of the list
                sortedRoles = [lockedRole, ...sortedRoles.filter(r => r !== lockedRole)];
                analysis.dashboard.top_role = lockedRole.role;
                analysis.dashboard.is_locked = true;
            } else {
                analysis.dashboard.top_role = sortedRoles[0]?.role || 'Professional';
                analysis.dashboard.is_locked = false;
            }
        } else {
            analysis.dashboard.top_role = sortedRoles[0]?.role || 'Professional';
            analysis.dashboard.is_locked = false;
        }

        analysis.dashboard.top_roles = sortedRoles.slice(0, 3);
        analysis.dashboard.skills_identified = analysis.candidate.skills.length;

        // Dynamic Global Learning Path for Top Role
        const topRole = sortedRoles[0];
        if (topRole) {
            analysis.learning_path = generateLearningPathForGaps(topRole.missing_skills, topRole.role);
        }

        // Update user data in MongoDB
        try {
            await User.findByIdAndUpdate(req.user._id, {
                $set: {
                    candidate: analysis.candidate,
                    dashboard: analysis.dashboard,
                    roles: analysis.roles,
                    skill_gap_analysis: analysis.skill_gap_analysis,
                    job_market: analysis.job_market,
                    learning_path: analysis.learning_path,
                    last_analysis: 'Today'
                }
            });
        } catch (dbErr) {
            console.error("Failed to update user in DB:", dbErr);
        }

        res.json(analysis);
    } catch (err) {
        console.error('Analysis error details:', err);
        res.status(500).json({ 
            error: 'Failed to analyze resume', 
            detail: err.message || 'Internal Server Error',
            step: err.step || 'General Process'
        });
    }
});

app.post('/resume/save/', authenticateToken, async (req, res) => {

    try {
        const updatedUser = await User.findByIdAndUpdate(req.user._id, { $set: req.body }, { new: true });
        res.json({ success: true, user: updatedUser });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/user/select-role/', authenticateToken, async (req, res) => {
    const { roleId } = req.body;
    try {
        await User.findByIdAndUpdate(req.user._id, { $set: { selected_role_id: roleId } });
        res.json({ success: true, selected_role_id: roleId });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/recommendations/', authenticateToken, async (req, res) => {

    try {
        const user = await User.findById(req.user._id);
        if (!user || !user.roles) return res.json([]);

        const fieldMap = {
            'Software Engineer': 'Software Development',
            'Frontend Developer': 'Web Development',
            'Backend Developer': 'Systems',
            'Full Stack Developer': 'Web Development',
            'Data Analyst': 'Analytics',
            'Data Scientist': 'Data Science',
            'ML Engineer': 'AI / ML',
            'DevOps Engineer': 'Infrastructure',
            'Cloud Engineer': 'Cloud',
            'MLOps Engineer': 'AI Infrastructure',
            'Business Analyst': 'Business',
            'HR Executive': 'Human Resources',
            'Digital Marketing': 'Marketing',
            'Project Coordinator': 'Management',
            'Operations Analyst': 'Operations'
        };

        const formattedRoles = user.roles.map((r, idx) => ({
            id: idx,
            title: r.role,
            field: fieldMap[r.role] || 'General',
            match_score: r.match_score,
            reason: r.reason
        }));

        res.json(formattedRoles);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/skill-gap/:roleId/', authenticateToken, async (req, res) => {

    const { roleId } = req.params;
    try {
        const user = await User.findById(req.user._id);
        if (!user || !user.roles) return res.status(404).json({ error: 'Data not found' });

        // Find the role
        const roleData = user.roles.find((r, idx) => idx == roleId || r.role === roleId);
        
        if (!roleData) return res.status(404).json({ error: 'Role not found' });

        // Format data for RoleDetails UI
        const chartData = [
            ...roleData.matched_skills.map(s => ({ skill: typeof s === 'object' ? (s.name || s.skill) : s, level: 'Advanced', isMatched: true })),
            ...roleData.missing_skills.map(s => ({ skill: typeof s === 'object' ? (s.name || s.skill) : s, level: 'Required', isMatched: false }))
        ];

        // DYNAMIC LEARNING PATH (GAP ANALYSIS)
        const dynamicPath = generateLearningPathForGaps(roleData.missing_skills, roleData.role);

        const learningResources = [
            ...dynamicPath.coursera.map(c => ({ platform: 'Coursera', title: c.title, link: c.url })),
            ...dynamicPath.udemy.map(c => ({ platform: 'Udemy', title: c.title, link: c.url })),
            ...dynamicPath.edx.map(c => ({ platform: 'edX', title: c.title, link: c.url }))
        ];

        // DYNAMIC JOB LINKS GENERATION (Anti-Gravity Requirement)
        const jobQuery = roleData.role.trim();
        const location = user.candidate?.location || 'Remote';

        const dynamicJobLinks = [
            {
                platform: 'LinkedIn',
                url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(jobQuery)}&location=${encodeURIComponent(location)}`,
                icon: 'linkedin'
            },
            {
                platform: 'Indeed',
                url: `https://www.indeed.com/jobs?q=${encodeURIComponent(jobQuery)}&l=${encodeURIComponent(location)}`,
                icon: 'indeed'
            }
        ];

        // PERSONALIZED JOB DISCOVERY ENGINE (Mocking Role-Specific Results)
        const recommendedJobs = [
            {
                title: `${roleData.role}`,
                company: 'LinkedIn',
                location: location,
                salary: '$120k - $160k',
                match: 'High Match',
                link: dynamicJobLinks[0].url
            },
            {
                title: `${roleData.role}`,
                company: 'Indeed',
                location: 'Remote',
                salary: '$110k - $145k',
                match: 'Skills Match',
                link: dynamicJobLinks[1].url
            }
        ];

        const skillGapResponse = {
            role: roleData.role,
            matchPercentage: roleData.match_score,
            reason: roleData.reason,
            chartData,
            marketInsights: {
                salary: user.job_market?.salary_range || 'Market Value',
                trend: user.job_market?.demand || 'Stable',
                openings: 'High Demand'
            },
            candidateLocation: location,
            learningResources,
            dynamicJobLinks,
            recommendedJobs // Added for Personalized Job Discovery
        };

        res.json(skillGapResponse);
    } catch (err) {
        console.error("Skill Gap Error:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET Market Trends (ADVANCED FEATURE 4)
app.get('/api/market-trends/', (req, res) => {
    // Generate beautiful mock data for the dashboard chart
    const trends = [
        { month: 'Jan', demand: 65, salary: '$95k' },
        { month: 'Feb', demand: 72, salary: '$98k' },
        { month: 'Mar', demand: 85, salary: '$102k' },
        { month: 'Apr', demand: 78, salary: '$105k' },
        { month: 'May', demand: 92, salary: '$110k' },
        { month: 'Jun', demand: 88, salary: '$112k' }
    ];
    res.json(trends);
});

// GET GitHub Repository Analysis (ADVANCED FEATURE)
app.get('/api/github/:username', async (req, res) => {
    const { username } = req.params;
    
    try {
        console.log(`Analyzing GitHub profile for: ${username}`);
        
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        
        if (!response.ok) {
            if (response.status === 404) return res.status(404).json({ error: 'GitHub user not found' });
            throw new Error(`GitHub API responded with ${response.status}`);
        }

        const repos = await response.json();
        
        // 1. Language Aggregation
        const languages = {};
        repos.forEach(repo => {
            if (repo.language) {
                languages[repo.language] = (languages[repo.language] || 0) + 1;
            }
        });

        // 2. Sort Languages
        const sortedLanguages = Object.entries(languages)
            .sort(([, a], [, b]) => b - a)
            .map(([name]) => name);

        // 3. Skill Mapping (Extended)
        const languageToSkillMap = {
            'JavaScript': 'Frontend Development',
            'TypeScript': 'Modern Web Architecture',
            'Python': 'Data Science / Backend',
            'Java': 'Enterprise Systems',
            'Go': 'Cloud Native / Go',
            'PHP': 'Web Services',
            'C#': '.NET Development',
            'Ruby': 'Server Side Logic',
            'Rust': 'Systems Programming',
            'CSS': 'Responsive UI Design',
            'HTML': 'Web Standards'
        };

        const detectedSkills = sortedLanguages
            .map(lang => languageToSkillMap[lang])
            .filter(Boolean)
            .slice(0, 5);

        // Add additional general skills based on repo activity
        if (repos.length > 5) detectedSkills.push('Open Source Contributor');
        if (repos.some(r => r.fork)) detectedSkills.push('Collaborative Development');

        res.json({
            username,
            repos: repos.length,
            topLanguages: sortedLanguages.slice(0, 3).join(', '),
            detectedSkills: Array.from(new Set(detectedSkills)),
            totalPRs: Math.floor(Math.random() * 200) + 10, // Mocked PR count as GitHub API requires search endpoint for real PRs
            qualityScore: repos.length > 10 ? 'High / Stable' : 'Rising',
            lastAnalyzed: new Date().toLocaleDateString()
        });

    } catch (err) {
        console.error('GitHub Analysis Error:', err);
        res.status(500).json({ error: 'Failed to analyze GitHub repositories', detail: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Catch-all 404 handler for API
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
