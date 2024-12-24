import { MenuBar } from "@/components/menu-bar";
import { Dialog, DialogContent, DialogTrigger } from "./components/dialog";
import { useMeasure } from "@uidotdev/usehooks";
import { ImageOff } from "lucide-react";
import { useCallback, useMemo } from "react";
import { Fade } from "react-awesome-reveal";
import { Badge } from "@/components/ui/badge";

const chars = [
  {
    name: 'Paul Atreides',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis maxime deleniti iure dolorum, necessitatibus quis facere ab aut ex asperiores minima corrupti labore adipisci voluptate tempore quasi vero, itaque error. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis maxime deleniti iure dolorum, necessitatibus quis facere ab aut ex asperiores minima corrupti labore adipisci voluptate tempore quasi vero, itaque error. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis maxime deleniti iure dolorum, necessitatibus quis facere ab aut ex asperiores minima corrupti labore adipisci voluptate tempore quasi vero, itaque error.',
    tags: ['Protagonista', 'Atreides'],
    image: 'https://cdnb.artstation.com/p/assets/images/images/030/318/801/large/brian-taylor-paul.jpg?1600250795'
  },
  {
    name: 'Chani Kynes',
    description: 'Chani é filha de Liet Kynes, o planetologista imperial de Arrakis e líder dos Fremen, e de uma mulher Fremen. Crescendo no deserto de Arrakis, Chani é profundamente enraizada na cultura e nas tradições dos Fremen, tornando-se uma figura resiliente e determinada. ',
    image: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/a05e8a16-2b75-4ac2-bf5c-f154d79cd905/deup5v6-9e41db50-d109-42f0-b542-1096fb266a0a.png/v1/fill/w_1280,h_1600,q_80,strp/chani_from_dune_by_aribudo_deup5v6-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTYwMCIsInBhdGgiOiJcL2ZcL2EwNWU4YTE2LTJiNzUtNGFjMi1iZjVjLWYxNTRkNzljZDkwNVwvZGV1cDV2Ni05ZTQxZGI1MC1kMTA5LTQyZjAtYjU0Mi0xMDk2ZmIyNjZhMGEucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.4KEUsrSpdecffG5tp_nLBX4MBMJ2Lj3cJqJh1h1yOZQ',
    tags: ['Arrakis']
  },
  {
    name: 'Leto Atreides I',
    description: 'Primo por parte de mãe dos membros da Casa Corrino, Leto Atreides I, também conhecido como Leto, o Justo e chamado de Duque Vermelho pelas legiões Sardaukar de Shaddam IV, foi um Duque da Casa Atreides na época da ascensão Atreides. Era conhecido por sua compaixão, bondade e sua liderança.',
    image: 'https://i.pinimg.com/736x/98/3c/ee/983cee29f3ab7789dbe556236f9ffb7f.jpg',
    tags: ['Atreides']
  },
]

export function Characters() {
  const [ref, { width }] = useMeasure();
  
  const columns = useMemo(() => {
      if (!width) return 3
      if (Math.floor(width / 400) > 12) return 12
      return Math.floor(width / 400) 
    }, [width])
  
  const renderItem = useCallback((char: any, index: number) => {
      return (
        <div key={index} className="grid grid-cols-[3fr_5fr] h-full border items-start rounded-xl bg-primary-foreground overflow-hidden cursor-pointer group">
          <div className="h-full bg-secondary flex justify-center items-center overflow-hidden" >
            {char.image && <img className="object-cover h-full group-hover:scale-105 transition"  src={char.image} alt="" />}
            <ImageOff className="text-muted-foreground" />
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
            {char.tags && (
              <div className="flex gap-2 flex-wrap">
                {char.tags.map(t => <Badge>{t}</Badge>)}
              </div>
            )}
          </div>
        </div>
      )
    }, [])

  return (
    <div className="flex p-4">
      {/* <div className="invisible">
        <MenuBar />
      </div> */}

      <section ref={ref}>
        <div style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }} className={`grid gap-4`}>
          <Fade triggerOnce duration={300}>
            {chars.map((char, index) => renderItem(char, index))}
          </Fade>
        </div>
      </section>
      
    </div>
  )
}