import { BackgroundVideo } from 'backgroundvideo';

window.testEcho = () => {
    const inputValue = document.getElementById("echoInput").value;
    BackgroundVideo.echo({ value: inputValue })
}
