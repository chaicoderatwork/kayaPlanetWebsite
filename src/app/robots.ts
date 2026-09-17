import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/private/', '/admin/'],
            },
            {
                userAgent: 'GPTBot',
                allow: '/',
            },
            {
                userAgent: 'Google-Extended',
                allow: '/',
            }
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
    }
}
