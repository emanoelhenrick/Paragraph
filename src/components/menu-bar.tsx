import { AvatarIcon } from "@radix-ui/react-icons";
import { Book, BookOpenText, Home, Library, Map, NotebookPen, Pen, PencilLine, Settings, StickyNote, UserPen } from "lucide-react";
import { Slide } from "react-awesome-reveal";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export function MenuBar() {
  const navigate = useNavigate()
  const location = useLocation();

  console.log(location);
  


  function handlePage(path: string) {
    navigate(path)
  }

  return (
    <div style={{ fontFamily: 'sora'}} className={`flex justify-center z-50 transition group min-w-8 h-screen`}>
      <div className={`bg-primary-foreground border-r flex flex-col py-6 justify-between overflow-hidden ${location.pathname.includes('editor') ? "opacity-0" : ""}`} >
        {/* <section className="flex items-center gap-2 px-6 py-4 mb-4 border-b max-w-52">
          <span className="text-sm text-muted-foreground line-clamp-2">Lord of the Rings: the return of the king</span>
        </section> */}
        

        <div className={`flex flex-col justify-between h-screen pl-3 pr-4 w-fit transition`}>
          <div className="flex flex-col gap-4">
            <div onClick={() => handlePage('/project/chapters')} className="flex z-10 items-center gap-4 text-sm cursor-pointer text-muted-foreground hover:bg-secondary py-2 px-4 rounded-lg">
              <Library size={18} strokeWidth={'1px'} className="text-muted-foreground hover:opacity-80 cursor-pointer" />
              <span>Chapters</span>
              <Library size={18} className="invisible" />
            </div>

            <div className="flex items-center gap-4 cursor-pointer z-10 transition text-sm text-muted-foreground hover:bg-secondary py-2 px-4 rounded-lg">
              <UserPen size={18} strokeWidth={'1px'} className="text-muted-foreground hover:opacity-80 cursor-pointer" />
              <span>Characters</span>
              <UserPen size={18} className="invisible" />
            </div>

            <div className="flex items-center gap-4 cursor-pointer z-10 transition text-sm text-muted-foreground hover:bg-secondary py-2 px-4 rounded-lg">
              <Map size={18} strokeWidth={'1px'} className="text-muted-foreground hover:opacity-80 cursor-pointer" />
              <span>Places</span>
              <Map size={18} className="invisible" />
            </div>

            <div className="flex items-center gap-4 cursor-pointer z-10 transition text-sm text-muted-foreground hover:bg-secondary py-2 px-4 rounded-lg">
              <StickyNote size={18} strokeWidth={'1px'} className="text-muted-foreground hover:opacity-80 cursor-pointer" />
              <span>Notes</span>
              <StickyNote size={18} className="invisible" />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div onClick={() => handlePage('/')} className="flex z-10 items-center gap-4 text-sm cursor-pointer text-muted-foreground hover:bg-secondary py-2 px-4 rounded-lg">
              <Home size={18} strokeWidth={'1px'} className="text-muted-foreground hover:opacity-80 cursor-pointer" />
              <span>Home</span>
              <Library size={18} className="invisible" />
            </div>

            <div className="flex items-center gap-4 cursor-pointer z-10 transition text-sm text-muted-foreground hover:bg-secondary py-2 px-4 rounded-lg">
              <Settings size={18} strokeWidth={'1px'} className="text-muted-foreground hover:opacity-80 cursor-pointer" />
              <span>Settings</span>
              <UserPen size={18} className="invisible" />
            </div>
          </div>
        </div>
      </div>
    </div>
    
  )
}