const BASE_URL = "https://fakestoreapi.com";

export async function getCategories() {
  const response = await fetch(`${BASE_URL}/products/categories`);

  if (!response.ok) {
    throw new Error("Failed to fetch categories.");
  }

  return response.json();
}

export async function getProductsByCategory(category) {
  const response = await fetch(
    `${BASE_URL}/products/category/${encodeURIComponent(category)}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch products.");
  }

  return response.json();
}

export async function getProductById(id) {
  const response = await fetch(`${BASE_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product details.");
  }

  return response.json();
}