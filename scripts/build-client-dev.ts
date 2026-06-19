const pages = Array.from(new Bun.Glob("src/pages/**/*.tsx").scanSync(".")).map((file) => `./${file}`);

const result = await Bun.build({
  entrypoints: ["./src/entry-client.tsx", ...pages],
  outdir: "./dist/assets",
  target: "browser",
  splitting: true,
  minify: false,
  sourcemap: "inline",
  define: {
    "process.env.NODE_ENV": JSON.stringify("development"),
  },
});

if (!result.success) {
  console.error("Client dev bundle basarisiz:");
  console.error(result.logs);
  process.exit(1);
}

console.log(`[client-dev] Bundle hazirlandi: ${new Date().toLocaleTimeString("tr-TR")}`);
