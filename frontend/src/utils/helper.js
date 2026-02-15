export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};


export const getInitials = (name) => {
  if (!name) return "";

  const words = name.split(" ");
  return words.slice(0, 2).map(w => w[0]).join("").toUpperCase();
};