import Seo from '../components/Seo'
import Hero from '../components/sections/Hero'
import ProofBand from '../components/sections/ProofBand'
import WhoWeAre from '../components/sections/WhoWeAre'
import Capabilities from '../components/sections/Capabilities'
import Work from '../components/sections/Work'
import Fabrication from '../components/sections/Fabrication'
import Industries from '../components/sections/Industries'
import PartnersTeaser from '../components/sections/PartnersTeaser'
import Contact from '../components/sections/Contact'

export default function Home() {
  return (
    <>
      <Seo
        path="/"
        title="XLIVE Production Event Production & Technologies · Saudi Arabia"
        description="XLIVE Production Saudi Arabia's event production & experience engineering partner. F1 Saudi Arabian Grand Prix, Dakar Rally, WRC, Red Bull built, branded and delivered on the ground in Riyadh, Jeddah and NEOM."
      />

      <Hero />
      <ProofBand />
      <WhoWeAre />
      <Capabilities />
      <Work />
      <Fabrication />
      <Industries />
      <PartnersTeaser />
      <Contact />
    </>
  )
}
