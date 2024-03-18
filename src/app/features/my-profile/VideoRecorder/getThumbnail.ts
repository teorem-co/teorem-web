import { VimeoResponse } from '../../searchTutors/components/TutorItem';

export async function getAndSetThumbnailUrl(videoUrl: string, setThumbnail: (thumbnail: string) => void) {
    const lastIndexOfSlash = videoUrl.lastIndexOf('/');
    const videoId = videoUrl.substring(lastIndexOfSlash + 1);
    await fetch(`https://vimeo.com/api/v2/video/${videoId}.json`).then((res) => {
        res.json().then((data: VimeoResponse[]) => {
            setThumbnail(data[0].thumbnail_large);
        });
    });
}
