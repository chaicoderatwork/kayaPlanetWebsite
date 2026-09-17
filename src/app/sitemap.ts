import { MetadataRoute } from 'next'
import { canonicalUrl } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: canonicalUrl(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: canonicalUrl('/gallery'),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: canonicalUrl('/academy'),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ]
}
