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
  protected _template: string;

  // 外部传参
  protected readonly props: T = <T>{};

  // 根元素
  shadowRoot;
  // 内部变量管理
  private _state = {};
  private _effects = {};
  private _listeners = {};

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
  }

  // HTMLElement 生命周期函数
  /**
   * 当自定义元素第一次被连接到文档DOM时被调用
   */
  protected connectedCallback() {
    // this.attachShadow({
    //   mode: "open",
    // })
    this.innerHTML = this._template;
    this.attrToProps();
    // 不应该遍历全部属性，只需要遍历 effects 即可
    for (const key of Object.getOwnPropertyNames(this._effects)) {
      // 遍历所有的内部字段
      // 字段类型为 object 则使用 Proxy 实现响应式
      if (typeof this[key] === "function") continue;
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
            handles?.forEach((handle) => {
              const dom = this.querySelector(
                `[data-yun-key='${handle.yun_id}']`
              );
              // TODO: 关于变更 attribute 的动作还需要细化
              if (value === false || value === "false") {
                dom.removeAttribute(handle.attribute);
              } else {
                dom.setAttribute(handle.attribute, value);
              }
            });
          },
        });
      }
    }
    for (const key of Object.getOwnPropertyNames(this._listeners)) {
      const eventArray = this._listeners[key];
      if (typeof this[key] !== "function") continue;
      eventArray.forEach(({ yun_id, event_name }) => {
        const dom = this.querySelector(`[data-yun-key='${yun_id}']`);
        dom.addEventListener(event_name, this[key].bind(this));
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
