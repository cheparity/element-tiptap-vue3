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
