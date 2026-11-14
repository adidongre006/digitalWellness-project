import nextConfig from "eslint-config-next";

// eslint-config-next ships a native ESLint 9 flat-config array (no legacy
// FlatCompat bridging needed), so it's used directly rather than through
// the FlatCompat("next/core-web-vitals") shim, which triggers a known
// circular-structure crash with this combination of package versions.
const eslintConfig = [
  ...nextConfig,
  {
    ignores: ["backend/**", "drizzle/**"],
  },
];

export default eslintConfig;
