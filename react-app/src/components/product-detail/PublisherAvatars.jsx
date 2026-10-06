import { cn } from "@/lib/utils"

export function PublisherAvatars({ avatars, more }) {
  return (
    <div className="flex items-center gap-[5px] px-1">
      <div className="flex items-center">
        {avatars.map((src, index) => (
          <img
            key={src}
            src={src}
            alt=""
            className={cn(
              "size-9 rounded-full border border-white object-cover",
              index < avatars.length - 1 && "-mr-[15px]"
            )}
          />
        ))}
      </div>
      <span className="text-[11px] text-neutral-600">+{more} more</span>
    </div>
  )
}
