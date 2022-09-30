import { transformYunjsSFC } from "../src/sfc";
import { parse } from "@babel/parser";

// const text = "class a { get x() {return 1} }";
// console.log(parse(text).program.body[0].body.body[0]);

const sfc = transformYunjsSFC(
  `
<template>
    <div id="div_123">
        { [1,2,3].map(v => <p>{v}</p>) }
        <div a={abc.a} onclick={test}>{ a + b }</div>
        <div b={abc}>{ a + b }</div>
    </div>
</template>

<script lang="ts">
import { YunElement } from "yunjs";

export class MyForm extends YunElement {
    formState = {
        name: "",
        age: 12,
        sex: 'male'
    }
    arr = [
        {
            a: 1,
            b:2
        }
    ]

    submit() {
        console.log(this.formState);
    }
}
</script>
`,
  {}
);
// console.log(sfc);
