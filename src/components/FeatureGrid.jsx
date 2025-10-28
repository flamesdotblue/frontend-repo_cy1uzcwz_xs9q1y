import React from 'react'
import { Upload, BarChart2, MessageSquare, Wand2, Shield } from 'lucide-react'

const features = [
  {
    icon: Upload,
    title: 'Intelligent Upload',
    desc: 'CSV, Excel, JSON with auto-profiling, metadata and data quality scoring.'
  },
  {
    icon: MessageSquare,
    title: 'Natural Language',
    desc: 'Ask questions in plain English. Get summaries, code, and tables.'
  },
  {
    icon: BarChart2,
    title: 'Auto Visualizations',
    desc: 'Instant charts on upload with a custom chart builder for flexibility.'
  },
  {
    icon: Wand2,
    title: 'Clean & Transform',
    desc: 'Handle missing values, outliers, and duplicates with one click.'
  },
  {
    icon: Shield,
    title: 'Safety First',
    desc: 'Scoped execution, timeouts, memory limits, and keyword blacklists.'
  }
]

const FeatureCard = ({ Icon, title, desc }) => (
  <div className="group rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur transition hover:bg-white/10">
    <div className="mb-3 inline-flex rounded-lg bg-emerald-500/10 p-2 text-emerald-400">
      <Icon size={18} />
    </div>
    <h3 className="mb-1 text-base font-semibold text-white">{title}</h3>
    <p className="text-sm text-white/70">{desc}</p>
  </div>
)

const FeatureGrid = () => {
  return (
    <section className="relative -mt-12 w-full bg-[#0b0b0c] py-16 text-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold sm:text-3xl">Built for modern data teams</h2>
            <p className="mt-2 max-w-2xl text-sm text-white/70">
              From upload to insights in minutes — no notebooks, no setup, just answers.
            </p>
          </div>
          <a href="#upload" className="hidden rounded-md bg-white/10 px-3 py-2 text-sm font-medium hover:bg-white/20 sm:inline-block">
            Explore the demo
          </a>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <FeatureCard key={f.title} Icon={f.icon} title={f.title} desc={f.desc} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeatureGrid
