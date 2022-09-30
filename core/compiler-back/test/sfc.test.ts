import { transformYunjsSFC } from "../src/sfc";

const sfc = transformYunjsSFC(
  `
<template>
    <div id="div_123">
        { [1,2,3].map(v => <p>{v}</p>) }
        <div a={abc} onclick={test}>{ a + b }</div>
        <div b={abc}>{ a + b }</div>
    </div>
</template>

<script lang="ts">
import { YunElement } from "yunjs";

export class MyForm extends YunElement {

   template = "123"

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
console.log(sfc);
