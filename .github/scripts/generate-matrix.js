const fs = require('fs');
const path = require('path');

// Configuration
// Script is in .github/scripts/generate-matrix.js
// We want to go up two levels to get to repo root
const REPO_ROOT = path.resolve(__dirname, '../../');
const APPS_DIR = path.join(REPO_ROOT, 'apps');
const IGNORED_APPS = ['template'];

/**
 * Generates the matrix configuration for GitHub Actions
 * strictly for the user-client repository.
 */
function main() {
    const services = [];

    // Discover Dynamic Frontend Apps
    if (fs.existsSync(APPS_DIR)) {
        const apps = fs.readdirSync(APPS_DIR).filter(file => {
            const fullPath = path.join(APPS_DIR, file);
            return fs.statSync(fullPath).isDirectory() &&
                !IGNORED_APPS.includes(file) &&
                fs.existsSync(path.join(fullPath, 'package.json'));
        });

        apps.forEach(app => {
            services.push({
                name: app,
                // Build context is the monorepo root
                context: '.',
                // Dockerfile is in the monorepo root
                dockerfile: 'Dockerfile',
                // Build args
                build_args: `APP_NAME=${app}`
            });
        });
    } else {
        console.error(`Warning: Apps directory not found at ${APPS_DIR}`);
    }

    // Output the matrix in JSON format
    console.log(JSON.stringify({ include: services }));
}

main();
