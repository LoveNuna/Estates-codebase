export default (text) =>
  "0x" +
  text
    .split("")
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("");
