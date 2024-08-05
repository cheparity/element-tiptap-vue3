import { Node, mergeAttributes, textblockTypeInputRule } from '@tiptap/core'
import katex from 'katex'
import 'katex/dist/katex.min.css'

export const InlineEquation = Node.create({
    name: 'inlineEquation',

    inline: true,
    group: 'inline',

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
                tag: 'span[data-type="inline-equation"]',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(HTMLAttributes, { 'data-type': 'inline-equation' }), 0]
    },

    addNodeView() {
        return ({ node }) => {
            const dom = document.createElement('span')
            const equation = node.attrs.equation
            dom.setAttribute('data-type', 'inline-equation')
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
            setInlineEquation:
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
                find: /\$\s*([^$]+)\s*\$\s/,
                type: this.type,
                getAttributes: (match) => ({ equation: match[1] }),
                handler: ({ state, range, match, type }) => {
                    const { tr } = state
                    const start = range.from
                    const end = range.to
                    const text = match[1]

                    // 插入内联公式
                    tr.replaceWith(start, end, type.create({ equation: text }))
                    // 将光标移动到内联公式之后的空白处
                    tr.setSelection(state.selection.constructor.near(tr.doc.resolve(end)))

                    return tr
                },
            }),
        ]
    },
})

export default InlineEquation
