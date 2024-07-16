<template>
    <el-dropdown @command="handleCommand" trigger="click">
        <div>
            <command-button
                :enable-tooltip="enableTooltip"
                :tooltip="t('editor.extensions.Ai.tooltip')"
                :readonly="isCodeViewMode"
                icon="ai"
                :button-icon="buttonIcon"
            />
        </div>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item :icon="Aim" command="summarize">摘要</el-dropdown-item>
                <el-dropdown-item :icon="Sugar" command="polish">润色</el-dropdown-item>
                <el-dropdown-item :icon="Switch" command="translate">翻译</el-dropdown-item>
                <el-dropdown-item :icon="Finished" command="correct">改错</el-dropdown-item>
                <el-dropdown-item :icon="EditPen" command="continuation">续写</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
    <AiDialog
        v-if="dialogVisible"
        :fullContent="fullDialogContent"
        :loading="dialogLoading"
        @close="dialogVisible = false"
    />
</template>

<script setup lang="ts">
import { inject, ref } from 'vue'
import { Editor } from '@tiptap/vue-3'
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElMessage } from 'element-plus'
import AiDialog from '@/components/MenuCommands/AiDialog.vue'
import CommandButton from './CommandButton.vue'
import {
    Sugar,
    Aim,
    EditPen,
    Switch,
    Finished
} from '@element-plus/icons-vue'
import api from '@/api'

const props = defineProps({
    editor: {
        type: Editor,
        required: true
    },
    buttonIcon: {
        default: 'ai',
        type: String
    }
})

const t = inject('t')
const enableTooltip = inject('enableTooltip', true)
const isCodeViewMode = inject('isCodeViewMode', false)

const dialogVisible = ref(false)
const dialogLoading = ref(false)
const fullDialogContent = ref('')
const getSelectedContent = (): string => {
    const state = props.editor.state
    if (state) {
        const { selection } = state
        const text = state.doc.textBetween(selection.from, selection.to, '')
        console.log('Selected text', text)
        return text
    }
    return ''
}

const copyContent = (content: string) => {
    navigator.clipboard
        .writeText(content)
        .then(() => {
            ElMessage('内容已复制到剪贴板')
        })
        .catch((err) => {
            console.error('复制失败', err)
            ElMessage('😭复制失败了，稍后重试一下吧！',)
})
}

const showLoadingDialog = () => {
    dialogVisible.value = true
    dialogLoading.value = true
    fullDialogContent.value = ''
}
const updateDialogContent = (newContent: string) => {
    dialogLoading.value = false
    fullDialogContent.value = newContent
}

function handleCommand(command: string) {

    switch (command) {
        case 'summarize':
            showLoadingDialog()
            api.abstract({
                content: getSelectedContent()
            }).then((ret) => {
                // 现在是原先的效果
                // 原先是复制，但是我们现在可以稍作修改，直接插入
                updateDialogContent(ret)
                // props.editor.commands.insertContent(ret)
            })
            break
        case 'polish':
            showLoadingDialog()
            api.polish({
                content: getSelectedContent()
            }).then((ret) => {
                updateDialogContent(ret)
            })
            break
        case 'translate':
            //点击执行这个函数，内容就会被替换掉
            showLoadingDialog()
            api.translate({
                content: getSelectedContent(),
                language: 'en'
            }).then((ret)=>{
                updateDialogContent(ret)
            })

            // props.editor.commands.insertContent('This is polish')
            break
        case 'correct':
            showLoadingDialog()
            api.correct({
                content: getSelectedContent()
            }).then((ret)=>{
                updateDialogContent(ret)
            })

            // props.editor.commands.insertContent('This is polish')
            break
        case 'continuation':
            showLoadingDialog()
            api.continueWrite({
                content: getSelectedContent()
            }).then((ret)=>{
                updateDialogContent(ret)
            })

            // props.editor.commands.continuation()
            break
        default:
            console.log(`Unknown command: ${command}`)
    }
}
</script>
