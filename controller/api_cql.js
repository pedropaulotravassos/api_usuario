const _ = require('lodash')

exports.cql = {
    criaUsuario(user) {
        const params = { ...user }
        const cypher = `
            create(u:Usuario {
                nome: $nome,
                email: $email,
                cel: $cel,
                dataNascimento: $dataNascimento,
                senha: $senha,
                ativo: true
            })
            RETURN 
                id(u) as id,
                u.nome as nome,
                u.email as email,
                u.cel as cel,
                u.dataNascimento as dataNascimento,
                u.senha as senha
                
        `
        return { cypher, params }
    },
    listarUsuarios() {
        const params = {
        }
        const cypher = `
            MATCH (u:Usuario) 
            WHERE u.ativo = true 
            OPTIONAL MATCH (u)-[:POSSUI]->(end:Endereco)
            RETURN 
                id(u) as id, 
                u.nome as nome, 
                u.email as email,
                u.cel as cel,
                u.dataNascimento as dataNascimento,
                end.cep as cep,
                end.logradouro as logradouro,
                end.complemento as complemento,
                end.bairro as bairro,
                end.localidade as cidade,
                end.uf as uf
        `
        return { cypher, params }
    },
    listarUsuarioByEmail(email) {
        const params = { email }
        const cypher = `
            MATCH (u:Usuario) 
            WHERE u.email = $email

            OPTIONAL MATCH (u)-[:POSSUI]->(end:Endereco)
            
            RETURN 
                id(u) as id, 
                u.ativo as ativo,
                u.nome as nome, 
                u.email as email,
                u.cel as cel,
                u.dataNascimento as dataNascimento,
                id(end) as idEndereco,
                end.cep as cep,
                end.logradouro as logradouro,
                end.complemento as complemento,
                end.bairro as bairro,
                end.localidade as cidade,
                end.uf as uf
        `

        return { cypher, params }
    },
    listarUsuarioPorId(id) {
        const params = { id }
        const cypher = `
            MATCH (u:Usuario) 
            WHERE  id(u) = $id
            OPTIONAL MATCH (u)-[:POSSUI]->(end:Endereco) 
            RETURN 
                id(u) as id,
                u.nome as nome, 
                u.email as email,
                u.cel as cel,
                u.dataNascimento as dataNascimento,
                u.senha as senha,
                u.ativo as ativo,
                end as endereco
        `
        return { cypher, params }
    },
    listarUsuariosExcluidos() {
        const params = {
        }
        const cypher = `
            MATCH (u:Usuario) 
            OPTIONAL MATCH (u)-[:POSSUI]->(end:Endereco)
            WHERE u.ativo = false 
            RETURN 
                id(u) as id, 
                u.nome as nome, 
                u.email as email,
                u.cel as cel,
                u.dataNascimento as dataNascimento,
                end.cep as cep,
                end.logradouro as logradouro,
                end.complemento as complemento,
                end.bairro as bairro,
                end.localidade as cidade,
                end.uf as uf
        `
        return { cypher, params }
    },
    editarUsuario(user) {
        const params = { ...user }
        const cypher = `
            MATCH (u:Usuario)
            WHERE id(u) = $id
            SET           
                u.nome = $nome,
                u.email = $email,
                u.cel = $cel,
                u.dataNascimento = $dataNascimento
            RETURN                 
                id(u) as id,
                count(u) as itensAlterados
        `
        return { cypher, params }
    },
    excluirUsuario(id) {
        const params = { id }
        const cypher = `
            MATCH (u:Usuario)
            WHERE id(u) = $id
            SET u.ativo = false
            RETURN 
                count(u) as usuariosExcluidos 
        `
        return { cypher, params }
    },
    ativarUsuario(id) {
        const params = { id }
        const cypher = `
            MATCH (u:Usuario)
            WHERE id(u) = $id
            SET u.ativo = true
            RETURN 
                count(u) as usuariosReativados 
        `
        return { cypher, params }
    },
    salvarSenha(id, senha) {
        const params = { id, senha }
        const cypher = `
        MATCH (u:Usuario)
        WHERE id(u) = $id
        SET u.senha = $senha
        RETURN count(u) as itensAlterados
        `

        return { cypher, params }
    },
    salvarEndereco(idUsuario, endereco) {
        const params = { idUsuario, ...endereco }
        const cypher = `
        MATCH (user:Usuario)
        WHERE id(user) = $idUsuario
        
        MERGE (end:Endereco)<-[:POSSUI]-(user)
        ON CREATE SET 
            end.cep = $cep,
            end.logradouro = $logradouro,
            end.complemento = $complemento,
            end.bairro = $bairro,
            end.localidade = $localidade,
            end.uf = $uf,
            end.unidade = $unidade,
            end.ibge = $ibge,
            end.gia = $gia
        ON MATCH SET
            end.cep = $cep,
            end.logradouro = $logradouro,
            end.complemento = $complemento,
            end.bairro = $bairro,
            end.localidade = $localidade,
            end.uf = $uf,
            end.unidade = $unidade,
            end.ibge = $ibge,
            end.gia = $gia
        RETURN id(end) as id
        `
        return { cypher, params }

    }
}