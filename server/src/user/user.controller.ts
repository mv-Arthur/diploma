import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Param,
	Post,
	Res,
	UsePipes,
	Req,
	UseGuards,
	UseInterceptors,
	UploadedFile,
	Patch,
	HttpException,
	Delete,
} from "@nestjs/common";
import { Response, Request } from "express";
import { UserService } from "./service/user.service";
import { RegistrationDto } from "./dto/registration.dto";
import { ValidationPipe } from "../pipes/validation.pipe";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { OrderService } from "./service/order.service";
import { AddOrderDto } from "./dto/addOrder.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { RoleGuard } from "./role.guard";
import { SetPriceDto } from "./dto/setPrice.dto";
import { SetStatusDto } from "./dto/setStatus.dto";
import { updateDescriptionDto } from "./dto/updateDescription.dto";
import { CreateTypeDto } from "./dto/createType.dto";
import * as webPush from "web-push";

export interface PushSubscription {
	endpoint: string;
	expirationTime?: number | null;
	keys: {
		p256dh: string;
		auth: string;
	};
}
@Controller("user")
export class UserController {
	constructor(
		private userService: UserService,
		private orderService: OrderService
	) {}
	@UsePipes(ValidationPipe)
	@Post("/registration")
	async registration(@Body() dto: RegistrationDto, @Res() res: Response) {
		try {
			const { email, password } = dto;
			const userData = await this.userService.registration(email, password);
			res.cookie("refreshToken", userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});
			return res.json(userData);
		} catch (err) {
			if (err.status) {
				return res.status(err.status).json({ message: err.message, status: err.status });
			}
			console.log(err);
			return res.json({ message: "непредвиденная ошибка", status: HttpStatus.BAD_REQUEST });
		}
	}

	@Post("/subscription")
	async subscription(@Req() req: Request, @Res() res: Response) {
		const sub: PushSubscription = req.body.subscription;
		const userId: number = req.body.id;
		await this.userService.subscribe(sub, userId);
		return {
			message: "успешно подписан",
		};
	}

	@Post("/resubscribe")
	async resubscribe(@Req() req: Request, @Res() res: Response) {
		const sub: PushSubscription = req.body.subscription;
		const userId: number = req.body.id;
		await this.userService.resubscribe(sub, userId);
		return {
			message: "успешно переподписан",
		};
	}

	@Get("/subscription/:id")
	async unsubscribe(@Param("id") id: number) {
		const subscription = await this.userService.unsubscribe(id);
		return subscription;
	}

	@Get("pushKey/:id")
	async getPushKey(@Param("id") id: number) {
		const key = await this.userService.getPushKey(id);
		return { publicKey: key };
	}

	@UsePipes(ValidationPipe)
	@Post("/login")
	async login(@Body() dto: RegistrationDto, @Res() res: Response) {
		try {
			const { email, password } = dto;
			const userData = await this.userService.login(email, password);
			res.cookie("refreshToken", userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});
			return res.json(userData);
		} catch (err) {
			if (err.status) {
				return res.status(err.status).json({ message: err.message, status: err.status });
			}
			return res.json({ message: "непредвиденная ошибка", status: HttpStatus.BAD_REQUEST });
		}
	}

	@Post("/logout")
	async logout(@Req() req: Request, @Res() res: Response) {
		try {
			const { refreshToken } = req.cookies;
			const token = await this.userService.logout(refreshToken);
			res.clearCookie("refreshToken");
			res.status(HttpStatus.OK).json(token);
		} catch (err) {
			if (err.status) {
				return res.status(err.status).json({ message: err.message, status: err.status });
			}
			return res.json({ message: "непредвиденная ошибка", status: HttpStatus.BAD_REQUEST });
		}
	}

	@Get("/activate/:link")
	async activate(@Param("link") activationLink: string, @Res() res: Response) {
		try {
			await this.userService.activate(activationLink);
			return res.redirect(process.env.CLIENT_URL);
		} catch (err) {
			if (err.status) {
				return res.status(err.status).json({ message: err.message, status: err.status });
			}
			return res.json({ message: "непредвиденная ошибка", status: HttpStatus.BAD_REQUEST });
		}
	}

	@Get("/refresh")
	async refresh(@Req() req: Request, @Res() res: Response) {
		try {
			const { refreshToken } = req.cookies;
			const userData = await this.userService.refresh(refreshToken);
			res.cookie(userData.refreshToken, {
				maxAge: 30 * 24 * 60 * 60 * 1000,
				httpOnly: true,
			});
			res.json(userData);
		} catch (err) {
			if (err.status) {
				return res.status(err.status).json({ message: err.message, status: err.status });
			}
			return res.json({ message: "непредвиденная ошибка", status: HttpStatus.BAD_REQUEST });
		}
	}

	@UseGuards(JwtAuthGuard)
	@Post("/addOrder/:id")
	@UseInterceptors(FileInterceptor("file"))
	async addOrder(
		@Body() dto: AddOrderDto,
		@UploadedFile() file: Express.Multer.File,
		@Param("id") userId: number
	) {
		const order = await this.orderService.addOrder(userId, file, dto);
		return order;
	}

	@Get("/getOrder/:id")
	async getOrder(@Param("id") id: number) {
		return await this.orderService.getOrderById(id);
	}

	@Get("/getOrder")
	async getAllOrder() {
		return await this.orderService.getAllOrder();
	}
	// @UseGuards(JwtAuthGuard)
	@Get("/activate/admin/:link")
	async activateAdmin(@Param("link") activationAdminLink: string) {
		await this.userService.activateAdmin(activationAdminLink);
		return {
			message: "Успех",
		};
	}

	@UseGuards(RoleGuard)
	@Patch("/setPrice")
	async setPrice(@Body() dto: SetPriceDto) {
		await this.orderService.setPrice(dto.id, dto.price);
		return {
			message: "Успех",
		};
	}

	@UseGuards(RoleGuard)
	@Patch("/setStatus")
	async setStatus(@Body() dto: SetStatusDto) {
		const { id, status } = dto;
		if (!["pending", "job", "resolved"].includes(status)) {
			throw new HttpException("неверный статус", HttpStatus.BAD_REQUEST);
		}
		await this.orderService.setStatus(id, status);
		return {
			message: "Успех",
		};
	}

	@UseGuards(JwtAuthGuard)
	@Patch("/updateDescription")
	async updateDescription(@Body() dto: updateDescriptionDto) {
		const { id, description } = dto;
		await this.orderService.updateDescription(id, description);
		return {
			message: "Успех",
		};
	}

	@UseGuards(RoleGuard)
	@Post("/createType")
	async createType(@Body() dto: CreateTypeDto) {
		const { name, type } = dto;
		const newType = await this.orderService.createType(name, type);
		return {
			message: "Успех",
			data: newType,
		};
	}

	// @UseGuards(JwtAuthGuard)
	@Get("/download/:id")
	async download(@Param("id") orderId: number, @Res() res: Response) {
		const file = await this.orderService.download(orderId);
		res.download(file);
	}

	@UseGuards(JwtAuthGuard)
	@Get("/types")
	async getTypeAll() {
		return this.orderService.getAllType();
	}

	@UseGuards(RoleGuard)
	@Delete("/types/:id")
	async deleteTypeById(@Param("id") id: number) {
		return await this.orderService.deleteType(id);
	}

	@Get("/test")
	async testToGetUsersByAdmin() {
		return this.orderService.getAlluser();
	}
}
