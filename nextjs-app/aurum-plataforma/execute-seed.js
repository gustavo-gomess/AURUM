const https = require('https');
const http = require('http');

// Função para fazer requisição POST
function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function executeSeed() {
  try {
    console.log('🌱 Iniciando seed do curso...');

    // 1. Criar usuários
    console.log('📝 Criando usuários...');
    const createUsersOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/dev/create-users',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const usersResult = await makeRequest(createUsersOptions);
    if (usersResult.status === 201) {
      console.log('✅ Usuários criados com sucesso!');
      console.log('Admin: admin@aurum.com.br / admin123');
      console.log('Estudante: estudante@teste.com / student123');
    } else {
      console.log('ℹ️ Usuários já existem ou erro:', usersResult.data);
    }

    // 2. Fazer login como admin para obter token
    console.log('🔐 Fazendo login como admin...');
    const loginOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const loginData = {
      email: 'admin@aurum.com.br',
      password: 'admin123'
    };

    const loginResult = await makeRequest(loginOptions, loginData);
    if (loginResult.status !== 200) {
      throw new Error('Falha no login: ' + JSON.stringify(loginResult.data));
    }

    const token = loginResult.data.token;
    console.log('✅ Login realizado com sucesso!');

    // 3. Executar seed do curso
    console.log('🏗️ Criando estrutura do curso...');
    const seedOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/dev/seed',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    const seedResult = await makeRequest(seedOptions);
    if (seedResult.status === 200) {
      console.log('✅ Seed executado com sucesso!');
      console.log('📚 Curso criado com:');
      console.log('  - Módulo 1: Mentalidade (15 aulas)');
      console.log('  - Aulas 2, 3 e 4 com vídeos do Vimeo');
      console.log('  - 10 módulos adicionais de exemplo');
      console.log('');
      console.log('🌐 Acesse: http://localhost:3000/cursos');
      console.log('📺 Teste os vídeos do Vimeo nas primeiras aulas!');
    } else {
      throw new Error('Falha no seed: ' + JSON.stringify(seedResult.data));
    }

  } catch (error) {
    console.error('❌ Erro durante o seed:', error.message);
    process.exit(1);
  }
}

executeSeed();
