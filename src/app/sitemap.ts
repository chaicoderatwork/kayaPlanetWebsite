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
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: canonicalUrl('/engagement'),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: canonicalUrl('/academy'),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
        {
            url: canonicalUrl('/blog'),
            changeFrequency: 'weekly',
            priority: 0.6,
        },
    ]
}
