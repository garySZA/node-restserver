const mongoose = require('mongoose');

const dbConnection = async () => {

    try{

        await mongoose.connect(process.env.MONGODB_ATLAS,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Base de datos conectada');

    } catch (err) {
        console.log(err);
        throw new Error('Error en la inicializacion de la base de datos');

    }

}

module.exports = dbConnection;
