document.addEventListener("DOMContentLoaded", event => {
    //#region OVERLAY
    let overlay = document.getElementById("overlay");
    let overlayWindow = document.getElementById("overlay-window");
    let overlayTitle = document.getElementById("overlay-title");
    let overlayClose = document.getElementById("overlay-close");
    let showOverlayButtons = document.querySelectorAll(".show-overlay");

    const overlayDisableTimer = 400;
    
    overlay.addEventListener("click", hideOverlay);
    overlayClose.addEventListener("click", hideOverlay);
    overlayWindow.addEventListener("click", function(evt){
        evt.stopPropagation();
    });
    
    for (let i = 0; i < showOverlayButtons.length; i++) {
        const showOverlayButton = showOverlayButtons[i];
        showOverlayButton.addEventListener("click", function(evt){
            showOverlay(evt);
            showWindow(this.dataset.for); //return true: remove invalid class from overlayTitle,
                                          //return false: add invalid class to overlayTitle

            //POPUP
            if (this.hasAttribute("data-button")) {
                const btnContainer = addButtonContainer(this.dataset.for);
                const btnType = this.dataset.button;
                if (btnType == "ok") {
                    addButton(btnContainer.buttonContainer, "Ok").addEventListener("click", function(evt){
                        hideOverlay(evt);
                        console.log("Ok was pressed"); //Add your custom events here
                    });
                } else if (btnType == "okcancel") {
                    addButton(btnContainer.buttonContainer, "Ok").addEventListener("click", function(evt){
                        hideOverlay(evt);
                        console.log("Ok was pressed"); //Add your custom events here
                    });
                    addButton(btnContainer.buttonContainer, "Cancel").addEventListener("click", function(evt){
                        hideOverlay(evt);
                        console.log("Cancel was pressed"); //Add your custom events here
                    });
                } else {
                    const inpEmail = btnContainer.popupWindow.querySelector("#forgot-email");
                    const inputLoginEmail = document.getElementById("login-email");
                    inpEmail.value = inputLoginEmail.value;
                    inpEmail.focus();
                    addButton(btnContainer.buttonContainer, btnType).addEventListener("click", function(evt){
                        if (!validateEmail(inpEmail)) {
                            return;
                        } else {
                            let pass = returnPassword(inpEmail);
                            if (pass == null) {
                                showMessage(`Your email is not in our database! Try again."`);
                            } else {
                                showMessage(`Your password is "${pass}"`);
                                hideOverlay(evt);
                                inputLoginEmail.value = inpEmail.value;
                                inpEmail.value = "";
                            }
                        }
                    });
                }
            }
        });
    }

    function showOverlay(evt){
        evt.preventDefault();
        overlay.classList.remove("disabled");
        overlay.classList.remove("hidden");
    }
    function hideOverlay(evt){
        evt.preventDefault();
        overlay.classList.add("hidden");
        setTimeout(() => {
            overlay.classList.add("disabled");
        }, overlayDisableTimer);
    }
    function showWindow(id){
        const overlayClasses = document.querySelectorAll(".overlay-class");
        for (let i = 0; i < overlayClasses.length; i++) {
            const overlayClass = overlayClasses[i];
            if (overlayClass.id == id) {
                overlayClass.classList.remove("hidden");
                overlayTitle.textContent = overlayClass.dataset.title;
            } else {
                overlayClass.classList.add("hidden");
            }
        }
    }

    //POPUP
    function addButtonContainer(id){
        let popupWindow = document.getElementById(id);
        if (popupWindow.querySelector(".popup-buttons")) {
            popupWindow.removeChild(popupWindow.querySelector(".popup-buttons"));
        }
        let buttonContainer = document.createElement("NAV");
        buttonContainer.className = "popup-buttons";
        popupWindow.appendChild(buttonContainer);
        let obj = new Object();
        obj.popupWindow = popupWindow;
        obj.buttonContainer = buttonContainer;
        return obj;
    }
    function addButton(buttonContainer, buttonName){
        const btn = document.createElement("BUTTON");
        const buttonNameLower = buttonName.toLowerCase();
        btn.className = "btn btn--round popup-" + buttonNameLower;
        btn.textContent = buttonName;
        buttonContainer.appendChild(btn);
        return btn;
    }
    //#endregion

    //#region SWIPE
    const wrapper = document.getElementById("wrapper");
    const signUp = document.getElementById("sign-up");
    const login = document.getElementById("login");

    signUp.addEventListener("click", function(e){
        e.preventDefault();
        swipeToContent();
    });
    login.addEventListener("click", function(e){
        e.preventDefault();
        toLogin();
    });
    wrapper.addEventListener("touchstart", touchStart, {passive: true});

    let touchStartX = 0;
    let touchEndX = 0;
    const threshold = 10;

    function touchStart(e){
        if (isLoggedIn) {
            e.preventDefault();
            return;
        }
        touchStartX = e.touches[0].clientX;
        wrapper.addEventListener("touchend", touchEnd, {passive: true});
    }
    function touchEnd(e){
        touchEndX = e.changedTouches[0].clientX;
        if (touchEndX + threshold < touchStartX) {
            swipeToContent();
        }
        if (touchEndX - threshold > touchStartX) {
            toLogin();
        }
        wrapper.removeEventListener("touchend", touchEnd);
    }
    function toLogin(){
        wrapper.classList.remove("swiped-content");
        resetAllEmails();
        resetAllPasswords();
    }
    function swipeToContent(){
        wrapper.classList.add("swiped-content");
        resetAllEmails();
        resetAllPasswords();
    }
    //#endregion SWIPE

    //#region PASSWORD TOGGLE VISIBILITY
    const toggleLoginPassword = document.getElementById("toggle-login-password");
    const toggleSignUpPassword = document.getElementById("toggle-sign-up-password");

    toggleLoginPassword.addEventListener("click", function(e){
        e.preventDefault();
        togglePasswordVisibility(this, "login-password");
    });
    toggleSignUpPassword.addEventListener("click", function(e){
        e.preventDefault();
        togglePasswordVisibility(this, "sign-up-password");
    });

    function togglePasswordVisibility(elementClicked, passwordFieldId){
        const passwordField = document.getElementById(passwordFieldId);
        if (passwordField.type === "password") {
            passwordField.type = "text";
            setPasswordVisibilityIcon(elementClicked, true);
        } else {
            passwordField.type = "password";
            setPasswordVisibilityIcon(elementClicked, false);
        }
    }
    function resetAllEmails(){
        const emailFields = document.querySelectorAll(".email-field");
        for (let i = 0; i < emailFields.length; i++) {
            const emailField = emailFields[i];
            emailField.value = "";
        }
    }
    function resetAllPasswords(){
        const passwordFields = document.querySelectorAll(".password-field");
        for (let i = 0; i < passwordFields.length; i++) {
            const passwordField = passwordFields[i];
            passwordField.type = "password";
            passwordField.value = "";
        }
        setPasswordVisibilityIcon(toggleLoginPassword, false);
        setPasswordVisibilityIcon(toggleSignUpPassword, false);
    }
    function setPasswordVisibilityIcon(elementClicked, visible){
        const icons = elementClicked.querySelectorAll("svg");
        if (visible) {
            icons[0].style.display = "none";
            icons[1].style.display = "block";
        } else {
            icons[0].style.display = "block";
            icons[1].style.display = "none";
        }
    }
    //#endregion PASSWORD TOGGLE VISIBILITY

    //#region LOGIN
    const btnLoginSubmit = document.getElementById("btn-login-submit");
    const btnSignUpSubmit = document.getElementById("btn-sign-up-submit");
    const logout = document.getElementById("logout");
    const submitContainers = document.querySelectorAll(".submit-container");

    let user = [
        {
            name: "Sune",
            email: "bqardi@msn.com",
            password: "1234",
            image: "sune_seifert.jpg",
        },
        {
            name: "Shashank",
            email: "Shashank@Peoplewho.design",
            password: "1234",
            image: "profile-placeholder.jpg",
        },
    ]

    let isLoggedIn = false;

    btnLoginSubmit.addEventListener("click", logInCheck);
    btnSignUpSubmit.addEventListener("click", newUserCheck);
    logout.addEventListener("click", logOut);

    for (let i = 0; i < submitContainers.length; i++) {
        const submitContainer = submitContainers[i];
        const inputs = submitContainer.querySelectorAll("input");
        for (let j = 0; j < inputs.length; j++) {
            const input = inputs[j];
            input.addEventListener("keyup", function(e){
                if (e.keyCode == 13) {
                    submitContainer.querySelector("button").click();
                }
            });
        }
    }

    function logInCheck(){
        const inpEmail = document.getElementById("login-email");
        const inpPassword = document.getElementById("login-password");
        if (!validateEmail(inpEmail)) {
            return;
        }
        if (!validatePassword(inpPassword)) {
            return;
        }
        if (!databaseCheck(inpEmail, inpPassword)) {
            return;
        }
        let currentUserIndex = getUserIndex(inpEmail.value, inpPassword.value);
        if (currentUserIndex >= 0) {
            //If everything is okay:
            logIn(user[currentUserIndex], false);
        }
    }
    function getUserIndex(email, password){
        for (let i = 0; i < user.length; i++) {
            const usr = user[i];
            if (email === usr.email && password === usr.password) {
                return i;
            }
        }
        return -1;
    }
    function logIn(currentUser, isNewUser){
        const signUpContainer = document.getElementById("signup-container");
        const mainContentContainer = document.getElementById("main-content-container");
        const image = document.getElementById("profile-image");
        signUpContainer.classList.add("hidden");
        mainContentContainer.classList.remove("hidden");
        document.getElementById("welcome").textContent = (isNewUser ? "Welcome " : "Welcome back ") + currentUser.name;
        image.src = "images/" + currentUser.image;
        image.alt = currentUser.name + " profile";
        swipeToContent();
        isLoggedIn =true;
    }
    function logOut(e){
        e.preventDefault();
        const signUpContainer = document.getElementById("signup-container");
        const mainContentContainer = document.getElementById("main-content-container");
        signUpContainer.classList.remove("hidden");
        mainContentContainer.classList.add("hidden");
        isLoggedIn = false;
        toLogin();
    }
    function newUserCheck(){
        const inpEmail = document.getElementById("sign-up-email");
        const inpPassword = document.getElementById("sign-up-password");
        if (!validateEmail(inpEmail)) {
            return;
        }
        if (returnPassword(inpEmail) != null) {
            showMessage("Email already registered in our database!");
            return;
        }
        if (!validatePassword(inpPassword)) {
            return;
        }
        //If everything is okay:
        addNewUser("Dummy user", inpEmail.value, inpPassword.value);
    }
    function addNewUser(userName, userEmail, userPassword){
        let newUserObj = new Object();
        newUserObj.name = userName == "" ? userEmail : userName;
        newUserObj.email = userEmail;
        newUserObj.password = userPassword;
        newUserObj.image = "profile-placeholder.jpg";
        user.push(newUserObj);
        logIn(user[user.length - 1], true);
    }
    //#endregion LOGIN

    //#region VALIDATION
    let popupTimer;
    function validateEmail(emailElement){
        if (emailElement.value == "") {
            inputErrorHandler(emailElement, "Email address must be entered!");
            return false;
        }
        const regex = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        let isValid = regex.test(emailElement.value.toLowerCase());
        if (!isValid) {
            inputErrorHandler(emailElement, "Email address is not valid. Please correct!");
        }
        return isValid;
    }
    function validatePassword(inputElement){
        if (inputElement.value == "") {
            inputErrorHandler(inputElement, "Password must be entered!");
            return false;
        }
        return true;
    }
    function databaseCheck(inputEmail, inputPassword){
        for (let i = 0; i < user.length; i++) {
            const usr = user[i];
            if (inputEmail.value == usr.email) {
                if (inputPassword.value == usr.password) {
                    return true;
                }
                inputErrorHandler(inputPassword, "Password is not valid!");
                return false;
            }
        }
        inputErrorHandler(inputEmail, "Email address was not found in our database!");
        return false;
    }
    function inputErrorHandler(element, message){
        //Element focus
        element.focus();
        element.select();
        //Shake element
        element.classList.remove("shake");
        setTimeout(() => {
            element.classList.add("shake");
            element.addEventListener("keyup", removeClassHidden);
            function removeClassHidden(){
                element.classList.remove("shake");
                element.removeEventListener("keyup", removeClassHidden);
            }
        }, 10);
        showMessage(message);
    }
    function showMessage(message){
        const popupMessage = document.getElementById("popup-message");
        popupMessage.textContent = message;
        popupMessage.classList.add("show");
        if (popupTimer) {
            clearTimeout(popupTimer);
        }
        popupTimer = setTimeout(() => {
            popupMessage.classList.remove("show");
        }, 3000);
    }
    function returnPassword(inputEmail){
        for (let i = 0; i < user.length; i++) {
            const usr = user[i];
            if (inputEmail.value == usr.email) {
                return usr.password;
            }
        }
        return null;
    }
    //#endregion VALIDATION
});