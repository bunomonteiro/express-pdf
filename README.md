# PDF Generator Service

This PDF service supports **HTML/Handlebars** template engine.

To run your PDF Docker image use the docker run command as follows:

```bash
$ docker run --name <container name> \
-p <host port>:9090 \
-v <host path>:/usr/app/logs \
-e SERVER_LOG_TRASNPORT_FILE="{ \""filename\"": \""/usr/app/logs/log.log\"" }"  \
bunomonteiro/pdf

Parameters:
    --name:                             The name of the container (default: auto generated). Optional.
    -p:                                 The port mapping of the host port to the container port. Default: 9090. Optional.
    -v /usr/app/logs:                   The data volume to use for the api log. Optional.
    -e SERVER_PORT:                     The api service port. Default: 9090. Optional.
    -e SERVER_REQUEST_LIMIT:            The api request size limit. Default: 1mb. Optional.
    -e SERVER_LOG:                      The log flag. Default: true. Optional.
    -e SERVER_LOG_MSG:                  The log message format. Optional.
    -e SERVER_LOG_TRASNPORT_CONSOLE:    The log Console transport JSON options. Default: {}. Optional.
    -e SERVER_LOG_TRASNPORT_FILE:       The log File transport JSON options. Optional.
    -e SERVER_LOG_TRASNPORT_HTTP:       The log HTTP transport JSON options. Optional.
    -e SERVER_LOG_TRASNPORT_STREAM:     The log Stream transport JSON options. Optional.
```

How to test the service:

```bash
$ curl --request POST \
  --url http://localhost:9090/api/v1/pdf \
  --header 'Content-Type: application/json' \
  --data '{
	"options": {
		"format": "A4",
		"orientation": "portrait",
		"border": "10mm"
	},
	"html": "<style>h1 { color: red }</style><h1>{{title}}</h1>",
	"data": {
		"title": "PDF Created!"
	}
}'
```