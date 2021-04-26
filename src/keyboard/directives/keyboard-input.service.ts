import createComponent from '../create-component';
import KeyboardComponent from '../components/keyboard/keyboard.vue';
import { KeyboardProps, KeyboardInputEvent } from '../keyboard.model';
import { focusInput, isIOS } from '../utils';

/**
 * 软键盘相关服务
 */
class KeyboardInputService {
    inputEl: HTMLInputElement;
    /** 键盘组件参数 */
    props: KeyboardProps;
    /** 键位是否随机 */
    keyboardRandom = false;
    /** 显示关闭按钮 */
    keyboardCloseAble = false;
    /** 该容器用于放置填充元素，当input下方无足够空间显示键盘时需在该容器内填入元素。默认为body */
    keyboardContainer = 'body';
    /** 键盘是否打开 */
    isOpened = false;
    /** 是否切换到系统输入法 */
    hasChangeIM = false;
    /** 填充元素，用于input下方空间不够时撑起高度 */
    filler: undefined | HTMLElement;
    /** 要放入填充元素的容器 */
    fillerContainer: undefined | HTMLElement;
    /** 键盘高度 */
    keyboardHeight!: number;
    /** 销毁键盘组件 */
    keyboardDestroy = () => {};

    constructor(input: HTMLInputElement, props: KeyboardProps) {
        this.inputEl = input;
        this.props = props;
        this.bindInputEvent();
    }

    inputOnFocus(event: Event) {
        const input = this.inputEl;
        if (!this.hasChangeIM) {
            // 未切换到系统输入法时
            // 设置input不做表单校验
            input.setAttribute('novalidate', 'novalidate');
            // 避免显示默认键盘
            input.blur();

            if (isIOS) {
                // ios11版本密码键盘延时出现，为兼容系统键盘收起较慢，系统键盘收起过程中造成密码键盘位置往上偏移
                setTimeout(() => {
                    this.openKeyboard();
                }, 100);
            } else {
                this.openKeyboard();
            }
        }
    }

    inputOnBlur() {
        if (this.hasChangeIM) {
            // 当使用系统输入法时，清除标识
            this.hasChangeIM = false;
        }
    }

    /** 打开键盘 */
    openKeyboard() {
        if (!this.isOpened) {
            this.isOpened = true;
            this.createKeyboard();
            this.inputEl.classList.add('focus');
        }
    }

    /** 关闭键盘 */
    closeKeyboard() {
        if (this.isOpened) {
            this.isOpened = false;
            this.destroy();
            this.resizePage();
            this.inputEl.classList.remove('focus');
        }
    }

    /** 键盘打开事件 */
    onKeyboardOpen($event: any) {
        // 获取键盘高度
        this.keyboardHeight = $event.height;
        this.resizePage();
    }

    /** 键盘关闭事件 */
    onKeyboardClose(action?: string) {
        const input = this.inputEl;
        // 延时，避免点击穿透
        setTimeout(() => {
            this.closeKeyboard();
            // 移除input不做表单校验的标识
            input.removeAttribute('novalidate');
            if (action === 'changeIM') {
                this.hasChangeIM = true;
                focusInput(input);
            } else {
                // 如不是切换输入法，关闭时触发自定义的input blur事件
                const blurEvent = new CustomEvent('keyboardInputBlur', {
                    detail: {
                        input,
                    },
                });
                input.dispatchEvent(blurEvent);
            }
        }, 50);
    }

    bindInputEvent() {
        const input = this.inputEl;
        input.addEventListener('focus', this.inputOnFocus.bind(this));
        input.addEventListener('blur', this.inputOnBlur.bind(this));
    }

    unbindInputEvent() {
        const input = this.inputEl;
        input.removeEventListener('focus', this.inputOnFocus);
        input.removeEventListener('blur', this.inputOnBlur);
    }

    /** 键盘输入事件 */
    onKeyboardInput(ev: KeyboardInputEvent) {
        const input = this.inputEl;
        const { type, value } = ev;
        if (type === 'add') {
            const maxLength = parseInt(
                input.getAttribute('maxLength') || '0',
                10
            );
            input.value = this.inputAdd(input.value, value, maxLength);
        } else if (type === 'delete') {
            input.value = this.inputDelete(input.value);
        } else if (type === 'clear') {
            input.value = '';
        }
    }

    /** 键盘文档点击事件 */
    onKeyboardDocClick(target: Element) {
        const input = this.inputEl;
        // 如点击对象不是当前输入框, 关闭键盘
        if (target !== input) {
            this.closeKeyboard();
        } else {
            // ios下通过input click来触发focus弹出键盘
            input.focus();
        }
    }

    /** 删除字符 */
    inputDelete(value: string) {
        if (value) {
            value = value.substr(0, value.length - 1);
        }
        return value;
    }

    /**  添加字符 */
    inputAdd(value: string, str: string, maxLength: number) {
        value += str;
        if (maxLength) {
            value = value.substr(0, maxLength);
        }
        return value;
    }

    /** 调整页面空间 */
    resizePage() {
        let fillerContainer = this.fillerContainer;
        if (!fillerContainer) {
            const keyboardContainer = this.keyboardContainer;
            if (keyboardContainer === 'body') {
                this.fillerContainer = document.body;
            } else {
                this.fillerContainer = <HTMLElement>(
                    document.body.querySelector(this.keyboardContainer)
                );
            }
        }
        if (this.isOpened) {
            // 键盘已打开
            this.setFiller();
        } else {
            // 键盘已关闭
            this.removeFiller();
        }
    }

    /** 填充页面底部 */
    setFiller() {
        const inputItem = this.inputEl.parentElement, // input所在的表单项元素
            container = this.fillerContainer;

        // 获取底部空间
        const bottomSpace =
            container!.getClientRects()[0].bottom -
            inputItem!.getClientRects()[0].bottom;
        if (bottomSpace < this.keyboardHeight) {
            // 设置填充元素
            const filler = document.createElement('div');
            filler.classList.add('ui-keyboard-container-filler');
            container!.appendChild(filler);
            const fillerHeight = this.keyboardHeight - bottomSpace;
            filler.style.height = fillerHeight + 'px';
            // 填充元素滚动到可视区域
            filler!.scrollIntoView(false);
            this.filler = filler;
        }
    }

    /** 移除页面底部填充 */
    removeFiller() {
        if (this.filler) {
            this.filler.parentNode?.removeChild(this.filler);
            this.filler = undefined;
        }
    }

    /** 销毁键盘组件 */
    destroy() {
        this.keyboardDestroy();
        this.unbindInputEvent();
    }

    /** 创建键盘组件 */
    createKeyboard() {
        const params: KeyboardProps = {
            ...this.props,
            onKeyboardOpen: this.onKeyboardOpen.bind(this),
            onKeyboardClose: this.onKeyboardClose.bind(this),
            onKeyboardInput: this.onKeyboardInput.bind(this),
            onKeyboardDocClick: this.onKeyboardDocClick.bind(this),
        };
        const { destroy } = createComponent(KeyboardComponent, params);
        this.keyboardDestroy = destroy;
    }
}
export { KeyboardInputService };
