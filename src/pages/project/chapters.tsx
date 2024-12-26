import { useMeasure } from "@uidotdev/usehooks"
import { useCallback, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Fade } from 'react-awesome-reveal'
import { MenuBar } from "@/components/menu-bar"
import { Plus, Search } from "lucide-react"
import { formatDistance } from "date-fns"
import { Input } from "./components/input"
import Fuse from "fuse.js"
import { Badge } from "@/components/ui/badge"

const caps = [
  {
    title: "EM QUE PHILEAS FOGG E PASSE PARTOUT RECIPROCAMENTE SE ACEITAM",
  },
  {
    title: "EM QUE PASSEPARTOUT SE CONVENCE DE Q UE FINALMENTE ENCONTROU O SEU IDEAL",
  },
  {
    title: "EM QUE PASSEPARTOUT SE CONVENCE DE Q UE FINALMENTE ENCONTROU O SEU IDEAL",
  },
  {
    title: "EM QUE PASSEPARTOUT SE CONVENCE DE Q UE FINALMENTE ENCONTROU O SEU IDEAL",
  },
  {
    title: "EM QUE PASSEPARTOUT SE CONVENCE DE Q UE FINALMENTE ENCONTROU O SEU IDEAL",
  },
  {
    title: "EM QUE PASSEPARTOUT SE CONVENCE DE Q UE FINALMENTE ENCONTROU O SEU IDEAL",
  },
]

export function Chapters() {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [ref, { width }] = useMeasure();

  const columns = useMemo(() => {
      if (!width) return 3
      if (Math.floor(width / 400) > 12) return 12
      return Math.floor(width / 400) 
    }, [width])
  
  const chapters = useMemo(() => {
    const fuse = new Fuse(caps, {
      keys: ['title'],
      threshold: 0.6,
      minMatchCharLength: 1,

    })
    return search.length > 0 ? fuse.search(search).map(i => i.item) : caps
  }, [search])

  function handleEditor(id: string) {
    navigate(`/project/editor/${id}`)
  }

  const renderItem = useCallback((c: any, index: number) => {
    return (
      <div onClick={() => handleEditor(index.toString())} key={index} className="p-4 flex flex-col h-full justify-between gap-2 bg-primary-foreground border rounded-lg hover:opacity-80 cursor-pointer">
        <div className="flex flex-col gap-2">
          <span className="text-lg capitalize text-muted-foreground">chapter {index + 1}</span>
          {c.title && <h1 className="text-xl capitalize">{c.title}</h1>}
        </div>
        <div className="flex justify-between">
        
        <span className="text-xs text-muted-foreground text-right">updated at {formatDistance(Date.now(), Date.now() - 1000)}</span>
        </div>
      </div>
    )
  }, [])
  
  return (
    <div className="w-full">
      <div style={{ fontFamily: 'sora'}} ref={ref} className="p-3 bg-background w-full">
        <div>
          <div className="flex gap-3 mb-3">
            <div className="bg-primary-foreground flex-1 rounded-lg justify-between border flex text-sm text-muted-foreground">
              <div className="p-1 flex">
                <span className="px-2 py-1 hover:bg-secondary rounded-md cursor-pointer transition">New Chapter</span>
              </div>
            </div>

            <div className="bg-primary-foreground rounded-lg justify-between border flex items-center text-sm text-muted-foreground">
              <Input className="border-none focus:border-b rounded-none" value={search} onChange={(v) => setSearch(v.currentTarget.value)} placeholder="Search" />
              <Search className="mr-2 size-4" />
            </div>
          </div>

          <div style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }} className={`grid gap-3`}>
            <Fade triggerOnce duration={300}>
              {chapters.map((c, index) => renderItem(c, index))}
            </Fade>
          </div>
        </div>
      </div>
    </div>
  )
}

