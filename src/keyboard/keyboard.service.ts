import { KeyboardInputEvent } from './keyboard.model';

/** 键盘组件相关服务 */
class KeyboardService {
    /** 键盘类型，默认数字键盘'num'，证件键盘'id' */
    private keyboardType = 'num';

    /** 键位是否随机 */
    private keyboardRandom = false;

    /** 显示关闭按钮 */
    private keyboardCloseAble = false;

    /** 显示虚拟光标 */
    private keyboardCaret = false;

    /** 该容器用于放置填充元素，当input下方无足够空间显示键盘时需在该容器内填入元素。默认为body */
    private keyboardContainer = 'body';

    /** 键盘是否打开 */
    private isOpened = false;

    /** 输入框 */
    private input: HTMLInputElement;

    /** 光标 */
    private caret: HTMLElement | undefined;

    /** 是否切换到系统输入法 */
    private hasChangeIM = false;

    /** 填充元素，用于input下方空间不够时撑起高度 */
    private filler: HTMLElement | undefined;

    /** 要放入填充元素的容器 */
    private fillerContainer: HTMLElement | undefined;

    /** 键盘高度 */
    private keyboardHeight!: number;

    constructor(options: any) {
        this.input = options.input;
        this.keyboardContainer =
            (options.container && options.container) || 'body';

        this.bindInputEvent();
    }

    bindInputEvent() {
        this.input.addEventListener('focus', this.inputOnFocus.bind(this));
        this.input.addEventListener('blur', this.inputOnBlur.bind(this));
    }

    unbindInputEvent() {
        this.input.removeEventListener('focus', this.inputOnFocus);
        this.input.removeEventListener('blur', this.inputOnBlur);
    }

