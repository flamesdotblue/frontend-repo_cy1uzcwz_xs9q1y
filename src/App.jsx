import React from 'react'
import HeroSplineCover from './components/HeroSplineCover'
import FeatureGrid from './components/FeatureGrid'
import UploadPanel from './components/UploadPanel'
import AnalysisTabs from './components/AnalysisTabs'

function App() {
  return (
    <div className="min-h-screen w-full bg-[#0b0b0c] font-['Inter','system-ui',sans-serif] text-white">
      <HeroSplineCover />
      <FeatureGrid />
      <UploadPanel />
      <AnalysisTabs />

      <footer className="border-t border-white/10 bg-[#0b0b0c] py-8 text-center text-xs text-white/60">
        <p>
          AI Data Analytics Platform · Secure, conversational insights for everyone
        </p>
      </footer>
    </div>
  )
}

export default App
