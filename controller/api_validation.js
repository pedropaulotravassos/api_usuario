const { toLower, toString } = require("lodash");

exports.formataStringLower = function (valor) {
    return toLower(toString(valor))
}
exports.formataStringData = function (valor) {
    const data = new Date(valor).toISOString().split('T')
    return data[0]
}
exports.aplicaMascaraEmail = function (email) {
    const emailParticionado = email.split('@')
    let emailComMascara = ''
    for (let i = 0; i < email.search('@'); i++) {
        if (i == 0) {
            emailComMascara += email.charAt(i)
        } else {
            emailComMascara += '*'
        }
    }
    return emailComMascara += emailParticionado[1]
}
exports.existeValor = function (chave, valor) {
    if (!valor) throw { msg: `Campo obrigatório não peenchido:${chave}`, status: 400 };
    return valor
}

exports.eNumero = function (chave, valor) {
    if (isNaN(valor)) throw { msg: `Valor do campo ${chave}, não é número`, status: 400 };
    return valor
}

exports.eString = function (chave, valor) {
    if (typeof (valor) === String) throw { msg: `Valor do campo ${chave}, não é string`, status: 400 };
    return valor
}

exports.eData = function (chave, valor) {
    if (typeof (valor)) throw { msg: `Valor do campo ${chave}, não é uma data válida`, status: 400 };
    return valor
}

exports.seNaoExisteSubstitui = function (valor, valorPadrao) {
    if (!valor) return valorPadrao;
    else return valor;
}

exports.validaRetornoCql = function (node, where, result) {
    if (!result || !Array.isArray(result) || !result.length) {
        throw {
            msg: `${node} com ${where} , não existe`,
            status: 400
        }
    }
    return result
}

exports.validaRetornoCqlParaEmail = function (result) {
    if (!result || !Array.isArray(result) || !result.length) {
        throw {
            msg: `Ops.. Algo deu errado, por favor tente novamente mais tarde`,
            status: 503
        }
    }
    return result
}