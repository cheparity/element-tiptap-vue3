import { Editor, Extension } from '@tiptap/core'
import AiDropDown from '@/components/MenuCommands/AiDropDown.vue'
import TextStyle from '@tiptap/extension-text-style'

export type AiOptions = {
    types: string[]
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        ai: {
            /**
             * Summarize text
             */
            summarize: () => ReturnType
            /**
             * Polish text
             */
            polish: () => ReturnType
            /**
             * Translate text
             */
            translate: () => ReturnType
            /**
             * Correct text
             */
            correct: () => ReturnType
            /**
             * Continue text
             */
            continuation: () => ReturnType
        }
    }
}

const Ai = Extension.create<AiOptions>({
    name: 'ai',

    onTransaction({  transaction }) {
        // The editor state has changed.
        console.log('onTransaction', transaction)
    },
    onFocus({ event }) {
        // The editor is focused.
        console.log('onFocus', event)
    },
    onBlur({ event }) {
        // The editor isn’t focused anymore.
        console.log('onBlur', event)
        // this.editor.commands.focus()
    },

    addOptions() {
        return {
            types: ['textStyle'],
            buttonIcon: '',
            commandList: [
                {
                    title: 'Summarize',
                    command: ({ editor, range }: any) => {
                        editor.chain().focus().deleteRange(range).summarize().run()
                    },
                    disabled: false,
                    isActive: () => false,
                },
                {
                    title: 'Polish',
                    command: ({ editor, range }: any) => {
                        editor.chain().focus().deleteRange(range).polish().run()
                    },
                    disabled: false,
                    isActive: () => false,
                },
                {
                    title: 'Translate',
                    command: ({ editor, range }: any) => {
                        editor.chain().focus().deleteRange(range).translate().run()
                    },
                    disabled: false,
                    isActive: () => false,
                },
                {
                    title: 'Correct',
                    command: ({ editor, range }: any) => {
                        editor.chain().focus().deleteRange(range).correct().run()
                    },
                    disabled: false,
                    isActive: () => false,
                },
                {
                    title: 'Continuation',
                    command: ({ editor, range }: any) => {
                        editor.chain().focus().deleteRange(range).continuation().run()
                    },
                    disabled: false,
                    isActive: () => false,
                },
            ],
            button({ editor, extension }: { editor: Editor; extension: any; t: (...args: any[]) => string }) {
                return {
                    component: AiDropDown,
                    componentProps: {
                        editor,
                        buttonIcon: extension.options.buttonIcon,
                    },
                }
            },
        }
    },

    addCommands() {
        return {
            summarize:
                () =>
                ({ chain }) => {
                    // TODO call the summarize function
                    return chain().run()
                },

            polish:
                () =>
                ({ chain }) => {
                    // TODO call the polish function
                    return chain().run()
                },

            translate:
                () =>
                ({ chain }) => {
                    // TODO call the translate function
                    return chain().run()
                },

            correct:
                () =>
                ({ chain }) => {
                    // TODO call the correct function
                    return chain().run()
                },

            continuation:
                () =>
                ({ chain }) => {
                    // TODO call the continuation function
                    return chain().run()
                },
        }
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    aiCommand: {
                        default: null,
                        parseHTML: (element) => element.getAttribute('data-ai-command') || '',
                        renderHTML: (attributes) => {
                            if (!attributes.aiCommand) {
                                return {}
                            }

                            return {
                                'data-ai-command': attributes.aiCommand,
                            }
                        },
                    },
                },
            },
        ]
    },

    addExtensions() {
        return [TextStyle]
    },
})

export default Ai
