import { useEffect, useState } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import P3Menu from './P3Menu'
import ResumePage from './ResumePage'
import ProjectsPage from './ProjectsPage'
import PageTransition from './PageTransition'
import Socials from './Socials'
import AboutMe from './AboutMe'
import SeaOfSouls from './SeaOfSouls'
import Intro from './Intro'
import Hud from './Hud'
import Cursor from './Cursor'
import NotFound from './NotFound'
import { PROFILE } from './content'
import { toggleDarkHour, onDarkHourChange } from './darkHour'
import { playRankUp } from './sfx'
import './App.css'

const TITLES = {
  '/': 'Belal Embaby — Software Engineer',
  '/about': 'About — Belal Embaby',
  '/resume': 'Resume — Belal Embaby',
  '/projects': 'Projects — Belal Embaby',
  '/socials': 'Socials — Belal Embaby',
}

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

function MenuScreen() {
  const navigate = useNavigate()
  return (
    <div id="menu-screen">
      <SeaOfSouls theme="menu" />
      <P3Menu
        onNavigate={(page) => {
          if (page === 'github') window.open(PROFILE.github.url, '_blank')
          else navigate(`/${page}`)
        }}
      />
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition><MenuScreen /></PageTransition>
        } />
        <Route path="/about" element={
          <PageTransition variant="about"><AboutMe /></PageTransition>
        } />
        <Route path="/resume" element={
          <PageTransition variant="resume"><ResumePage /></PageTransition>
        } />
        <Route path="/projects" element={
          <PageTransition variant="projects"><ProjectsPage /></PageTransition>
        } />
        <Route path="/socials" element={
          <PageTransition variant="socials"><Socials /></PageTransition>
        } />
        <Route path="*" element={
          <PageTransition><NotFound /></PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  )
}

// Keeps the tab title in sync with the current screen.
function TitleSync() {
  const location = useLocation()
  useEffect(() => {
    document.title = TITLES[location.pathname] ?? '??? — Belal Embaby'
  }, [location.pathname])
  return null
}

// Konami code → Dark Hour. A full-screen flash sells the moment.
function useKonami(onTrigger) {
  useEffect(() => {
    let idx = 0
    const onKey = (e) => {
      const expect = KONAMI[idx]
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      if (key === expect) {
        idx++
        if (idx === KONAMI.length) {
          idx = 0
          onTrigger()
        }
      } else {
        idx = key === KONAMI[0] ? 1 : 0
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onTrigger])
}

export default function App() {
  const [introDone, setIntroDone] = useState(
    () => sessionStorage.getItem('p3-intro-seen') === '1'
  )
  const [darkFlash, setDarkFlash] = useState(false)

  useKonami(() => {
    toggleDarkHour()
    playRankUp()
  })

  // Flash overlay whenever Dark Hour flips (from Konami or the HUD clock).
  useEffect(() => onDarkHourChange(() => {
    setDarkFlash(true)
    const t = setTimeout(() => setDarkFlash(false), 700)
    return () => clearTimeout(t)
  }), [])

  return (
    <>
      <TitleSync />
      {!introDone && (
        <Intro onDone={() => {
          sessionStorage.setItem('p3-intro-seen', '1')
          setIntroDone(true)
        }} />
      )}
      <AnimatedRoutes />
      <Hud />
      <Cursor />
      {darkFlash && (
        <div
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1500,
            pointerEvents: 'none',
            background: 'radial-gradient(circle at 50% 40%, rgba(190, 255, 120, 0.5) 0%, rgba(3, 20, 10, 0.85) 70%)',
            animation: 'dark-flash 0.7s ease-out both',
          }}
        />
      )}
      <style>{`
        @keyframes dark-flash {
          0% { opacity: 0; }
          18% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </>
  )
}
