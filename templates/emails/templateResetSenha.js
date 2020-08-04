exports.geraHtmlResetSenha = function (novaSenha) {

    const htmlEmailResetSenha = `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email de Reset de Senha</title>
        <style>
            * {
                box-sizing: border-box;
                font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
                color: #000000c9;
            }
            .corpo {  
                background: rgba(210, 255, 166, 0.911);              
                display: grid;
                flex-direction: column;
                align-items: center;
                grid-template-columns: 1;
                grid-template-rows: 3;
                grid-template-areas:
                    "logo"
                    "msg"
                    "novaSenha";
            }
            .container {
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .container img {
                width: 35%;
            }
            .container p {
                margin: 0px;
                font-size: 0.9rem;
                margin-bottom: 95px;
            }
            .container h2 {
                font-size: 1.6rem;
            }
            .container div{
                margin-top: 7%
            }
            @media (max-width: 885px) {
                .container h1 {
                    margin-left: 5%;
                    font-size: 1.5rem;
                }
                .container h2 {
                    margin-left: 5%;
                    font-size: 1.3rem;
                }
            }
        </style>
    </head>
    <body class="corpo">
        <div class="container">
            <img src="cid:logo@logo" alt="logo Dona Fruta">
            <div>
            <h1>Seu reset de senha, foi realizado com sucesso!</h1>
            <h2>
                Sua nova senha é: ${novaSenha}
            </h2>
            <p>
                Dica: Lembre-se de troca-la assim que realizar o login
            </p>
            <div>
        </div>
    </body>
    </html>`


    return htmlEmailResetSenha
}