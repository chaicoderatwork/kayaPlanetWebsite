import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PUBLIC_DIR = path.join(process.cwd(), "public");

// GET - Run performance audit
export async function GET() {
    try {
        const report = {
            totalImages: 0,
            totalVideos: 0,
            unoptimized: [] as string[],
            largeFiles: [] as { name: string; size: string }[],
            recommendations: [] as string[],
        };

        // Scan directories
        const scanDir = (dir: string) => {
            if (!fs.existsSync(dir)) return;

            const files = fs.readdirSync(dir);
            for (const file of files) {
                if (file.startsWith(".")) continue;

                const filePath = path.join(dir, file);
                const stat = fs.statSync(filePath);

                if (stat.isDirectory()) {
                    scanDir(filePath);
                    continue;
                }

                const ext = path.extname(file).toLowerCase();
                const relativePath = filePath.replace(PUBLIC_DIR, "");
                const sizeInMB = stat.size / (1024 * 1024);

                // Count by type
                if ([".jpg", ".jpeg", ".png", ".webp", ".gif", ".heic"].includes(ext)) {
                    report.totalImages++;

                    // Flag non-WebP images
                    if ([".jpg", ".jpeg", ".png"].includes(ext)) {
                        report.unoptimized.push(relativePath);
                    }

                    // Flag large images (>500KB)
                    if (stat.size > 500 * 1024) {
                        report.largeFiles.push({
                            name: relativePath,
                            size: `${sizeInMB.toFixed(2)} MB`,
                        });
                    }
                } else if ([".mp4", ".mov", ".webm"].includes(ext)) {
                    report.totalVideos++;

                    // Flag large videos (>5MB)
                    if (stat.size > 5 * 1024 * 1024) {
                        report.largeFiles.push({
                            name: relativePath,
                            size: `${sizeInMB.toFixed(2)} MB`,
                        });
                    }
                }
            }
        };

        // Scan relevant directories
        scanDir(path.join(PUBLIC_DIR, "gallery"));
        scanDir(path.join(PUBLIC_DIR, "service-videos"));
        scanDir(path.join(PUBLIC_DIR, "videos"));

        // Also check root images
        const rootFiles = fs.readdirSync(PUBLIC_DIR);
        for (const file of rootFiles) {
            const ext = path.extname(file).toLowerCase();
            if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
                const filePath = path.join(PUBLIC_DIR, file);
                const stat = fs.statSync(filePath);
                if (stat.isFile()) {
                    report.totalImages++;
                    if ([".jpg", ".jpeg", ".png"].includes(ext)) {
                        report.unoptimized.push(`/${file}`);
                    }
                    if (stat.size > 500 * 1024) {
                        report.largeFiles.push({
                            name: `/${file}`,
                            size: `${(stat.size / (1024 * 1024)).toFixed(2)} MB`,
                        });
                    }
                }
            }
        }

        // Generate recommendations
        if (report.unoptimized.length > 0) {
            report.recommendations.push(
                `Convert ${report.unoptimized.length} images to WebP format for better compression`
            );
        }

        if (report.largeFiles.length > 0) {
            report.recommendations.push(
                `${report.largeFiles.length} files are larger than recommended. Consider further compression.`
            );
        }

        if (report.totalVideos > 10) {
            report.recommendations.push(
                "Consider lazy loading more aggressively for videos to improve initial load time"
            );
        }

        // Sort large files by size (largest first)
        report.largeFiles.sort((a, b) => {
            const sizeA = parseFloat(a.size);
            const sizeB = parseFloat(b.size);
            return sizeB - sizeA;
        });

        // Limit to top 10 large files
        report.largeFiles = report.largeFiles.slice(0, 10);

        return NextResponse.json(report);
    } catch (error) {
        console.error("Performance audit error:", error);
        return NextResponse.json({ error: "Audit failed" }, { status: 500 });
    }
}
