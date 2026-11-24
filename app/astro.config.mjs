import mdx from "@astrojs/mdx";
import { unified } from "@astrojs/markdown-remark";
import { defineConfig } from "astro/config";

export default defineConfig({
  integrations: [mdx()],
  markdown: { processor: unified() },
  compressHTML: true,
  output: "static",
  site: "https://ftfn.io"
});
