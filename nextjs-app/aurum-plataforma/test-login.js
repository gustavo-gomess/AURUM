const fetch = require('node-fetch');

async function testLogin() {
    try {
        console.log('🧪 Testando login...');
        
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'admin@aurum.com.br',
                password: 'admin123'
            })
        });

        console.log('Status:', response.status);
        const data = await response.json();
        console.log('Response:', data);

        if (data.token) {
            console.log('✅ Login realizado com sucesso!');
            console.log('Token:', data.token.substring(0, 20) + '...');
        } else {
            console.log('❌ Erro no login:', data.error || 'Erro desconhecido');
        }
    } catch (error) {
        console.error('❌ Erro de conexão:', error.message);
    }
}

testLogin();
