const express = require('express');
const cors = require('cors');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.usersPath = '/api/users';

        //Middlewares
        this.middlewares();

        //Rutas
        this.routes();
    }

    middlewares() {
        //Cors
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use( express.json() );
        //Directorio publico
        this.app.use(express.static('public'));

    }

    routes() {
        this.app.use(this.usersPath, require('../routes/user'));

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server is listening on port ' + this.port);

        });
    }

}

module.exports = Server;