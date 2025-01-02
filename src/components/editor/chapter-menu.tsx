import { Editor } from "@tiptap/react";
import { EditorMenuBar } from "./editor-menu-bar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import { Tag, TagInput } from "emblor";
import { useState } from "react";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const tags = [
  {
    id: "1",
    text: "Sport",
  },
  {
    id: "2",
    text: "Coding",
  },
  {
    id: "3",
    text: "Travel",
  },
];

const fakeVersions = [
  {
    name: 'v0.1',
    value: '0.1'
  },
  {
    name: 'v0.2',
    value: '0.2'
  },
  {
    name: 'v0.3',
    value: '0.3'
  }
]

export function ChapterMenu({ editor }: { editor: Editor }) {
  const [exampleTags, setExampleTags] = useState<Tag[]>(tags);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col justify-between">
      <div>
        <div className="p-4">
          <EditorMenuBar editor={editor} />
        </div>

        <Tabs defaultValue="tab-1">
          <TabsList className="h-auto rounded-none w-full border-b border-border bg-transparent p-0">
            <TabsTrigger
              value="tab-1"
              className="relative flex-1 text-xs font-normal rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
            >
              Scenes
            </TabsTrigger>
            <TabsTrigger
              value="tab-2"
              className="relative flex-1 text-xs font-normal rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
            >
              Comments
            </TabsTrigger>
            <TabsTrigger
              value="tab-3"
              className="relative flex-1 text-xs font-normal rounded-none py-2 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary"
            >
              Tags
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tab-1">
            <p className="p-4 text-center text-xs text-muted-foreground">Content for Tab 1</p>
          </TabsContent>

          <TabsContent value="tab-2">
            <div className="">

            </div>
          </TabsContent>

          <TabsContent value="tab-3">
            <div className="px-4 pt-1">
              <div className="space-y-2">
                <TagInput
                  id="input-56"
                  tags={exampleTags}
                  setTags={(newTags) => {
                    setExampleTags(newTags);
                  }}
                  placeholder="Add a tag"
                  styleClasses={{
                    tagList: {
                      container: "gap-1",
                    },
                    input:
                      "rounded-lg transition-shadow placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20",
                    tag: {
                      body: "relative h-7 bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
                      closeButton:
                        "absolute -inset-y-px -end-px p-0 rounded-s-none rounded-e-lg flex size-7 transition-colors outline-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 text-muted-foreground/80 hover:text-foreground",
                    },
                  }}
                  activeTagIndex={activeTagIndex}
                  setActiveTagIndex={setActiveTagIndex}
                  inlineTags={false}
                  inputFieldPosition="top"
                />
                
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}