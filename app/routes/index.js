const userRoutes = require("./user.routes.js");
const fileRoutes = require("./file.routes.js");

const appRoutes = (app) => {
    app.use('/user',userRoutes);
    app.use('/file',fileRoutes);
}

module.exports = appRoutes;