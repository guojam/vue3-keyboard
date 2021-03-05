<template>
    <div class="wrap">
        <form action="">
            <div class="form-item">
                <label for="username">全键盘</label>
                <input type="text" id="username" ref="inputUsername" />
            </div>
            <div class="form-item">
                <label for="password">数字</label>
                <input type="password" id="password" ref="inputPassword" />
            </div>
        </form>
    </div>
    <app-keyboard
        :input="inputUsername"
        @keyboard-input="onKeyboardInput"
    ></app-keyboard>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { Keyboard } from './keyboard/';

export default defineComponent({
    name: 'App',
    components: {
        'app-keyboard': Keyboard,
    },
    setup() {
        const inputUsername = ref(null),
            inputPassword = ref(null);

        const onKeyboardInput = (ev) => {
            const { type } = ev.type;
            console.log('onKeyboardInput', type);
        };
        onMounted(() => {
            console.log('inputUsername', inputUsername.value);
        });
        return {
            inputUsername,
            inputPassword,
            onKeyboardInput,
        };
    },
});
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
.wrap {
    padding: 20px;
    background: #eee;
}
.form-item {
    margin: 20px 0;
}
.form-item label {
    display: block;
}
.form-item input {
}
</style>
