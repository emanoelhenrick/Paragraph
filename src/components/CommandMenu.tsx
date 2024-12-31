import { InputHTMLAttributes, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command"
import { useNavigate } from "react-router-dom"
import { getAllChapters } from "@/fakeData/fake-chapters"
import Fuse from "fuse.js"
import { useCommandState } from "cmdk"
import { Library } from "lucide-react"
import { IconAlignBoxLeftTopFilled, IconPencil, IconSettings } from "@tabler/icons-react"
import { Badge } from "./ui/badge"

export function CommandMenu() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleHelper(cmd: string) {
    setSearch(cmd)
    inputRef!.current!.focus()
  }

  const chapters = useMemo(() => {
    return getAllChapters()
  }, [])

  const chaps = useMemo(() => {
    const searchText = search.split('/')[1] ? search.split('/')[1].trim() : undefined
    const fuse = new Fuse(chapters, {
      keys: ['title'],
      threshold: 0.6,
      minMatchCharLength: 1,

    })
    return searchText ? fuse.search(searchText).map(i => i.item) : chapters
  }, [search])

  function handlePage(path: string) {
    navigate(path)
    setSearch('')
    setOpen(false)
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const ChapterItem = useCallback((chap: any, index: number) => {
    return (
      <CommandItem key={chap.id} onSelect={() => handlePage(`/project/chapter/${chap.id}`)}>
        <div className="relative p-2 rounded-md bg-background  border opacity-80 flex justify-center items-center">
          <IconAlignBoxLeftTopFilled className="text-primary" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground font-medium">Chapter #{index + 1}</span>
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
              <div className="bg-background border py-0.5 px-2 rounded-md text-primary">c/</div>
              <span>chapters</span>
            </div>

            <div onClick={() => handleHelper('n/ ')} className="flex gap-2 items-center bg-primary-foreground border py-0.5 pr-2.5 pl-0.5 rounded-lg hover:opacity-80 cursor-pointer">
              <div className="bg-background border py-0.5 px-2 rounded-md text-primary">n/</div>
              <span>notes</span>
            </div>

            <div onClick={() => handleHelper('s/ ')} className="flex gap-2 items-center bg-primary-foreground border py-0.5 pr-2.5 pl-0.5 rounded-lg hover:opacity-80 cursor-pointer">
              <div className="bg-background border py-0.5 px-2 rounded-md text-primary">s/</div>
              <span>scenes</span>
            </div>
          </div>
        </CommandEmpty>

        {search.startsWith("c/ ") && (
          <CommandGroup className="pt-2">
            {chaps.map((chap, index) => ChapterItem(chap, index))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  )
}
