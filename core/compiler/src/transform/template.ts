import { parse } from "@babel/parser";
const traverse = require("@babel/traverse").default;
import type { EffectHandle, EventHandle } from "./type";
const generator = require("@babel/generator").default;

export const transformJSX = (code) => {
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["jsx"],
    // sourceFilename: "",
  });

  const effects: { [key: string]: Array<EffectHandle> } = {};
  const listeners: { [key: string]: Array<EventHandle> } = {};

  const visitor = {
    // JSXElement: {
    //   enter: (path, state) => {
    //     state = state ?? {};
    //     state.a = 1;
    //     console.log("dom 节点");
    //   },
    //   exit(path, state) {
    //     console.log("离开 dom", );
    //   },
    // },
    // 前半部分标签
    JSXOpeningElement: {
      exit(path) {
        // 执行完该标签后将事件从 attribute 上移除
        path.node.attributes = path.node.attributes.filter((attr) => {
          if (attr.name.name.startsWith("on")) {
            return false;
          }
          return true;
        });
      },
    },
    // 标签的 attributes，涉及属性和事件
    JSXAttribute: {
      enter: (path) => {
        const node = path.node;
        const { name, value } = node;

        if (value.type === "JSXExpressionContainer") {
          // 内容为表达式，需要判断标签 attribute 上是否带有 data-yun-key,若没有则加上
          let yunIdAttr = path.parent.attributes.find(
            (v) => v.name.name === "data-yun-key"
          );
          if (!yunIdAttr) {
            yunIdAttr = {
              type: "JSXAttribute",
              name: {
                name: "data-yun-key",
                type: "JSXIdentifier",
              },
              value: {
                type: "StringLiteral",
                value: "_" + Math.random(),
              },
            };
            path.insertBefore(yunIdAttr);
          }
          const yun_id = yunIdAttr.value.value;

          const key = name.name;

          if (key.startsWith("on")) {
            const dataKey = value.expression.name;
            // 事件
            listeners[dataKey] = listeners[dataKey] ?? [];
            listeners[dataKey].push({
              yun_id,
              event_name: key.slice(2, key.length),
            });
          } else {
            console.log(value.expression.type);
            switch (value.expression.type) {
              case "Identifier":
                const dataKey = value.expression.name;
                // 属性
                effects[dataKey] = effects[dataKey] ?? [];
                effects[dataKey].push({
                  yun_id,
                  attribute: key,
                });
                // 采集完 effects，将表达式转化为模版字符串
                name.type = "JSXIdentifier";
                value.type = "StringLiteral";
                value.value = "${this." + dataKey + "}";
                break;
              case "MemberExpression":
                console.log(generator(value.expression));
                const dataExpressionKey = generator(value.expression).code;
                const _dataExpressionKey = `"${dataExpressionKey}"`;
                // 属性
                effects[_dataExpressionKey] = effects[_dataExpressionKey] ?? [];
                effects[_dataExpressionKey].push({
                  yun_id,
                  attribute: key,
                });
                // 采集完 effects，将表达式转化为模版字符串
                name.type = "JSXIdentifier";
                value.type = "StringLiteral";
                value.value = "${this." + dataExpressionKey + "}";
                break;
              case "":
                break;
              default:
                break;
            }
          }
        }
      },
    },
    // JSXExpressionContainer: (path, state) => {
    //   console.log("表达式");
    // },
  };
  traverse(ast, visitor);

  return {
    ast,
    effects,
    listeners,
  };
};
