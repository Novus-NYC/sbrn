import ConnectBand from "@/lib/components/connect-band"
import Morning from "@/lib/components/home/morning"
import ServiceOverview from "@/lib/components/home/service-overview"
import NetworkMap from "@/lib/components/home/network-map"
import OnlineStrip from "@/lib/components/home/online-strip"
import StoriesTeaser from "@/lib/components/home/stories-teaser"
import Who from "@/lib/components/home/who"

export default function HomePage() {
  return (
    <>
      <Morning />
      <ServiceOverview />
      <Who />
      <NetworkMap />
      <OnlineStrip />
      <StoriesTeaser />
      <ConnectBand />
    </>
  )
}
