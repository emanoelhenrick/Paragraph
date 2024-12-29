import { Plus } from "lucide-react"
import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll-area"
import { useMemo, useState } from "react";
import { useMeasure } from "@uidotdev/usehooks";
import Fuse from "fuse.js";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllChapters } from "@/fakeData/fake-chapters";

export function ChaptersSection() {
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [ref, { height }] = useMeasure();

  console.log(location.pathname);
  

  const chapters = useMemo(() => {
    return getAllChapters()
  }, [])

  function handleEditor(id: string) {
    navigate(`/project/chapter/${id}`)
  }

  const chaps = useMemo(() => {
    const fuse = new Fuse(chapters, {
      keys: ['title'],
      threshold: 0.6,
      minMatchCharLength: 1,

    })
    return search.length > 0 ? fuse.search(search).map(i => i.item) : chapters
  }, [search])

  return (
    <section className="h-screen overflow-hidden">
      <header ref={ref} className="text-muted-foreground uppercase items-center p-4 pb-2">
        <div className="flex justify-between mb-3">
          <span className="text-xs">Chapters</span>
          <Plus className="size-4" />
        </div>
        <Input value={search} onChange={e => setSearch(e.currentTarget.value)} placeholder="Search" className="text-xs" />
      </header>

      <section>
        <ScrollArea style={{ height: `calc(100vh - ${height}px)`}} className="h-screen">
          <div className="flex flex-col p-4 gap-4">
            {chaps.map((item, index) => {
              return (
                <div key={item.id} onClick={() => handleEditor(item.id)} className={"flex flex-col gap-1 p-4 border rounded-xl cursor-pointer hover:opacity-80 " + (location.pathname.includes(item.id) && ' bg-primary-foreground')}>
                  <span className="text-xs text-muted-foreground font-bold">Chapter #{index + 1}</span>
                  <span className="text-md font-bold">{item.title}</span>
                  <span className="text-xs text-muted-foreground line-clamp-4">{item.resume}</span>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </section>
    </section>
  )
}