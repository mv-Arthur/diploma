import { Model } from "sequelize-typescript";
import { Report } from "./report.model";
interface CreationAttrs {
    revenue: string;
    date: string;
    rejectedQty: string;
    fullfiledQty: string;
}
export declare class DateU extends Model<DateU, CreationAttrs> {
    id: number;
    revenue: string;
    date: string;
    rejectedQty: string;
    fullfiledQty: string;
    report: Report[];
}
export {};
