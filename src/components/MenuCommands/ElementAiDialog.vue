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

        <div class="button-group" v-if="!loading">
            <el-button round style="width: auto" @click="acceptText">Accept Text</el-button>
            <el-button round style="width: auto" @click="copyText">Copy Text</el-button>
            <el-button type="danger" round style="width: auto" @click="closeDialog">Close</el-button>
            <el-button type="primary" round style="width: auto" @click="handleRegenerate">Regenerate</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, inject, computed } from 'vue'
import { Editor } from '@tiptap/vue-3'
import { ElCard, ElSkeleton, ElSkeletonItem } from 'element-plus'

const emits = defineEmits(['onClose', 'onCopy', 'onAccept', 'onRegenerate'])
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

const handleRegenerate = () => {
    emits('onRegenerate')
}

const acceptText = () => {
    emits('onAccept', props.text)
}

const copyText = () => {
    emits('onCopy', props.text)
}

const closeDialog = () => {
    emits('onClose')
}
</script>

<style scoped>
.button-group {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 10px;
}
</style>
