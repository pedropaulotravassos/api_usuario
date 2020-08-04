var appConfigs = require('./app-services-configs')
var api = require('./controller')

async function startup() {
  console.log('Iniciando a aplicação');

  try {
    console.log('Iniciando o módulo web server');

    api.server.listen(appConfigs.configs.api_usuario.http_port, function() {
      console.log('%s módulo iniciado em %s', api.server.name, api.server.url)
    })
    
  } catch (err) {
    console.log('Erro ao iniciar api.');
    console.error(err);
    process.exit(1); 
  }
}

startup()