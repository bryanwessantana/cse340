document.addEventListener("DOMContentLoaded", function () {
    const passBtn = document.querySelector("#passBtn");
    
    if (passBtn) {
        passBtn.addEventListener("click", function (event) {
            event.preventDefault(); 
            
            const passInput = document.getElementById("account_password");
            const type = passInput.getAttribute("type");
            
            if (type === "password") {
                passInput.setAttribute("type", "text");
                passBtn.innerHTML = "Hide Password";
            } else {
                passInput.setAttribute("type", "password");
                passBtn.innerHTML = "Show Password";
            }
        });
    }
});