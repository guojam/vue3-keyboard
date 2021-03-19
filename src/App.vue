<template>
    <div class="wrap">
        <form action="">
            <div class="form-item">
                <label for="username">全键盘</label>
                <app-keyboard-input name="username" id="username" />
            </div>
            <div class="form-item">
                <label for="password">数字</label>
                <app-keyboard-input
                    type="password"
                    name="password"
                    id="password"
                />
            </div>
            <!-- <div class="form-item">
                <label for="password">数字</label>
                <input type="password" id="password" />
            </div> -->
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { KeyboardInput } from './keyboard/';

export default defineComponent({
    name: 'App',
    components: {
        'app-keyboard-input': KeyboardInput,
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
