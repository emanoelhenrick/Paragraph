import { useParams } from "react-router-dom";
import { chars, charTemplate } from "./characters";
import { Separator } from "@/components/ui/separator";

export function CharacterPage() {
  const { id } = useParams();

  const char = chars.find(c => c.id === parseInt(id as string))
  const template = charTemplate

  if (!char) return <div>deu rui</div>

  return (
    <div className="flex p-3 w-full min-h-screen">
      <img src={char.image} className="absolute rounded-lg w-full object-cover blur-3xl z-0 opacity-30" alt="" />
      <section className="w-full z-10">
        <div className="bg-primary-foreground rounded-xl justify-between border mb-3 flex text-sm text-muted-foreground">
          <div className="p-1 flex">
            <span className="px-2 py-1 hover:bg-secondary rounded-lg cursor-pointer transition">General</span>
            <span className="px-2 py-1 hover:bg-secondary rounded-lg cursor-pointer transition">Edit</span>
            <span className="px-2 py-1 hover:bg-secondary rounded-lg cursor-pointer transition">Notes</span>
          </div>
        </div>

        <section className="flex items-start justify-center gap-3">
          <div className="bg-primary-foreground w-full max-w-screen-md rounded-xl overflow-hidden border flex flex-col items-start gap-3">
            <div className="w-full overflow-hidden relative flex gap-3 items-center p-3">
                <img src={char.image} className="rounded-lg size-24 object-cover z-10" alt="" />
                <div className="flex flex-col z-10">
                  <span className="text-3xl">{char.name}</span>
                  <span className="text-sm text-muted-foreground">{char.tag}</span>
                </div>

              <img src={char.image} className="absolute rounded-lg w-full object-cover blur-3xl z-0 opacity-30" alt="" />
            </div>
            <div className="flex flex-col gap-1 px-6 py-3">
              <span className="text-sm text-muted-foreground">{char.description}</span>
              {/* <Separator /> */}
              <div className="flex flex-col gap-3 mt-2">
                {template.labels.filter(l => l.title !== 'description' && l.title !== 'name' && l.title !== 'image').map(l => {
                  return (
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold capitalize">{l.title}</span>
                      <span className="text-sm text-muted-foreground">{char[l.title]}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </section>
      
    </div>
  )
} 