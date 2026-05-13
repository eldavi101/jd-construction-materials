import { API_BASE_URL } from "./api-config";

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function fetchCategories(): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchCategoryBySlug(slug: string): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categories/${slug}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch category: ${response.statusText}`);
  }

  return response.json();
}
