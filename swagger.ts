const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./routers/index.ts']
const config = {
    info: {
        title: 'Blog API Documentation',
        description: '',
    },
    tags: [ ],
    host: 'localhost:8080',
    schemes: ['http', 'https'],
};
swaggerAutogen(outputFile, endpointsFiles, config)