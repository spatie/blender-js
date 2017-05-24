<template>
    <input type="text">
</template>

<script>
    export default {
        props: {
            value: { required: true, type: String },
            format: { default: 'DD/MM/YYYY', type: String },
        },
    };
</script>
