import { Section } from "../model/section"

export const sections: Section[] = [
  {
    id: "blog",
    title: "Blog",
    description: "Each moment becomes a page, and those pages come together to fill the shelves.",
    href: "/blog",
    published: true,
  },
  {
    id: "moments",
    title: "Moments",
    description: "The day’s light, passing scenes, subtle emotions — a record of moments.",
    href: "/moments",
    published: false,
  },
  {
    id: "projects",
    title: "Projects",
    description: "Experiences take root and grow into a forest.",
    href: "/projects",
    published: false,
  },
  {
    id: "about",
    title: "About",
    description: "Thoughts on work, values, and direction",
    href: "/about",
    published: false,
  },
]
