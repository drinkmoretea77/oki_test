export default function ({ route, redirect, from }) {
    if (process.client) {
        const pages = [
            '/n/',
        ];

        const path = route.fullPath;
        const isNuxtPage = pages.some(item => path.includes(item));

        if(!isNuxtPage) {
            window.location.replace(path);
            return redirect(from.path);
        }
    }
}
