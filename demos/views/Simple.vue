<template>
    <div class="el-tiptap-editor__wrapper">
        <el-tiptap :extensions="extensions" v-model:content="content" output="html" placeholder="Write something ..." />
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import {
    Doc,
    Text,
    Paragraph,
    Heading,
    Bold,
    Underline,
    Italic,
    Strike,
    Code,
    Link,
    Image,
    Blockquote,
    BulletList,
    OrderedList,
    TaskList,
    TextAlign,
    Indent,
    HardBreak,
    HorizontalRule,
    CodeView,
    Fullscreen,
    History,
    AiContext,
} from 'element-tiptap-vue3-niyuta'

import codemirror from 'codemirror'
import 'codemirror/lib/codemirror.css' // import base style
import 'codemirror/mode/xml/xml.js' // language
import 'codemirror/addon/selection/active-line.js' // require active-line.js
import 'codemirror/addon/edit/closetag.js' // autoCloseTags
onMounted(() => {})
const extensions = [
    AiContext.configure({ bubble: true }),
    Doc,
    Text,
    Paragraph,
    Heading.configure({ level: 5 }),
    Bold.configure({ bubble: true }),
    Underline.configure({ bubble: true }),
    Italic.configure({ bubble: true }),
    Strike.configure({ bubble: true }),
    Code,
    Link.configure({ bubble: true }),
    Image,
    Blockquote,
    TextAlign,
    BulletList,
    OrderedList,
    TaskList,
    Indent,
    HardBreak,
    HorizontalRule.configure({ bubble: true }),
    CodeView.configure({
        codemirror,
        codemirrorOptions: {
            styleActiveLine: true,
            autoCloseTags: true,
        },
    }),
    Fullscreen,
    History,
]

// const content = ref(
//     '<h2 style="text-align: center;">Welcome To Element Tiptap Editor Demo</h2><p>🔥 <strong>Element Tiptap Editor </strong>🔥is a WYSIWYG rich-text editor using&nbsp; <a href="https://github.com/scrumpy/tiptap" target="_blank" ref="nofollow noopener noreferrer">tiptap</a>&nbsp;and <a href="https://github.com/element-plus/element-plus" target="_blank" ref="nofollow noopener noreferrer">element-plus</a>&nbsp;for Vue3,<img src="https://i.ibb.co/nbRN3S2/undraw-upload-87y9.png" alt="" title="" height="200" data-display="right"> that\'s easy to use, friendly to developers, fully extensible and clean in design.</p><p></p><p style="text-align: right;">👉Click on the image to get started image features 👉</p><p></p><p>You can switch to <strong>Code View </strong>💻 mode and toggle <strong>Fullscreen</strong> 📺 in this demo.</p><p></p><p><strong>Got questions or need help or feature request?</strong></p><p>🚀 <strong>welcome to submit an <a href="https://github.com/cheparity/element-tiptap-vue3/issues" target="_blank" ref="nofollow noopener noreferrer">issue</a></strong> 😊</p><p>I\'m continuously working to add in new features.</p><p></p><blockquote><p>This demo is simple, switch tab for more features.</p><p>All demos source code: <a href="https://github.com/Leecason/element-tiptap/blob/master/demos/views/Index.vue" target="_blank" ref="nofollow noopener noreferrer">source code 🔗</a></p></blockquote>'
// )
const content = ref(                '<h2 style="text-align: center">Edivator is a \n' +
    '  <span style="color: #f44336"><em>GREAT </em></span>editor！\n' +
    '</h2>\n' +
    '<p>🔥 \n' +
    '  <strong>Edivator </strong>🔥is a WYSIWYG rich-text editor using&nbsp; \n' +
    '  <a target="_blank" rel="noopener noreferrer nofollow" href="https://www.paddlepaddle.org.cn/">baidu-paddlepaddle</a>&nbsp;and \n' +
    '  <a target="_blank" rel="noopener noreferrer nofollow" href="https://yiyan.baidu.com/welcome">yi-chat</a>,\n' +
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
    '  <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/cheparity/element-tiptap-vue3/issues"><strong>issue</strong></a> 😊\n' +
    '</p>\n' +
    "<p>I'm continuously working to add in new features.\n" +
    '</p>\n' +
    '<p>\n' +
    '</p>\n' +
    '<blockquote>\n' +
    '  <p>This demo is simple, switch tab for more features.\n' +
    '  </p>\n' +
    '  <p>All demos source code: \n' +
    '    <a target="_blank" rel="noopener noreferrer nofollow" href="https://github.com/cheparity/element-tiptap-vue3">source code 🔗</a>\n' +
    '  </p>\n' +
    '</blockquote>',)
</script>
