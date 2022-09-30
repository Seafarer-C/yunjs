// 副作用事件
interface EffectHandle {
  // 数据作用的 dom 节点的 yun-id
  yun_id: string;
  // 影响的 attribute
  attribute?: string;
}
// 事件
interface EventHandle {
  // 数据作用的 dom 节点的 yun-id
  yun_id: string;
  // 事件
  event_name?: string;
  // 参数
  params?: Array<any>;
}

// 将 json 转化为标准 html 的 json 格式
export function jsonTransform(
  json,
  effects: { [key: string]: Array<EffectHandle> },
  listeners: { [key: string]: Array<EventHandle> },
  options
) {
  // TODO：这部分代码可读性不高，需要优化一下
  // 标签属性及事件处理逻辑
  if (json.attributes) {
    json.attributes["data-yun-id"] = json.tag + "_" + Math.random();
    for (const key in json.attributes) {
      // attribute 对应的表达式或变量
      // TODO: 需要处理一下表达式的逻辑
      const attrKey = json.attributes[key];
      // 属性
      if (typeof attrKey === "string" && attrKey.match(/\{[^\)]+\}/g)) {
        // 对应的属性名称
        const attribute_name = key;
        // 对应的数据名称
        const data_key = attrKey.substr(1, attrKey.length - 2);

        effects[data_key] = effects[data_key] ?? [];
        effects[data_key].push({
          yun_id: json.attributes["data-yun-id"],
          attribute: attribute_name,
        });
        if (options[data_key]) {
          json.attributes[attribute_name] = options[data_key];
        } else {
          delete json.attributes[key];
        }
      }
      // 事件
      if (key.startsWith("on")) {
        // 对应的数据名称
        const data_key = attrKey.substr(1, attrKey.length - 2);
        listeners[data_key] = listeners[data_key] ?? [];
        listeners[data_key].push({
          yun_id: json.attributes["data-yun-id"],
          event_name: key.slice(2, key.length),
        });
        delete json.attributes[key];
      }
    }
  }
  if (json.node === "text") {
    if (json.text.startsWith("{") && json.text.endsWith("}")) {
      console.log("表达式", json);
    }
  }
  if (json.children) {
    json.children.forEach(function (c) {
      jsonTransform(c, effects, listeners, options);
    });
  }
  return json;
}
