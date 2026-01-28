export const categoryImages = {
  electronics: "/category/electronics.png",
  fashion: "/category/fashion.png",
  mobiles: "/category/mobiles.png",
  shoes: "/category/shoes.png",
  "home applications": "/category/home.png",
  books: "/category/books.png",
  sports: "/category/sports.png",
  toys: "/category/toys.png",
  groceries: "/category/groceries.png",
  health: "/category/health.png",
  beauty: "/category/beauty.png",
  automotive: "/category/automotive.png",
};

export const getCategoryImage = (category) => {
  if (!category) return "/category/default.png";
  const key = category.trim().toLowerCase();
  return categoryImages[key] || "/category/default.png";
};
