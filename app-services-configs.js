exports.configs = {
    api_usuario: {
        http_port: 9000,
        url_neo4j_bolt: 'bolt://localhost:7687',
        neo4j_user: "neo4j",
        neo4j_password: "1234",

        core_http_server: 'http://localhost:8082',
        core_resource_uri: "/balde-evento/core-evento",

        security_api_http_server: "http://localhost",
        security_api_resource_uri: "/api/ValidarToken",
        apiGateway_apiKey: "48b37bd3-ecff-4cd9-add2-a062870e6d05"
    }
}