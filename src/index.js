import DatePicker from './components/DatePicker';
import TextEditor from './components/TextEditor';

export default {
    install(Vue) {
        Vue.component('date-picker', DatePicker);
        Vue.component('text-editor', TextEditor);
    },
};

export {
    DatePicker,
    TextEditor,
};
