

const imageGen = (image, maskImage) => {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    context.drawImage(image, 0, 0);
    if(maskImage != null) context.drawImage(maskImage, 0, 0, maskImage.width, maskImage.height, 0, 0, canvas.width, canvas.height);

    let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    let data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        // red
        const color = data[i];
        data[i] = data[i + 1] = data[i + 2] = data[i + 3] = color;
    }

    context.putImageData(imageData, 0, 0);
    document.getElementById("redImg").src = canvas.toDataURL("image/png");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0);
    if(maskImage != null) context.drawImage(maskImage, 0, 0, maskImage.width, maskImage.height, 0, 0, canvas.width, canvas.height);

    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        // green
        const color = data[i + 1];
        data[i] = data[i + 1] = data[i + 2] = data[i + 3] = color;
    }

    context.putImageData(imageData, 0, 0);
    document.getElementById("greenImg").src = canvas.toDataURL("image/png");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0);
    if(maskImage != null) context.drawImage(maskImage, 0, 0, maskImage.width, maskImage.height, 0, 0, canvas.width, canvas.height);

    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        // blue
        const color = data[i + 2];
        data[i] = data[i + 1] = data[i + 2] = data[i + 3] = color;
    }

    context.putImageData(imageData, 0, 0);
    document.getElementById("blueImg").src = canvas.toDataURL("image/png");
}

const gen = () => {
    const file = document.getElementById("inputFile").files[0];
    if (file == null || file.type.indexOf("image/") === -1) return;
    const url = URL.createObjectURL(file);
    const maskFile = document.getElementById("inputMaskFile").files[0];
    let maskImage = null;
    let maskImageEnable = false, standby = false, maskStandby = false;
    if (maskFile != null) {
        if (maskFile.type.indexOf("image/") != -1) {
            maskImageEnable = true;
            const maskUrl = URL.createObjectURL(maskFile);
            maskImage = new Image();
            maskImage.onload = () => {
                maskStandby = true;
            }
            maskImage.src = maskUrl;
            console.log("mask enable");
        } else {
            console.log("nope");
            return;
        }
    }

    const image = new Image();
    image.onload = () => {
        standby = true;
    }
    image.src = url;

    let id = setInterval(() => {
        if (standby) {
            if (!maskImageEnable || maskImageEnable && maskStandby) {
                console.log("go");
                imageGen(image, maskImage);
                clearInterval(id);
            }
        }
    }, 0);


}



const dl = (num) => {
    switch (num) {
        case 0:
            downloadImage(document.getElementById("redImg").src, "_red");
            break;
        case 1:
            downloadImage(document.getElementById("greenImg").src, "_green");
            break;
        case 2:
            downloadImage(document.getElementById("blueImg").src, "_blue");
            break;
    }
}

const downloadImage = (imageUrl, n) => {
    let name = document.querySelector("#name").value.replace(/\.png/g, '');
    let link = document.createElement("a");
    link.href = imageUrl;
    link.download = name + n + ".png";
    link.click();
}

document.getElementById("inputFile").addEventListener("input", (e) => {
    gen();
});