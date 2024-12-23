import { useMeasure } from "@uidotdev/usehooks"
import { useCallback, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Fade } from 'react-awesome-reveal'
import { MenuBar } from "@/components/menu-bar"
import { Plus } from "lucide-react"
import { formatDistance } from "date-fns"

const caps = [
  {
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  },
  {
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  }
  ,{
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  }
  ,{
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  }
  ,{
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  },
  {
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  },
  {
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  },
  {
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  },
  {
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  },
  {
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  },
  {
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
  },
  {
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  },
  {
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  },
  {
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  },
  {
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  },
  {
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  },
  {
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  },
  {
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  },
  {
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  }
  ,{
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  }
  ,{
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  }
  ,{
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  },
  {
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  },
  {
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  },
  {
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  },
  {
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  },
  {
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  },
  {
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
  },
  {
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  },
  {
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  },
  {
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  },
  {
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  },
  {
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  },
  {
    title: 'capitulo',
    desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
  }
]

export function Chapters() {
  const navigate = useNavigate()

  const [ref, { width }] = useMeasure();

  const columns = useMemo(() => {
      if (!width) return 3
      if (Math.floor(width / 400) > 12) return 12
      return Math.floor(width / 400) 
    }, [width])

  function handleEditor(id: string) {
    navigate(`/project/editor/${id}`)
  }

  const renderItem = useCallback((caps: any, index: number) => {
    return (
      <div onClick={() => handleEditor(index.toString())} key={index} className="p-6 flex flex-col h-full justify-between gap-4 bg-primary-foreground border rounded-xl hover:opacity-80 cursor-pointer">
        <div>
          <h1 className="text-xl capitalize mb-1">Chapter {index}</h1>
          <span className="text-sm text-muted-foreground line-clamp-3">{caps.desc}</span>
        </div>
        <span className="text-xs text-muted-foreground text-right">updated at {formatDistance(Date.now(), Date.now() - 1000)}</span>
      </div>
    )
  }, [])
  
  return (
    <div className="flex">
      <div className="invisible">
        <MenuBar />
      </div>
      <div style={{ fontFamily: 'sora'}} ref={ref} className="p-4 bg-background w-full flex justify-center">
      <div>
        <div className="flex gap-3 items-center w-fit bg-primary-foreground py-2 px-4 rounded-lg mb-4 border cursor-pointer hover:opacity-80 transition ">
          <span className="text-sm  ">New chapter</span>
          <Plus className="" size={14} />
        </div>

        <div style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }} className={`grid gap-4`}>
          <Fade triggerOnce duration={300}>
          {caps.map((c, index) => renderItem(c, index))}

          </Fade>
        </div>

        {/* <div className="flex flex-col gap-4">
          {caps.map(c => {
            return (
              
              <div className="p-8 bg-secondary rounded-xl">
                <h1 className="text-xl capitalize">{c.title}</h1>
                <span className="text-sm text-muted-foreground line-clamp-3">{c.desc}</span>
              </div>
            )
          })}
        </div> */}
      </div>
    </div>
    </div>
  )
}

