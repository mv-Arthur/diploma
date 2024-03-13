import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./service/user.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "./model/user.model";
import { Token } from "./model/token.model";
import { MailService } from "./service/mail.service";
import { TokenService } from "./service/token.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { Order } from "./model/order.model";
import { File } from "./model/file.model";
import { Status } from "./model/status.model";
import { OrderService } from "./service/order.service";
import { MulterModule } from "@nestjs/platform-express";
import { RoleGuard } from "./role.guard";
import { Type } from "./model/type.model";
import { Vapid } from "./model/vapid.model";
import { Subscription } from "./model/subscription.model";
import { Keys } from "./model/keys.model";

@Module({
	controllers: [UserController],
	providers: [UserService, MailService, TokenService, JwtAuthGuard, OrderService, RoleGuard],
	imports: [
		JwtModule.register({}),
		ConfigModule,
		SequelizeModule.forFeature([
			User,
			Token,
			Order,
			File,
			Status,
			Type,
			Vapid,
			Subscription,
			Keys,
		]),
		MulterModule.register({
			dest: "./dist/user/uploads",
		}),
	],
})
export class UserModule {}
