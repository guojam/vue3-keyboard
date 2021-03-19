<template>
    <input :type="inputType" :name="inputName" :id="inputId" ref="inputRef" />
    <teleport to="body">
        <app-keyboard
            v-show="keyboardState.isOpened"
            @keyboard-input="onKeyboardInput"
        ></app-keyboard>
    </teleport>
</template>

<script lang="ts">
import {
    defineComponent,
    onMounted,
    computed,
    reactive,
    ref,
    toRefs,
    toRaw,
} from 'vue';
import Keyboard from '../keyboard/keyboard.vue';
// import KeyboardService from '../../keyboard.service';

export default defineComponent({
    components: {
        'app-keyboard': Keyboard,
    },
    props: {
        name: String,
        id: String,
        type: {
            type: String,
            default: 'text',
        },
    },
    setup(props) {
        const showKeyboard = ref(false);
        const state = reactive({
            inputRef: null,
            inputName: props.name,
            inputType: props.type,
            inputId: props.id,
        });

        const keyboardState = reactive({
            /** 键盘类型，默认数字键盘'num'，证件键盘'id' */
            keyboardType: 'num',
            /** 键位是否随机 */
            keyboardRandom: false,
            /** 显示关闭按钮 */
            keyboardCloseAble: false,
            /** 显示虚拟光标 */
            keyboardCaret: false,
            /** 该容器用于放置填充元素，当input下方无足够空间显示键盘时需在该容器内填入元素。默认为body */
            keyboardContainer: 'body',
            /** 键盘是否打开 */
            isOpened: false,
            /** 光标 */
            caret: undefined,
            /** 是否切换到系统输入法 */
            hasChangeIM: false,
            /** 填充元素，用于input下方空间不够时撑起高度 */
            filler: undefined,
            /** 要放入填充元素的容器 */
            fillerContainer: undefined,
            /** 键盘高度 */
            keyboardHeight: undefined,
            /** 文档点击监听 */
            docClickHandler: undefined,
            /** 路由跳转事件订阅 */
            // routerSub: undefined,
        });

        const inputOnFocus = (event: Event) => {
            console.log('inputOnFocus');
            if (!keyboardState.hasChangeIM) {
                // 未切换到系统输入法时
                const input = state.inputRef;
                // 设置input不做表单校验
                input.setAttribute('novalidate', 'novalidate');
                // 避免显示默认键盘
                input.blur();

                const iosVer = window.navigator.userAgent
                    .toLowerCase()
                    .match(/cpu iphone os (.*?) like mac os/);
                if (iosVer) {
                    // ios11版本密码键盘延时出现，为兼容系统键盘收起较慢，系统键盘收起过程中造成密码键盘位置往上偏移
                    setTimeout(() => {
                        openKeyboard();
                    }, 100);
                } else {
                    openKeyboard();
                }
            }
        };

        const inputOnBlur = () => {
            console.log('inputOnBlur');
            if (keyboardState.hasChangeIM) {
                // 当使用系统输入法时，清除标识
                keyboardState.hasChangeIM = false;
            }
        };

        /** 打开键盘 */
        const openKeyboard = () => {
            // 如键盘还未打开
            if (!keyboardState.isOpened) {
                // 创建键盘
                // this.createKeyboard();
                keyboardState.isOpened = true;
                // 设置光标
                // setCaret();
            }
        };

        /** 关闭键盘 */
        const closeKeyboard = () => {
            console.log('closeKeyboard');

            if (keyboardState.isOpened) {
                // 取消订阅键盘相关事件
                // this.unsubscribeEvent();
                //  销毁键盘组件
                // this.destroyComponent(this.keyboardRef);
                keyboardState.isOpened = false;
                // 移除光标
                // removeCaret();
                // 调整页面空间
                resizePage();
            }
        };

        /** 键盘打开事件 */
        const onOpen = ($event: any) => {
            // 获取键盘高度
            keyboardState.keyboardHeight = $event.height;
            // 调整页面空间
            resizePage();
        };

        /** 键盘关闭事件 */
        const onClose = (action?: string) => {
            const input = state.inputRef;
            // 延时，避免点击穿透
            setTimeout(() => {
                closeKeyboard();

                // 移除input不做表单校验的标识
                input.removeAttribute('novalidate');
                // 如不是切换输入法，关闭时触发自定义的input blur事件
                if (action !== 'changeIM') {
                    const blurEvent = new CustomEvent('keyboardInputBlur', {
                        detail: {
                            input,
                        },
                    });
                    input.dispatchEvent(blurEvent);
                }
            }, 50);
            if (action === 'changeIM') {
                keyboardState.hasChangeIM = true;
            }
        };

        const bindInputEvent = () => {
            const input = state.inputRef;
            input.addEventListener('focus', inputOnFocus);
            input.addEventListener('blur', inputOnBlur);
        };

        const unbindInputEvent = () => {
            const input = state.inputRef;
            input.removeEventListener('focus', inputOnFocus);
            input.removeEventListener('blur', inputOnBlur);
        };

        const onKeyboardInput = (ev) => {
            const input = state.inputRef;
            const { type, value } = ev;
            if (type === 'add') {
                const maxLength = parseInt(
                    input.getAttribute('maxLength') || '0',
                    10
                );
                input.value = inputAdd(input.value, value, maxLength);
            } else if (type === 'delete') {
                input.value = inputDelete(input.value);
            } else if (type === 'clear') {
                input.value = inputClear();
            }
        };

        /** 订阅相关事件 */
        const subscribeEvent = () => {
            const input = state.inputRef;
            // 监听body点击事件
            keyboardState.docClickHandler = document.addEventListener(
                'click',
                (ev: Event) => {
                    // 如点击对象不是当前输入框, 关闭键盘
                    if (event.target !== input) {
                        closeKeyboard();
                    } else {
                        // ios下通过input click来触发focus弹出键盘
                        input.focus();
                    }
                }
            );

            // 监听路由跳转事件
            //  keyboardState.routerSub = this.router.events.subscribe((event) => {
            //     if (event instanceof NavigationStart) {
            //         // 路由跳转时关闭键盘
            //         closeKeyboard();
            //     }
            // });
        };

        /** 取消订阅相关事件 */
        const unsubscribeEvent = () => {
            // 移除body点击监听器
            keyboardState.docClickHandler();

            // 取消订阅路由跳转事件
            //  keyboardState.routerSub.unsubscribe();
        };

        /** 清空字符 */
        const inputClear = () => {
            return '';
        };

        /** 删除字符 */
        const inputDelete = (value: string) => {
            if (value) {
                value = value.substr(0, value.length - 1);
            }
            return value;
        };

        /**  添加字符 */
        const inputAdd = (value: string, str: string, maxLength: number) => {
            value += str;
            if (maxLength) {
                value = value.substr(0, maxLength);
            }
            return value;
        };

        /** 设置输入框光标 */
        const setCaret = () => {
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
        };

        /** 移除输入框光标 */
        const removeCaret = () => {
            if (this.caret) {
                this.caret.parentNode!.removeChild(this.caret);
                this.caret = undefined;
            }
        };

        /** 调整页面空间 */
        const resizePage = () => {
            if (!keyboardState.fillerContainer) {
                if (keyboardState.keyboardContainer === 'body') {
                    keyboardState.fillerContainer = document.body;
                } else {
                    keyboardState.fillerContainer = <HTMLElement>(
                        document.body.querySelector(
                            keyboardState.keyboardContainer
                        )
                    );
                }
            }
            if (keyboardState.isOpened) {
                // 键盘已打开
                setFiller();
            } else {
                // 键盘已关闭
                removeFiller();
            }
        };

        /** 填充页面底部 */
        const setFiller = () => {
            const inputItem = this.input.parentElement, // input所在的表单项元素
                container = this.fillerContainer;

            // 获取底部空间
            const bottomSpace =
                container!.getClientRects()[0].bottom -
                inputItem!.getClientRects()[0].bottom;
            if (bottomSpace < this.keyboardHeight) {
                // 设置填充元素
                keyboardState.filler = document.createElement('div');
                // renderer.addClass(keyboardState.filler, 'ui-keyboard-container-filler');
                container!.appendChild(keyboardState.filler);
                keyboardState.filler.style.height =
                    this.keyboardHeight - bottomSpace + 'px';
                // 填充元素滚动到可视区域
                keyboardState.filler!.scrollIntoView(false);
            }
        };

        /** 移除页面底部填充 */
        const removeFiller = () => {
            if (keyboardState.filler) {
                keyboardState.filler.parentNode?.removeChild(this.filler);
                keyboardState.filler = undefined;
            }
        };

        /** 获取input输入内容的宽度 */
        const getTextWidth = (input: HTMLInputElement) => {
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
        };

        onMounted(() => {
            if (state.inputRef) {
                keyboardState.keyboardContainer = 'body';
                bindInputEvent();

                subscribeEvent();
            }
        });
        return {
            ...toRefs(state),
            keyboardState,
            onKeyboardInput,
        };
    },
});
</script>
