const cameraControl = document.getElementById('camera-control');
const container = cameraControl.parentElement;

let isDragging = false;
let offsetX, offsetY;

cameraControl.addEventListener('mousedown', (e) => {
    isDragging = true;

    // Calculate the offset of the cursor from the top-left of the control
    offsetX = e.clientX - cameraControl.getBoundingClientRect().left;
    offsetY = e.clientY - cameraControl.getBoundingClientRect().top;

    cameraControl.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const containerRect = container.getBoundingClientRect();
        const controlRect = cameraControl.getBoundingClientRect();

        // Calculate the new position of the control
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;

        // Clamp the control position within the boundaries of the container
        x = Math.max(containerRect.left, Math.min(x, containerRect.right - controlRect.width));
        y = Math.max(containerRect.top, Math.min(y, containerRect.bottom - controlRect.height));

        // Adjust the position relative to the parent container
        cameraControl.style.left = `${x - containerRect.left}px`;
        cameraControl.style.top = `${y - containerRect.top}px`;
    }
});

document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        cameraControl.style.cursor = 'grab';
    }
});



// Webcam functionality
let stream;
document.addEventListener('DOMContentLoaded', () =>{
    startWebcam();

    document.getElementById('camera-toggle').addEventListener('click', function() {
        const cameraOn = document.querySelector('.camera-on');
        const cameraOff = document.querySelector('.camera-off');
        const webcanDiv = document.getElementById('camera-control');

        if(stream){
            stopWebcam();
            cameraOn.style.display = 'none';
            cameraOff.style.display = 'flex';
            webcanDiv.style.display = 'none';
        }else{
            startWebcam();
            cameraOn.style.display = 'flex';
            cameraOff.style.display = 'none';
            webcanDiv.style.display = 'flex';
        }
    });
});

async function startWebcam() {
    try{
        stream = await navigator.mediaDevices.getUserMedia({video: true});
        const videoElement = document.getElementById('webcam-video');
        videoElement.srcObject = stream;
        document.getElementById('webcam').style.display = 'flex';
    }catch(error){
        console.error('Error accesing webcam: ', error);
    }
}

function stopWebcam() { 
    if(stream){
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        stream = null;
    }
}