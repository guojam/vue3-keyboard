import {
    defineComponent,
    onMounted,
    reactive,
    toRaw,
    shallowRef,
    toRefs,
} from 'vue';
import { KeyInterface } from '../../keyboard.model';
import KeyboardKey from '../keyboard-key/keyboard-key.vue';
import keyboardLayoutService from '../../keyboard-layout.service';
import KeyboardService from '../../keyboard.service';

export default defineComponent({
    components: { 'app-keyboard-key': KeyboardKey },
    props: {
        /** 键盘对应的输入框 */
        input: {
            type: HTMLInputElement,
            required: true,
        },
        // @Input() input!: HTMLInputElement;

        /** 键盘类型，默认数字键盘'num'，证件键盘'id' */
        type: {
            type: String,
            default: 'num',
        },

        /** 键位是否随机排序 */
        random: {
            type: Boolean,
            default: false,
        },

        /** 该容器用于放置填充元素，当input下方无足够空间显示键盘时需在该容器内填入元素 */
        // @Input() container!: string;

        /** 显示关闭按钮 */
        closeAble: {
            type: Boolean,
            default: false,
        },

        /** 显示切换输入法按钮 */
        switchAble: {
            type: Boolean,
            default: false,
        },

        /** 键盘容器样式名 */
        style: {
            type: String,
            default: '',
        },
    },

    setup(props, context) {
        // @Output() onOpen = new EventEmitter<any>();
        // @Output() onClose = new EventEmitter<any>();
        // @Output() onInput = new EventEmitter<any>();

        /** 文档点击监听 */
        // private docClickHandler: any;

        /** 路由跳转事件订阅 */
        // private routerSub!: Subscription;

        const keyboardService = new KeyboardService({
            input: props.input,
        });

        const state = reactive({
            /** 默认键盘布局 */
            layout: [] as KeyInterface[][],
            /** 删除键长按计时器 */
            delTimeOut: null as number | null,
        });

        /** 按键 */
        const onKeyPress = ($event: any) => {
            const key = $event.key,
                type = $event.type;
            console.log('onKeyPress:', key, type);
            // 清除长按删除
            // this.clearPressDel();
            if (key.special) {
                // 功能键
                if (key.keyValue === 'backspace') {
                    // 删除键
                    if (type === 'press') {
                        // 长按
                        // 设置长按删除
                        // this.setPressDel();
                    } else {
                        // 单次点击
                        // 删除input value
                        inputDelete();
                    }
                }
                if (key.keyValue === 'clear') {
                    // 清空键
                    // 清空input value
                    inputClear();
                }
                if (key.keyValue === 'submit') {
                    // 完成键
                    // 关闭键盘
                    // this.close();
                }
            } else {
                // 数字键
                inputAdd(key.keyValue);
            }
        };

        /** 清空字符 */
        const inputClear = () => {
            keyboardService.onInput({
                type: 'clear',
            });
        };

        /** 删除字符 */
        const inputDelete = () => {
            keyboardService.onInput({
                type: 'delete',
            });
        };

        /**  添加字符 */
        const inputAdd = (value: string) => {
            keyboardService.onInput({
                type: 'add',
                value,
            });
        };

        /** 设置长按删除 */
        const setPressDel = () => {
            state.delTimeOut = setInterval(() => {
                // 删除input value
                inputDelete();
            }, 100);
        };

        /** 清除长按删除 */
        const clearPressDel = () => {
            // 清除持续删除定时器
            if (state.delTimeOut) {
                clearInterval(state.delTimeOut);
            }
        };

        onMounted(() => {
            // 初始化键盘布局
            state.layout = keyboardLayoutService.getLayout(
                props.type,
                props.random
            );
        });

        return {
            ...toRefs(state),
            onKeyPress,
        };
    },
});
