import { compiler } from "@yunjs/compiler";

const parseJSONString = (jsonStr: string) => {
  try {
    return JSON.parse(jsonStr);
  } catch {
    return jsonStr;
  }
};

export class YunElement<T = Object> extends HTMLElement {
  // 是否为 Shadow DOM
  IS_SHADOW_DOM: boolean = false;
  // 用户自定义的模版
  protected template: string;

  // 外部传参
  protected readonly props: T = <T>{};

  // 根元素
  shadowRoot;
  // 内部变量管理
  private _state = {};
  private _effects: { [key: string]: Array<Function> } = {};

  $emit(name: string, options: Object) {
    let evt = new CustomEvent(name, {
      ...options,
      composed: true,
      bubbles: true,
    });
    this.dispatchEvent(evt);
    evt = undefined;
  }

  // 将 attribute 转化成 props
  attrToProps() {
    for (const key in this.attributes) {
      if (Object.prototype.hasOwnProperty.call(this.attributes, key)) {
        const element = this.attributes[key];
        this.props[element.name] = parseJSONString(element?.value);
      }
    }
    console.log(this.props);
  }

  // HTMLElement 生命周期函数
  /**
   * 当自定义元素第一次被连接到文档DOM时被调用
   */
  protected connectedCallback() {
    // this.attachShadow({
    //   mode: "open",
    // })
    const { html, effects, listeners } = compiler(this);
    console.log(listeners, "listeners");
    this.innerHTML = html;
    this._effects = effects;
    this.attrToProps();
    for (const key of Object.getOwnPropertyNames(this)) {
      // 遍历所有的内部字段
      // 字段类型为 object 则使用 Proxy 实现响应式
      if (typeof this[key] === "function") break;
      if (typeof this[key] === "object") {
        this[key] = new Proxy(this[key], {
          get: (target, key) => {
            return target[key];
          },
          set: (target, key: string, value) => {
            target[key] = value;
            this._effects[key];
            return true;
          },
        });
      } else {
        this._state[key] = this[key];
        Object.defineProperty(this, key, {
          get() {
            return this._state[key];
          },
          set(value) {
            this._state[key] = value;
            const handles = this._effects[key];
            console.log("handles", handles);
            handles?.forEach((handle) => {
              const dom = document.querySelector(
                `[data-yun-id='${handle.yun_id}']`
              );
              if (value === false) {
                dom.removeAttribute(handle.attribute);
              } else {
                dom.setAttribute(handle.attribute, value);
              }
            });
          },
        });
      }
    }
    for (const key of Object.getOwnPropertyNames(listeners)) {
      const eventArray = listeners[key];
      if (typeof this[key] !== "function") break;
      eventArray.forEach(({ event_name }) => {
        // TODO: 移除开头 on 的逻辑应放到编译阶段
        const evt_name = event_name.startsWith("on")
          ? event_name.slice(2, event_name.length)
          : event_name;
        this.addEventListener(evt_name, this[key]);
      });
    }
  }
  /**
   * 当自定义元素与文档DOM断开连接时被调用
   */
  disconnectedCallback() {}
  /**
   * 当自定义元素被移动到新文档时被调用
   */
  adoptedCallback() {}
  /**
   * HTMLElement 钩子，当 attribute 发生变化时触发
   * @param name
   * @param oldValue
   * @param newValue
   */
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(name, oldValue, newValue);
    this.attrToProps();
  }
}
