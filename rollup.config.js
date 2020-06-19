import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json";
module.exports = [
  {
    input: "src/index.ts",
    plugins: [typescript()],
    output: { dir: "build", format: "cjs" },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
  },
  {
    input: "src/index.ts",
    preserveModules: true,
    plugins: [typescript()],
    output: { dir: "build", format: "es", sourcemap: true },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
  },
];
