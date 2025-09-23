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

async function clearCacheAndVerify() {
  try {
    console.log('🧹 Limpando cache e verificando aulas...');

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

    // 2. Buscar curso para obter ID
    console.log('🔍 Buscando curso...');
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
    if (courses.length === 0) {
      console.log('❌ Nenhum curso encontrado');
      return;
    }

    const course = courses[0];
    console.log('✅ Curso encontrado:', course.title);
    console.log('🎯 ID do curso:', course.id);

    // 3. Fazer uma requisição que força a atualização do cache
    console.log('🔄 Forçando atualização do cache...');
    
    // Fazer uma requisição PUT para o curso (isso invalida o cache)
    const updateResult = await makeRequest(`http://localhost:3000/api/courses/${course.id}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, {
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      price: course.price
    });

    if (updateResult.status === 200) {
      console.log('✅ Cache invalidado com sucesso!');
    } else {
      console.log('⚠️ Erro ao invalidar cache:', updateResult.status);
    }

    // 4. Aguardar um pouco para o cache ser limpo
    console.log('⏳ Aguardando limpeza do cache...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 5. Verificar resultado final
    console.log('📊 Verificando resultado final...');
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
        console.log('🌐 Acesse: http://localhost:3000/cursos');
      } else {
        console.log('\n❌ Ainda não há aulas visíveis. Pode ser necessário reiniciar o servidor.');
      }
    } else {
      console.log('❌ Erro ao verificar resultado final:', finalResult.status, finalResult.data);
    }

  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

clearCacheAndVerify();
