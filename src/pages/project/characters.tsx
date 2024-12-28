import { ImageOff, Pencil, Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Fade } from "react-awesome-reveal";
import { Badge } from "@/components/ui/badge";
import { Input } from "./components/input";
import Fuse from "fuse.js"
import { useNavigate } from "react-router-dom";
import { useMeasure } from "@uidotdev/usehooks";
import { Dialog, DialogContent, DialogTrigger } from "./components/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

export const chars = [
  {
    id: 1,
    name: 'Paul Atreides',
    description: "Também conhecido como Paul Muad'Dib, Usul e mais tarde O Pregador, foi um humano com habilidades prescientes responsável pela queda do Imperador Shaddam IV e por governar o Imperium de 10.193 até 10.205 d.G.. Nascido no planeta de Caladan, Paul Atreides era filho do Duque Leto Atreides I e de sua concubina Bene Gesserit, Lady Jéssica Atreides. ",
    tag: 'Emperor',
    planet: "Caladan",
    house: "Atreides",
    image: 'https://static.wikia.nocookie.net/dune/images/8/83/PaulTextless.jpeg'
  },
  { id: 2,
    name: 'Chani Kynes',
    description: 'Chani é filha de Liet Kynes, o planetologista imperial de Arrakis e líder dos Fremen, e de uma mulher Fremen. Crescendo no deserto de Arrakis, Chani é profundamente enraizada na cultura e nas tradições dos Fremen, tornando-se uma figura resiliente e determinada. ',
    image: 'https://static.wikia.nocookie.net/dune/images/c/cf/Chanitextless.jpeg',
    tag: 'Wife',
    planet: 'Arrakis',
    house: 'Fremen',
  },
  {
    id: 3,
    name: 'Leto Atreides I',
    description: 'Primo por parte de mãe dos membros da Casa Corrino, Leto Atreides I, também conhecido como Leto, o Justo e chamado de Duque Vermelho pelas legiões Sardaukar de Shaddam IV, foi um Duque da Casa Atreides na época da ascensão Atreides. Era conhecido por sua compaixão, bondade e sua liderança.',
    image: 'https://static.wikia.nocookie.net/dune/images/3/3a/DuneLetoTextlessPoster.jpeg',
    tag: 'Duke',
    planet: 'Caladan',
    house: 'Atreides',
  },
  {
    id: 4,
    name: 'Jéssica Atreides',
    description: 'Lady Jéssica Atreides, Lady Jéssica ou apenas Jéssica, foi uma Reverenda Madre da Irmandade Bene Gesserit. Ela também foi a concubina oficial do Duque Leto Atreides I, com quem teve dois filhos: o Imperador Paul Atreides e a Regente Alia Atreides.',
    tag: 'Bene Gesserit',
    planet: 'Caladan',
    house: 'Atreides',
    image: 'https://static.wikia.nocookie.net/dune/images/a/a9/Jessicatextless.jpeg'
  },
  {
    id: 5,
    name: 'Vladimir Harkonnen',
    description: 'Vladimir Harkonnen, comumente chamado de barão Harkonnen, seu título oficial é barão-siridar(governador planetário). Vladimir Harkonnen é o descendente masculino em linha direta do bashar Abulurd Harkonnen, banido por covardia após a Batalha de Corrino. A volta da Casa Harkonnen ao poder costuma ser atribuída à manipulação sagaz do mercado de pele de baleia e, posteriormente, à consolidação com a abundância de mélange em Arrakis. ',
    image: 'https://static.wikia.nocookie.net/dune/images/9/90/BaronTextless.jpeg',
    tag: 'Harkonnen',
    planet: 'Giedi Prime',
    house: 'Atreides',
  },
  {
    id: 6,
    name: 'Stilgar Ben Fifrawi',
    description: 'Stilgar, nome completo Stilgar Ben Fifrawi, foi o Naib do Sietch Tabr, tribo Fremen de Arrakis. Stilgar era um grande amigo do Imperador Paul Atreides, já que ele o havia acolhido juntamente com sua mãe, Jéssica Atreides, no Sietch Tabr após o ataque da Casa Harkonnen.',
    image: 'https://static.wikia.nocookie.net/dune/images/8/8c/Stilgartextless.webp',
    tag: 'Naib',
    planet: 'Arrakis',
    house: 'Fremen',
  },
]

export const charTemplate = {
  title: 'Standard',
  labels: [
    {
      title: 'name',
      type: 'string'
    },
    {
      title: 'description',
      type: 'string'
    },
    {
      title: 'house',
      type: 'string'
    },
    {
      title: 'planet',
      type: 'string'
    },
    {
      title: 'image',
      type: 'string'
    },
    {
      title: 'tag',
      type: 'string'
    },
  ]
}

const templates = [charTemplate]

