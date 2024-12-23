import { PlusIcon } from "@radix-ui/react-icons"
import { useMeasure } from "@uidotdev/usehooks"
import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { Fade } from 'react-awesome-reveal'

const caps = {
  title: 'capitulo',
  desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore. Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate vitae eius error eligendi sequi aliquid consectetur vero debitis cumque facilis perferendis, repellendus quibusdam labore, soluta rem itaque tempora eos. Labore.'
}


export function Chapters() {
  let [searchParams] = useSearchParams()
  const [ref, { width }] = useMeasure();

  const columns = useMemo(() => {
      if (!width) return 3
      if (Math.floor(width / 400) > 12) return 12
      return Math.floor(width / 400) 
    }, [width])
  
  return (
    <div style={{ fontFamily: 'sora'}} ref={ref} className="p-8 w-full flex justify-center">
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-4xl mb-4">Chapters</h1>
          <PlusIcon height={20} width={20} />
        </div>

        <div style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }} className={`grid gap-4`}>
          <Fade triggerOnce duration={300}>
          {Array.from({ length: 10 }).map((c, index) => {
              return (
                <div className="p-8 bg-secondary rounded-xl hover:opacity-80">
                  <h1 className="text-xl capitalize">Chapter {index}</h1>
                  <span className="text-sm text-muted-foreground line-clamp-3">{caps.desc}</span>
                </div>
              )
            })}

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
  )
}

