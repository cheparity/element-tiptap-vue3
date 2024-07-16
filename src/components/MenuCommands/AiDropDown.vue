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
</template>

<script setup lang="ts">
import { defineComponent, inject } from 'vue'
import { Editor } from '@tiptap/vue-3'
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import CommandButton from './CommandButton.vue'
import {
    Sugar,
    Aim,
    EditPen,
    Switch,
    Finished
} from '@element-plus/icons-vue'

const prop = defineProps({
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

function handleCommand(command: string) {
    switch (command) {
        case 'summarize':
            prop.editor.commands.summarize()
            break
        case 'polish':
            prop.editor.commands.polish()
            break
        case 'translate':
            prop.editor.commands.translate()
            break
        case 'correct':
            prop.editor.commands.correct()
            break
        case 'continuation':
            prop.editor.commands.continuation()
            break
        default:
            console.log(`Unknown command: ${command}`)
    }
}
</script>
