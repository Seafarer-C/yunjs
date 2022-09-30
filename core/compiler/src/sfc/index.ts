import { transformJSX } from "../transform/template";
import { transformScript } from "../transform/script";
const generator = require("@babel/generator").default;

const matchTemplateReg = /(?<=<template.*>)[\s\S]*?(?=<\/template>)/;
const matchScriptReg = /(?<=<script.*>)[\s\S]*?(?=<\/script>)/;
const matchStyleReg = /(?<=<style.*>)[\s\S]*?(?=<\/style>)/;

function getMatch(str, reg) {
  return str.match(reg) ? str.match(reg)[0] : "";
}

export const transformYunjsSFC = (code: string, options?) => {
  const template = getMatch(code, matchTemplateReg);
  const script = getMatch(code, matchScriptReg);
  const style = getMatch(code, matchStyleReg);

  const { ast, effects, listeners } = transformJSX(template);
  const htmlCode = generator(ast).code;

  const astScript = transformScript(script, {
    effects,
    listeners,
  });
  const result = generator(astScript);

  return {
    ...result,
    code: result.code.replace('"TEMPLATE_POSITION"', "`" + htmlCode + "`"),
  };
};
