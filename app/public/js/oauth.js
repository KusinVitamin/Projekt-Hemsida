function signIn() {
    document.querySelector(".g-signin2 > div").click();
}

async function onSignIn(googleUser) {
    const origin = window.location.origin;
    const token = googleUser.getAuthResponse().id_token;
    const oauthVerificationURL = `${origin}/oauth/google/signin?token=${token}`;
    const response = await fetch(oauthVerificationURL);
    switch (response.status) {
        case 201:
            window.location.reload();
            break;
        case 400:
            console.warn(response);
            break;
        case 403:
            alert("Access denied");
            signOut();
            break;
        default:
            break;
    }
}

async function signOut() {
    const origin = window.location.origin;
    const signoutUrl = `${origin}/oauth/signout`;
    const auth2 = gapi.auth2.getAuthInstance();

    await auth2.signOut();
    const response = await fetch(signoutUrl);
    if (response.status === 200) {
        window.location.reload();
    }
}
