import { LegacyCatalogue } from "@/components/gallery/legacy-catalogue"
import { PublicHeader } from "@/components/gallery/public-header"
import { readGallerySources } from "@/components/gallery/source"

export default async function LegacyComponentsPage() {
  const sources = await readGallerySources()
  return <><PublicHeader /><LegacyCatalogue sources={sources} /></>
}
