"use client"

import { galleryEntries } from "./catalog"
import { Catalogue } from "./catalogue"

export function DefaultCatalogue({
  sources,
}: {
  sources: Record<string, string>
}) {
  return <Catalogue sources={sources} entries={galleryEntries} />
}
