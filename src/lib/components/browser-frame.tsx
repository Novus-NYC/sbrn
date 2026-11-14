import Image from "next/image"

export type FrameProject = { name: string; url: string | null; slug: string; w: number; h: number }

/**
 * A real client website shown in a browser window. It links to the live site
 * when that site still answers; otherwise it is a plain picture of the work.
 */
export default function BrowserFrame({ project, sizes }: { project: FrameProject; sizes: string }) {
  const host = project.url ? project.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "") : ""
  const inner = (
    <>
      <span className="frame__bar" aria-hidden="true">
        <i />
        <i />
        <i />
        <b>{host}</b>
      </span>
      <span className="frame__shot">
        <Image
          src={`/media/projects/${project.slug}.webp`}
          alt={`Screenshot of the ${project.name} homepage.`}
          width={project.w}
          height={project.h}
          sizes={sizes}
        />
      </span>
      <span className="label frame__name">
        {project.name}
        {project.url ? <span className="sr-only">, live website</span> : null}
      </span>
    </>
  )
  if (!project.url) return <div className="frame frame--still">{inner}</div>
  return (
    <a className="frame" href={project.url} target="_blank" rel="noopener noreferrer">
      {inner}
    </a>
  )
}
