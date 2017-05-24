import './bootstrap';
import Vue from 'vue';
import { TextEditor } from '../src';

Vue.component('text-editor', TextEditor);

new Vue({
    el: '#app',
});
