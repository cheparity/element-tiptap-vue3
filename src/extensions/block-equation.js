import { Node, mergeAttributes, textblockTypeInputRule } from '@tiptap/core'
import katex from 'katex'
import 'katex/dist/katex.min.css'

export const BlockEquation = Node.create({
    name: 'blockEquation',

    group: 'block',
    content: 'text*',

    addAttributes() {
        return {
            equation: {
                default: '',
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="block-equation"]',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'block-equation' }), 0]
    },

    addNodeView() {
        return ({ node }) => {
            const dom = document.createElement('div')
            dom.setAttribute('data-type', 'block-equation')
            const equation = node.attrs.equation
            katex.render(equation, dom, {
                displayMode: true,
                throwOnError: false,
            })
            return {
                dom,
            }
        }
    },

    addCommands() {
        return {
            setBlockEquation:
                (equation) =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: this.name,
                        attrs: { equation },
                    })
                },
        }
    },

    addInputRules() {
        return [
            textblockTypeInputRule({
                find: /\$\$\$\s*([^$]+)\s*\$\$\$\s*\n/,
                type: this.type,
                getAttributes: (match) => ({ equation: match[1] }),
                handler: ({ state, range, match, type }) => {
                    const { tr } = state
                    const start = range.from
                    const end = range.to
                    const text = match[1]

                    // 插入公式块
                    tr.replaceWith(start, end, type.create({ equation: text }))
                    // 将光标移动到公式块之后的空白处
                    tr.setSelection(state.selection.constructor.near(tr.doc.resolve(end)))

                    return tr
                },
            }),
        ]
    },
})

export default BlockEquation
