import { html2json, json2html } from "./parser";
import { jsonTransform } from "./converter";

// 由 template 编译为 html 源码
export function compiler(vm) {
  const template = vm.template;
  const json = html2json(template);
  const effects = {};
  const listeners = {};
  const htmlJson = jsonTransform(json, effects, listeners, vm);
  const html = json2html(htmlJson);
  return { html, effects, listeners };
}
