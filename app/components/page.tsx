import { DefaultCatalogue } from "@/components/gallery/default-catalogue"
import { PublicHeader } from "@/components/gallery/public-header"
import { readGallerySources } from "@/components/gallery/source"

export default async function ComponentsPage() {
  const sources = await readGallerySources()
  return (
    <>
      <PublicHeader />
      <DefaultCatalogue sources={sources} />
    </>
  )
}
