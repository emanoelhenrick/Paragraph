import { useEditor, EditorContent, Editor as EditorType, BubbleMenu } from "@tiptap/react";
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import CharacterCount from '@tiptap/extension-character-count'
import Typography from '@tiptap/extension-typography'
import TextAlign from '@tiptap/extension-text-align'
import { Extension } from '@tiptap/core';
import './styles.css'
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, Bold, Heading1, Italic, SeparatorVertical } from "lucide-react";
import { Fade } from "react-awesome-reveal";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getChapter } from "@/fakeData/fake-chapters";
import { ScrollArea } from "../ui/scroll-area";

const MenuBar = ({ editor }: { editor: EditorType }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex bg-background border gap-2 p-1 rounded-md">
      <section className="flex gap-1 border-r pr-2">
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

      <section className="flex gap-1">
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

const wordLimit = 1000

const LiteralTab = Extension.create({
  name: 'literalTab',
  addKeyboardShortcuts() {
    return {
      Tab: () => {
        return this.editor.commands.insertContent('\t')
      }
    }
  }
})

interface ChapterProps {
  id: string
  resume: string
  title: string
}

export function ChapterEditor() {
  const params = useParams()
  const chapterId = params.id
  const [chapter, setChapter] = useState<ChapterProps>()

  const editor = useEditor({
    content: chapter ? chapter.resume : '',
    editorProps: {
      attributes: {
        class: 'border-none max-w-screen-md outline-none min-h-screen h-fit',
      }
    },
    autofocus: true,
    extensions: [
      StarterKit,
      CharacterCount,
      LiteralTab,
      Typography,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Write something …'
      }),
    ],
  }, [chapter]);

  useEffect(() => {
    if (!chapterId) return
    setChapter(getChapter(chapterId))
  }, [chapterId])

  if (chapter) {
    return (
      <ScrollArea>
        <section className="w-full max-h-screen">
          <header className="p-4">
            <span className="text-xl">{chapter.title}</span>
          </header>
          <div className=" w-full max-w-screen-md m-auto h-screen" style={{fontFamily: 'sora'}}>
            <Fade duration={300} triggerOnce>
              <div className="flex gap-4">
                {editor && <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                  <MenuBar editor={editor} />
                </BubbleMenu>}
                { chapterId && <EditorContent placeholder="teste" style={{ fontFamily: 'PT Serif, serif'}} className="border-none flex-1 mt-4 text-lg px-8 py-12 rounded-xl mb-20" editor={editor} />}
              </div>
            </Fade>
  
            <div className={`bg-primary-foreground border fixed bottom-2 right-4 py-1 px-2 ml-2 rounded-md text-xs`}>
              <span className={`${editor?.storage.characterCount.words() >= wordLimit ? 'text-green-400' : 'text-muted-foreground'}`} >{editor?.storage.characterCount.words()} / {wordLimit} words</span>
            </div>
          </div>
        </section>
      </ScrollArea>
    );
  }

  return <></>
}