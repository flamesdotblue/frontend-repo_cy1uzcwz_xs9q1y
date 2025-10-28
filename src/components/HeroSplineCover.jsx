import React from 'react'
import Spline from '@splinetool/react-spline'
import { Rocket, BarChart2, MessageSquare } from 'lucide-react'

const HeroSplineCover = () => {
  return (
    <section className="relative h-[70vh] w-full overflow-hidden rounded-b-3xl bg-black">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/6tUXqVcUA0xgJugv/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      {/* Subtle gradient for text readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-start justify-end gap-6 px-6 pb-10 text-white">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
          <Rocket size={14} />
          AI Data Analytics Platform
        </span>
        <h1 className="text-3xl font-semibold leading-tight sm:text-5xl">
          Ask in plain language. Get instant insights, charts, and reports.
        </h1>
        <p className="max-w-2xl text-sm text-white/80 sm:text-base">
          Upload your dataset and explore it conversationally. Automatic profiling, smart visuals, and secure code execution powered by LLMs.
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <a
            href="#upload"
            className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <BarChart2 size={16} /> Start with your data
          </a>
          <a
            href="#chat"
            className="inline-flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            <MessageSquare size={16} /> Try a question
          </a>
        </div>
      </div>
    </section>
  )
}

export default HeroSplineCover
