module.exports = {
  singleQuote: true, // Use single quotes instead of double quotes
  trailingComma: "all", // Add trailing commas in arrays and objects
  semi: true, // Omit semicolons at the end of statements
  tabWidth: 2, // Use 2 spaces for indentation
  printWidth: 100, // Limit line length to 120 characters
  arrowParens: "always", // Always use parentheses around arrow function arguments
  endOfLine: "lf", // Use LF line endings (Unix style) (LF - Unix & MacOS | CRLF - Windows | CR - Classic MacOS)

  importOrder: [
    "^(?:@|\\.\\./)?", // Import paths starting with '@' or '../'
    "^[./]", // Import paths starting with '.'
    "^(?:\\w|\\d)+$", // Import paths containing only letters or numbers
    "^@?\\w+\\/\\w+$", // Import paths with a slash and a word on either side
    "^\\w+$", // Import paths containing only words
    "^\\./assets\\/.*\\.(png|svg|jpg|jpeg|gif|webp)$", // Asset files starting with "./assets" and ending with (.png .svg .jpg .jpeg .gif .webp)
  ],
  importOrderSeparation: true,
  importOrderGroups: [
    "builtin", // Built-in modules
    "external", // External modules
    "internal", // Internal modules
  ],
};
