import { Catalogue } from "@/components/gallery/catalogue"
import { PublicHeader } from "@/components/gallery/public-header"
import { readGallerySources } from "@/components/gallery/source"

export default async function ComponentsPage() {
  const sources = await readGallerySources()
  return (
    <>
      <PublicHeader />
      <Catalogue sources={sources} />
    </>
  )
}
