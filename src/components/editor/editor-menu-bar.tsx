import { Editor } from "@tiptap/react";

import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Heading1, Italic } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect, useState } from "react";

export const EditorMenuBar = ({ editor }: { editor: Editor }) => {
  const [fontSize, setFontSize] = useState('14')

  const fontSizes = ['8', '9', '10', '11', '12', '14', '16', '18', '24', '30', '36', '48', '60', '72']

  useEffect(() => {
    editor.chain().focus().setFontSize(`${fontSize}pt`).run()
  }, [fontSize])

  return (
    <div className="flex w-fit bg-background border gap-2 p-1 rounded-md">
      <section className="flex justify-between items-center gap-1">
        <div className="space-y-2">
          <Select defaultValue="18" onValueChange={setFontSize}>
            <SelectTrigger id="select-24" className="w-auto min-w-16 text-xs max-w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontSizes.map(s => <SelectItem className="text-xs" value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
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