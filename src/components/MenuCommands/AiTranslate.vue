<script setup lang="ts">
import { ref, inject, computed } from 'vue'
import { ElButton, ElMessage, ElInput, ElSelect, ElOption, ElCard, ElSkeleton, ElSkeletonItem } from 'element-plus'
import { Editor } from '@tiptap/vue-3'
import api from '@/api'
import { Close } from '@element-plus/icons-vue'
import copy from 'rollup-plugin-copy'

const emits = defineEmits(['onClose', 'onAccept', 'onCopy'])
const closeComponent = () => {
    emits('onClose')
}
const clickedGenerate = ref(false)
const props = defineProps({
    editor: {
        type: Editor,
        required: true,
    },
})
const t = inject('t')
const target = ref(['英语', '汉语', '德语', '法语', '日语', '俄语', '意大利语'])
const selectedLanguage = ref('')
const loading = ref(true)
const result = ref('')
const selectedContent = computed((): string => {
    const state = props.editor.state
    let text = ''
    if (state) {
        const { selection } = state
        text = state.doc.textBetween(selection.from, selection.to)
    }
    return text
})
const translate = () => {
    clickedGenerate.value = true
    loading.value = true
    api.translate({ content: selectedContent.value, language: selectedLanguage.value })
        .then((ret) => {
            result.value = ret
        })
        .finally(() => {
            loading.value = false
        })
}
const copyText = (result: string) => {
    emits('onCopy', result)
}
const acceptText = (result: string) => {
    emits('onAccept', result)
}
</script>
<template>
    <div class="el-tiptap-editor__ai-image">
        <div style="margin-bottom: 15px">选择翻译语言</div>
        <!-- 加载框 -->
        <el-skeleton v-if="clickedGenerate" :loading="loading" style="width: 240px; margin-bottom: 20px" animated>
            <template #template>
                <div style="padding: 14px">
                    <el-skeleton-item variant="h3" style="width: 50%" />
                    <div style="display: flex; align-items: center; margin-top: 16px; height: 16px">
                        <el-skeleton-item variant="text" style="margin-right: 16px" />
                        <el-skeleton-item variant="text" style="width: 30%" />
                    </div>
                </div>
            </template>
            <template #default>
                <el-card :body-style="{ padding: '0px', marginBottom: '1px' }">
                    <el-card :body-style="{ padding: '0px', marginBottom: '5px' }">{{ result }}</el-card>
                </el-card>
            </template>
        </el-skeleton>

        <div class="left-right">
            <el-select
                v-model="selectedLanguage"
                placeholder="目标语言"
                style="margin-right: 20px"
                @click="editor.commands.blur()"
            >
                <el-option v-for="language in target" :key="language" :label="language" :value="language"></el-option>
            </el-select>
            <el-button v-if="!clickedGenerate" round @click="translate">翻译</el-button>
            <el-button v-if="clickedGenerate" round @click="acceptText(result)">接受</el-button>
            <el-button v-if="clickedGenerate" round @click="copyText(result)">复制</el-button>
            <el-button type="danger" round @click="closeComponent">关闭</el-button>
        </div>
    </div>
</template>
