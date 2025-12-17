import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Makeup Tips & Insights",
    description: "Expert makeup tips, bridal beauty guides, and skincare routines from the best makeup artist in Kanpur. Learn professional techniques at Kaya Planet.",
    keywords: ["makeup tips", "bridal makeup guide", "skincare routine", "makeup artist kanpur"],
};

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
