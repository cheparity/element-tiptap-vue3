<template>
    <div class="el-tiptap-editor__ai-image">
        <div style="margin-bottom: 15px">{{ t('editor.extensions.Ai.chat.prompt') }}</div>
        <!-- 加载框 -->
        <el-skeleton v-if="clickedGenerate" :loading="loading" style="width: 240px; margin-bottom: 20px" animated>
            <template #template>
                <!-- TODO -->
                <el-skeleton-item variant="image" style="width: 240px; height: 240px" />
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
                    <img :src="resultUrl" class="image" />
                </el-card>
            </template>
        </el-skeleton>

        <el-input
            type="textarea"
            v-model="prompt"
            class="el-tiptap-editor__ai-image__input"
            :placeholder="t('editor.extensions.Ai.chat.imageGen_prompt')"
        ></el-input>

        <div class="left-right">
            <el-select
                v-model="selectedStyle"
                placeholder="Style"
                style="margin-right: 20px"
                @click="editor.commands.blur()"
            >
                <el-option v-for="style in imageStyles" :key="style" :label="style" :value="style"></el-option>
            </el-select>
            <el-button v-if="!clickedGenerate" round @click="generateImage">Generate image </el-button>
            <el-button v-else round @click="acceptImage">Accept image </el-button>
            <el-button type="danger" round @click="closeComponent">Close </el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { ElButton, ElMessage, ElInput, ElSelect, ElOption, ElCard, ElSkeleton, ElSkeletonItem } from 'element-plus'
import { Editor } from '@tiptap/vue-3'
import api from '@/api'
import { Close } from '@element-plus/icons-vue'

const emits = defineEmits(['onClose'])
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
const prompt = ref('')
const imageStyles = ref(['二次元', '写实风格', '古风', '赛博朋克', '水彩画', '油画', '卡通画'])
const selectedStyle = ref('')
const loading = ref(true)
const resultUrl = ref('')
const acceptImage = () => {
    // 插入到当前光标位置
    const editor = props.editor
    editor.commands.insertContent(`<img src="${resultUrl.value}" alt="" />`)
}

const generateImage = () => {
    clickedGenerate.value = true
    api.generateImage({
        text: prompt.value,
        style: selectedStyle.value,
        resolution: '512*512',
    }).then((url) => {
        loading.value = false
        resultUrl.value = url
    })
}
</script>
