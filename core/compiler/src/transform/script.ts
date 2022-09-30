import { parse } from "@babel/parser";
const traverse = require("@babel/traverse").default;
import type { EffectHandle, EventHandle } from "./type";

export const transformScript = (
  script: string,
  injection: {
    effects: { [key: string]: Array<EffectHandle> };
    listeners: { [key: string]: Array<EventHandle> };
  }
) => {
  const ast = parse(script, {
    sourceType: "module",
    plugins: ["typescript"],
  });
  const { effects, listeners } = injection;
  const visitor = {
    ClassBody(path) {
      const classDeclaration = path.parent;
      if (classDeclaration.superClass.name === "YunElement") {
        const classBody = path.node.body;
        classBody.unshift(
          {
            type: "ClassMethod",
            key: {
              type: "Identifier",
              name: "_template",
            },
            kind: "get",
            params: [],
            body: {
              type: "BlockStatement",
              body: [
                {
                  type: "ReturnStatement",
                  argument: {
                    type: "StringLiteral",
                    value: "TEMPLATE_POSITION",
                  },
                },
              ],
            },
          },
          ...[
            {
              key: "_effects",
              value: effects,
            },
            {
              key: "_listeners",
              value: listeners,
            },
          ].map((target) => ({
            type: "ClassProperty",
            key: {
              type: "Identifier",
              name: target.key,
            },
            value: {
              type: "ObjectExpression",
              properties: Object.keys(target.value).map((key) => ({
                type: "ObjectProperty",
                method: false,
                key: {
                  type: "Identifier",
                  name: key,
                },
                value: {
                  type: "ArrayExpression",
                  elements: target.value[key].map((val) => ({
                    type: "ObjectExpression",
                    properties: Object.keys(val).map((k) => ({
                      type: "ObjectProperty",
                      key: {
                        type: "Identifier",
                        name: k,
                      },
                      value: {
                        type: "StringLiteral",
                        value: val[k],
                      },
                    })),
                  })),
                },
              })),
            },
          }))
        );
      }
    },
  };
  traverse(ast, visitor);

  return ast;
};
