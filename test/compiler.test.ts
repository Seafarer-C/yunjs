import { compiler } from "../core/compiler-back";

const template = `
    <div :readonly="a">
        <span>{{ test }}</span>
    </div>
`;
const { html, effects } = compiler(template);
console.log(html, effects);
