export const validateNewProduct = (
  name,
  price,
  ratings,
  reviews,
  countInStock,
  discount,
  imageURL,
  itemType,
  kind,
  description
) => {
  if (name.length < 3) {
    return "Invalid Product Name..";
  }
  if (
    price <= 0 ||
    ratings <= 0 ||
    ratings > 5 ||
    reviews <= 0 ||
    countInStock <= 0 ||
    discount <= 0 ||
    discount >= 100
  ) {
    return "Invalid Product Details";
  }
  if (imageURL.length < 5) {
    return "Invalid ImageURL";
  }
  if (itemType.length < 3) {
    return "Invalid itemType";
  }
  if (kind !== "men" && kind !== "women" && kind !== "kids") {
    return "Invalid Product Kind";
  }
  if (description.length < 2) {
    return "Description should not be empty!";
  }
  return "valid";
};
