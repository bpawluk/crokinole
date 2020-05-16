import { injectable } from "inversify";
import { IVectorMathHelper } from "./IVectorMathHelper";

@injectable()
export class VectorMathHelper implements IVectorMathHelper {}