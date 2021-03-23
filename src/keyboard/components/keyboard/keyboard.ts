import {
    defineComponent,
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

        /** 路由跳转事件订阅 */
        // private routerSub!: Subscription;

        const state = reactive({
            wrapperRef: undefined as HTMLElement | undefined,
            /** 默认键盘布局 */
            layout: [] as KeyInterface[][],
            shift: false,
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
        const changeInputMethod = () => {
            context.emit('keyboard-close', 'changeIM');
        };

        /** 初始化键盘布局 */
        const initLayout = () => {
            state.layout = keyboardLayoutService.getLayout(
                props.type,
                props.random
            );
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
            initLayout();
            subscribeEvent();
            const wrapper = state.wrapperRef;
            // 弹射键盘打开事件
            if (wrapper) {
                context.emit('keyboard-open', {
                    height: wrapper.offsetHeight, // 键盘高度
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
