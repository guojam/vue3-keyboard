import {
    defineComponent,
    nextTick,
    onBeforeMount,
    onMounted,
    onBeforeUpdate,
    onUpdated,
    onBeforeUnmount,
    onUnmounted,
    onActivated,
    onDeactivated,
    onErrorCaptured,
    reactive,
    toRaw,
    shallowRef,
    toRefs,
} from 'vue';
import { KeyInterface } from '../../keyboard.model';
import KeyboardKey from '../keyboard-key/keyboard-key.vue';
import keyboardLayoutService from '../../keyboard-layout.service';
import { inputMethodsName } from '../../keyboard.layout';

export default defineComponent({
    components: { 'app-keyboard-key': KeyboardKey },
    props: {
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

        /** 可切换的输入法 */
        inputMethod: {
            type: String,
            default: '',
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

        /** 路由跳转事件订阅 */
        // private routerSub!: Subscription;

        const state = reactive({
            wrapperRef: undefined as HTMLElement | undefined,
            /** 默认键盘布局 */
            layout: [] as KeyInterface[][],
            shift: false,
            /** 当前输入法 */
            currentMethod: props.type,
            inputMethods: props.inputMethod
                .split(',')
                .map((value) => value.trim()),
            inputMethodsName,
        });

        /** 按键 */
        const onKeyPress = ($event: any) => {
            const key = $event.key,
                type = $event.type;
            if (key.special) {
                // 功能键
                switch (key.keyValue) {
                    case 'backspace':
                        // 删除input value
                        inputDelete();
                        break;
                    case 'clear':
                        // 清空input value
                        inputClear();
                        break;
                    case 'submit':
                        // 关闭键盘
                        close();
                        break;
                    case 'roman10':
                        // 罗马数字10
                        inputAdd(key.keyText);
                        break;
                    case 'shift':
                        // 换挡
                        state.shift = !state.shift;
                        break;
                    default:
                        break;
                }
            } else {
                // 非特殊键
                if (state.shift) {
                    inputAdd(key.keyValue.toUpperCase());
                } else {
                    inputAdd(key.keyValue);
                }
            }
        };

        /** 清空字符 */
        const inputClear = () => {
            context.emit('keyboard-input', { type: 'clear' });
        };

        /** 删除字符 */
        const inputDelete = () => {
            context.emit('keyboard-input', { type: 'delete' });
        };

        /**  添加字符 */
        const inputAdd = (value: string) => {
            context.emit('keyboard-input', { type: 'add', value });
        };

        /** 关闭键盘 */
        const close = () => {
            context.emit('keyboard-close');
        };

        /** 切换输入法 */
        const changeInputMethod = (method: string) => {
            if (method === 'system') {
                // 切换到原生输入法
                context.emit('keyboard-close', 'changeIM');
            } else {
                // 修改键盘
                state.currentMethod = method;
                initLayout(method, props.random);
            }
        };

        /** 初始化键盘布局 */
        const initLayout = (type: string, random?: boolean) => {
            state.layout = keyboardLayoutService.getLayout(type, random);
        };

        /** 点击文档事件 */
        const docClickHandler = (event: Event) => {
            context.emit('keyboard-doc-click', event.target);
        };

        /** 订阅相关事件 */
        const subscribeEvent = () => {
            console.log('document.addEventListener docClickHandler');
            // 监听body点击事件
            document.addEventListener('click', docClickHandler);
        };

        /** 取消订阅相关事件 */
        const unsubscribeEvent = () => {
            console.log('document.removeEventListener docClickHandler');
            // 移除body点击监听器
            document.removeEventListener('click', docClickHandler);
        };

        onMounted(() => {
            // 初始化键盘布局
            initLayout(state.currentMethod, props.random);
            subscribeEvent();
            const wrapper = state.wrapperRef;
            // 弹射键盘打开事件
            if (wrapper) {
                nextTick(() => {
                    // 键盘高度
                    const height = wrapper.offsetHeight;
                    context.emit('keyboard-open', {
                        height,
                    });
                });
            }
        });

        onBeforeUnmount(() => {
            console.log('onBeforeUnmount');
            unsubscribeEvent();
        });

        return {
            ...toRefs(state),
            onKeyPress,
            changeInputMethod,
        };
    },
});
