import {
    defineComponent,
    nextTick,
    onBeforeUnmount,
    onMounted,
    PropType,
    reactive,
    toRefs,
} from 'vue';
import { getLayout } from '../../keyboard-layout.service';
import { keyboardLayouts } from '../../keyboard.layout';
import {
    KeyboardType,
    KeyInterface,
    KeyPressInterface,
} from '../../keyboard.model';
import { touchEvent } from '../../utils';
import KeyboardKeyComponent from '../keyboard-key/keyboard-key.vue';

export default defineComponent({
    components: { 'app-keyboard-key': KeyboardKeyComponent },
    props: {
        /** 键位是否随机排序 */
        random: {
            type: Boolean,
            default: false,
        },

        /** 显示关闭按钮 */
        closeAble: {
            type: Boolean,
            default: false,
        },

        /** 可切换的输入法 */
        inputMethods: {
            type: Array as PropType<KeyboardType[]>,
            required: true,
        },

        /** 键盘容器样式名 */
        style: {
            type: String,
            default: '',
        },
    },

    setup(props, context) {
        const state = reactive({
            wrapperRef: undefined as HTMLElement | undefined,
            /** 默认键盘布局 */
            layout: [] as KeyInterface[][],
            // grid容器样式
            gridStyle: {},
            shift: false,
            /** 当前输入法 */
            currentMethod: props.inputMethods![0],
            keyboardLayouts,
            /** 触摸事件 */
            touchEvent,
        });

        /** 按键 */
        const onKeyPress = ($event: {
            key: KeyPressInterface;
            type: string;
        }) => {
            const key = $event.key,
                type = $event.type;
            let value = key.keyValue;
            if (key.special) {
                // 功能键
                switch (value) {
                    case 'backspace':
                        // 删除input value
                        context.emit('keyboard-input', { type: 'delete' });
                        break;
                    case 'clear':
                        // 清空input value
                        context.emit('keyboard-input', { type: 'clear' });
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
                if (value) {
                    // 非特殊键
                    if (state.shift) {
                        value = value.toUpperCase();
                    }
                    inputAdd(value);
                }
            }
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
        const changeInputMethod = (method: KeyboardType) => {
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
        const initLayout = (type: KeyboardType, random?: boolean) => {
            const { layout, rowNum, colNum } = getLayout(type, random);
            state.layout = layout;
            state.gridStyle = {
                'grid-template-columns': '1fr '.repeat(colNum),
            };
        };

        /** 点击文档事件 */
        const docClickHandler = (event: Event) => {
            context.emit('keyboard-doc-click', event.target);
        };

        /** 订阅相关事件 */
        const subscribeEvent = () => {
            // 监听body点击事件
            document.addEventListener(touchEvent.end, docClickHandler);
        };

        /** 取消订阅相关事件 */
        const unsubscribeEvent = () => {
            // 移除body点击监听器
            document.removeEventListener(touchEvent.end, docClickHandler);
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
            unsubscribeEvent();
        });

        return {
            ...toRefs(state),
            onKeyPress,
            changeInputMethod,
        };
    },
});
