const queries = require('./api_cql.js')
const config = require('./api_config.js')
const { executeCypherAsync, transporterConfigs } = config
const valida = require('./api_validation')
const bcrypt = require('bcrypt-nodejs')
const axios = require('axios')
const nodemailer = require('nodemailer')
const { geraHtmlResetSenha } = require('../templates/emails/templateResetSenha.js')
const { geraHtmlNovoUsuario } = require('../templates/emails/templateNovoUsuario.js')
const { urlHomeSite } = require('./api_config.js')



exports.Usuario = {
    async criar(payLoad) {
        if (payLoad.senha != payLoad.confirmarSenha)
            throw { msg: 'senhas não conferem', status: 400 };
        const user = buildUsuario(payLoad)
        user.senha = encryptPassword(payLoad.senha)

        const endereco = await this.buscaEndereco(user.endereco.cep)


        const cqlUser = queries.cql.criaUsuario(user)
        let resultUser = await executeCypherAsync(cqlUser)
        valida.validaRetornoCqlParaEmail(resultUser)
        resultUser = resultUser.reduce(e => e)


        endereco.complemento = user.endereco.complemento

        const cqlEndereco = queries.cql.salvarEndereco(resultUser.id, endereco)
        let resultEnd = await executeCypherAsync(cqlEndereco)
        valida.validaRetornoCqlParaEmail(resultEnd)
        resultEnd = resultEnd.reduce(e => e)

        const transporter = nodemailer.createTransport(transporterConfigs)
        const enviaEmail = await transporter.sendMail({
            from: 'NãoRespondaDonaFruta <pim3semestre2016@gmail.com>',
            to: resultUser.email,
            subject: 'Bem vindo a Dona fruta',
            text: `Bem vindo!!!`,
            html: geraHtmlNovoUsuario(resultUser.nome, urlHomeSite),
            attachments: [{
                filename: 'logo.png',
                path: 'assets/image/logo.png',
                cid: 'logo@logo'
            }]
        })
        valida.existeValor('Envio do email', enviaEmail)
        return {
            idUsuario: resultUser.id,
            idEndereco: resultEnd.id
        }
    },

    async listar() {
        const cql = queries.cql.listarUsuarios()

        const result = await executeCypherAsync(cql)

        return result

    },

    async listarPorEmail(payLoad) {
        const email = valida.formataStringLower(valida.existeValor('email', payLoad.email))

        const cql = queries.cql.listarUsuarioByEmail(email)

        const result = await executeCypherAsync(cql)

        return result

    },

    async listarPorId(id) {
        const idUser = valida.eNumero('listar Por ID', parseInt(id))

        const cql = queries.cql.listarUsuarioPorId(idUser)

        const result = await executeCypherAsync(cql)

        return result

    },

    async editar(id, payLoad) {
        valida.eNumero('id editar', parseInt(id))
        let userDB = await this.listarPorId(id)
        if (!userDB || !Array.isArray(userDB) || !userDB.length) {
            throw {
                msg: `Usuário do id ${id},
             não existe`, status: 404
            };
        }
        userDB = userDB.reduce(e => e)
        userDB.endereco.cep = userDB.endereco.cep.replace('-', '')

        const user = buildUsuario(payLoad, userDB)

        const cqlUser = queries.cql.editarUsuario(user)

        const complemento =
            user.endereco.complemento ==
                userDB.endereco.complemento ? userDB.endereco.complemento : user.endereco.complemento


        if (userDB.endereco.cep != user.endereco.cep) {
            user.endereco = await this.buscaEndereco(user.endereco.cep)
            user.endereco.complemento = complemento
        } else {
            user.endereco.logradouro = userDB.endereco.logradouro
            user.endereco.bairro = userDB.endereco.bairro
            user.endereco.uf = userDB.endereco.uf
            user.endereco.localidade = userDB.endereco.localidade
            user.endereco.unidade = userDB.endereco.unidade
            user.endereco.ibge = userDB.endereco.ibge
            user.endereco.gia = userDB.endereco.gia
        }

        const cqlEndereco = queries.cql.salvarEndereco(user.id, user.endereco)

        const resultUser = await executeCypherAsync(cqlUser)
        const resultEndereco = await executeCypherAsync(cqlEndereco)

        return {
            usuario: resultUser.reduce(e => e),
            endereco: resultEndereco.reduce(e => e)
        }

    },

    async excluir(id) {
        const userId = valida.eNumero('id(excluir)', parseInt(id))
        const userPorID = await this.listarPorId(userId)
        if (!userPorID || !Array.isArray(userPorID) || !userPorID.length) {
            throw {
                msg: `Usuário do id ${id},
             não existe`, status: 404
            };
        }

        const cql = queries.cql.excluirUsuario(userId)

        const result = await executeCypherAsync(cql)

        return result

    },

    async ativar(id) {
        const userId = valida.eNumero('id(Ativar)', parseInt(id))
        const userPorID = await this.listarPorId(userId)
        if (!userPorID || !Array.isArray(userPorID) || !userPorID.length) {
            throw {
                msg: `Usuário do id ${id},
             não existe`, status: 404
            };
        }

        const cql = queries.cql.ativarUsuario(userId)

        const result = await executeCypherAsync(cql)

        return result

    },

    async buscaEndereco(cep) {
        valida.eString('cep(buscaCep)', cep)
        const configCep = {
            method: 'get',
            url: `https://viacep.com.br/ws/${cep}/json/`,
            headers: {}
        }
        const result = await axios(configCep)
            .then(function (response) {
                return response.data
            })
            .catch(function (err) {
                throw (err)
            });
        result.cep = result.cep.replace('-', '')
        return result
    },

    async alterarSenha(id, payLoad) {
        const senha = buildSenha(id, payLoad)
        let user = await this.listarPorId(senha.idUsuario)
        user = valida.validaRetornoCql('Usuário', `id: ${id}`, user).reduce(e => e)
        const eIgual = bcrypt.compareSync(senha.senha, user.senha)

        if (!eIgual)
            throw { msg: 'Senha incorreta', status: 400 };
        if (senha.novaSenha != senha.confirmarSenha)
            throw { msg: 'nova senha difere da confirmação de senha', status: 400 };

        const novaSenha = encryptPassword(senha.novaSenha)
        const cql = queries.cql.salvarSenha(user.id, novaSenha)
        const result = await executeCypherAsync(cql)
        return result
    },

    async resetSenha(payLoad) {
        valida.existeValor(' payLoad reset senha', payLoad)
        let user = await this.listarPorEmail(payLoad)
        user = valida.validaRetornoCql('usuario', 'email', user).reduce(e => e)

        const novaSenha = Math.random().toString(36).substr(2, 8)
        const novaSenhaEncrypt = encryptPassword(novaSenha)
        const cql = queries.cql.salvarSenha(parseInt(user.id), novaSenhaEncrypt)

        const transporter = nodemailer.createTransport(transporterConfigs)
        const enviaEmail = await transporter.sendMail({
            from: 'NãoRespondaDonaFruta <pim3semestre2016@gmail.com>',
            to: user.email,
            subject: 'Esqueci minha senha, reset de senha',
            text: `segue o reset de senha`,
            html: geraHtmlResetSenha(novaSenha),
            attachments: [{
                filename: 'logo.png',
                path: 'assets/image/logo.png',
                cid: 'logo@logo'
            }]
        })
        if (!enviaEmail) {
            throw { msg: `Falha ao encaminhar mensagem, por favor verifique o e-mail informado` }
        }

        const result = await executeCypherAsync(cql)
        valida.validaRetornoCqlParaEmail(result)
        const mascaraEmail = valida.aplicaMascaraEmail(user.email)

        return `A nova senha do usuário foi enviada para o e-mail ${mascaraEmail}`
    }
}


