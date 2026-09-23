// let popup=document.getElementById("popup");

function showPopup(){
    document.getElementById("popup").style.display="block";
}
function closePopup(){
    document.getElementById("popup").style.display="none";
}

function submitEmail(){
    let email=document.getElementById("email").value;
    if(email){
        alert("Thank you! Your 10% discount code is: WELCOME10");
        closePopup();
    }else{
        alert("Please enter a valid email.");
    }
}

//Nav toggle behavior
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const primaryNavigation = document.getElementById('primary-navigation');

    navToggle.addEventListener('click', function() {
        primaryNavigation.classList.toggle('open');
    });
});