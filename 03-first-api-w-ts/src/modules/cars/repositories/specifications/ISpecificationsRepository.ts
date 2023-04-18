import { Category } from "../../models/Category";

export interface ICreateSpecificationDTO {
  name: string;
  description: string;
}

export interface ISpecificationsRepository {
  findByName(name: string): Category;

  list(): Category[];

  create({ name, description }: ICreateSpecificationDTO): Category;
}
