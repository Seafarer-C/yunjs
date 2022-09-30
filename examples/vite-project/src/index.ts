// import { MyDemo } from "./demo";
import { MyForm } from "./demo.yun";

// customElements.define("my-demo", MyDemo);
console.log(MyForm);
customElements.define("my-form", MyForm);
const dom = document.createElement("my-form");
const dom2 = document.createElement("my-form");
document.body.appendChild(dom);
document.body.appendChild(dom2);
// console.log();
