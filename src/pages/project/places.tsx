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

const places = [
  {
    name: 'Caladan',
    description: "Também conhecido como Paul Muad'Dib, Usul e mais tarde O Pregador, foi um humano com habilidades prescientes responsável pela queda do Imperador Shaddam IV e por governar o Imperium de 10.193 até 10.205 d.G.. Nascido no planeta de Caladan, Paul Atreides era filho do Duque Leto Atreides I e de sua concubina Bene Gesserit, Lady Jéssica Atreides. Também era irmão de Alia Atreides, que viria a nascer mais tarde.",
    image: 'https://wallpapercat.com/w/full/4/1/f/484676-3840x1657-desktop-dual-screen-caladan-background-photo.jpg'
  },
  {
    name: 'Arrakis',
    description: "Também conhecido como Paul Muad'Dib, Usul e mais tarde O Pregador, foi um humano com habilidades prescientes responsável pela queda do Imperador Shaddam IV e por governar o Imperium de 10.193 até 10.205 d.G.. Nascido no planeta de Caladan, Paul Atreides era filho do Duque Leto Atreides I e de sua concubina Bene Gesserit, Lady Jéssica Atreides. Também era irmão de Alia Atreides, que viria a nascer mais tarde.",
    image: 'https://traversingtradition.com/wp-content/uploads/2021/10/wolfgang-hasselmann-pvr6wvunemk-unsplash.jpg'
  },
  {
    name: 'Gieidi Primo',
    description: "Também conhecido como Paul Muad'Dib, Usul e mais tarde O Pregador, foi um humano com habilidades prescientes responsável pela queda do Imperador Shaddam IV e por governar o Imperium de 10.193 até 10.205 d.G.. Nascido no planeta de Caladan, Paul Atreides era filho do Duque Leto Atreides I e de sua concubina Bene Gesserit, Lady Jéssica Atreides. Também era irmão de Alia Atreides, que viria a nascer mais tarde.",
    image: 'https://cdnb.artstation.com/p/assets/images/images/074/371/567/large/ba-giedi-prime3.jpg?1711923222'
  },
]


export function Places() {
  const [ref, { width }] = useMeasure();
  const [search, setSearch] = useState('')
  
  const columns = useMemo(() => {
      if (!width) return 3
      if (Math.floor(width / 500) > 12) return 12
      return Math.floor(width / 500) 
    }, [width])

  const placesFiltered = useMemo(() => {
    const fuse = new Fuse(places, {
      keys: ['name'],
      threshold: 0.6,
      minMatchCharLength: 1,

    })
    return search.length > 0 ? fuse.search(search).map(i => i.item) : places
  }, [search])

  const renderItem = useCallback((place: any, index: number) => {
      return (
        <div key={index} className={`max-h-44 border items-start rounded-xl bg-primary-foreground overflow-hidden cursor-pointer group`}>
          <div className="flex justify-center h-44 items-center overflow-hidden relative rounded-xl" >
            <div className="z-10 absolute flex flex-col text-center px-16">
              <span className="text-2xl">{place.name}</span>
            </div>
            {place.image && <img className="object-cover w-full h-full rounded-lg opacity-60 group-hover:scale-105 transition z-0"  src={place.image} alt="" />}
          </div>
        </div>
      )
    }, [])

  return (
    <div className="flex p-3 w-full">

      <section ref={ref} className="w-full">
        <div className="bg-primary-foreground rounded-xl justify-between border mb-3 flex text-sm text-muted-foreground">
          <div className="p-1 flex">
            <span className="px-2 py-1 hover:bg-secondary rounded-lg cursor-pointer transition">New Place</span>
            <span className="px-2 py-1 hover:bg-secondary rounded-lg cursor-pointer transition">New Template</span>
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