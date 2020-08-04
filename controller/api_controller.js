const { Usuario } = require('./api_model');

exports.criaUsuario = async function (req, res, next) {
    try {
        const payLoad = typeof (req.body) == 'string' ? JSON.parse(req.body) : req.body

        const result = await Usuario.criar(payLoad)

        res.send(result);

    } catch (err) {
        tratativaErro(res, err);
        return next(err)
    }

    return next()
}
exports.listaUsuarios = async function (req, res, next) {
    try {
        const result = await Usuario.listar()

        res.send(result);

    } catch (err) {
        tratativaErro(res, err);
        return next(err)
    }

    return next()
}
exports.listaUsuarioPorId = async function (req, res, next) {
    try {
        const result = await Usuario.listarPorId(req.params.id)

        res.send(result);

    } catch (err) {
        tratativaErro(res, err);
        return next(err)
    }

    return next()
}
exports.listaUsuarioPorEmail = async function (req, res, next) {
    try {
        const payLoad = typeof (req.body) == 'string' ? JSON.parse(req.body) : req.body

        const result = await Usuario.listarPorEmail(payLoad)

        res.send(result);

    } catch (err) {
        tratativaErro(res, err);
        return next(err)
    }

    return next()
}
exports.editarUsuario = async function (req, res, next) {
    try {
        const payLoad = typeof (req.body) == 'string' ? JSON.parse(req.body) : req.body

        const result = await Usuario.editar(req.params.id, payLoad)

        res.send(result);

    } catch (err) {
        tratativaErro(res, err);
        return next(err)
    }

    return next()
}
exports.excluirUsuario = async function (req, res, next) {
    try {
        const result = await Usuario.excluir(req.params.id)

        res.send(result);

    } catch (err) {
        tratativaErro(res, err);
        return next(err)
    }

    return next()
}
exports.ativarUsuario = async function (req, res, next) {
    try {
        const result = await Usuario.ativar(req.params.id)

        res.send(result);

    } catch (err) {
        tratativaErro(res, err);
        return next(err)
    }

    return next()
}

//############## SENHA ##############//
exports.alterarSenhaUsuario = async function (req, res, next) {
    try {
        const payLoad = typeof (req.body) == 'string' ? JSON.parse(req.body) : req.body

        const result = await Usuario.alterarSenha(req.params.id, payLoad)

        res.send(result);

    } catch (err) {
        tratativaErro(res, err);
        return next(err)
    }

    return next()
}
exports.resetarSenhaUsuario = async function (req, res, next) {
    try {
        const payLoad = typeof (req.body) == 'string' ? JSON.parse(req.body) : req.body

        const result = await Usuario.resetSenha(payLoad)

        res.send(result);

    } catch (err) {
        tratativaErro(res, err);
        return next(err)
    }

    return next()
}


exports.teste = async function (req, res, next) {
    try {
        // const payLoad = typeof (req.body) == 'string' ? JSON.parse(req.body) : req.body

        const result = await Usuario.teste()

        res.send(result);

    } catch (err) {
        tratativaErro(res, err);
        return next(err)
    }

    return next()
}



function tratativaErro(res, err) {
    if (err.status) {
        res.status(err.status);
    }
    else {
        res.status(500);
    }
    if (err.msg) {
        console.log(err.msg);
        res.send(err.msg);
    } else if (err.message) {
        console.log(err.message);
        res.send(err.message);
    }
    else {
        console.log(err);
        res.send(err);
    }
}