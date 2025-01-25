import { useEditor, EditorContent } from "@tiptap/react";
import Placeholder from '@tiptap/extension-placeholder'
import StarterKit from '@tiptap/starter-kit'
import CharacterCount from '@tiptap/extension-character-count'
import Typography from '@tiptap/extension-typography'
import FontSize from 'tiptap-extension-font-size'
import TextStyle from "@tiptap/extension-text-style";
import TextAlign from '@tiptap/extension-text-align'
import './styles.css'

import { Fade } from "react-awesome-reveal";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { ChapterMenu } from "./chapter-menu";
import { PanelRight } from "lucide-react";
import { ImperativePanelHandle } from "react-resizable-panels";
import services from "@/electron/electronApi";
import { useProjectInfo } from "@/states/project-state";
import { Chapter } from "electron/core/models/Chapter";
import { Tag } from "emblor";
import { LiteralTab } from "./Extensions";

const wordLimit = 1000

export function ChapterEditor() {
  const params = useParams()
  const chapterId = params.id
  const [chapter, setChapter] = useState<Chapter>()
  const [tags, setTags] = useState<Tag[]>();
  const projectId = useProjectInfo(state => state.info.id)
  const ref = useRef<ImperativePanelHandle>(null)
  const [isOpen, setIsOpen] = useState(true)

  async function saveContent() {
    if (!chapter) return
    const updatedChapter: Chapter = { ...chapter, content: editor!.getJSON(), tags }
    await services.updateChapter({ projectId, chapterData: updatedChapter })
  }

  const editor = useEditor({
    content: chapter?.content,
    onUpdate: async () => await saveContent(),
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
      TextStyle,
      FontSize,
      Typography,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Write something …'
      }),
    ],
  }, [chapter]);

  async function getLocalChapter(id: string) {
    const chapter = await services.getChapter({ projectId, chapterId: id })
    setChapter(chapter)
    setTags(chapter.tags)
  }

  useEffect(() => {
    if (!chapterId || !tags) return
    services.updateTags({ projectId, chapterId, tags })
  }, [tags])

  useEffect(() => {
    if (!chapterId) return
    getLocalChapter(chapterId)
  }, [chapterId])

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
      <section className="flex">
        <div className="flex-1 relative">
          <PanelRight onClick={handleSidebar} className="size-5 absolute right-4 top-4 z-10 text-muted-foreground cursor-pointer hover:opacity-80" />
          <ScrollArea>
            <section className="w-full max-h-screen">
              <header className="p-4 flex items-center justify-between">
                <span className="text-xl">{chapter.title}</span>
              </header>
              <div className=" w-full max-w-screen-md m-auto h-screen" style={{fontFamily: 'sora'}}>
                <Fade duration={300} triggerOnce>
                  <div className="flex gap-4">
                    { chapterId && 
                      <EditorContent
                        placeholder="teste"
                        style={{ fontFamily: 'PT Serif, serif' }}
                        className="border-none flex-1 mt-4 text-lg px-8 py-12 rounded-xl mb-20"
                        editor={editor}
                      />}
                  </div>
                </Fade>
      
                <div className={`bg-primary-foreground border fixed bottom-2 right-4 py-1 px-2 ml-2 rounded-md text-xs`}>
                  <span className={`${editor?.storage.characterCount.words() >= wordLimit ? 'text-green-400' : 'text-muted-foreground'}`} >{editor?.storage.characterCount.words()} / {wordLimit} words</span>
                </div>
              </div>
            </section>
          </ScrollArea>
        </div>

        <div className={`${isOpen ? 'block' : 'hidden'} max-w-72 border-l`}>
          {editor && <ChapterMenu editor={editor} tags={tags} setTags={setTags} />}
        </div>
      </section>
    );
  }

  return <></>
}