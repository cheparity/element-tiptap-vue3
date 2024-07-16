<template>
    <el-dropdown trigger="click">
        <div>
            <command-button :enable-tooltip="false" tooptip="" :readonly="isCodeViewMode" icon="ai" :button-icon="buttonIcon"/>
        </div>

        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item>Action 1</el-dropdown-item>
                <el-dropdown-item>Action 2</el-dropdown-item>
                <el-dropdown-item>Action 3</el-dropdown-item>
                <el-dropdown-item disabled>Action 4</el-dropdown-item>
                <el-dropdown-item divided>Action 5</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
    <!--    <el-dropdown-->
    <!--        placement="bottom"-->
    <!--        trigger="click"-->
    <!--        @command="toggleFontType"-->
    <!--        popper-class="my-dropdown"-->
    <!--        :popper-options="{ modifiers: [{ name: 'computeStyles', options: { adaptive: false } }] }"-->
    <!--    >-->
    <!--        <div>-->
    <!--            <command-button-->
    <!--                :enable-tooltip="enableTooltip"-->
    <!--                :tooltip="t('editor.extensions.FontType.tooltip')"-->
    <!--                :readonly="isCodeViewMode"-->
    <!--                icon="font-family"-->
    <!--                :button-icon="buttonIcon"-->
    <!--            />-->
    <!--        </div>-->
    <!--        <template #dropdown>-->
    <!--            <el-dropdown-menu class="el-tiptap-dropdown-menu">-->
    <!--                <el-dropdown-item-->
    <!--                    v-for="name in fontFamilies"-->
    <!--                    :key="name"-->
    <!--                    :command="name"-->
    <!--                    :class="{-->
    <!--                        'el-tiptap-dropdown-menu__item&#45;&#45;active': name === activeFontFamily,-->
    <!--                    }"-->
    <!--                    class="el-tiptap-dropdown-menu__item"-->
    <!--                >-->
    <!--                    <span :data-font="name" :style="{ 'font-family': name }">{{ name }}</span>-->
    <!--                </el-dropdown-item>-->
    <!--            </el-dropdown-menu>-->
    <!--        </template>-->
    <!--    </el-dropdown>-->
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
import { Editor, getMarkAttributes } from '@tiptap/vue-3'
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from 'element-plus'
import CommandButton from './CommandButton.vue'

export default defineComponent({
    name: 'AiDropDown',

    components: {
        ElDropdown,
        ElDropdownMenu,
        ElDropdownItem,
        CommandButton
    },
    props: {
        editor: {
            type: Editor,
            required: true
        },
        buttonIcon: {
            default: 'ai',
            type: String
        }
    },

    setup() {
        const t = inject('t')
        const enableTooltip = inject('enableTooltip', true)
        const isCodeViewMode = inject('isCodeViewMode', false)

        return { t, enableTooltip, isCodeViewMode }
    },

    computed: {
        fontFamilies() {
            const fontFamilyOptions = this.editor.extensionManager.extensions.find(
                (e) => e.name === 'fontFamily'
            )!.options
            return fontFamilyOptions.fontFamilyMap
        },

        activeFontFamily() {
            return getMarkAttributes(this.editor.state, 'textStyle').fontFamily || ''
        }
    },

    methods: {
        toggleFontType(name: string) {
            if (name === this.activeFontFamily) {
                this.editor.commands.unsetFontFamily()
            } else {
                this.editor.commands.setFontFamily(name)
            }
        }
    }
})
</script>
