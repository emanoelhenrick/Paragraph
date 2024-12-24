import { useMeasure } from "@uidotdev/usehooks"
import { useCallback, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Fade } from 'react-awesome-reveal'
import { MenuBar } from "@/components/menu-bar"
import { Plus } from "lucide-react"
import { formatDistance } from "date-fns"
import { Input } from "./components/input"
import Fuse from "fuse.js"

const caps = [
  {
    title: 'capitulo 1',
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
    <div className="w-full">
      <div style={{ fontFamily: 'sora'}} ref={ref} className="p-3 bg-background w-full">
        <div>
          <div className="bg-primary-foreground rounded-xl justify-between border mb-3 flex text-sm text-muted-foreground">
            <div className="p-1 flex">
              <span className="px-2 py-1 hover:bg-secondary rounded-lg cursor-pointer transition">New Chapter</span>
            </div>

            <div className="flex items-center gap-2 mr-1">
              <Input value={search} onChange={(v) => setSearch(v.currentTarget.value)} placeholder="Search" />
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

