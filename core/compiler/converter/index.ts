// 副作用事件
class EffectHandle {
  // 数据作用的 dom 节点的 yun-id
  yun_id: string;
  // 影响的 attribute
  attribute?: string;
}
// 事件
class EventHandle {
  // 数据作用的 dom 节点的 yun-id
  yun_id: string;
  // 事件
  event_name?: string;
}

// 将 json 转化为标准 html 的 json 格式
export function jsonTransform(
  json,
  effects: { [key: string]: Array<EffectHandle> },
  listeners: { [key: string]: Array<EventHandle> },
  options
) {
  // 标签属性处理逻辑
  if (json.attributes) {
    json.attributes["data-yun-id"] = Math.random();
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
          event_name: key,
        });
        delete json.attributes[key];
        console.log("事件", key);
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
