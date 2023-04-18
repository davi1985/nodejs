import { Category } from "../../models/Category";
import { ICategoriesRepository } from "../../repositories/categories/ICategoriesRepository";

interface IRequest {
  name: string;
  description: string;
}

export class CreateSpecificationsService {
  constructor(private categoriesRepository: ICategoriesRepository) {}

  execute({ name, description }: IRequest): Category {
    const categoryAlreadyExists = this.categoriesRepository.findByName(name);

    if (categoryAlreadyExists) {
      throw new Error("Category already exists");
    }

    return this.categoriesRepository.create({ name, description });
  }
}
