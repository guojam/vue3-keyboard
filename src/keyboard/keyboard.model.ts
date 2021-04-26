/**
 * 键盘组件数据模型
 */

/** 按键 */
export interface KeyPressInterface {
    /** 功能键 */
    special: boolean;
    /** 显示键名 */
    keyText: string;
    /** 实际键值 */
    keyValue?: string;
}

/** 按键布局 */
export interface KeyInterface {
    /** 按键 */
    key: KeyPressInterface;
    /** 占据空间：列数 */
    col: number;
    /** 占据空间：行数 */
    row: number;
}

/** 键盘布局 */
export type KeyboardLayout = string[][];

/** 自定义键盘输入事件 */
export interface KeyboardInputEvent {
    /** 事件类型 */
    type: string;
    /** 事件数据 */
    value?: any;
}

/** 键盘组件参数 */
export interface KeyboardProps {
    /** 可切换的输入法 */
    inputMethods: string[];
    /** 键位是否随机排序 */
    random?: boolean;
    /** 显示关闭按钮 */
    closeAble?: boolean;
    /** 键盘容器样式名 */
    style?: string;
    /** 其他属性 */
    [propName: string]: any;
}

/** 键盘类型 */
export type KeyboardType =
    | 'id'
    | 'inline-num'
    | 'decimal'
    | 'all'
    | 'num'
    | 'system';

/** 键盘布局汇总 */
export type KeyboardLayouts = {
    [propName in KeyboardType]?: { name: string; layout?: KeyboardLayout };
};
