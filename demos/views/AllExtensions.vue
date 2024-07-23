<template>
    <div class="el-tiptap-editor__wrapper">
        <!-- <el-tiptap lang="ru" :extensions="textExtensions" content="Text Extensions" /> -->
        <el-tiptap
            lang="en"
            ref="editor"
            output="html"
            :extensions="allExtensions"
            v-model:content="content2"
            @onUpdate="onEditorUpdate"
        />
        <!-- {{ content2 }}
        <el-tiptap lang="en" output="json" :extensions="allExtensions" v-model:content="content2" /> -->
    </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { ElButton } from 'element-plus'

export default defineComponent({
    data() {
        return {
            content1: '<div equation="e = mc^2" data-type="block-equation"></div>',
            content2:
                '<h2 style="text-align: center">Edivator is a \n' +
                '  <span style="color: #f44336"><em>GREAT </em></span>editor！\n' +
                '</h2>\n' +
                '<p>🔥 \n' +
                '  <strong>Edivator </strong>🔥is a WYSIWYG rich-text editor using&nbsp; \n' +
                '  <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/scrumpy/tiptap">baidu-paddlepaddle</a>&nbsp;and \n' +
                '  <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/element-plus/element-plus">yi-chat</a>,\n' +
                '  <img src="https://i.ibb.co/nbRN3S2/undraw-upload-87y9.png" alt="" title="" width="400" height="200" data-display="right" draggable="true"> which is easy to use, friendly to developers, fully extensible and clean in design.\n' +
                '</p>\n' +
                '<p>\n' +
                '</p>\n' +
                '<p style="text-align: right">👉Click on the image to get started image features 👉\n' +
                '</p>\n' +
                '<p>\n' +
                '</p>\n' +
                '<p>You can switch to \n' +
                '  <strong>Code View </strong>💻 mode and toggle \n' +
                '  <strong>Fullscreen</strong> 📺 in this demo.\n' +
                '</p>\n' +
                '<p>\n' +
                '</p>\n' +
                '<p>\n' +
                '  <strong>Got questions or need help or feature request?</strong>\n' +
                '</p>\n' +
                '<p>🚀 \n' +
                '  <strong>welcome to submit an </strong>\n' +
                '  <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/Leecason/element-tiptap/issues"><strong>issue</strong></a> 😊\n' +
                '</p>\n' +
                "<p>I'm continuously working to add in new features.\n" +
                '</p>\n' +
                '<p>\n' +
                '</p>\n' +
                '<blockquote>\n' +
                '  <p>This demo is simple, switch tab for more features.\n' +
                '  </p>\n' +
                '  <p>All demos source code: \n' +
                '    <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/Leecason/element-tiptap/blob/master/demos/views/Index.vue">source code 🔗</a>\n' +
                '  </p>\n' +
                '</blockquote>',
        }
    },
})
</script>
<script lang="ts" setup>
import {
    AiContext,
    // InlineEquation,
    BlockEquation,
    Doc,
    Text,
    Paragraph,
    // text extensions
    Bold,
    Underline,
    Italic,
    Strike,
    Code,
    FontFamily,
    FontSize,
    Color,
    Highlight,
    FormatClear,
    // paragraph extensions
    Heading,
    BulletList,
    OrderedList,
    TaskList,
    TextAlign,
    LineHeight,
    Indent,
    Blockquote,
    CodeBlock,
    // rich and tools extensions
    Link,
    Image,
    Table,
    Iframe,
    HorizontalRule,
    Fullscreen,
    Print,
    SelectAll,
    History,
    CodeView,
    Gapcursor,
    Commands,
    Dropcursor,
    CodeBlockLowlight,
    getSuggestionItems,
    renderItems,
} from 'element-tiptap-vue3-niyuta'
import { ref } from 'vue'
import codemirror from 'codemirror'
import 'codemirror/lib/codemirror.css' // import base style
import 'codemirror/mode/xml/xml.js' // language
import 'codemirror/addon/selection/active-line.js' // require active-line.js
import 'codemirror/addon/edit/closetag.js'
// autoCloseTags
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
// load all highlight.js languages
import { lowlight } from 'lowlight'

