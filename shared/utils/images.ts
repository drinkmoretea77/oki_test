export function loadImage(src: string) {
    return new Promise((resolve, reject) => {
        const img: any = new Image()
        img.onload = () => resolve(img)
        img.onerror = () => reject()
        img.src = src
    })
}
