export const  generateRandomId = async() => {
  const allowedChars = 'abcdefghijklmnopqrstuvwxyz_0123456789';
  let id = '';
  // First character is a letter or underscore
  const firstChar = allowedChars.charAt(Math.floor(Math.random() * 27));
  id += firstChar;
  // Remaining characters
  for (let i = 1; i < 31; i++) {
      const char = allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
      id += char;
  }
  return id.substring(0, 31); // Limit the ID to 31 characters as per the standard
}
