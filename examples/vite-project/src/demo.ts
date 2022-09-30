import { YunElement } from "yunjs";

class MyTest extends YunElement {
  constructor() {
    super();
    setTimeout(() => {
      this.b = this.props["par"];
      this.$emit("hello", { a: 123 });
    }, 2000);
  }
  b = "";
  say() {
    this.$emit("hello", { a: 123 });
  }
  template = `
        <h1>
            这是简单的小测试
            <input value={b}  />
            <button onclick={say}>hello</button>
        </h1>
    `;
}
customElements.define("my-test", MyTest);

class Props {
  aa: number = 1;
}

export class MyDemo extends YunElement<Props> {
  template = `
        <div>
          <h1>Yunjs</h1>
            <select value={readonly} onchange={changeReadonly}>
            <option value="false">启用</option>
            <option value="true">禁用</option>
          </select>          
          <input value={a} oninput={changeA} />
          <input value={a} oninput={changeA} disabled={readonly}  />

          <template id="a123">
          123
          </template>
          <h2>{
              a
          }</h2>
          <img src="https://st-gdx.dancf.com/gaodingx/0/uxms/design/20210302-170753-9499.png?x-oss-process=image/resize,w_300/interlace,1,image/format,webp" />
          </div>
        <h2>
            End

            <slot name="my-text" />
            <my-test par={a} onhello={hello}></my-test>
        </h2>
    `;
  a = 12;
  b = "你好";
  readonly = false;
  www = {
    a: 1,
  };

  changeA(e) {
    this.a = e.target.value;
  }
  changeReadonly(e) {
    this.readonly = e.target.value;
  }
  changeB(e) {
    this.b = e.target.value;
  }
  hello(e) {
    console.log("hello～～", e);
  }
}
