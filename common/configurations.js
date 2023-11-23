module.exports = {
    server: {
        port: process.env.SERVER_PORT,
        requestLimit: process.env.SERVER_REQUEST_LIMIT || '1mb',
        timeout: parseInt(process.env.SERVER_REQUEST_TIMEOUT || 300000),
        log: {
            isEnabled: process.env.SERVER_LOG || true,
            msg: process.env.SERVER_LOG_MSG,
            transport: {
                console: process.env.SERVER_LOG_TRASNPORT_CONSOLE || '{}',
                file: process.env.SERVER_LOG_TRASNPORT_FILE,
                http: process.env.SERVER_LOG_TRASNPORT_HTTP,
                stream: process.env.SERVER_LOG_TRASNPORT_STREAM,
            }
        },
        cors: process.env.SERVER_CORS
    },
    app: {
        title: process.env.APP_TITLE,
        description: process.env.APP_DESCRIPTION,
        version: process.env.APP_VERSION
    }
}