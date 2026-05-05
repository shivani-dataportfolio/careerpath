/**
 * ANTI-GRAVITY SKILL INTELLIGENCE ENGINE
 * Full 15-Role Matrix Coverage
 */

const ROLE_SKILL_MATRIX = {
    "Software Engineer": {
        "core": ["JavaScript", "Python", "Data Structures", "Algorithms"],
        "important": ["Git", "SQL", "Unit Testing", "System Design"],
        "optional": ["Docker", "AWS", "Agile"],
        "types": {
            "JavaScript": "Language", "Python": "Language", "Data Structures": "Concept", "Algorithms": "Concept",
            "Git": "Tool", "SQL": "Language", "System Design": "Concept", "Docker": "Tool", "AWS": "Tool"
        },
        "explanations": {
            "Data Structures": "Fundamental for efficient coding and problem solving.",
            "System Design": "Critical for scaling applications and high-level architecture.",
            "Git": "Essential for version control and collaborative development."
        }
    },
    "Frontend Developer": {
        "core": ["React", "JavaScript", "HTML", "CSS"],
        "important": ["TypeScript", "Tailwind", "Vite", "Next.js"],
        "optional": ["Redux", "Testing Library", "Web Accessibility"],
        "types": {
            "React": "Framework", "JavaScript": "Language", "HTML": "Language", "CSS": "Language",
            "TypeScript": "Language", "Next.js": "Framework", "Tailwind": "Framework", "Redux": "Tool"
        },
        "explanations": {
            "React": "Primary library for building modern user interfaces.",
            "TypeScript": "Improves code quality and prevents runtime errors in large apps.",
            "Web Accessibility": "Ensures the application is usable by everyone."
        }
    },
    "Backend Developer": {
        "core": ["Node.js", "Express", "SQL", "APIs"],
        "important": ["PostgreSQL", "MongoDB", "Redis", "Authentication"],
        "optional": ["GraphQL", "Docker", "Microservices"],
        "types": {
            "Node.js": "Runtime", "Express": "Framework", "SQL": "Language", "PostgreSQL": "Database",
            "MongoDB": "Database", "Redis": "Tool", "Docker": "Tool", "GraphQL": "Concept"
        },
        "explanations": {
            "APIs": "The bridge between frontend and backend services.",
            "Authentication": "Critical for securing user data."
        }
    },
    "Full Stack Developer": {
        "core": ["React", "Node.js", "SQL", "JavaScript"],
        "important": ["Express", "MongoDB", "TypeScript", "Redux"],
        "optional": ["Docker", "Testing", "Cloud Deployment"],
        "types": { "React": "Framework", "Node.js": "Runtime", "SQL": "Language", "MongoDB": "Database" },
        "explanations": { "Full Stack": "Combining frontend and backend for end-to-end delivery." }
    },
    "Data Analyst": {
        "core": ["SQL", "Excel", "Data Visualization", "Statistics"],
        "important": ["Python", "Tableau", "Power BI", "Cleaning"],
        "optional": ["R", "Reporting", "A/B Testing"],
        "types": { "SQL": "Language", "Excel": "Tool", "Tableau": "Tool" },
        "explanations": { "SQL": "Primary tool for data retrieval and manipulation." }
    },
    "Data Scientist": {
        "core": ["Python", "Statistics", "Machine Learning", "SQL"],
        "important": ["Pandas", "NumPy", "Scikit-Learn", "Deep Learning"],
        "optional": ["NLP", "Computer Vision", "Big Data"],
        "types": { "Python": "Language", "Statistics": "Concept", "Machine Learning": "Concept" },
        "explanations": { "Statistics": "The core of making data-driven decisions." }
    },
    "ML Engineer": {
        "core": ["Python", "Machine Learning", "TensorFlow", "PyTorch"],
        "important": ["Data Engineering", "Scikit-Learn", "Optimization"],
        "optional": ["MLOps", "Model Deployment", "Neural Networks"],
        "types": { "Python": "Language", "TensorFlow": "Framework", "PyTorch": "Framework" },
        "explanations": { "TensorFlow": "Leading library for production-grade deep learning." }
    },
    "MLOps Engineer": {
        "core": ["Docker", "Kubernetes", "MLFlow", "Python"],
        "important": ["SageMaker", "CI/CD for ML", "Model Monitoring"],
        "optional": ["Feature Store", "Distributed Training"],
        "types": { "Docker": "Tool", "MLFlow": "Tool", "Python": "Language" },
        "explanations": { "MLFlow": "Standard for tracking and managing ML lifecycles." }
    },
    "DevOps Engineer": {
        "core": ["Docker", "Kubernetes", "AWS", "CI/CD"],
        "important": ["Terraform", "Linux", "Jenkins", "Monitoring"],
        "optional": ["GCP", "Azure", "Security"],
        "types": { "Docker": "Tool", "Kubernetes": "Tool", "AWS": "Tool" },
        "explanations": { "Kubernetes": "Orchestrating containerized apps at scale." }
    },
    "Cloud Engineer": {
        "core": ["AWS", "Azure", "GCP", "Networking"],
        "important": ["Serverless", "CloudFormation", "Identity Management"],
        "optional": ["Cost Optimization", "Hybrid Cloud"],
        "types": { "AWS": "Tool", "Azure": "Tool", "GCP": "Tool" },
        "explanations": { "AWS": "The world's most widely used cloud platform." }
    },
    "Business Analyst": {
        "core": ["Requirement Gathering", "SQL", "Excel", "Communication"],
        "important": ["Data Modeling", "Agile", "User Stories"],
        "optional": ["Jira", "Stakeholder Management"],
        "types": { "SQL": "Language", "Agile": "Concept", "Requirement Gathering": "Concept" },
        "explanations": { "Requirement Gathering": "Bridging business needs with technical solutions." }
    },
    "Project Coordinator": {
        "core": ["Scheduling", "Communication", "Documentation", "Agile"],
        "important": ["Risk Management", "Jira", "MS Project"],
        "optional": ["Budgeting", "Scrum Master"],
        "types": { "Agile": "Concept", "Jira": "Tool", "Documentation": "Concept" },
        "explanations": { "Agile": "Modern framework for efficient project delivery." }
    },
    "HR Executive": {
        "core": ["Recruitment", "Employee Relations", "Payroll", "Sourcing"],
        "important": ["ATS Tools", "Compliance", "Interviewing"],
        "optional": ["Training", "Conflict Resolution"],
        "types": { "Recruitment": "Concept", "ATS Tools": "Tool" },
        "explanations": { "Recruitment": "Finding and onboarding the right talent." }
    },
    "Digital Marketing": {
        "core": ["SEO", "SEM", "Content Marketing", "Social Media"],
        "important": ["Google Ads", "Analytics", "Email Marketing"],
        "optional": ["PPC", "Copywriting", "Branding"],
        "types": { "SEO": "Concept", "Google Ads": "Tool" },
        "explanations": { "SEO": "Driving organic traffic via search engine visibility." }
    },
    "Operations Analyst": {
        "core": ["Process Improvement", "SQL", "Excel", "Six Sigma"],
        "important": ["Forecasting", "KPI Tracking", "Workflow Optimization"],
        "optional": ["Lean", "Logistics"],
        "types": { "Process Improvement": "Concept", "SQL": "Language" },
        "explanations": { "Six Sigma": "Methodology for reducing process defects." }
    }
};

const SKILL_SYNONYMS = {
    "js": "JavaScript", "ts": "TypeScript", "py": "Python", "react.js": "React",
    "node.js": "Node.js", "aws": "Amazon Web Services", "ml": "Machine Learning",
    "ai": "Artificial Intelligence", "ds": "Data Science"
};

module.exports = { ROLE_SKILL_MATRIX, SKILL_SYNONYMS };
