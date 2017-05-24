<template>
    <textarea
        :name="name"
        :id="name"
        :value="value"
    ></textarea>
</template>

<script>
    import $ from 'jquery';

    export default {
        props: {
            value: { required: true, type: String },
            mediaLibraryUrl: { required: true, type: String },
            options: { default: () => ({}), type: Object },
            name: { default: null, type: String },
        },

        data() {
            return {
                defaultOptions: {
                    formatting: ['p', 'h1', 'h2', 'h3', 'blockquote'],
                    imageUpload: this.mediaLibraryUrl + '&redactor=true',
                    imageManagerJson: this.mediaLibraryUrl,
                    pastePlainText: true,
                    plugins: ['imagemanager', 'video'],
                    changeCallback: () => this.$emit('input', this.$el.value),
                    codeKeydownCallback: () => this.$emit('input', this.$el.value),
                },
            };
        },

        mounted() {
            $(this.$el).redactor(
                { ...this.defaultOptions, ...this.options }
            );
        },

        beforeDestroy() {
            $(this.$el).redactor('core.destroy');
        },
    };
</script>
