function setCookie(name, value, years) {
    var expires = "";
    if (years) {
        var date = new Date();
        date.setFullYear(date.getFullYear() + years);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function checkPopupCookie() {
    return getCookie("popupClosed") === "true";
}

document.addEventListener("DOMContentLoaded", function () {
    var popup = document.querySelector(".popup");
    var continueBtn = document.querySelector(".continueBtn");
    var mainContent = document.querySelector(".main-content");

    if (checkPopupCookie()) {
        popup.style.display = "none";
        document.body.style.overflow = "auto";
    } else {
        document.body.style.overflow = "hidden";
    }

    continueBtn.addEventListener("click", function () {
        popup.style.display = "none";
        document.body.style.overflow = "auto";
        setCookie("popupClosed", "true", 10);
    });
});
