import { MenuBar } from "@/components/menu-bar";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./components/dialog";
import { useMeasure } from "@uidotdev/usehooks";
import { ImageOff, Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Badge } from "@/components/ui/badge";
import { Input } from "./components/input";
import Fuse from "fuse.js"
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const notes = [
  {
    name: 'Sobre a queda dos Atreides',
    value: "Também conhecido como Paul Muad'Dib, Usul e mais tarde O Pregador, foi um humano com habilidades prescientes responsável pela queda do Imperador Shaddam IV e por governar o Imperium de 10.193 até 10.205 d.G.. Nascido no planeta de Caladan, Paul Atreides era filho do Duque Leto Atreides I e de sua concubina Bene Gesserit, Lady Jéssica Atreides. Também era irmão de Alia Atreides, que viria a nascer mais tarde.",
  },
]


export function Notes() {
  const [ref, { width }] = useMeasure();
  const [search, setSearch] = useState('')
  
  const columns = useMemo(() => {
      if (!width) return 3
      if (Math.floor(width / 400) > 12) return 12
      return Math.floor(width / 400) 
    }, [width])

  const placesFiltered = useMemo(() => {
    const fuse = new Fuse(notes, {
      keys: ['name'],
      threshold: 0.6,
      minMatchCharLength: 1,

    })
    return search.length > 0 ? fuse.search(search).map(i => i.item) : notes
  }, [search])

  const renderItem = useCallback((note: any, index: number) => {
      return (
        <div key={index} className={`border items-start rounded-xl p-6 hover:opacity-80 transition bg-primary-foreground overflow-hidden cursor-pointer group`}>
          <span className="line-clamp-2 text-xl mb-2">{note.name}</span>
          <span className="text-xs text-muted-foreground line-clamp-6 leading-normal">{note.value}</span>
        </div>
      )
    }, [])

  return (
    <div className="flex p-3 w-full">

      <section ref={ref} className="w-full">
        <div className="bg-primary-foreground rounded-xl justify-between border mb-3 flex text-sm text-muted-foreground">
          <div className="p-1 flex">
            <span className="px-2 py-1 hover:bg-secondary rounded-lg cursor-pointer transition">New Note</span>
          </div>

          <div className="flex items-center gap-2 mr-1">
            <Input value={search} onChange={(v) => setSearch(v.currentTarget.value)} placeholder="Search" />
          </div>
        </div>
        <div style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }} className={`grid gap-3`}>
          <Fade triggerOnce duration={300}>
            {placesFiltered.map((place, index) => renderItem(place, index))}
          </Fade>
        </div>
      </section>
      
    </div>
  )
}