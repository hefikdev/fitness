const fs = require('fs');
const content = [
  "import { redirect } from \"next/navigation\";",
  "",
  "export default function Home() {",
  "  redirect(\"/login\");",
  "}",
  ""
].join("\n");
fs.writeFileSync("app/page.tsx", content);
console.log("done");
