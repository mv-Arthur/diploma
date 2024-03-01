import { Column, DataType, Table, Model, HasMany, HasOne, ForeignKey } from "sequelize-typescript";
import { Token } from "./token.model";
import { RoleType } from "../types/RoleType";
import { Order } from "./order.model";

interface CreationAttrs {
	email: string;
	password: string;
	activationLink: string;
	activationLinkAdmin: string;
}

@Table({ tableName: "user", timestamps: false })
export class User extends Model<User, CreationAttrs> {
	@Column({
		type: DataType.INTEGER,
		unique: true,
		autoIncrement: true,
		primaryKey: true,
	})
	id: number;
	@Column({ type: DataType.STRING, unique: true, allowNull: false })
	email: string;
	@Column({ type: DataType.STRING, unique: false, allowNull: false })
	password: string;
	@Column({ type: DataType.BOOLEAN, unique: false, defaultValue: false })
	isActivated: boolean;
	@Column({ type: DataType.STRING, unique: false })
	activationLink: string;
	@Column({ type: DataType.STRING, unique: false })
	activationLinkAdmin: string;
	@Column({ type: DataType.STRING, defaultValue: "user" })
	role: RoleType;
	@HasOne(() => Token)
	token: Token;
	@HasMany(() => Order, { onDelete: "CASCADE" })
	order: Order[];
}
