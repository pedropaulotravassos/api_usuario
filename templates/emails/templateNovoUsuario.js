exports.geraHtmlNovoUsuario = function (usuario, urlSite = 'http://') {
    const htmlEmailNovoUsuario = `
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email de Reset de Senha</title>
    <style>
        * {
            font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
            color: #000000c9;
            margin: 0px;
            padding: 0px;

        }

        .corpo {
            background: #d2ffa6e8;
            padding-top: 5%;
            border: solid 5px gray;
            margin: 1% 5%;
            padding: 5% 5%;
            width: 65%

        }

        .container {
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: 1fr;
            justify-items: center;
            margin-top: 2%;
            margin-bottom: 8%;
        }

        .logo {
            display: grid;
            justify-items: center;
            margin-top: 2%;
        }

        .logo img {
            width: 55%;
            margin-top: 0px;
            padding-top: 0px;
            margin-left: 25%;
        }

        .mensagem p {
            margin: 0px;
            font-size: 1.3rem;
            margin-bottom: 2%;
        }

        .container h2 {
            font-size: 1.6rem;
        }

        .mensagem div {
            margin-top: 7%
        }

        .link {
            text-decoration: none;
            border: solid 1px #DB8425;
            border-radius: 10px;
            background-color: #FFD4A6;
            padding: 2%;
            width: 95%;
            color: #000000c9;
        }

        .link:hover {
            background-color: #ffbc75;
            color: #000000c9;
        }

        .link a {
            text-decoration: none;
            color: #000000c9;
            font-size: 1.4rem;
            text-align: center;
            margin-left: 5%
        }

        .link a :hover {
            text-decoration: none;
            color: #000000c9;
        }

        .mensagem {
            display: grid;
            align-content: center;
            justify-items: center;
            margin: 0px 5%;
        }

        @media (max-width: 885px) {
            .container h1 {
                margin-left: 5%;
                font-size: 1.5rem;
            }

            .mensagem p {
                padding: 5%;
            }
        }
    </style>
</head>
<body class="corpo">
    <div class="logo">
        <img src="cid:logo@logo" alt="logo Dona Fruta">
    </div>
    <div class="container">
        <div class="mensagem">
            <h1>Bem vindo à Dona Fruta!!!</h1>
            <div>
                <p>Obrigado ${usuario}, por criar uma conta em nossa loja!</p>
                <p>Lembrando que temos vários produtos frequinhos só para você!</p>
            </div>
            <div class="link"><a href="${urlSite}" target="_blank">Clique aqui e confira nossos produtos</a></div>
        </div>
    </div>
</body>
</html>
`
    return htmlEmailNovoUsuario
}