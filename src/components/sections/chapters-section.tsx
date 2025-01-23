import { Input } from "../ui/input"
import { ScrollArea } from "../ui/scroll-area"
import { useMemo, useState } from "react";
import { useMeasure } from "@uidotdev/usehooks";
import Fuse from "fuse.js";
import { useLocation, useNavigate } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import { NewChapterDialog } from "../NewChapterDialog";
import { useProjectInfo } from "@/states/project-state";

export function ChaptersSection() {
  const navigate = useNavigate()
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [ref, { height }] = useMeasure();
  const chapters = useProjectInfo(state => state.info.chapters)

  function handleEditor(id: string) {
    navigate(`/project/chapter/${id}`)
    setSearch('')
  }

  const chaps = useMemo(() => {
    const fuse = new Fuse(chapters, {
      keys: ['title'],
      threshold: 0.6,
      minMatchCharLength: 1,

    })
    return search.length > 0 ? fuse.search(search).map(i => i.item) : chapters
  }, [search, chapters])

  return (
    <section className="h-screen overflow-hidden">
      <header ref={ref} className="text-muted-foreground uppercase items-center p-4 pb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium">Chapters</span>
          <div className="cursor-pointer hover:opacity-80 p-1 text-xs flex gap-2 items-center">
            <NewChapterDialog handleEditor={handleEditor} />
          </div>
        </div>
        <Input value={search} onChange={e => setSearch(e.currentTarget.value)} placeholder="Search" className="text-sm" />
      </header>

      <section>
        <ScrollArea style={{ height: `calc(100vh - ${height}px)`}} className="h-screen">
          <div className="flex flex-col p-4 gap-4">
            <Fade triggerOnce duration={300}>
            {chaps && chaps.length > 0 ? (
              chaps.map((item, index) => {
                return (
                  <button key={item.id} onClick={() => handleEditor(item.id)} className={"text-left outline-none focus-visible:outline-primary flex flex-col gap-1 p-4 w-full border rounded-xl cursor-pointer hover:opacity-80 " + (location.pathname.includes(item.id) && ' bg-primary-foreground')}>
                    <span className="text-xs text-muted-foreground font-bold uppercase">Chapter #{index + 1}</span>
                    <span className="text-lg font-bold">{item.title}</span>
                    {/* <span className="text-sm text-muted-foreground line-clamp-4">{item.resume}</span> */}
                  </button>
                )
              })
            ) : (
              <h1 className="text-center text-sm text-muted-foreground">You don't have any chapter</h1>
            )}
            </Fade>
          </div>
        </ScrollArea>
      </section>
    </section>
  )
}



