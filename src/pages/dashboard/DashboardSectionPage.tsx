interface DashboardSectionPageProps {
  title: string
  description: string
  activeItem?: string
}

function DashboardSectionPage({
  title,
  description,
  activeItem,
}: DashboardSectionPageProps) {
  return (
    <div
      className="
        dashboard-page
        min-h-full
        px-4
        py-5
        sm:px-6
        lg:px-8
        lg:py-6
      "
      data-active-item={activeItem}
    >
      <section
        className="
          rounded-[28px]
          border
          border-[#E2E6E2]
          bg-white
          p-6
          shadow-[0px_8px_24px_-8px_#080C091F]
          sm:p-8
        "
      >
        <h2
          className="
            text-[22px]
            font-semibold
            tracking-[-0.03em]
            text-[#080C09]
          "
        >
          {title}
        </h2>

        <p
          className="
            mt-2
            max-w-[600px]
            text-[13px]
            leading-6
            text-[#6E736E]
          "
        >
          {description}
        </p>
      </section>
    </div>
  )
}

export default DashboardSectionPage