import { site } from '../data/site'
import { useReveal } from '../hooks/useReveal'
import { useScrollEffects } from '../hooks/useScrollEffects'
import { useSeo } from '../hooks/useSeo'
import { About } from '../sections/About'
import { Contact } from '../sections/Contact'
import { Education } from '../sections/Education'
import { Experience } from '../sections/Experience'
import { Hero } from '../sections/Hero'
import { Skills } from '../sections/Skills'
import { Work } from '../sections/Work'

export default function Home() {
  useSeo({ title: site.title, description: site.description, path: '' })
  useReveal('home')
  useScrollEffects('home')

  return (
    <main id="main" className="page">
      <Hero />
      <About />
      <Work />
      <Experience />
      <Skills />
      <Education />
      <Contact />
    </main>
  )
}
