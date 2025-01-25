import { Extension } from '@tiptap/core';

export const LiteralTab = Extension.create({
  name: 'literalTab',
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        return this.editor.commands.insertContent('\t')
      }
    }
  }
})