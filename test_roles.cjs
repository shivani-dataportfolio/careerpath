const axios = require('axios');

async function verifyRoles() {
    try {
        console.log('Logging in...');
        const loginRes = await axios.post('http://localhost:8000/api/token/', {
            email: 'john@example.com',
            password: 'password123'
        });
        const token = loginRes.data.access;
        console.log('Token obtained.');

        console.log('Fetching recommendations...');
        const recRes = await axios.get('http://localhost:8000/api/recommendations/', {
            headers: { Authorization: `Bearer ${token}` }
        });

        const roles = recRes.data;
        console.log(`Total roles found: ${roles.length}`);

        const nonTechRoles = roles.filter(r => r.category === 'Non-Technical');
        console.log(`Non-Technical roles count: ${nonTechRoles.length}`);

        nonTechRoles.forEach(r => {
            console.log(`- ${r.title} (${r.category})`);
            console.log(`  Skills: ${r.required_skills.map(s => s.name).join(', ')}`);
        });

        if (roles.length === 15 && nonTechRoles.length === 5) {
            console.log('\nVERIFICATION SUCCESSFUL: 15 roles total, 5 non-technical roles found.');
        } else {
            console.log('\nVERIFICATION FAILED: Unexpected role counts.');
        }
    } catch (error) {
        console.error('Error during verification:', error.response ? error.response.data : error.message);
    }
}

verifyRoles();
