import React from "react";
import { useEditor, EditorContent, Editor as EditorType } from "@tiptap/react";
import StarterKit from '@tiptap/starter-kit'
import CharacterCount from '@tiptap/extension-character-count'
import './styles.css'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Bold, Heading1, Italic } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Fade, Slide } from "react-awesome-reveal";



const MenuBar = ({ editor }: { editor: EditorType }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col bg-primary-foreground gap-4 p-1 rounded-md mt-4 fixed -ml-14 top-0">
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
  

  return (
    <div className="m-auto min-w-[1024px] max-w-screen-lg h-screen" style={{fontFamily: 'sora'}}>

      <Fade duration={300} triggerOnce>
        <h1 className="text-2xl bg-primary-foreground py-2 px-4 rounded-lg mt-4">Capitulo 1</h1>
        <div className="flex gap-4">
          <MenuBar editor={editor!} />
          <EditorContent className="border-none flex-1 mt-4 leading-relaxed bg-primary-foreground px-8 py-6 rounded-lg mb-20" editor={editor} />
        </div>
      </Fade>

      <div className={`bg-primary-foreground border fixed bottom-2 left-0 py-1 px-2 ml-2 rounded-md text-xs`}>
        <span className={`${editor.storage.characterCount.words() >= wordLimit ? 'text-green-400' : 'text-muted-foreground'}`} >{editor.storage.characterCount.words()} / {wordLimit} words</span>
      </div>
    </div>
  );
}