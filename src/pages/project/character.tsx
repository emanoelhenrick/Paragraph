import { useParams } from "react-router-dom";
import { chars, charTemplate } from "./characters";
import { Separator } from "@/components/ui/separator";

export function CharacterPage() {
  const { id } = useParams();

  const char = chars.find(c => c.id === parseInt(id as string))
  const template = charTemplate

  if (!char) return <div>deu rui</div>

  return (
    <div className="flex p-3 w-full">

      <section className="w-full">
        <div className="bg-primary-foreground rounded-xl justify-between border mb-3 flex text-sm text-muted-foreground">
          <div className="p-1 flex">
            <span className="px-2 py-1 hover:bg-secondary rounded-lg cursor-pointer transition">General</span>
            <span className="px-2 py-1 hover:bg-secondary rounded-lg cursor-pointer transition">Edit</span>
            <span className="px-2 py-1 hover:bg-secondary rounded-lg cursor-pointer transition">Notes</span>
          </div>
        </div>

        <section className="grid grid-cols-[2fr_1fr] gap-3">
          <div className="bg-primary-foreground rounded-xl border flex items-start p-6">
            <div className="flex flex-col gap-1 pr-6">
              <span className="text-2xl">{char.name}</span>
              <span className="text-sm text-muted-foreground mb-2">{char.description}</span>
              <Separator />
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

            <img src={char.image} className="rounded-lg" alt="" />
          </div>

          <div className="bg-primary-foreground rounded-xl border flex p-6">
            notes
          </div>
        </section>


      </section>
      
    </div>
  )
} 