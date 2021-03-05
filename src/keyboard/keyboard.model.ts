/** Interface that can be used to generically type a class. */
export interface ComponentType<T> {
    new (...args: any[]): T;
}

/** 单个键盘按键 */
export interface KeyPressInterface {
    /** 功能键 */
    special: boolean;
    /** 显示键名 */
    keyText: string;
    /** 实际键值 */
    keyValue?: string;
}

/** 键盘按键布局 */
export interface KeyInterface {
    /** 按键 */
    key: KeyPressInterface;
    /** 占据空间：列数 */
    col: number;
    /** 占据空间：行数 */
    row: number;
}

/** 键盘布局type */
export type KeyboardLayout = string[][];

/** 自定义键盘输入事件 */
export interface KeyboardInputEvent {
    /** 事件类型 */
    type: string;
    /** 事件数据 */
    value?: any;
}
