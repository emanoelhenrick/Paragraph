import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command"
import { useNavigate } from "react-router-dom"
import Fuse from "fuse.js"
import { AlignLeft } from "lucide-react"
import { useProjectInfo } from "@/states/project-state"
export function CommandMenu() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleHelper(cmd: string) {
    setSearch(cmd)
    inputRef!.current!.focus()
  }

  const chapters = useProjectInfo(state => state.info.chapters)

  const chaps = useMemo(() => {
    const searchText = search.replace('c/', '').trim()
    const fuse = new Fuse(chapters, {
      keys: ['title'],
      threshold: 0.6,
      minMatchCharLength: 1
    })
    return searchText ? fuse.search(searchText).map(i => i.item) : chapters
  }, [search])

  function handlePage(path: string) {
    navigate(path)
    setSearch('')
    setOpen(false)
  }

  useEffect(() => {
    if (!open) setSearch('')
  }, [open])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => {
      document.removeEventListener("keydown", down)
    }
  }, [])

  const ChapterItem = useCallback((chap: any) => {
    return (
      <CommandItem key={chap.id} onSelect={() => handlePage(`/project/chapter/${chap.id}`)}>
        <div className="relative p-2 rounded-md bg-background  border opacity-80 flex justify-center items-center">
          <AlignLeft className="text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-medium">Chapter #{chap.position + 1}</span>
          <span className="text-base">{chap.title}</span>
        </div>
      </CommandItem>
    )
      
  }, [chapters])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput ref={inputRef}  value={search} onValueChange={setSearch} placeholder="Type a command..." />
      <CommandList>
        <CommandEmpty>
          <div className="flex gap-4 justify-center items-center text-xs text-muted-foreground font-medium">
            <div onClick={() =>  handleHelper('c/ ')} className="flex gap-2 items-center bg-primary-foreground border py-0.5 pr-2.5 pl-0.5 rounded-lg hover:opacity-80 cursor-pointer">
              <div className="bg-background border py-0.5 px-2 rounded-md">c/</div>
              <span>chapters</span>
            </div>

            <div onClick={() => handleHelper('n/ ')} className="flex gap-2 items-center bg-primary-foreground border py-0.5 pr-2.5 pl-0.5 rounded-lg hover:opacity-80 cursor-pointer">
              <div className="bg-background border py-0.5 px-2 rounded-md">n/</div>
              <span>notes</span>
            </div>

            <div onClick={() => handleHelper('s/ ')} className="flex gap-2 items-center bg-primary-foreground border py-0.5 pr-2.5 pl-0.5 rounded-lg hover:opacity-80 cursor-pointer">
              <div className="bg-background border py-0.5 px-2 rounded-md">s/</div>
              <span>scenes</span>
            </div>
          </div>
        </CommandEmpty>

        {search.startsWith("c/") && (
          <CommandGroup className="py-2">
            {chaps.map((chap) => ChapterItem(chap))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}
