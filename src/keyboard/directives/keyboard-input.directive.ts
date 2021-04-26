import { KeyboardProps } from '../keyboard.model';
import { KeyboardInputService } from './keyboard-input.service';

let keyboardInputService: KeyboardInputService;

/** 软键盘输入框指令 */
const keyboardInputDirective = {
    mounted(el: HTMLInputElement, binding: any) {
        const {
            /** 键位是否随机排序 */
            random,
            /** 显示关闭按钮 */
            closeAble,
            /** 可切换的输入法 */
            inputMethod,
            /** 键盘容器样式名 */
            style,
        } = binding.value;
        const props: KeyboardProps = {
            random,
            closeAble,
            style,
            inputMethods:
                inputMethod &&
                inputMethod.split(',').map((value: string) => value.trim()),
        };
        keyboardInputService = new KeyboardInputService(el, props);
    },
    unmounted() {
        keyboardInputService.destroy();
    },
};

export { keyboardInputDirective };
