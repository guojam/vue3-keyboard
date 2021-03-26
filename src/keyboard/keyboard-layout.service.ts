import {
    idLayout,
    inlineNumericLayout,
    numericLayout,
    decimalLayout,
    allLayout,
} from './keyboard.layout';
import { KeyInterface, KeyboardLayout } from './keyboard.model';

/**
 * 软键盘布局服务
 */
class KeyboardLayoutService {
    /** 获取键盘布局 */
    getLayout(type: string, random?: boolean) {
        let layout: KeyInterface[][];
        // 获取键盘按键数据
        if (type === 'id') {
            layout = this.getKeyArray(idLayout, random);
        } else if (type === 'inline-num') {
            layout = this.getKeyArray(inlineNumericLayout, random);
        } else if (type === 'decimal') {
            layout = this.getKeyArray(decimalLayout, random);
        } else if (type === 'all') {
            layout = this.getKeyArray(allLayout, random);
        } else {
            layout = this.getKeyArray(numericLayout, random);
        }
        return layout;
    }

    /** 将键盘布局数组转换为对应的按键数组 */
    private getKeyArray(
        layoutArray: KeyboardLayout,
        isRandom?: boolean
    ): KeyInterface[][] {
        let randomKey: string[];
        // 数字键随机布局
        if (isRandom) {
            const keyArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            randomKey = this.getRandomArray(keyArray);
        }
        return layoutArray.map((row: string[]): KeyInterface[] => {
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
