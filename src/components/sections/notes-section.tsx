import { Folder, Plus, StickyNote } from "lucide-react"
import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll-area"
import { useMemo, useState } from "react";
import { useMeasure } from "@uidotdev/usehooks";
import Fuse from "fuse.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Fade } from "react-awesome-reveal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const notes = [
  {
    title: 'Lorem ipsum dolor',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis.'
  },
  {
    title: 'Neque expedita',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis.'
  },
  {
    title: 'Cum nemo ullam ipsa',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis.'
  },
  {
    title: 'Sit amet consectetur',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis.'
  },
  {
    title: 'Adipisicing elit',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis.'
  },
  {
    title: 'Lorem ipsum dolor',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis.'
  },
  {
    title: 'Neque expedita',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis.'
  },
  {
    title: 'Cum nemo ullam ipsa',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis.'
  },
  {
    title: 'Sit amet consectetur',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis.'
  },
  {
    title: 'Adipisicing elit',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis.'
  },
  {
    title: 'Lorem ipsum dolor',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis.'
  },
  {
    title: 'Neque expedita',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis.'
  },
  {
    title: 'Cum nemo ullam ipsa',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis.'
  },
  {
    title: 'Sit amet consectetur',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis.'
  },
  {
    title: 'Adipisicing elit',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis.'
  },
  {
    title: 'Lorem ipsum dolor',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis.'
  },
  {
    title: 'Neque expedita',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis.'
  },
  {
    title: 'Cum nemo ullam ipsa',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis.'
  },
  {
    title: 'Sit amet consectetur',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis.'
  },
  {
    title: 'Adipisicing elit',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis.'
  },
]

export function NotesSection() {
  const [search, setSearch] = useState('')
  const [headerRef, { height }] = useMeasure();
  const [gridRef, { width }] = useMeasure();

  const [selected, setSelected] = useState(0)

  const columns = useMemo(() => {
    if (!width) return 2
    if (Math.floor(width / 300) > 12) return 12
    return Math.floor(width / 300) 
  }, [width])

  const chaps = useMemo(() => {
    const fuse = new Fuse(notes, {
      keys: ['title'],
      threshold: 0.6,
      minMatchCharLength: 1,

    })
    return search.length > 0 ? fuse.search(search).map(i => i.item) : notes
  }, [search])

  return (
    <section className="h-screen overflow-hidden">
      <header ref={headerRef} className="text-muted-foreground uppercase items-center p-4 pb-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs">Notes</span>
          <DropdownPlus />
        </div>

        <div className="flex gap-3">
          <Select>
            <SelectTrigger className="max-w-40 text-xs">
              <SelectValue placeholder="Notes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="characters">Characters</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Input value={search} onChange={e => setSearch(e.currentTarget.value)} placeholder="Search" className="text-xs" />
        </div>
      </header>

      <section ref={gridRef}>
        <ScrollArea style={{ height: `calc(100vh - ${height}px)`}} className="h-screen">
          <div style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }} className="grid p-4 gap-4"> 
            <Fade triggerOnce duration={300}>
            {chaps.map((item, index) => {
              return (
                <div key={index} onClick={() => setSelected(index)} className={"flex flex-col gap-1 p-4 border rounded-xl cursor-pointer hover:bg-primary-foreground " + (index === selected && ' bg-primary-foreground')}>
                  <span className="text-md font-bold">{item.title}</span>
                  <span className="text-xs text-muted-foreground line-clamp-6">{item.resume}</span>
                </div>
              )
            })}
            </Fade>
          </div>
        </ScrollArea>
      </section>
    </section>
  )
}

function DropdownPlus() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer hover:opacity-80 p-1">
          <Plus size={16} strokeWidth={2} aria-hidden="true" className="size-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        <DropdownMenuItem className="cursor-pointer">
          <div
            className="flex size-6 items-center justify-center rounded-lg"
            aria-hidden="true"
          >
            <StickyNote size={14} strokeWidth={2} className="opacity-60" />
          </div>
          <div>
            <div className="text-xs">Note</div>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <div
            className="flex size-6 items-center justify-center rounded-lg"
            aria-hidden="true"
          >
            <Folder size={14} strokeWidth={2} className="opacity-60" />
          </div>
          <div>
            <div className="text-xs">Folder</div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

