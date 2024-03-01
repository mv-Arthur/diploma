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
			return res.json({ message: "непредвиденная ошибка", status: HttpStatus.BAD_REQUEST });
		}
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
	@Get("/users")
	users() {
		return this.userService.getUsers();
	}

	@UseGuards(JwtAuthGuard)
	@Post("/addOrder/:id")
	@UseInterceptors(FileInterceptor("file"))
	async addOrder(
		@Body() dto: AddOrderDto,
		@UploadedFile() file: Express.Multer.File,
		@Param("id") userId: number
	) {
		try {
			await this.orderService.addOrder(userId, file, dto);
			return {
				status: 200,
				message: "Успех",
			};
		} catch (err) {
			return {
				message: err.message,
				status: err.status,
			};
		}
	}

	@Get("/activate/admin/:link")
	async activateAdmin(@Param("link") activationAdminLink: string) {
		try {
			await this.userService.activateAdmin(activationAdminLink);
			return {
				status: 200,
				message: "Успех",
			};
		} catch (err) {
			return {
				status: err.status,
				message: err.message,
			};
		}
	}

	@UseGuards(RoleGuard)
	@Patch("/setPrice")
	async setPrice(@Body() dto: SetPriceDto) {
		try {
			await this.orderService.setPrice(dto.id, dto.price);
			return {
				status: 200,
				message: "Успех",
			};
		} catch (err) {
			return {
				status: err.status,
				message: err.message,
			};
		}
	}

	@UseGuards(RoleGuard)
	@Patch("/setStatus")
	async setStatus(@Body() dto: SetStatusDto) {
		try {
			const { id, status } = dto;
			if (!["pending", "job", "resolved"].includes(status)) {
				throw new HttpException("неверный статус", HttpStatus.BAD_REQUEST);
			}
			await this.orderService.setStatus(id, status);
			return {
				status: 200,
				message: "Успех",
			};
		} catch (err) {
			return {
				status: err.status,
				message: err.message,
			};
		}
	}

	@UseGuards(JwtAuthGuard)
	@Patch("/updateDescription")
	async updateDescription(@Body() dto: updateDescriptionDto) {
		try {
			const { id, description } = dto;
			await this.orderService.updateDescription(id, description);
			return {
				status: 200,
				message: "Успех",
			};
		} catch (err) {
			return {
				status: err.status,
				message: err.message,
			};
		}
	}
	@UseGuards(RoleGuard)
	@Post("/createType")
	async createType(@Body() dto: CreateTypeDto) {
		try {
			const { name, type } = dto;
			await this.orderService.createType(name, type);
			return {
				status: 200,
				message: "Успех",
			};
		} catch (err) {
			return {
				status: err.status,
				message: err.message,
			};
		}
	}

	@UseGuards(RoleGuard)
	@Get("/download/:id")
	async download(@Param("id") orderId: number, @Res() res: Response) {
		try {
			const file = await this.orderService.download(orderId);
			res.sendFile(file);
		} catch (err) {
			return {
				status: err.status,
				message: err.message,
			};
		}
	}
}
