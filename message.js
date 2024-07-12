document.getElementById("start").addEventListener("click", function() {
    window.location.href = "main.html";
});
document.getElementById("character").addEventListener("click", function() {
    window.location.href = "characterChange.html";
});
const closeMsg = document.getElementById("close-msg")
const displayMsg = document.getElementById("display-msg");
const msg = document.getElementById("message");

msg.addEventListener("click", () => {
    displayMsg.style.top = "50%";
    document.querySelector(".container").style.opacity = .7;
    closeMsg.style.display ="block"
});
closeMsg.addEventListener("click", ()=>{
    displayMsg.style.top = "-50%";
closeMsg.style.display ="none";
document.querySelector(".container").style.opacity = 1;
})