    inputOnFocus(event: Event) {
        if (!this.hasChangeIM) {
            // 未切换到系统输入法时
            // 设置input不做表单校验
            this.input.setAttribute('novalidate', 'novalidate');
            // 避免显示默认键盘
            this.input.blur();

            const iosVer = window.navigator.userAgent
                .toLowerCase()
                .match(/cpu iphone os (.*?) like mac os/);
            if (iosVer) {
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
        // 如键盘还未打开
        if (!this.isOpened) {
            // 创建键盘
            // this.createKeyboard();
            this.isOpened = true;
            // 设置光标
            this.setCaret();
        }
    }

    /** 关闭键盘 */
    closeKeyboard() {
        console.log('closeKeyboard');

        if (this.isOpened) {
            // 取消订阅键盘相关事件
            // this.unsubscribeEvent();
            //  销毁键盘组件
            // this.destroyComponent(this.keyboardRef);
            this.isOpened = false;
            // 移除光标
            this.removeCaret();
            // 调整页面空间
            this.resizePage();
        }
    }

    /** 键盘打开事件 */
    onOpen($event: any) {
        // 获取键盘高度
        this.keyboardHeight = $event.height;
        // 调整页面空间
        this.resizePage();
    }
    /** 键盘关闭事件 */
    onClose(action?: string) {
        // 延时，避免点击穿透
        setTimeout(() => {
            this.closeKeyboard();

            // 移除input不做表单校验的标识
            this.input.removeAttribute('novalidate');
            // 如不是切换输入法，关闭时触发自定义的input blur事件
            if (action !== 'changeIM') {
                const blurEvent = new CustomEvent('keyboardInputBlur', {
                    detail: {
                        input: this.input,
                    },
                });
                this.input.dispatchEvent(blurEvent);
            }
        }, 50);
        if (action === 'changeIM') {
            this.hasChangeIM = true;
        }
    }

    /** 键盘输入事件 */
    onInput($event: KeyboardInputEvent) {
        if ($event.type === 'add') {
            const maxLength = parseInt(
                this.input.getAttribute('maxLength') || '0',
                10
            );
            this.input.value = this.add(
                this.input.value,
                $event.value,
                maxLength
            );
        } else if ($event.type === 'delete') {
            this.input.value = this.delete(this.input.value);
        } else if ($event.type === 'clear') {
            this.input.value = this.clear();
        }

        // this.setCaret();
        // 派发input输入事件
        const inputEvent = new Event('input', { bubbles: true });
        this.input.dispatchEvent(inputEvent);
    }
    /** 清空字符 */
    clear() {
        return '';
    }

    /** 删除字符 */
    delete(value: string) {
        if (value) {
            value = value.substr(0, value.length - 1);
        }
        return value;
    }

    /**  添加字符 */
    add(value: string, str: string, maxLength: number) {
        value += str;
        if (maxLength) {
            value = value.substr(0, maxLength);
        }
        return value;
    }

    /** 设置输入框光标 */
    setCaret() {
        if (!this.keyboardCaret) {
            return;
        }
        const input = this.input,
            inputStyles: any = window.getComputedStyle(input, null);
        let caret = this.caret;
        if (!caret) {
            caret = document.createElement('div');
            // renderer.addClass(caret, 'ui-keyboard-caret');
            const parent = input.parentNode;
            parent!.appendChild(caret);
            caret.style.height =
                parseInt(inputStyles['font-size'], 10) + 2 + 'px';
        }
        if (inputStyles['text-align'] === 'right') {
            // 输入框文字右对齐
            caret.style.right = '0';
        } else {
            // 获取输入的文本宽度
            const textWidth = this.getTextWidth(input);
            caret.style.left = textWidth + 'px';
        }

        this.caret = caret;
    }

    /** 移除输入框光标 */
    removeCaret() {
        if (this.caret) {
            this.caret.parentNode!.removeChild(this.caret);
            this.caret = undefined;
        }
    }

    /** 调整页面空间 */
    resizePage() {
        if (!this.fillerContainer) {
            if (this.keyboardContainer === 'body') {
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
        const inputItem = this.input.parentElement, // input所在的表单项元素
            container = this.fillerContainer;

        // 获取底部空间
        const bottomSpace =
            container!.getClientRects()[0].bottom -
            inputItem!.getClientRects()[0].bottom;
        if (bottomSpace < this.keyboardHeight) {
            // 设置填充元素
            this.filler = document.createElement('div');
            // renderer.addClass(this.filler, 'ui-keyboard-container-filler');
            container!.appendChild(this.filler);
            this.filler.style.height = this.keyboardHeight - bottomSpace + 'px';
            // 填充元素滚动到可视区域
            this.filler!.scrollIntoView(false);
        }
    }

    /** 移除页面底部填充 */
    removeFiller() {
        if (this.filler) {
            this.filler.parentNode?.removeChild(this.filler);
            this.filler = undefined;
        }
    }

    /** 获取input输入内容的宽度 */
    getTextWidth(input: HTMLInputElement) {
        let width;

        if (input.type === 'password') {
            const isIos = !!window.navigator.userAgent.match(
                    /\(i[^;]+;(U;)? CPU.+Mac OS X/
                ),
                dotWidth = isIos ? 10 : 6; // 密码圆点宽度
            width = input.value.length * dotWidth;
        } else {
            const inputStyles: any = window.getComputedStyle(input, null);
            // 生成dom元素，插入input文本并设置对应样式以获取宽度
            const fakeInput = document.createElement('div'),
                styles = [
                    'font-size',
                    'font-family',
                    'font-style',
                    'font-weight',
                    'letter-spacing',
                    'text-indent',
                ];
            styles.map((value: any) => {
                fakeInput.style[value] = inputStyles[value];
            });
            fakeInput.style.position = 'absolute';
            fakeInput.style.float = 'left';
            fakeInput.style.visibility = 'hidden';
            fakeInput.style.whiteSpace = 'nowrap';

            const textContent = document.createTextNode(input.value);
            fakeInput.appendChild(textContent);
            document.body.appendChild(fakeInput);
            width = fakeInput.offsetWidth;
            document.body.removeChild(fakeInput);
        }
        return width;
    }
}

export default KeyboardService;
