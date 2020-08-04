var api_log = require('./api_log').log
var api_controller = require('./api_controller')
var restify = require('restify')
const corsMiddleware = require('restify-cors-middleware')
const cors = corsMiddleware({
    origins: ['*'],
    allowHeaders: ['*']
})


// CONFIG AXIOS GLOBALMENTE
const https = require('https')
const axios = require('axios')
axios.interceptors.request.use(function (config) {
    config.httpsAgent = new https.Agent({ rejectUnauthorized: false })
    return config;
});

var server = restify.createServer()

server.pre(cors.preflight)
server.use(cors.actual)
server.use(api_log)
server.use(restify.plugins.fullResponse())
server.use(restify.plugins.bodyParser())

//estudar o que é uma rest api 
server.post('/usuario/criar', api_controller.criaUsuario)
server.get('/usuario/listar', api_controller.listaUsuarios)
server.post('/usuario/listar-por-email', api_controller.listaUsuarioPorEmail)
server.get('/usuario/listar/:id', api_controller.listaUsuarioPorId)
server.put('/usuario/editar/:id', api_controller.editarUsuario)
server.del('/usuario/excluir/:id', api_controller.excluirUsuario)
server.put('/usuario/ativar/:id', api_controller.ativarUsuario)
server.put('/usuario/senha/:id', api_controller.alterarSenhaUsuario)
server.post('/usuario/resetar-senha', api_controller.resetarSenhaUsuario)
server.post('/usuario/teste', api_controller.teste)

exports.server = server