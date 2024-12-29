const chapters = [
  {
    id: (Math.random() * 10000).toFixed(0).toString(),
    title: 'Introduction',
    resume: 'Led Zeppelin foi uma banda britânica de rock formada em Londres, em 1968. Consistia no guitarrista Jimmy Page, no vocalista Robert Plant, no baixista e tecladista John Paul Jones e no baterista John Bonham. Seu som pesado e violento de guitarra, enraizado no blues e música psicodélica de seus dois primeiros álbuns, é frequentemente reconhecido como um dos fundadores do heavy metal. Seu estilo foi inspirado em uma grande variedade de influências, incluindo a música folk, psicodélica e o blues.'
  },
  {
    id: (Math.random() * 10000).toFixed(0).toString(),
    title: 'Name changed',
    resume: 'Depois de mudar seu antigo nome de New Yardbirds, o Led Zeppelin assinou um contrato favorável com a Atlantic Records, que lhes ofereceu uma considerável liberdade artística. O grupo não gostava de lançar suas canções como singles, pois viam os seus álbuns como indivisíveis e completas experiências de escuta. Embora inicialmente impopular com os críticos, o grupo conseguiu um impacto comercial significativo nas vendas com Led Zeppelin (1969), Led Zeppelin II (1969), Led Zeppelin III (1970), o quarto álbum sem título (1971), Houses of the Holy (1973), e Physical Graffiti (1975). O quarto álbum, com a música "Stairway to Heaven", está entre as obras mais populares e influentes do rock e ajudou a consolidar a popularidade do grupo. '
  },
  {
    id: (Math.random() * 10000).toFixed(0).toString(),
    title: 'Cum nemo ullam ipsa',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis.'
  },
  {
    id: (Math.random() * 10000).toFixed(0).toString(),
    title: 'Sit amet consectetur',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis.'
  },
  {
    id: (Math.random() * 10000).toFixed(0).toString(),
    title: 'Adipisicing elit',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis.'
  },
  {
    id: (Math.random() * 10000).toFixed(0).toString(),
    title: 'Lorem ipsum dolor',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis.'
  },
  {
    id: (Math.random() * 10000).toFixed(0).toString(),
    title: 'Neque expedita',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis.'
  },
  {
    id: (Math.random() * 10000).toFixed(0).toString(),
    title: 'Cum nemo ullam ipsa',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis.'
  },
  {
    id: (Math.random() * 10000).toFixed(0).toString(),
    title: 'Sit amet consectetur',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis.'
  },
  {
    id: (Math.random() * 10000).toFixed(0).toString(),
    title: 'Adipisicing elit',
    resume: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis. Lorem ipsum dolor sit amet consectetur adipisicing elit. Neque expedita, enim veritatis, cum nemo ullam ipsa nam non tenetur soluta molestias et doloribus excepturi totam ab officia fugiat, odio perspiciatis.'
  },
]

export function getChapter(id: string) {
  return chapters.find(c => c.id === id.toString())
}

export function getAllChapters() {
  return chapters
}