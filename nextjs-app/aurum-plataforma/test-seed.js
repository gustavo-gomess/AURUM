console.log('🌱 Testando seed...');

// Simular a criação do curso diretamente
fetch('http://localhost:3000/api/dev/create-users', {
  method: 'POST'
})
.then(res => res.json())
.then(data => {
  console.log('✅ Usuários:', data);
  
  // Login como admin
  return fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@aurum.com.br',
      password: 'admin123'
    })
  });
})
.then(res => res.json())
.then(data => {
  console.log('🔐 Login realizado');
  const token = data.token;
  
  // Executar seed
  return fetch('http://localhost:3000/api/dev/seed', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
})
.then(res => res.json())
.then(data => {
  console.log('🎯 Seed executado:', data);
  console.log('🌐 Acesse: http://localhost:3000/cursos');
})
.catch(err => console.error('❌ Erro:', err));
