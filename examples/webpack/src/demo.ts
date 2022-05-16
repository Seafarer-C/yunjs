import { YunElement } from "yunjs";

class MyTest extends YunElement {
  constructor() {
    super();
    setTimeout(() => {
      this.b = this.props["par"];
    }, 2000);
  }
  b = "";
  template = `
        <h1>
            这是简单的小测试
            <input value={b}  />
        </h1>
    `;
}
customElements.define("my-test", MyTest);

class Props {
  aa: number;
}
export class MyDemo extends YunElement<Props> {
  constructor() {
    super();
  }

  template = `
        <div>
          <h1>Yunjs</h1>
            <select value={readonly} onchange={changeReadonly}>
            <option value="true">禁用</option>
            <option value="false">启用</option>
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
           <!--  <my-test par={a}></my-test> -->
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
}
