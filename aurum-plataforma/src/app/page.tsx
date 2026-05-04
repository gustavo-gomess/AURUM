import Navbar from "@/components/home/Navbar"
import Hero from "@/components/home/Hero"
import CursoPrincipalBanner from "@/components/CursoPrincipalBanner"
import Problem from "@/components/home/Problem"
import Solution from "@/components/home/Solution"
import LearningPath from "@/components/home/LearningPath"
import ExtraCourses from "@/components/home/ExtraCourses"
import Differentials from "@/components/home/Differentials"
import Gamification from "@/components/home/Gamification"
import Testimonials from "@/components/home/Testimonials"
import Offer from "@/components/home/Offer"
import Guarantee from "@/components/home/Guarantee"
import FAQ from "@/components/home/FAQ"
import FinalCTA from "@/components/home/FinalCTA"

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-black text-white min-h-screen pt-16">
        <Hero />
        <CursoPrincipalBanner />
        <ExtraCourses />
        <Problem />
        <Solution />
        <LearningPath />
        <Differentials />
        <Gamification />
        <Testimonials />
        <Offer />
        <Guarantee />
        <FAQ />
        <FinalCTA />
      </main>
    </>
  )
}
