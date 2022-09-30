import { transformYunjsSFC } from "@yunjs/compiler";
const fileRegex = /\.(yun)$/;

export default function yunjsPlugin() {
  return {
    name: "transform-yunjs",
    transform(src, id) {
      if (fileRegex.test(id)) {
        const { code } = transformYunjsSFC(src);
        console.log(code);
        return {
          code,
          map: null, // 如果可行将提供 source map
        };
      }
    },
  };
}
