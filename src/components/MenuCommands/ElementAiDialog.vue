<template>
    <div class="el-tiptap-editor__ai-text">
        <!-- Loading Skeleton -->
        <el-skeleton :loading="loading" style="width: 100%; margin-bottom: 20px" animated>
            <template #template>
                <el-skeleton :rows="5" animated />
            </template>
            <template #default>
                <el-card :body-style="{ padding: '0px', marginBottom: '5px' }">{{ text }}</el-card>
            </template>
        </el-skeleton>

        <div class="left-right">
            <el-button v-if="!loading" round style="width: auto" @click="emits('onAccept', text)"
                >Accept Text</el-button
            >
            <el-button v-if="!loading" round style="width: auto" @click="emits('onCopy', text)">Copy Text</el-button>
            <el-button type="danger" round style="width: auto" @click="emits('onClose')">Close</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, inject, computed } from 'vue'
import { Editor } from '@tiptap/vue-3'
import { ElCard, ElSkeleton, ElSkeletonItem } from 'element-plus'

const emits = defineEmits(['onClose', 'onCopy', 'onAccept'])
const props = defineProps({
    editor: {
        type: Editor,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
})
const t = inject('t')
const loading = computed(() => {
    return props.text === ''
})
</script>

<style scoped>
.el-tiptap-editor__ai-text {
    position: fixed !important;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid #90caf9;
    border-radius: 10px;
    z-index: 1000;
    height: auto;
    width: 500px;
    max-width: 100%;
    padding: 20px;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    .el-tiptap-editor__ai-text__input {
        background-color: whitesmoke;
        margin-bottom: 20px;
    }

    .left-right {
        margin-top: 14px;
        display: flex;
        flex-direction: row;
    }
}

.loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    .loading-spinner {
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-top: 4px solid #007bff;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        animation: spin 1s linear infinite;
    }
}
</style>
