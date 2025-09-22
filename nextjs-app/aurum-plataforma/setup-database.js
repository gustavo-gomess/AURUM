#!/usr/bin/env node

/**
 * Script para configurar o banco de dados PostgreSQL e criar usuários iniciais
 * Execute: node setup-database.js
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
  const prisma = new PrismaClient();

  try {
    console.log('🚀 Configurando banco de dados PostgreSQL...');

    // Verificar conexão
    await prisma.$connect();
    console.log('✅ Conexão com PostgreSQL estabelecida!');

    // Criar usuário admin
    console.log('\n👤 Criando usuários...');
    
    const adminPassword = await bcrypt.hash('admin123', 12);
    let adminUser;
    
    try {
      adminUser = await prisma.user.create({
        data: {
          name: 'Administrador AURUM',
          email: 'admin@aurum.com.br',
          password: adminPassword,
          role: 'ADMIN',
        }
      });
      console.log('✅ Usuário admin criado:', adminUser.email);
    } catch (error) {
      if (error.code === 'P2002') {
        console.log('ℹ️ Usuário admin já existe: admin@aurum.com.br');
      } else {
        throw error;
      }
    }

    // Criar usuário estudante
    const studentPassword = await bcrypt.hash('student123', 12);
    let studentUser;
    
    try {
      studentUser = await prisma.user.create({
        data: {
          name: 'Estudante Teste',
          email: 'estudante@teste.com',
          password: studentPassword,
          role: 'STUDENT',
        }
      });
      console.log('✅ Usuário estudante criado:', studentUser.email);
    } catch (error) {
      if (error.code === 'P2002') {
        console.log('ℹ️ Usuário estudante já existe: estudante@teste.com');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 Configuração concluída com sucesso!');
    console.log('\n📋 Credenciais de acesso:');
    console.log('┌─────────────┬─────────────────────┬─────────────┐');
    console.log('│ Tipo        │ Email               │ Senha       │');
    console.log('├─────────────┼─────────────────────┼─────────────┤');
    console.log('│ Admin       │ admin@aurum.com.br  │ admin123    │');
    console.log('│ Estudante   │ estudante@teste.com │ student123  │');
    console.log('└─────────────┴─────────────────────┴─────────────┘');
    
    console.log('\n🚀 Próximos passos:');
    console.log('1. Configurar .env.local com DATABASE_URL');
    console.log('2. Executar: npm run dev');
    console.log('3. Testar login em: http://localhost:3000/login');
    console.log('4. Criar dados de seed em: POST /api/dev/seed (com token admin)');

  } catch (error) {
    console.error('❌ Erro na configuração:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  setupDatabase();
}

module.exports = { setupDatabase };
