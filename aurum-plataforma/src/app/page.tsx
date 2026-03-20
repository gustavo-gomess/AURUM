import Navbar from "@/components/home/Navbar"
import Hero from "@/components/home/Hero"
import Problem from "@/components/home/Problem"
import Solution from "@/components/home/Solution"
import LearningPath from "@/components/home/LearningPath"
import ExtraCourses from "@/components/home/ExtraCourses"
import HowItWorks from "@/components/home/HowItWorks"
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
        <Problem />
        <Solution />
        <LearningPath />
        <ExtraCourses />
        <HowItWorks />
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
