window.onload = function() {
    const toggleBtn = document.getElementsByClassName("nav_toggle");
    const menu = document.getElementsByClassName("nav_menu");
    const login = document.getElementsByClassName("nav_login");

    toggleBtn[0].addEventListener('click', () => {
        menu.item(0).classList.toggle('active');
        login[0].classList.toggle('active');
    })
};

function get_cookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function change_mode(mode){
    console.log(get_cookie(mode));
    // document.cookie = `${mode}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/board;`;
    // location.reload();
    if(get_cookie(mode) == 1){
        document.cookie = `${mode}=0; path=/`;
        location.reload();
    } else {
        document.cookie = `${mode}=1; path=/`;
        location.reload();
    }
}