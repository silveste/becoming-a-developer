import { serve } from "https://deno.land/std/http/server.ts";

const server = serve({ port: 3000 });
console.log("http://localhost:3000/");
for await (const req of server) {
  req.respond({ body: '<h1 style="color: green;">Hello World</h1>' });
}
