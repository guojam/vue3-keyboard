# Vue 3 Keyboard

Virtual keyboard for Vue 3

#### 注册指令后使用

```typescript
import { keyboardInputDirective } from './keyboard/';

export default defineComponent({
    directives: {
        'keyboard-input': keyboardInputDirective,
    },
});
```

```html
<input
    v-keyboard-input="{
        inputMethod: 'all, num, system',
        random: true,
        closeAble: true,
        style: 'custom-style',
    }"
/>
```

#### 指令可设置的属性

```js
/** 键位是否随机排序，只针对数字键盘 */
random: {
    type: Boolean,
    default: false,
},

/** 显示关闭按钮 */
closeAble: {
    type: Boolean,
    default: false,
},

/** 可切换的输入法 */
inputMethods: {
    type: Array as PropType<KeyboardType[]>,
    required: true,
},

/** 键盘容器样式名 */
style: {
    type: String,
    default: '',
},
```

#### 键盘类型

```ts
type KeyboardType = 'id' | 'inline-num' | 'decimal' | 'all' | 'num' | 'system';
```

#### 键盘布局

用二维数组表示，每个按键形式如 键名:所占列数:所占行数 列数行数不设置则为 1 列 1 行

```ts
const numericLayout: KeyboardLayout = [
    ['1', '2', '3', 'backspace:1:2'],
    ['4', '5', '6'],
    ['7', '8', '9', 'submit:1:2'],
    ['clear', '0', ''],
];
```
