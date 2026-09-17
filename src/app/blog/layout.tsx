import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
    path: "/blog",
    title: "Makeup Tips & Insights",
    description: "Expert makeup tips, bridal beauty guides, and skincare routines from the best makeup artist in Kanpur. Learn professional techniques at Kaya Planet.",
});

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
