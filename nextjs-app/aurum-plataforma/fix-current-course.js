const https = require('https');
const http = require('http');

function makeRequest(url, options, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    if (data) {
      const jsonData = JSON.stringify(data);
      requestOptions.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }

    const req = client.request(requestOptions, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsedData = responseData ? JSON.parse(responseData) : {};
          resolve({
            status: res.statusCode,
            data: parsedData,
            headers: res.headers
          });
        } catch (error) {
          resolve({
            status: res.statusCode,
            data: responseData,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function fixCurrentCourse() {
  try {
    console.log('🔧 Corrigindo curso atual...');

    // 1. Fazer login como admin
    console.log('🔐 Fazendo login...');
    const loginResult = await makeRequest('http://localhost:3000/api/auth/login/', {
      method: 'POST'
    }, {
      email: 'admin@aurum.com.br',
      password: 'admin123'
    });

    if (loginResult.status !== 200) {
      console.log('❌ Erro no login:', loginResult.status, loginResult.data);
      return;
    }

    const token = loginResult.data.token;
    console.log('✅ Login realizado com sucesso!');

    // 2. Buscar todos os cursos
    console.log('🔍 Buscando todos os cursos...');
    const coursesResult = await makeRequest('http://localhost:3000/api/courses/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (coursesResult.status !== 200) {
      console.log('❌ Erro ao buscar cursos:', coursesResult.status, coursesResult.data);
      return;
    }

    const courses = coursesResult.data.courses || [];
    console.log(`📚 Encontrados ${courses.length} cursos:`);
    courses.forEach((course, index) => {
      console.log(`  ${index + 1}. ${course.title} (ID: ${course.id})`);
    });

    if (courses.length === 0) {
      console.log('❌ Nenhum curso encontrado');
      return;
    }

    // 3. Usar o primeiro curso (mais recente)
    const course = courses[0];
    console.log(`\n🎯 Trabalhando com: ${course.title}`);
    console.log(`🆔 ID: ${course.id}`);

    // 4. Verificar módulos do curso
    console.log('\n📚 Verificando módulos...');
    const courseResult = await makeRequest(`http://localhost:3000/api/courses/${course.id}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      }
    });

    if (courseResult.status !== 200) {
      console.log('❌ Erro ao buscar curso:', courseResult.status, courseResult.data);
      return;
    }

    const courseData = courseResult.data.course;
    console.log(`📚 Módulos encontrados: ${courseData.modules.length}`);
    
    courseData.modules.forEach((module, index) => {
      console.log(`  ${index + 1}. ${module.title} (${module.lessons.length} aulas)`);
    });

    // 5. Se não há módulos ou aulas, criar
    if (courseData.modules.length === 0 || courseData.modules.every(m => m.lessons.length === 0)) {
      console.log('\n🏗️ Criando módulo e aulas...');
      
      // Criar módulo
      const moduleResult = await makeRequest('http://localhost:3000/api/modules/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }, {
        title: 'Módulo 1 - Mentalidade Financeira',
        description: 'Fundamentos da mentalidade financeira',
        order: 0,
        courseId: course.id
      });

      if (moduleResult.status !== 201) {
        console.log('❌ Erro ao criar módulo:', moduleResult.status, moduleResult.data);
        return;
      }

      const module = moduleResult.data.data;
      console.log('✅ Módulo criado:', module.title);

      // Criar aulas
      const lessons = [
        'AULA 01 LIMPAR O TERRENO',
        'AULA 02 MENTALIDADE DE ABUNDÂNCIA X MENTALIDADE DE ESCASSEZ',
        'AULA 03 CRENÇAS LIMITANTES SOBRE VOCÊ',
        'AULA 04 CRENÇAS LIMITANTES EM RELAÇÃO AO DINHEIRO',
        'AULA 05 O PODER DO AMBIENTE E DAS PESSOAS AO REDOR'
      ];

      console.log('\n📝 Criando aulas...');
      for (let i = 0; i < lessons.length; i++) {
        const lessonResult = await makeRequest('http://localhost:3000/api/lessons/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }, {
          title: lessons[i],
          description: `Descrição da ${lessons[i]}`,
          vimeoVideoId: '1120965691',
          order: i,
          moduleId: module.id,
          courseId: course.id,
          tasks: []
        });

        if (lessonResult.status === 201) {
          console.log(`✅ Aula criada: ${lessons[i]}`);
        } else {
          console.log(`⚠️ Aula já existe ou erro: ${lessons[i]} (${lessonResult.status})`);
        }
      }

      console.log('\n🎉 Aulas criadas com sucesso!');
    } else {
      console.log('\n✅ Módulos e aulas já existem');
    }

    // 6. Verificar resultado final
    console.log('\n📊 Verificando resultado final...');
    const finalResult = await makeRequest(`http://localhost:3000/api/courses/${course.id}/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      }
    });

    if (finalResult.status === 200) {
      const finalCourse = finalResult.data.course;
      console.log(`\n📚 Status final - ${finalCourse.modules.length} módulos:`);
      finalCourse.modules.forEach(module => {
        console.log(`  - ${module.title}: ${module.lessons.length} aulas`);
        module.lessons.forEach(lesson => {
          console.log(`    • ${lesson.title} (ID: ${lesson.vimeoVideoId})`);
        });
      });

      if (finalCourse.modules.some(m => m.lessons.length > 0)) {
        console.log('\n🎉 SUCESSO! As aulas estão visíveis agora!');
        console.log(`🌐 Acesse: http://localhost:3000/cursos/${course.id}`);
        console.log(`👤 Login: admin@aurum.com.br / admin123`);
      } else {
        console.log('\n❌ Ainda não há aulas visíveis.');
      }
    } else {
      console.log('❌ Erro ao verificar resultado final:', finalResult.status, finalResult.data);
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

fixCurrentCourse();
