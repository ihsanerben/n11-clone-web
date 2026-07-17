import { ImageIcon } from 'lucide-react'

type ProductImageProps = {
  alt: string
  className?: string
  imageUrl: string | null
}

export function ProductImage({ alt, className = '', imageUrl }: ProductImageProps) {
  if (!imageUrl) {
    return (
      <div className={`grid place-items-center bg-slate-100 text-slate-400 ${className}`}>
        <ImageIcon aria-hidden="true" size={36} />
      </div>
    )
  }

  return <img alt={alt} className={`bg-slate-100 object-cover ${className}`} loading="lazy" src={imageUrl} />
}
