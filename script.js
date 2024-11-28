document.getElementById("username").addEventListener("input", function () {
  const usernameText = this.value;
  const svgIcon = document.querySelector(".svgs").cloneNode(true).outerHTML;
  document.querySelector(".username").innerHTML = "";
  document.querySelector(".username").innerHTML = usernameText + svgIcon;
});

document
  .getElementById("upload-profile-pic")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function () {
      document.querySelector(".profile-pic").src = reader.result;
    };
    reader.readAsDataURL(file);
  });

document
  .getElementById("show-verified")
  .addEventListener("change", function () {
    const verifiedIcon = document.querySelector(".custom-svg");
    const showVerified = this.checked;

    verifiedIcon.style.display = showVerified ? "inline" : "none";
  });
document.getElementById("show-border").addEventListener("change", function () {
  const showBorder = document.querySelector(".profile-pic");
  const profileimg = document.querySelector(".profile-img");
  const borderAdd = "border-add";
  const whiteborderAdd = "white-borderadd";
  const shownBorder = this.checked;

  if (shownBorder) {
    profileimg.classList.add(borderAdd);
    showBorder.classList.add(whiteborderAdd);
  } else {
    profileimg.classList.remove(borderAdd);
    showBorder.classList.remove(whiteborderAdd);
  }
});

document
  .getElementById("post-img")
  .addEventListener("change", function (event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function () {
      document.querySelector(".main-img").src = reader.result;
    };
    reader.readAsDataURL(file);
  });

document.getElementById("location").addEventListener("input", function () {
  document.querySelector(".location").textContent = this.value;
});

document.getElementById("likes").addEventListener("input", function () {
  const likesCount = Math.abs(parseInt(this.value) || 0);
  if (likesCount >= 100000) {
    this.value = "";
    this.placeholder = "Likes cannot exceed 100,000";
  } else {
    this.value = likesCount;
    this.placeholder = "";
  }
  if (isNaN(likesCount)) {
    this.value = "";
  }
  const formattedLikes = likesCount.toLocaleString();
  document.querySelector(".likes").textContent = formattedLikes + " Likes";
});

// Update the outer border color in real-time
document
  .getElementById("outer-border-color")
  .addEventListener("input", function () {
    const borderColor = this.value;
    document.querySelector(".insta-post").style.borderColor = borderColor;
    this.style.backgroundColor = borderColor;
  });

// Update the outer border width in real-time

document
  .getElementById("outer-border-width")
  .addEventListener("input", function () {
    if (this.value > 20) {
      this.value = 20;
    }
    const borderWidth = this.value + "px";
    document.querySelector(".insta-post").style.borderWidth = borderWidth;

    if (this.value === "0") {
      document.querySelector("#show-px").innerText = "(px)"; // Show nothing if value is 0
    } else {
      document.querySelector("#show-px").innerText = "(" + borderWidth + ")";
    }
  });

// Function to create a download link
function createDownloadLink(canvas) {
  const link = document.createElement("a");
  link.download = "instapost.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// Function to clone the post element
function clonePostElement(postElement, targetWidth, targetHeight) {
  const clone = postElement.cloneNode(true);
  document.body.appendChild(clone);
  clone.style.maxWidth = `${targetWidth}px`;
  clone.style.minWidth = `${targetWidth}px`;
  clone.style.height = `${targetHeight}px`;
  return clone;
}

// Function to generate the original canvas
function generateOriginalCanvas(clone) {
  return html2canvas(clone, {
    scale: 2,
    useCORS: true,
  });
}

// Function to generate the final canvas
function generateFinalCanvas(originalCanvas, borderColor, borderWidth) {
  const finalCanvas = document.createElement("canvas");
  const finalContext = finalCanvas.getContext("2d");
  finalCanvas.width = originalCanvas.width + borderWidth * 2;
  finalCanvas.height = originalCanvas.height + borderWidth * 2;
  finalContext.fillStyle = borderColor;
  finalContext.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
  finalContext.drawImage(originalCanvas, borderWidth, borderWidth);
  return finalCanvas;
}

// Download button event listener
document.getElementById("download").addEventListener("click", function () {
  const postElement = document.querySelector(".insta-post");
  const selectedSize = document.getElementById("image-size").value;
  let targetWidth, targetHeight;
  if (selectedSize === "small") {
    targetWidth = 280;
    targetHeight = postElement.Height;
  } else if (selectedSize === "medium") {
    targetWidth = 620;
    targetHeight = postElement.Height;
  } else if (selectedSize === "auto") {
    targetWidth = 320;
    targetHeight = postElement.Height;
  }

  // Clone the element for capture to avoid modifying the original
  const clone = clonePostElement(postElement, targetWidth, targetHeight);
  const borderColor =
    document.getElementById("outer-border-color").value || "#000";
  const borderWidth =
    parseInt(document.getElementById("outer-border-width").value, 10) || 0;
  // Generate the original canvas
  generateOriginalCanvas(clone)
    .then((originalCanvas) => {
      // Generate the final canvas
      const finalCanvas = generateFinalCanvas(
        originalCanvas,
        borderColor,
        borderWidth
      );
      createDownloadLink(finalCanvas);
      document.body.removeChild(clone);
    })
    .catch((err) => {
      console.error("Error generating image:", err);
      alert("Image generation failed. Please try again.");
    });
});

/// Preview button event listener
document.getElementById("show-preview").addEventListener("click", function () {
  const postElement = document.querySelector(".insta-post");
  const selectedSize = document.getElementById("image-size").value;
  let targetWidth, targetHeight;
  if (selectedSize === "small") {
    targetWidth = 280;
    targetHeight = postElement.Height;
  } else if (selectedSize === "medium") {
    targetWidth = 620;
    targetHeight = postElement.Height;
  } else if (selectedSize === "auto") {
    targetWidth = 350;
    targetHeight = postElement.Height;
  }
  const previewImg = clonePostElement(postElement, targetWidth, targetHeight);
  const previewContainer = document.querySelector("#previews");
  previewContainer.innerHTML = "";
  previewContainer.appendChild(previewImg);
});
