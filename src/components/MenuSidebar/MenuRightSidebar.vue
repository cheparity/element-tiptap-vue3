<template>
    <div class="el-tiptap-editor__right-sidebar">
        <div class="trigger-area" @mouseover="openSidebar" @mouseleave="closeSidebar"></div>
        <div class="sidebar" :class="{ open: isOpen }" @mouseover="openSidebar" @mouseleave="closeSidebar">
            <el-tree-v2 :data="treeData" :height="300" :props="{ label: 'label', children: 'children' }" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted } from 'vue'
import { ElTreeV2 } from 'element-plus'
import { Editor } from '@tiptap/vue-3'

const isOpen = ref(false)
const props = defineProps({
    editor: {
        type: Editor,
        required: true,
    },
})

/**
 * 从`https://stackoverflow.com/questions/74318348/prosemirror-tiptap-how-to-scrollintoview-without-focus`
 * 复制的。应该是滚动到现在选择的区域
 * Scrolls to the current position/selection of the document. It does the same as scrollIntoView()
 * but without requiring the focus on the editor, thus it can be called from the search box while
 * typing or in shopping mode when the editor is disabled.
 * @param {Editor}  editor - A TipTap editor instance.
 */
const scrollToSelection = (editor: Editor): void => {
    const { node } = editor.view.domAtPos(editor.state.selection.anchor)
    if (node) {
        ;(node as any).scrollIntoView?.(false)
    }
}

const loadHeadings = (): any[] => {
    const headings: any[] = []
    const editor = props.editor
    if (!editor) return []

    const transaction = editor.state.tr
    if (!transaction) return []

    editor.state.doc.descendants((node, pos) => {
        if (node.type.name === 'heading') {
            const start = pos
            const end = pos + node.nodeSize
            const id = `heading-${headings.length + 1}`
            if (node.attrs.id !== id) {
                transaction.setNodeMarkup(pos, undefined, { ...node.attrs, id })
            }

            headings.push({
                node: node, //
                pos: pos, //
                level: node.attrs.level, // 1 2 3 4
                text: node.textContent, // label内容
                start,
                end,
                id,
            })
        }
    })

    transaction.setMeta('addToHistory', false)
    transaction.setMeta('preventUpdate', true)
    editor.view.dispatch(transaction)
    return headings
}

const treeData = ref<
    {
        id: number
        label: string
        children: any[]
    }[]
>([])
const mapHeadingsToTreeData = (
    headings: {
        node: any //
        pos: any //
        level: number // 1 2 3 4
        text: string // label内容
        start: number
        end: number
        id: number
    }[]
) => {
    const allData: {
        id: number
        label: string
        children: any[]
    }[] = []
    treeData.value = []
    for (let i = 0; i < headings.length; i++) {
        const heading = headings[i]
        const { level, text, id } = heading
        const data = {
            id: id,
            label: text,
            children: [],
        }

        allData.push(data)
        let flag = false
        for (let j = i - 1; j >= 0; j--) {
            if (headings[j].level < level) {
                allData[j].children.push(data)
                flag = true
                break
            }
        }
        if (!flag) {
            treeData.value.push(data)
        }
    }
}

const openSidebar = () => {
    // 同时更新目录
    const headings = loadHeadings()
    mapHeadingsToTreeData(headings)
    // treeData取数组最后一个
    treeData.value = treeData.value.slice()
    isOpen.value = true
}

const closeSidebar = () => {
    isOpen.value = false
}

onMounted(() => {
    const headings = loadHeadings()
})
</script>
