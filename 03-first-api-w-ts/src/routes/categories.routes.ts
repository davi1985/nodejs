import { Request, Response, Router } from "express";
import { CategoryRepository } from "../modules/cars/repositories/categories/CategoryRepository";
import { CreateCategoryService } from "../modules/cars/services/categories/CreateCategoryService";

const categoriesRoutes = Router();

const categoriesRepository = new CategoryRepository();

categoriesRoutes.post("/", (request: Request, response: Response) => {
  const { name, description } = request.body;

  const createCategoryService = new CreateCategoryService(categoriesRepository);

  const category = createCategoryService.execute({ name, description });

  return response.status(201).json(category);
});

categoriesRoutes.get("/", (request: Request, response: Response) => {
  const categories = categoriesRepository.list();

  return response.json(categories);
});

export { categoriesRoutes };