const encryptPassword = password => {
    const salt = bcrypt.genSaltSync(1)
    return bcrypt.hashSync(password, salt)
}

function buildSenha(id, payLoad) {
    return {
        idUsuario: valida.eNumero('id(payLoad)', valida.existeValor('id(payLoad)', id)),
        senha: valida.existeValor('senha(payLoad)', payLoad.senha),
        novaSenha: valida.existeValor('senha(payLoad)', payLoad.novaSenha),
        confirmarSenha: valida.existeValor('confirmarSenha', payLoad.confirmarSenha)
    }
}

function buildUsuario(payLoad, user) {
    if (user) {
        return {
            id: valida.seNaoExisteSubstitui(payLoad.id, user.id),
            nome:
                valida.eString('nome(payLoad)',
                    valida.seNaoExisteSubstitui(payLoad.nome, user.nome)),
            email:
                valida.formataStringLower(
                    valida.eString('email(payLoad)',
                        valida.seNaoExisteSubstitui(payLoad.email, user.email))),
            cel:
                valida.eNumero("cel(payLoad)",
                    parseInt(valida.seNaoExisteSubstitui(payLoad.cel, user.cel))),
            dataNascimento:
                valida.formataStringData(
                    valida.seNaoExisteSubstitui(payLoad.dataNascimento, user.dataNascimento)),
            endereco: {
                cep: valida.seNaoExisteSubstitui(payLoad.endereco.cep, user.endereco.cep),
                complemento: valida.seNaoExisteSubstitui(payLoad.endereco.complemento, user.endereco.complemento)
            }
        }

    } else {
        return {
            nome: valida.existeValor('nome', payLoad.nome),
            email: valida.formataStringLower(valida.existeValor('email', payLoad.email)),
            cel: valida.eNumero("cel", parseInt(valida.existeValor('cel', payLoad.cel))),
            dataNascimento: valida.existeValor('data nascimento', valida.formataStringData(payLoad.dataNascimento)),
            endereco: valida.existeValor("endereco", payLoad.endereco)
        }
    }
}