lowlight.registerLanguage('html', html)
lowlight.registerLanguage('css', css)
lowlight.registerLanguage('js', js)
lowlight.registerLanguage('ts', ts)
const onEditorUpdate = (content: string) => {}
const content = ref(
    '<h2 style="text-align: center;">Welcome To Element Tiptap Editor Demo</h2><p>🔥 <strong>Element Tiptap Editor </strong>🔥is a WYSIWYG rich-text editor using&nbsp; <a href="https://github.com/scrumpy/tiptap" target="_blank" ref="nofollow noopener noreferrer">tiptap</a>&nbsp;and <a href="https://github.com/element-plus/element-plus" target="_blank" ref="nofollow noopener noreferrer">element-plus</a>&nbsp;for Vue3,<img src="https://i.ibb.co/nbRN3S2/undraw-upload-87y9.png" alt="" title="" height="200" data-display="right"> that\'s easy to use, friendly to developers, fully extensible and clean in design.</p><p></p><p style="text-align: right;">👉Click on the image to get started image features 👉</p><p></p><p>You can switch to <strong>Code View </strong>💻 mode and toggle <strong>Fullscreen</strong> 📺 in this demo.</p><p></p><p><strong>Got questions or need help or feature request?</strong></p><p>🚀 <strong>welcome to submit an <a href="https://github.com/Leecason/element-tiptap/issues" target="_blank" ref="nofollow noopener noreferrer">issue</a></strong> 😊</p><p>I\'m continuously working to add in new features.</p><p></p><blockquote><p>This demo is simple, switch tab for more features.</p><p>All demos source code: <a href="https://github.com/Leecason/element-tiptap/blob/master/demos/views/Index.vue" target="_blank" ref="nofollow noopener noreferrer">source code 🔗</a></p></blockquote>'
)
const textExtensions = [
    Doc,
    Text,
    Paragraph,
    Bold,
    Underline,
    Italic,
    Strike,
    Code,
    FontFamily,
    FontSize,
    Color.configure({ bubble: true }),
    Highlight.configure({ bubble: true }),
    FormatClear,
    History,
]

const paragraphExtensions = [
    Doc,
    Text,
    Paragraph,
    Heading.configure({ level: 5 }),
    BulletList,
    OrderedList,
    TaskList,
    TextAlign,
    LineHeight,
    Indent,
    Blockquote,
    CodeBlock,
    History,
]

const richAndToolsExtensions = [
    Doc,
    Text,
    Paragraph,
    Link,
    Image,
    Iframe,
    Table.configure({ resizable: true }),
    HorizontalRule,
    Print,
    SelectAll,
    Fullscreen,
    CodeView.configure({
        codemirror,
        codemirrorOptions: {
            styleActiveLine: true,
            autoCloseTags: true,
        },
    }),
    // Gapcursor,
    History,
]
const allExtensions = [
    AiContext.configure({ bubble: true }),
    History.configure({ depth: 10 }),
    // InlineEquation,
    BlockEquation,
    Doc,
    Text,
    Paragraph,
    Bold.configure({ bubble: true }),
    Underline.configure({ bubble: true }),
    Italic.configure({ bubble: true }),
    Strike.configure({ bubble: true }),
    Code.configure({ bubble: true }),
    FontFamily.configure({ bubble: true }),
    FontSize.configure({ bubble: true }),
    Color.configure({ bubble: true }),
    Highlight.configure({ bubble: true }),
    FormatClear.configure({ bubble: true }),
    Heading.configure({ level: 5, bubble: true }),
    BulletList.configure({ bubble: true }),
    OrderedList.configure({ bubble: true }),
    TaskList.configure({ bubble: true }),
    TextAlign.configure({ bubble: true }),
    LineHeight.configure({ bubble: true }),
    Indent.configure({ bubble: true }),
    Blockquote.configure({ bubble: true }),
    CodeBlockLowlight.configure({ lowlight }),
    Link.configure({ bubble: true, addLinkPlaceholder: 'add link', editLinkPlaceholder: 'edit link' }),
    Commands.configure({
        suggestion: {
            items: getSuggestionItems,
            render: renderItems,
        },
    }),
    Image.configure({
        bubble: true,
        defaultWidth: 400,
        draggable: true,
    }),
    Iframe.configure({ bubble: true }),
    Table.configure({ resizable: true }),
    HorizontalRule.configure({ bubble: true }),
    Print.configure({ bubble: true }),
    SelectAll.configure({ bubble: true }),
    Fullscreen.configure({ bubble: true }),
    Gapcursor,
    Dropcursor,
]
</script>
<style lang="scss">
/* Basic editor styles */
.ProseMirror {
    > * + * {
        margin-top: 0.75em;
    }

    pre {
        background: #0d0d0d;
        border-radius: 0.5rem;
        color: #fff;
        font-family: 'JetBrainsMono', monospace;
        padding: 0.75rem 1rem;

        code {
            background: none;
            color: inherit;
            font-size: 0.8rem;
            padding: 0;
        }

        .hljs-comment,
        .hljs-quote {
            color: #616161;
        }

        .hljs-variable,
        .hljs-template-variable,
        .hljs-attribute,
        .hljs-tag,
        .hljs-name,
        .hljs-regexp,
        .hljs-link,
        .hljs-name,
        .hljs-selector-id,
        .hljs-selector-class {
            color: #f98181;
        }

        .hljs-number,
        .hljs-meta,
        .hljs-built_in,
        .hljs-builtin-name,
        .hljs-literal,
        .hljs-type,
        .hljs-params {
            color: #fbbc88;
        }

        .hljs-string,
        .hljs-symbol,
        .hljs-bullet {
            color: #b9f18d;
        }

        .hljs-title,
        .hljs-section {
            color: #faf594;
        }

        .hljs-keyword,
        .hljs-selector-tag {
            color: #70cff8;
        }

        .hljs-emphasis {
            font-style: italic;
        }

        .hljs-strong {
            font-weight: 700;
        }
    }
}
</style>
