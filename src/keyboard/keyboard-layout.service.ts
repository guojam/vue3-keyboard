import { keyboardLayouts } from './keyboard.layout';
import { KeyInterface, KeyboardType } from './keyboard.model';
import { getRandomArray } from './utils';

/** 获取键盘布局 */
function getLayout(type: KeyboardType, random = false) {
    const layoutObj = keyboardLayouts[type];
    const layoutArray = layoutObj!.layout;
    // 获取键盘按键数据
    let randomKey: string[];
    // 数字键随机布局
    if (random && (type === 'num' || type === 'inline-num' || type === 'id')) {
        const keyArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        randomKey = getRandomArray(keyArray);
    }
    let rowNum = layoutArray!.length,
        colNum = 0;
    // 将键盘布局数组转换为对应的按键数组
    const layout = layoutArray!.map((row: string[]): KeyInterface[] => {
        colNum = Math.max(colNum, row.length);
        return row.map(
            (keyStr: string): KeyInterface => {
                return getKeyData(keyStr, randomKey);
            }
        );
    });
    return {
        rowNum,
        colNum,
        layout,
    };
}

/** 获取键盘布局对应的按键数据 */
function getKeyData(keyStr: string, randomKey: string[]): KeyInterface {
    const keyConfig = keyStr.split(':'),
        key = keyConfig[0],
        col = keyConfig[1] ? parseInt(keyConfig[1], 10) : 1,
        row = keyConfig[2] ? parseInt(keyConfig[2], 10) : 1;
    let isSpecial = false,
        keyText,
        keyValue;

    switch (key) {
        case 'backspace':
            // 删除键
            isSpecial = true;
            keyText = '⬅';
            keyValue = key;
            break;
        case 'submit':
            // 完成键
            isSpecial = true;
            keyText = '完成';
            keyValue = key;
            break;
        case 'clear':
            // 清空键
            isSpecial = true;
            keyText = '清空';
            keyValue = key;
            break;
        case 'shift':
            // 换挡键
            isSpecial = true;
            keyText = '⇧';
            keyValue = key;
            break;
        case 'roman10':
            // 罗马数字十
            isSpecial = true;
            keyText = 'X';
            keyValue = key;
            break;
        case 'point':
            // 小数点键
            keyText = '.';
            keyValue = '.';
            break;
        default:
            // 数字键
            if (randomKey) {
                const keyIndex = parseInt(key, 10);
                keyText = randomKey[keyIndex];
                keyValue = keyText;
            } else {
                keyText = key;
                keyValue = key;
            }
    }
    return {
        key: {
            special: isSpecial,
            keyText: keyText,
            keyValue: keyValue,
        },
        col: col,
        row: row,
    };
}

export { getLayout };
