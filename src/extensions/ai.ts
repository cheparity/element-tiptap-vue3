import CommandButton from '@/components/MenuCommands/CommandButton.vue'
import type { Editor } from '@tiptap/core'
import { Extension } from '@tiptap/core'
import AiWriterCommandButton from '@/components/AiModal/AiWriterCommandButton.vue'

const AiModal = Extension.create({
    name: 'aiModal',

    addOptions() {
        return {
            ...this.parent?.(),
            buttonIcon: '',
            button({ extension }: { extension: any; t: (...args: any[]) => string }) {
                return {
                    component: AiWriterCommandButton,
                    componentProps: {
                        buttonIcon: extension.options.buttonIcon,
                    },
                }
            },
        }
    },
})

export default AiModal
