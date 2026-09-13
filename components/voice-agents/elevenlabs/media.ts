export async function acquireMediaStream(
  constraints: MediaStreamConstraints,
  cancelled: () => boolean
) {
  const stream = await navigator.mediaDevices.getUserMedia(constraints)
  if (!cancelled()) return stream
  stream.getTracks().forEach((track) => track.stop())
  return null
}
