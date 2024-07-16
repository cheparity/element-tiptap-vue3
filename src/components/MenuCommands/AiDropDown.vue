<template>
    <el-dropdown @command="handleCommand" trigger="click">
        <div>
            <command-button :enable-tooltip="enableTooltip" :tooptip="t('editor.extensions.Ai.tooltip')" :readonly="isCodeViewMode" icon="ai" :button-icon="buttonIcon"/>
        </div>

        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item command="summarize">摘要</el-dropdown-item>
                <el-dropdown-item command="polish">润色</el-dropdown-item>
                <el-dropdown-item command="translate">翻译</el-dropdown-item>
                <el-dropdown-item comand="correct">改错</el-dropdown-item>
                <el-dropdown-item command="continuation">续写</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup lang="ts">
import { defineComponent, inject } from 'vue'
import { Editor, getMarkAttributes } from '@tiptap/vue-3'
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import CommandButton from './CommandButton.vue'

defineProps(
    {
        editor: {
            type: Editor,
            required: true
        },
        buttonIcon: {
            default: 'ai',
            type: String
        }
    },
)

const t = inject('t')
const enableTooltip = inject('enableTooltip', true)
const isCodeViewMode = inject('isCodeViewMode', false)

function handleCommand(command: string) {
    console.log(`click on command ${command}`)
}

</script>
