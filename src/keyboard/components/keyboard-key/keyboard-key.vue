<template>
    <span
        :class="[currentClasses]"
        @[touchEvent.start].stop
        @[touchEvent.end].stop="onTouchend"
        @contextmenu.prevent
        v-keyboard-press="onLongPress"
    >
        {{ currentText }}
    </span>
</template>
<script lang="ts">
import {
    computed,
    defineComponent,
    PropType,
    reactive,
    toRaw,
    toRefs,
} from 'vue';
import { longpressDirective } from '../../directives/longpress.directive';
import { KeyPressInterface } from '../../keyboard.model';
import { touchEvent } from '../../utils';
export default defineComponent({
    name: 'app-keyboard-key',
    directives: {
        keyboardPress: longpressDirective,
    },
    props: {
        /** 按键数据 */
        keyData: {
            type: Object as PropType<KeyPressInterface>,
            required: true,
        },
        /** 是否换挡 */
        shift: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, context) {
        const state = reactive({
            /** 当前按键对象 */
            currentKey: props.keyData,
            /** 删除键被长按 */
            delIsPressed: false,
            /** 触摸事件 */
            touchEvent,
        });

        /** 按键样式 */
        const currentClasses = computed(() => {
            let style = 'btn';
            if (!state.currentKey.special) {
                style += ' btn-num';
            }

            const keyValue = state.currentKey.keyValue;
            if (keyValue) {
                style += ' btn-' + keyValue.toLowerCase();
            }
            return style;
        });

        /** 按键文字 */
        const currentText = computed(() => {
            const currentKey = state.currentKey;
            let text = currentKey.keyText;
            if (!currentKey.special) {
                if (props.shift) {
                    return text.toUpperCase();
                }
            }
            return text;
        });

        const onTouchend = () => {
            const key = toRaw(state.currentKey);

            // 如已长按删除键
            if (state.delIsPressed) {
                // 清除长按标志，不传递按键事件
                state.delIsPressed = false;
            } else {
                // 弹射按键数据
                context.emit('key-press', {
                    key,
                    type: 'tap',
                });
            }
        };

        const onLongPress = () => {
            const key = toRaw(state.currentKey);
            const keyValue = state.currentKey.keyValue;
            if (keyValue === 'backspace') {
                // 标识删除按键被长按，在touchend触发时如有该标识，不再次执行删除
                state.delIsPressed = true;
                // 弹射按键数据
                context.emit('key-press', {
                    key,
                    type: 'press',
                });
            }
        };

        return {
            ...toRefs(state),
            currentClasses,
            currentText,
            onTouchend,
            onLongPress,
        };
    },
});
</script>

<style scoped lang="scss" src="./keyboard-key.scss"></style>
