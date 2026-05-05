const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    role: String,
    match_score: Number,
    matched_skills: [mongoose.Schema.Types.Mixed],
    missing_skills: [mongoose.Schema.Types.Mixed],
    total_skills: Number,
    matched_count: Number,
    reason: String,
    roleId: String
});

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        // Optional because Firebase social logins won't have a local password initially
    },
    candidate: {
        location: String,
        experience: String,
        education: String,
        skills: [String]
    },
    dashboard: {
        skills_identified: Number,
        last_analysis: String,
        top_role: String,
        is_locked: Boolean,
        top_roles: [RoleSchema]
    },
    roles: [RoleSchema],
    skill_gap_analysis: {
        missing_skills: [mongoose.Schema.Types.Mixed],
        learning_focus: String
    },
    job_market: {
        salary_range: String,
        demand: String,
        platforms: [String]
    },
    learning_path: {
        coursera: [{ title: String, url: String }],
        udemy: [{ title: String, url: String }],
        edx: [{ title: String, url: String }]
    },
    selected_role_id: {
        type: String
    },
    last_analysis: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
