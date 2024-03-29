import { AxiosResponse } from "axios";
import $api from "../http/index";
import { IUser } from "../models/IUser";

export default class UserService {
	static fetchUsers(): Promise<AxiosResponse<IUser[]>> {
		return $api.get<IUser[]>("/user/users");
	}
}