export function Characters() {
  const navigate = useNavigate()
  const [ref, { width, height }] = useMeasure();
  const [search, setSearch] = useState('')

  const [selectedChar, setSelectedChar] = useState(chars[0])
  
  const columns = useMemo(() => {
      if (!width) return 3
      if (Math.floor(width / 400) > 12) return 12
      return Math.floor(width / 400) 
    }, [width])

  const characters = useMemo(() => {
    const fuse = new Fuse(chars, {
      keys: ['name'],
      threshold: 0.6,
      minMatchCharLength: 1,

    })
    return search.length > 0 ? fuse.search(search).map(i => i.item) : chars
  }, [search])

  const renderItem = useCallback((char: any, index: number) => {
      return (
        <Sheet>
          <SheetTrigger className="w-full">
            <div onClick={() => setSelectedChar(chars.find(c => c.id === char.id))} className="w-full cursor-pointer hover:opacity-80 overflow-hidden relative flex bg-primary-foreground rounded-lg border gap-3 items-center p-3">
              <div className="z-10 aspect-square rounded-md flex justify-center items-center border overflow-hidden">
                <img src={char.image} className="object-cover aspect-square size-24" alt="" />
              </div>

              <div className="flex flex-col items-start text-left w-full z-10">
                <span className="text-xl line-clamp-1">{char.name}</span>
                <span className="text-xs text-muted-foreground">{char.tag}</span>
              </div>

              {/* <img src={char.image} className="object-cover w-full absolute scale-105 blur-3xl opacity-20" alt="" /> */}
            </div>
          </SheetTrigger>
          <SheetContent>
            <div className="absolute flex gap-2 items-center right-4 top-4 cursor-pointer hover:opacity-80 z-20">
              <span className="text-sm text-muted-foreground">Edit</span>
            </div>
            <ScrollArea className="h-full w-full">
            <div className=" w-full overflow-hidden gap-3">         
            <div className="w-full h-fit overflow-hidden relative flex gap-3 items-center p-6">
              <img
                src={char.image}
                className="rounded-lg size-32 object-cover hover:opacity-80 cursor-pointer transition z-10"
                alt=""
              />
              <div className="flex flex-col z-10">
                <span className="text-3xl line-clamp-3">{char.name}</span>
                <span className="text-sm text-muted-foreground line-clamp-1">{char.tag}</span>
              </div>
              <img
                src={char.image}
                className="absolute rounded-lg w-full object-cover blur-3xl z-0 opacity-30"
                alt=""
              />
            </div>
              <div className="gap-1 px-6 py-3">
                <span className="text-sm text-muted-foreground">
                  {char.description}
                </span>
                <div className="flex flex-col gap-6 mt-6">
                  {charTemplate.labels
                    .filter(
                      (l) =>
                        l.title !== "description" &&
                        l.title !== "name" &&
                        l.title !== "image"
                    )
                    .map((l, idx) => (
                      <div key={idx} className="flex flex-col gap-1">
                        <span className="text-sm font-bold capitalize">{l.title}</span>
                        <span className="text-sm text-muted-foreground">
                          {char[l.title]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        
      )
    }, [])

  return (
    <div className="flex p-3 w-full h-screen">

      <section ref={ref} className="w-full h-full">
        <div className="flex flex-col gap-3 h-full">
            <div className="flex gap-3">
              <div className="bg-primary-foreground rounded-lg justify-between border flex text-sm text-muted-foreground flex-1">
                <div className="p-1 flex">
                  <span className="px-2 py-1 hover:bg-secondary rounded-lg cursor-pointer transition">New Character</span>
                  <span className="px-2 py-1 hover:bg-secondary rounded-lg cursor-pointer transition">New Template</span>
                </div>
              </div>

              <div className="bg-primary-foreground rounded-lg justify-between border flex items-center text-sm text-muted-foreground">
                <Input className="border-none focus:border-b rounded-none" value={search} onChange={(v) => setSearch(v.currentTarget.value)} placeholder="Search" />
                <Search className="mr-2 size-4" />
              </div>
            </div>
            <ScrollArea className="h-full pb-12">
              <div
                style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
                className="grid gap-3 h-fit overflow-auto"
              >
                <Fade triggerOnce duration={300}>
                  {characters.map((char, index) => renderItem(char, index))}
                </Fade>
              </div>
            </ScrollArea>

          
        </div>
      </section>
      
    </div>
  )
}

{/* <div key={index} className={`grid grid-cols-[3fr_5fr] h-full border items-start rounded-lg bg-primary-foreground overflow-hidden cursor-pointer group`}>
  <div className="h-full flex justify-center items-center overflow-hidden p-1 " >
    {char.image && <img className="object-cover h-full group-hover:scale-105 rounded-md z-10 transition"  src={char.image} alt="" />}
    <ImageOff className="absolute text-muted-foreground" />
  </div>

  <div className="flex flex-col gap-4 py-6 pl-6 pr-8 text-left">
    <div className="text-sm flex flex-col gap-1">
      <span className="capitalize text-xs text-muted-foreground">Name</span>
      <span>{char.name}</span>
    </div>
    <div className="text-sm flex flex-col gap-1">
      <span className="capitalize text-xs text-muted-foreground">Description</span>
      <span className="line-clamp-6">{char.description}</span>
    </div>
    {char.tag && (
      <div className="flex gap-2 flex-wrap">
        {<Badge>{char.tag}</Badge>}
      </div>
    )}
  </div>
</div> */}