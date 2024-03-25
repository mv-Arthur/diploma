"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
const express = require("express");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        credentials: true,
        origin: process.env.CLIENT_URL,
    });
    console.log((0, path_1.join)(__dirname, "user", "uploads"));
    app.use("/uploads", express.static((0, path_1.join)(__dirname, "user", "uploads")));
    app.use(cookieParser());
    const PORT = process.env.PORT || 3000;
    await app.listen(PORT, () => console.log(`server listening on port: ${PORT}`));
}
bootstrap();
//# sourceMappingURL=main.js.map