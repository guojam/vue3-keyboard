<template>
    <div class="wrap">
        <form action="">
            <div class="form-item">
                <label for="username">全键盘</label>
                <input
                    v-keyboard-input="{ inputMethod: 'all, num, system' }"
                    name="username"
                    id="username"
                />
            </div>
            <div class="form-item">
                <label for="idcard">身份证</label>
                <input
                    v-keyboard-input="{ inputMethod: 'id' }"
                    name="idcard"
                    id="idcard"
                />
            </div>
            <div class="form-item">
                <label for="number">数字</label>
                <input
                    v-keyboard-input="{
                        inputMethod: 'num, system',
                        random: true,
                    }"
                    name="number"
                    id="number"
                />
            </div>
            <div class="form-item">
                <label for="password">密码</label>
                <input
                    v-keyboard-input="{
                        inputMethod: 'inline-num',
                        random: true,
                    }"
                    name="password"
                    id="password"
                    type="password"
                />
            </div>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { keyboardInputDirective } from './keyboard/';

export default defineComponent({
    name: 'App',
    directives: {
        'keyboard-input': keyboardInputDirective,
    },
});
</script>

<style lang="scss">
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
    label {
        display: inline-block;
        width: 60px;
        margin-right: 10px;
        text-align: right;
    }
    input {
        &.focus {
            border-color: blue;
        }
    }
}
</style>
