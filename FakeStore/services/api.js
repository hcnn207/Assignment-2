const BASE_URL = "https://fakestoreapi.com";

export async function getCategories() {
  const response = await fetch(`${BASE_URL}/products/categories`);
  return response.json();
}

export async function getProductsByCategory(category) {
  const response = await fetch(`${BASE_URL}/products/category/${category}`);
  return response.json();
}

export async function getProductById(id) {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  return response.json();
}