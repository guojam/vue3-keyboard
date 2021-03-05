import { KeyboardLayout } from './keyboard.model';

/**
 * 软键盘布局定义
 */

/** 纯数字键盘布局 - 带完成按钮 */
export const numericLayout: KeyboardLayout = [
    ['1', '2', '3', 'backspace:1:2'],
    ['4', '5', '6'],
    ['7', '8', '9', 'submit:1:2'],
    ['clear', '0'],
];

/** 数字键盘布局带小数点 - 带完成按钮 */
export const decimalLayout: KeyboardLayout = [
    ['1', '2', '3', 'backspace:1:2'],
    ['4', '5', '6'],
    ['7', '8', '9', 'submit:1:2'],
    ['clear', '0', 'point'],
];

/** 纯数字键盘布局 */
export const inlineNumericLayout: KeyboardLayout = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['clear', '0', 'backspace'],
];

/** 身份证键盘布局 - 带完成按钮  */
export const idLayout: KeyboardLayout = [
    ['1', '2', '3', 'backspace:1:2'],
    ['4', '5', '6'],
    ['7', '8', '9', 'submit:1:2'],
    ['clear', '0', 'X'],
];
