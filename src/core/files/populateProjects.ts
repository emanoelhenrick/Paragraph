import { createProjectFile } from "./createProjectFile"

export const allProjects = [
  {
    type: 'book',
    title: 'Lord of the rings',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia labore aliquid dolorem ratione molestiae consequuntur cumque, animi magni cum quos amet perspiciatis, maiores, maxime voluptatem recusandae est. Ducimus, accusamus ipsum.',
    updatedAt: new Date(2024, 9, 27) as any
  },
  {
    type: 'script',
    title: 'Dune - Part 2',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia labore aliquid dolorem ratione molestiae consequuntur cumque, animi magni cum quos amet perspiciatis, maiores, maxime voluptatem recusandae est. Ducimus, accusamus ipsum.',
    updatedAt: new Date(2024, 9, 16) as any
  },
  {
    type: 'book',
    title: 'American Gods',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia labore aliquid dolorem ratione molestiae consequuntur cumque, animi magni cum quos amet perspiciatis, maiores, maxime voluptatem recusandae est. Ducimus, accusamus ipsum.',
    updatedAt: new Date(2024, 10, 2) as any
  },
  {
    type: 'script',
    title: 'The Witch',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia labore aliquid dolorem ratione molestiae consequuntur cumque, animi magni cum quos amet perspiciatis, maiores, maxime voluptatem recusandae est. Ducimus, accusamus ipsum.',
    updatedAt: new Date(2024, 9, 28) as any
  },
  {
    type: 'book',
    title: 'Flowers to Algernon',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia labore aliquid dolorem ratione molestiae consequuntur cumque, animi magni cum quos amet perspiciatis, maiores, maxime voluptatem recusandae est. Ducimus, accusamus ipsum.',
    updatedAt: new Date(2024, 9, 27) as any
  },
  {
    type: 'note',
    title: 'Thoughts',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia labore aliquid dolorem ratione molestiae consequuntur cumque, animi magni cum quos amet perspiciatis, maiores, maxime voluptatem recusandae est. Ducimus, accusamus ipsum.',
    updatedAt: new Date(2024, 9, 4) as any
  }
]

allProjects.sort((a, b) => {
  return a.updatedAt - b.updatedAt;
});

export async function populateProjects() {
  allProjects.forEach(async (p) => {
    await createProjectFile(p)
  })
}