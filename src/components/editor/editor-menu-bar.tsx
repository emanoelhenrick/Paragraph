import { Editor } from "@tiptap/react";

import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Heading1, Italic } from "lucide-react";
import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button, Group, Input, Label, NumberField } from "react-aria-components";


export const EditorMenuBar = ({ editor }: { editor: Editor }) => {
  const [fontSize, setFontSize] = useState('13')

  const fontSizes = ['8', '9', '10', '11', '12', '13', '14', '16', '18', '24']

  useEffect(() => {
    editor.chain().focus().setFontSize(`${fontSize}px`).run()
  }, [fontSize])

  return (
    <div className="flex w-fit bg-background border gap-2 p-1 rounded-md">
      <section className="flex justify-between items-center gap-1">
        {/* <div className="space-y-2">
          <NumberField defaultValue={16} minValue={8} maxValue={72}>
            <div className="space-y-2">
              <Group className="relative inline-flex h-8 w-fit items-center overflow-hidden whitespace-nowrap rounded-lg border border-input text-sm shadow-sm shadow-black/5 transition-shadow data-[disabled]:opacity-50 ">
                <Button
                  slot="decrement"
                  className="-ms-px flex aspect-square h-[inherit] items-center justify-center rounded-s-lg border border-input bg-background text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Minus size={16} strokeWidth={2} aria-hidden="true" />
                </Button>
                <Input className="w-12 bg-background px-3 py-2 text-xs text-center tabular-nums text-foreground focus:outline-none" />
                <Button
                  slot="increment"
                  className="-me-px flex aspect-square h-[inherit] items-center justify-center rounded-e-lg border border-input bg-background text-sm text-muted-foreground/80 transition-shadow hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus size={16} strokeWidth={2} aria-hidden="true" />
                </Button>
              </Group>
            </div>
          </NumberField>
        </div> */}
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