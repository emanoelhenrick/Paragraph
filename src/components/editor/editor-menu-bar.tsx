import { Editor } from "@tiptap/react";

import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Heading1, Italic } from "lucide-react";

export const EditorMenuBar = ({ editor }: { editor: Editor }) => {

  return (
    <div className="flex bg-background border gap-2 p-1 rounded-md">
      <section className="flex justify-between gap-1 border-r pr-2">
        <div
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={(editor.isActive('heading') ? 'bg-secondary' : '') + ' p-2 rounded-sm cursor-pointer hover:opacity-80'} aria-label="Toggle heading"
          >
          <Heading1 className="h-4 w-4" />
        </div>
        <div 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          className={(editor.isActive('bold') ? 'bg-secondary' : '') + ' p-2 rounded-sm cursor-pointer hover:opacity-80'} aria-label="Toggle bold"
          >
          <Bold  className="h-4 w-4" />
        </div>
        <div 
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          className={(editor.isActive('italic') ? 'bg-secondary' : '') + ' p-2 rounded-sm cursor-pointer hover:opacity-80'} aria-label="Toggle italic"
          >
          <Italic className="h-4 w-4" />
        </div>
      </section>

      <section className="flex flex-1 justify-between gap-1">
        <div
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={(editor.isActive({ textAlign: 'left' }) ? 'bg-secondary' : '') + ' p-2 rounded-sm cursor-pointer hover:opacity-80'} aria-label="Toggle align left"
          >
          <AlignLeft className="h-4 w-4" />
        </div>
        <div
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={(editor.isActive({ textAlign: 'center' }) ? 'bg-secondary' : '') + ' p-2 rounded-sm cursor-pointer hover:opacity-80'} aria-label="Toggle align center"
          >
          <AlignCenter className="h-4 w-4" />
        </div>
        <div
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={(editor.isActive({ textAlign: 'right' }) ? 'bg-secondary' : '') + ' p-2 rounded-sm cursor-pointer hover:opacity-80'} aria-label="Toggle align right"
          >
          <AlignRight className="h-4 w-4" />
        </div>
        <div
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={(editor.isActive({ textAlign: 'justify' }) ? 'bg-secondary' : '') + ' p-2 rounded-sm cursor-pointer hover:opacity-80'} aria-label="Toggle align justify"
          >
          <AlignJustify className="h-4 w-4" />
        </div>
      </section>
    </div>
  );
};