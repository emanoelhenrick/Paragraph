import { useEditor, EditorContent, Editor, BubbleMenu } from "@tiptap/react";
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import CharacterCount from '@tiptap/extension-character-count'
import Typography from '@tiptap/extension-typography'
import TextAlign from '@tiptap/extension-text-align'
import { Extension } from '@tiptap/core';
import './styles.css'

import { Fade } from "react-awesome-reveal";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getChapter } from "@/fakeData/fake-chapters";
import { ScrollArea } from "../ui/scroll-area";
import { ChapterMenu } from "./chapter-menu";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../ui/resizable";
import { PanelRight } from "lucide-react";
import { ImperativePanelHandle } from "react-resizable-panels";



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
  const ref = useRef<ImperativePanelHandle>(null)
  const [isOpen, setIsOpen] = useState(true)

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

  useEffect(() => {
    if (!isOpen) return ref.current?.expand
    return ref.current?.collapse 
  }, [isOpen])

  function handleSidebar() {
    if (isOpen) {
      setIsOpen(false)
      return ref.current?.collapse()
    }
    setIsOpen(true)
    return ref.current?.expand()
  }

  if (chapter) {
    return (
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel minSize={50} className="relative">
          <PanelRight onClick={handleSidebar} className="size-5 absolute right-4 top-4 z-10 text-muted-foreground cursor-pointer hover:opacity-80" />
          <ScrollArea>
            <section className="w-full max-h-screen">
              <header className="p-4 flex items-center justify-between">
                <span className="text-xl">{chapter.title}</span>
              </header>
              <div className=" w-full max-w-screen-md m-auto h-screen" style={{fontFamily: 'sora'}}>
                <Fade duration={300} triggerOnce>
                  <div className="flex gap-4">
                    { chapterId && <EditorContent placeholder="teste" style={{ fontFamily: 'PT Serif, serif'}} className="border-none flex-1 mt-4 text-lg px-8 py-12 rounded-xl mb-20" editor={editor} />}
                  </div>
                </Fade>
      
                <div className={`bg-primary-foreground border fixed bottom-2 right-4 py-1 px-2 ml-2 rounded-md text-xs`}>
                  <span className={`${editor?.storage.characterCount.words() >= wordLimit ? 'text-green-400' : 'text-muted-foreground'}`} >{editor?.storage.characterCount.words()} / {wordLimit} words</span>
                </div>
              </div>
            </section>
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel ref={ref} collapsible minSize={25} defaultSize={25}>
          {editor && <ChapterMenu editor={editor} />}
        </ResizablePanel>
      </ResizablePanelGroup>
    );
  }

  return <></>
}