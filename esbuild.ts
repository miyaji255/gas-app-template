import GasGeneratorPlugin from "esbuild-plugin-gas-generator"
import { build, BuildOptions, context } from "esbuild"
import { copyFile } from "fs/promises"

async function main() {
  const options = {
    entryPoints: ["src/index.ts"],
    bundle: true,
    outfile: "dist/index.js",
    format: "esm",
    plugins: [
      GasGeneratorPlugin(),
      {
        name: "copy-appsscript",
        setup(build) {
          build.onEnd(async () => {
            await copyFile("appsscript.json", "dist/appsscript.json")
          })
        }
      }
    ],
  } as const satisfies BuildOptions

  switch (process.argv[2]) {
    case "watch": {
      const ctx = await context({ ...options, logLevel: "info" })
      await ctx.watch();
      break;
    }
    case "build": {
      await build(options);
      break;
    }
    default: {
      console.error(`Unknown command: ${process.argv[2]}`);
      process.exit(1);
    }
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
});
