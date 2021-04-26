import { KeyboardLayout, KeyboardLayouts } from './keyboard.model';

/** 软键盘布局定义 */

/** 纯数字键盘布局 - 带完成按钮 */
const numericLayout: KeyboardLayout = [
    ['1', '2', '3', 'backspace:1:2'],
    ['4', '5', '6'],
    ['7', '8', '9', 'submit:1:2'],
    ['clear', '0', ''],
];

/** 数字键盘布局带小数点 - 带完成按钮 */
const decimalLayout: KeyboardLayout = [
    ['1', '2', '3', 'backspace:1:2'],
    ['4', '5', '6'],
    ['7', '8', '9', 'submit:1:2'],
    ['clear', '0', 'point'],
];

/** 纯数字键盘布局 */
const inlineNumericLayout: KeyboardLayout = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['clear', '0', 'backspace'],
];

/** 身份证键盘布局 - 带完成按钮  */
const idLayout: KeyboardLayout = [
    ['1', '2', '3', 'backspace:1:2'],
    ['4', '5', '6'],
    ['7', '8', '9', 'submit:1:2'],
    ['clear', '0', 'roman10'],
];

/** 全键盘布局 */
const allLayout: KeyboardLayout = [
    ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'backspace'],
    ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'submit:2:1'],
];

export const keyboardLayouts: KeyboardLayouts = {
    id: { name: '身份证', layout: idLayout },
    'inline-num': { name: '数字', layout: inlineNumericLayout },
    decimal: { name: '数字', layout: decimalLayout },
    all: { name: '字母', layout: allLayout },
    num: { name: '数字', layout: numericLayout },
    system: { name: '系统输入法' },
};
