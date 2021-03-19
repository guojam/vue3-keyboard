<template>
    <input :type="inputType" :name="inputName" :id="inputId" ref="inputRef" />
    <teleport to="body">
        <app-keyboard
            v-show="keyboardService.showKeyboard"
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
import KeyboardService from '../../keyboard.service';

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
        const state = reactive({
            inputRef: null,
            inputName: props.name,
            inputType: props.type,
            inputId: props.id,
            keyboardService: null,
        });

        const onKeyboardInput = (ev) => {
            const { type, value } = ev;
            if (type === 'add') {
                const maxLength = parseInt(
                    state.inputRef.getAttribute('maxLength') || '0',
                    10
                );
                state.inputRef.value = state.keyboardService.add(
                    state.inputRef.value,
                    value,
                    maxLength
                );
            } else if (type === 'delete') {
                state.inputRef.value = state.keyboardService.delete(
                    state.inputRef.value
                );
            } else if (type === 'clear') {
                state.inputRef.value = state.keyboardService.clear();
            }
        };
        onMounted(() => {
            if (state.inputRef) {
                state.keyboardService = new KeyboardService({
                    input: state.inputRef,
                });
            }
        });
        return {
            ...toRefs(state),
            onKeyboardInput,
        };
    },
});
</script>
