import {
    idLayout,
    inlineNumericLayout,
    numericLayout,
    decimalLayout,
    allLayout,
} from './keyboard.layout';
import { KeyInterface } from './keyboard.model';

/** 键盘布局Map */
const layoutArrayMap = new Map([
    ['id', idLayout],
    ['inline-num', inlineNumericLayout],
    ['decimal', decimalLayout],
    ['all', allLayout],
    ['num', numericLayout],
]);
/**
 * 软键盘布局服务
 */
class KeyboardLayoutService {
    /** 获取键盘布局 */
    getLayout(type: string, random = false): KeyInterface[][] {
        const layoutArray = layoutArrayMap.get(type);
        // 获取键盘按键数据
        let randomKey: string[];
        // 数字键随机布局
        if (
            random &&
            (type === 'num' || type === 'inline-num' || type === 'id')
        ) {
            const keyArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            randomKey = this.getRandomArray(keyArray);
        }
        // 将键盘布局数组转换为对应的按键数组
        return layoutArray!.map((row: string[]): KeyInterface[] => {
            return row.map(
                (keyStr: string): KeyInterface => {
                    return this.getKeyData(keyStr, randomKey);
                }
            );
        });
    }

    /** 获取键盘布局对应的按键数据 */
    private getKeyData(keyStr: string, randomKey?: any[]): KeyInterface {
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

    /** 数组随机排序 */
    private getRandomArray(arr: string[]): string[] {
        return arr.sort(() => {
            return 0.5 - Math.random();
        });
    }
}

export default new KeyboardLayoutService();
