export const isValidSLIITEmail = (email: string) => {
  const regex = /^it\d{8}@my\.sliit\.lk$/;
  return regex.test(email);
};