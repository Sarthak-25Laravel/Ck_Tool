CKEDITOR.dialog.add('imageToolDialog', function (editor) {
    return {
        title: 'Image Crop & Reduce Tool',
        minWidth: 900,
        minHeight: 600,
        contents: [
            {
                id: 'iframeTab',
                label: 'Image Tool',
                elements: [
                    {
                        type: 'html',
                        html: `
                            <div style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%;">
                                <iframe 
                                    id="imageToolIframe"
                                    src="${CKEDITOR.plugins.getPath('imagetool')}imagetool.html?_token=${CKEDITOR.config.imageToolToken}"
                                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 1px solid #ccc;" 
                                    frameborder="0"
                                    allowfullscreen>
                                </iframe>
                            </div>
                        `
                    }
                ]
            }
        ],
        onShow: function () {
            const iframe = document.getElementById('imageToolIframe');

            function dataURLtoBlob(dataurl) {
                const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new Blob([u8arr], { type: mime });
            }

            function handleMessage(event) {
                if (event.data && event.data.type === 'FROM_IMAGE_TOOL') {
                    const imageDataUrl = event.data.imageBlob;
                    const blob = dataURLtoBlob(imageDataUrl);
                    const formData = new FormData();
                    formData.append('upload', blob);

                    // Get token from iframe URL
                    const urlParams = new URLSearchParams(iframe.src.split('?')[1]);
                    const csrfToken = urlParams.get('_token');
                    formData.append('_token', csrfToken);

                    fetch(CKEDITOR.config.filebrowserUploadUrl, {
                        method: 'POST',
                        body: formData
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.uploaded) {
                            editor.insertHtml('<img src="' + data.url + '" />');
                        } else {
                            alert('Upload failed: ' + (data.error?.message || 'Unknown error'));
                        }
                    })
                    .catch(error => {
                        console.error('Upload error:', error);
                        alert('Upload error.');
                    });

                    window.removeEventListener('message', handleMessage);
                }
            }

            window.addEventListener('message', handleMessage);
        }
    };
});
