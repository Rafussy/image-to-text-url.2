// Function to handle image upload and conversion
function convertImageToText() {
  const imageUrl = document.getElementById('image-url').value.trim(); // Get the URL from the input field

  if (imageUrl) {
    fetch(imageUrl)
      .then(response => response.blob()) // Get the image data as a Blob
      .then(blob => {
        const reader = new FileReader();

        reader.onload = function (e) {
          const img = new Image();
          img.onload = function () {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
            const dataURL = canvas.toDataURL();
            sendImageForOCR(dataURL);
          };
          img.src = e.target.result;
        };

        reader.readAsDataURL(blob); // Read the Blob data as a data URL
      })
      .catch(error => {
        console.error('Image fetch failed:', error);
      });
  } else {
    alert('Please enter a valid image URL.');
  }
}

// Function to send the image to the server for OCR processing
function sendImageForOCR(imageDataURL) {
  fetch('http://localhost:3000/ocr', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imageDataURL }),
  })
    .then(response => response.json())
    .then(data => {
      const resultText = document.getElementById('result-text');
      resultText.value = data.text;
    })
    .catch(error => {
      console.error('OCR API request failed:', error);
    });
}

// Event listener for the convert button
document.addEventListener('DOMContentLoaded', function () {
  const convertButton = document.getElementById('convert-button');
  convertButton.addEventListener('click', convertImageToText);
});
