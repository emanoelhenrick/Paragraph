import React from "react";
import { useEditor, EditorContent, Editor as EditorType } from "@tiptap/react";
import StarterKit from '@tiptap/starter-kit'
import CharacterCount from '@tiptap/extension-character-count'
import './styles.css'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ArrowLeft, Bold, Heading1, Italic, Library } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Fade, Slide } from "react-awesome-reveal";
import { CaretLeftIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";



const MenuBar = ({ editor }: { editor: EditorType }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex bg-secondary gap-4 p-1 rounded-md">
      <div onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={(editor.isActive('heading') ? 'bg-secondary' : '') + ' p-2 rounded-sm cursor-pointer hover:opacity-80'} aria-label="Toggle heading">
        <Heading1 className="h-4 w-4" />
      </div>
      <div onClick={() => editor.chain().focus().toggleBold().run()} className={(editor.isActive('bold') ? 'bg-secondary' : '') + ' p-2 rounded-sm cursor-pointer hover:opacity-80'} aria-label="Toggle bold">
        <Bold  className="h-4 w-4" />
      </div>
      <div onClick={() => editor.chain().focus().toggleItalic().run()} className={(editor.isActive('italic') ? 'bg-secondary' : '') + ' p-2 rounded-sm cursor-pointer hover:opacity-80'} aria-label="Toggle italic">
        <Italic className="h-4 w-4" />
      </div>
    </div>
  );
};

const wordLimit = 1000

export function Editor() {
  const navigate = useNavigate()

  const editor = useEditor({
    editorProps: {
      attributes: {
        class: 'border-none outline-none text-justify min-h-screen h-fit'
      }
    },
    extensions: [
      StarterKit,
      CharacterCount
    ],
    content: `
        ola
      `
  });

  console.log(editor?.getJSON());

  function handleBack() {

    return navigate(-1)
  }
  

  return (
    <section className="flex justify-center w-full">
      <div className="fixed bottom-0 p-4 z-20 w-full flex justify-center group">
        <MenuBar editor={editor!} />
      </div>
      <div className="mx-4 w-svw max-w-screen-lg h-screen" style={{fontFamily: 'sora'}}>

        <Fade duration={300} triggerOnce>
          <div onClick={handleBack} className="flex gap-2 items-center justify-center bg-primary-foreground border rounded-lg hover:opacity-80 cursor-pointer mt-4 w-fit py-2 pl-4 pr-6">
            <ArrowLeft className="text-muted-foreground" size={16} />
            <span className="text-sm text-muted-foreground">Back</span>
          </div>
          <div className="flex gap-4">
            <EditorContent className="border-none flex-1 mt-4 leading-relaxed bg-primary-foreground px-16 py-12 rounded-xl mb-20" editor={editor} />
          </div>
        </Fade>

        <div className={`bg-primary-foreground border fixed bottom-2 right-2 py-1 px-2 ml-2 rounded-md text-xs`}>
          <span className={`${editor.storage.characterCount.words() >= wordLimit ? 'text-green-400' : 'text-muted-foreground'}`} >{editor.storage.characterCount.words()} / {wordLimit} words</span>
        </div>
        </div>
    </section>
  );
}