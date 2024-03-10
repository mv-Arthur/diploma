import { makeAutoObservable, runInAction } from "mobx";
import { IOrderType } from "../models/IOrderType";
import { OrderTypeService } from "../services/OrderTypeService";

class TypeStore {
	types = [] as IOrderType[];
	current = {} as IOrderType;
	constructor() {
		makeAutoObservable(this, {}, { deep: true });
	}

	addNewType(type: IOrderType) {
		this.types.push(type);
	}

	firstStepRender(data: IOrderType[]) {
		this.types = [...data];
	}

	deleteTypeById(id: number) {
		this.types = this.types.filter((el) => el.id !== id);
	}

	setCurrent(type: string) {
		const founded = this.types.find((el) => el.type === type);
		if (founded) {
			this.current = founded;
		}
	}

	async fetchToDelete(id: number) {
		try {
			const response = await OrderTypeService.deleteById(id);
			this.deleteTypeById(response.data.deletedTypeId);
		} catch (err: any) {
			console.log(err.response.data.message);
		}
	}

	async addNewFetch(name: string, type: string) {
		try {
			const response = await OrderTypeService.addType(name, type);
			this.addNewType(response.data.data);
		} catch (err: any) {
			console.log(err.response.data.message);
		}
	}

	async fetchTypes() {
		try {
			const response = await OrderTypeService.getAll();
			this.firstStepRender(response.data);
		} catch (err: any) {
			console.log(err.response.data.message);
		}
	}
}

export const typeStore = new TypeStore();
